const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        
        // 상태 메시지 배열
        // Playing : 게임 중
        // Streaming : 방송 중
        // Listening : 듣기 중
        // Watching : 시청 중
        // Custom : 사용자 정의
        // Competing : 경쟁 중
        const activities = [
            { name: '지옥에서 살아 돌아왔다!', type: ActivityType.Custom },
            { name: '오늘의 메뉴는?', type: ActivityType.Custom },
            { name: '동행자님! 무엇을 도와드릴까요?', type: ActivityType.Custom },
            { name: '저는 열심히 성장하고 여러가지를 해보고 싶어요!', type: ActivityType.Custom },
            { name: '저의 성정과 함께 키워나갈 개발자는 없나요?', type: ActivityType.Custom },
            { name: '저의 주인장은 SOIV라는 사람인데요..', type: ActivityType.Custom },
            { name: '저는 SOIV Studio에 소속된 Discord BOT이에요!', type: ActivityType.Custom }
        ];
        
        // 10초마다 랜덤으로 상태 메시지 변경
        setInterval(() => {
            // 0부터 activities.length - 1 사이의 랜덤 인덱스 생성
            const randomIndex = Math.floor(Math.random() * activities.length);
            const activity = activities[randomIndex];
            client.user.setActivity(activity.name, { type: activity.type });
        }, 10000); // 10초 = 10000ms
    },
};