const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dashboard')
        .setDescription('봇을 쉽게 조작 또는 설정할 수 있는 웹사이트를 안내합니다.'),
    
    // 접두사 명령어 설정
    prefixCommand: {
        name: 'dashboard',
        aliases: ['대시보드'], // 한글 별칭 추가
        description: '봇을 쉽게 조작 또는 설정할 수 있는 웹사이트를 안내합니다.'
    },
    
    // 슬래시 명령어 실행 함수
    async execute(interaction) {
        // 대시보드 링크
        const dashboardLink = 'https://dashboard.soiv-studio.xyz';
        
        // Embed 생성
        const dashboardEmbed = new EmbedBuilder()
            .setColor('#517200')
            .setTitle('HYolss 대시보드')
            .setDescription('대시보드에서 봇의 모든 기능을 쉽게 설정하고 관리할 수 있습니다!')
            .addFields(
                { name: '대시보드 기능', value: 
                  '• 서버별 설정 관리\n• 명령어 사용 통계\n• 알림 설정 관리\n• 사용자 권한 관리\n• 그 외 다양한 기능' }
            )
            .setTimestamp()
            .setFooter({ text: 'SOIV Studio', iconURL: interaction.client.user.displayAvatarURL() });
        
        // 버튼 생성
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('대시보드 방문하기')
                    .setStyle(ButtonStyle.Link)
                    .setURL(dashboardLink)
            );
        
        await interaction.reply({ embeds: [dashboardEmbed], components: [row] });
    },
    
    // 접두사 명령어 실행 함수
    async executePrefix(message, args) {
        // 대시보드 링크
        const dashboardLink = 'https://dashboard.soiv-studio.xyz';
        
        // Embed 생성
        const dashboardEmbed = new EmbedBuilder()
            .setColor('#517200')
            .setTitle('HYolss 대시보드')
            .setDescription('대시보드에서 봇의 모든 기능을 쉽게 설정하고 관리할 수 있습니다!')
            .addFields(
                { name: '대시보드 기능', value:
                  '• 서버별 설정 관리\n• 명령어 사용 통계\n• 알림 설정 관리\n• 사용자 권한 관리\n• 그 외 다양한 기능' }
            )
            .setTimestamp()
            .setFooter({ text: 'SOIV Studio', iconURL: message.client.user.displayAvatarURL() });
        
        // 버튼 생성
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('대시보드 방문하기')
                    .setStyle(ButtonStyle.Link)
                    .setURL(dashboardLink)
            );
        
        await message.reply({ embeds: [dashboardEmbed], components: [row] });
    },
};