const { Events } = require('discord.js');
const { pool } = require('../database/database.js');

// 서버 퇴장 기록 업데이트 함수
async function updateBotServerLeave(guildId) {
  try {
    const query = `
      UPDATE bot_server_history
      SET last_leave_date = CURRENT_TIMESTAMP,
          current_status = FALSE
      WHERE guild_id = $1
      RETURNING *;
    `;
    
    const result = await pool.query(query, [guildId]);
    
    if (result.rows.length === 0) {
      console.log(`[WAN-DB] 서버 ID ${guildId}에 대한 기록이 없습니다.`);
      return null;
    }
    
    return result.rows[0];
  } catch (err) {
    console.error('[ERROR] 서버 퇴장 기록 업데이트 오류:', err);
    return null;
  }
}

module.exports = {
  name: Events.GuildDelete,
  async execute(guild) {
    try {
      console.log(`[WAN-DB] 봇이 서버에서 제거되었습니다: ${guild.name} (ID: ${guild.id})`);
      
      // 서버 퇴장 기록 업데이트
      await updateBotServerLeave(guild.id);
      
      // 여기서는 메시지를 보낼 수 없음 (이미 서버에서 퇴장했기 때문)
      // 대신 로그만 남김
      console.log(`[WAN-DB] 서버 ${guild.name} (ID: ${guild.id})에서 퇴장 기록이 업데이트되었습니다.`);
      
    } catch (error) {
      console.error('[ERROR] 서버 퇴장 처리 오류:', error);
    }
  }
};