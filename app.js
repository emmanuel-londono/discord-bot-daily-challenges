import { Client, Events, GatewayIntentBits, Collection } from 'discord.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL  } from 'url'
import config from "./config.json"  assert { type: 'json' };

// Function to run the app
const runApp = () => {
  // Convert the URL to a directory path
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const token = config.token
    // Create a new client instance
  const client = new Client({ intents: [GatewayIntentBits.Guilds] })

  client.commands = new Collection();

  const foldersPath = path.join(__dirname, 'commands');
  const commandFolders = fs.readdirSync(foldersPath);
  
  commandFolders.forEach((folder) => {
      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  
      for (const file of commandFiles) {
          const filePath = path.join(commandsPath, file);
          const fileURL = pathToFileURL(filePath);
  
          import(fileURL.href).then(commandModule => {
              const command = commandModule.default;
              if ('data' in command && 'execute' in command) {
                  client.commands.set(command.data.name, command);
              } else {
                  console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
              }
          }).catch(error => {
              console.error(`Error importing command ${file}:`, error);
          });
      }
  });
  // When the client is ready, run this code (only once).
  // The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
  // It makes some properties non-nullable.
  client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`)
  })

  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return
    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`)
      return
    }

    try {
      await command.execute(interaction)
    } catch (error) {
      console.error(error)
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true
        })
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true
        })
      }
    }
  })

  client.login(token)
}
// Export the runApp function
export default runApp
