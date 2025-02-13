const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		
		// 봇의 상태 설정
		client.user.setActivity('지옥에서 살아 돌아왔다!', { type: ActivityType.Playing });
	},
};