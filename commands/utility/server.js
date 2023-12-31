import SlashCommandBuilder from 'discord.js'


	const serverData = new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server.');

	const execute = async () => {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
	};

    export default {serverData, execute}
