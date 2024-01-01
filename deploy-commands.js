import { Client, Events, GatewayIntentBits, Collection, REST, Routes } from 'discord.js'
import { fileURLToPath, pathToFileURL  } from 'url'
import fs from 'fs'
import path from 'path'
import config from "./config.json" assert { type: 'json' };
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const commands = [];
// Grab all the command folders from the commands directory you created earlier
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
				commands.push(command.data.toJSON());
              } else {
                  console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
              }
          }).catch(error => {
              console.error(`Error importing command ${file}:`, error);
          });
      }
  });

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(config.token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(config.clientId, config.guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();