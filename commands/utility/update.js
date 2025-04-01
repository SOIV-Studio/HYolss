const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { runUpdateProcess, getCurrentVersion, getLatestVersion, isNewerVersion } = require('../../auto-updater');

// 개발자 ID 목록 가져오기
const developerIds = process.env.BOT_DEVELOPER_IDS ? process.env.BOT_DEVELOPER_IDS.split(',') : [];

// 개발자 권한 확인 함수
function isDeveloper(userId) {
    return developerIds.includes(userId);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('봇을 최신 버전으로 업데이트합니다 (관리자 전용)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addBooleanOption(option => 
            option.setName('force')
                .setDescription('최신 버전이 아니더라도 강제로 업데이트를 실행합니다')
                .setRequired(false)),
    
    // 접두사 명령어 설정
    prefixCommand: {
        name: 'update',
        aliases: ['업데이트'], // 한글 별칭 추가
        description: '봇을 최신 버전으로 업데이트합니다 (관리자 전용)'
    },
    
    // 슬래시 명령어 실행 함수
    async execute(interaction) {
        // 관리자 권한 및 개발자 ID 확인
        const isAdmin = interaction.memberPermissions.has(PermissionFlagsBits.Administrator);
        const isDevUser = isDeveloper(interaction.user.id);
        
        if (!isAdmin) {
            return interaction.reply({
                content: '⚠️ 이 명령어는 관리자 권한이 필요합니다.',
                ephemeral: true
            });
        }
        
        if (!isDevUser) {
            return interaction.reply({
                content: '⚠️ 이 명령어는 봇 개발자만 사용할 수 있습니다.',
                ephemeral: true
            });
        }

        await interaction.deferReply();

        try {
            // 현재 버전과 최신 버전 확인
            const currentVersion = getCurrentVersion();
            const latestVersion = await getLatestVersion();
            const force = interaction.options.getBoolean('force') || false;
            
            // 버전 비교
            if (!isNewerVersion(currentVersion, latestVersion) && !force) {
                return interaction.editReply(`✅ 이미 최신 버전(${currentVersion})을 사용 중입니다. 업데이트가 필요하지 않습니다.\n강제 업데이트를 원하시면 \`/update force:true\` 명령어를 사용하세요.`);
            }
            
            await interaction.editReply(`🔄 업데이트를 시작합니다. 현재 버전: ${currentVersion}, 최신 버전: ${latestVersion || '확인 중...'}\n잠시 후 봇이 재시작됩니다.`);
            
            // 업데이트 프로세스 실행
            runUpdateProcess();
            
        } catch (error) {
            console.error('[ERROR] 업데이트 명령어 실행 중 오류:', error);
            await interaction.editReply(`⚠️ 업데이트 확인 중 오류가 발생했습니다: ${error.message}`);
        }
    },
    
    // 접두사 명령어 실행 함수
    async executePrefix(message, args) {
        // 관리자 권한 및 개발자 ID 확인
        const isAdmin = message.member.permissions.has(PermissionFlagsBits.Administrator);
        const isDevUser = isDeveloper(message.author.id);
        
        if (!isAdmin) {
            return message.reply('⚠️ 이 명령어는 관리자 권한이 필요합니다.');
        }
        
        if (!isDevUser) {
            return message.reply('⚠️ 이 명령어는 봇 개발자만 사용할 수 있습니다.');
        }

        const reply = await message.reply('🔄 업데이트 확인 중...');

        try {
            // 현재 버전과 최신 버전 확인
            const currentVersion = getCurrentVersion();
            const latestVersion = await getLatestVersion();
            const force = args.includes('force');
            
            // 버전 비교
            if (!isNewerVersion(currentVersion, latestVersion) && !force) {
                return reply.edit(`✅ 이미 최신 버전(${currentVersion})을 사용 중입니다. 업데이트가 필요하지 않습니다.\n강제 업데이트를 원하시면 \`!update force\` 명령어를 사용하세요.`);
            }
            
            await reply.edit(`🔄 업데이트를 시작합니다. 현재 버전: ${currentVersion}, 최신 버전: ${latestVersion || '확인 중...'}\n잠시 후 봇이 재시작됩니다.`);
            
            // 업데이트 프로세스 실행
            runUpdateProcess();
            
        } catch (error) {
            console.error('[ERROR] 업데이트 명령어 실행 중 오류:', error);
            await reply.edit(`⚠️ 업데이트 확인 중 오류가 발생했습니다: ${error.message}`);
        }
    }
};