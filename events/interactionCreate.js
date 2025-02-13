const { Events, MessageFlags, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			// 메뉴추가 명령어에 대한 권한 체크
			if (interaction.commandName === '메뉴추가') {
				const allowedUserId = '336746851971891203';
				if (interaction.user.id !== allowedUserId) {
					const noPermissionEmbed = new EmbedBuilder()
						.setColor('#FF0000')
						.setTitle('❌ 권한 없음')
						.setDescription('이 명령어를 사용할 권한이 없습니다.')
						.setTimestamp()
						.setFooter({ text: 'HYolss Bot' });

					await interaction.reply({
						embeds: [noPermissionEmbed],
						ephemeral: true
					});
					return;
				}
			}

			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
			}
		}
	},
};