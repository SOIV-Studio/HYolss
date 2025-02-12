//client.ws.on('INTERACTION_CREATE', async interaction => {
//  const { name } = interaction.data;
//
//  if (name === '오늘의메뉴') {
//    const word = randomWords(); // get a random word
//    const response = {
//      type: 4,
//      data: {
//        content: `..님 ${word} 어때?`,
//      },
//    };
//
//    client.api.interactions(interaction.id, interaction.token).callback.post({ data: response });
//  }
//});

// const { SlashCommandBuilder } = require('discord.js');

//module.exports = {
//	data: new SlashCommandBuilder()
//		.setName('오늘의메뉴')
//		.setDescription('오늘의 메뉴를 추천해줍니다.'),
//	async execute(interaction) {
//		await interaction.reply('..님 ${word} 어때?');
//	},
//};