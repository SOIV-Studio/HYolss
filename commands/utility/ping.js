const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('서버와의 핑 테스트를 보여줍니다.'),
	async execute(interaction) {
		const ping = interaction.client.ws.ping;
		await interaction.reply(`Pong! (${ping}ms)`);
	},
};