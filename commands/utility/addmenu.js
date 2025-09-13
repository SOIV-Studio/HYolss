const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addMenuToSupabase(menuName, menuType) {
    try {
        // 중복 체크
        const { data: existingMenu, error: checkError } = await supabase
            .from('menu_items')
            .select('*')
            .eq('name', menuName)
            .eq('type', menuType);
            
        if (checkError) {
            console.error('[ERROR] 중복 체크 중 오류:', checkError);
            return { success: false, message: '데이터베이스 조회 중 오류가 발생했습니다.' };
        }
        
        if (existingMenu && existingMenu.length > 0) {
            return { success: false, message: '이미 존재하는 메뉴입니다.' };
        }
        
        // 새 메뉴 추가
        const { data, error } = await supabase
            .from('menu_items')
            .insert([
                { name: menuName, type: menuType }
            ]);
            
        if (error) {
            console.error('[ERROR] 메뉴 추가 중 오류:', error);
            return { success: false, message: '데이터베이스에 메뉴 추가 중 오류가 발생했습니다.' };
        }
        
        return { success: true, message: '메뉴가 성공적으로 추가되었습니다.' };
    } catch (error) {
        console.error('[ERROR] Error in addMenuToSupabase:', error);
        return { success: false, message: '메뉴 추가 중 오류가 발생했습니다.' };
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('메뉴추가')
        .setDescription('[개발자 전용 명령어] 새로운 메뉴를 추가합니다.')
        .addStringOption(option =>
            option.setName('메뉴이름')
                .setDescription('추가할 메뉴의 이름을 입력하세요.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('메뉴종류')
                .setDescription('메뉴의 종류를 선택하세요.')
                .setRequired(true)
                .addChoices(
                    { name: '일반메뉴', value: 'menu' },
                    { name: '편의점메뉴', value: 'convenience' }
                )),

    async execute(interaction) {
        // 권한 체크
        const allowedUserId = '336746851971891203';
        if (interaction.user.id !== allowedUserId) {
            const noPermissionEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ 권한 없음')
                .setDescription('이 명령어를 사용할 권한이 없습니다.')
                .setTimestamp()
                .setFooter({ text: 'HYolss' });

            return interaction.reply({
                embeds: [noPermissionEmbed],
                ephemeral: true
            });
        }

        const menuName = interaction.options.getString('메뉴이름');
        const menuType = interaction.options.getString('메뉴종류');
        
        // Supabase에 메뉴 추가
        const result = await addMenuToSupabase(menuName, menuType);

        // 현재 메뉴 개수 조회
        let totalCount = 0;
        if (result.success) {
            try {
                const { data: allMenus, error: countError } = await supabase
                    .from('menu_items')
                    .select('*')
                    .eq('type', menuType);

                if (!countError && allMenus) {
                    totalCount = allMenus.length;
                }
            } catch (error) {
                console.error('[ERROR] 메뉴 개수 조회 중 오류:', error);
            }
        }

        const embed = new EmbedBuilder()
            .setColor(result.success ? '#00FF00' : '#FF0000')
            .setTitle('📝 메뉴 추가 결과')
            .addFields(
                { name: '메뉴', value: menuName, inline: true },
                { name: '종류', value: menuType === 'menu' ? '일반메뉴' : '편의점메뉴', inline: true },
                { name: '결과', value: result.message }
            );

        // 성공한 경우에만 총 메뉴 개수 표시
        if (result.success) {
            embed.addFields(
                { name: '총 메뉴 개수', value: `${totalCount}개`, inline: true }
            );
        }

        embed.setTimestamp()
            .setFooter({ text: 'HYolss' });

        return interaction.reply({
            embeds: [embed],
            ephemeral: false
        });
    },
};