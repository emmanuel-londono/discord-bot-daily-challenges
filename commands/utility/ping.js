import SlashCommandBuilder from 'discord.js'

const pingData = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!')

const execute = async (interaction) => {
    await interaction.reply("Pong!")
}

export default { pingData, execute };