const { Events, EmbedBuilder } = require('discord.js');
const { pool, initializeBotServerTables } = require('../database/database.js');

// 서버 입장 기록 업데이트 함수
async function updateBotServerHistory(guildId) {
  try {
    // 서버 기록 조회
    const checkQuery = `
      SELECT * FROM bot_server_history
      WHERE guild_id = $1;
    `;
    
    const result = await pool.query(checkQuery, [guildId]);
    
    if (result.rows.length === 0) {
      // 신규 서버인 경우
      const insertQuery = `
        INSERT INTO bot_server_history (guild_id)
        VALUES ($1)
        RETURNING *;
      `;
      
      const insertResult = await pool.query(insertQuery, [guildId]);
      return { isNew: true, data: insertResult.rows[0] };
    } else {
      // 기존 서버인 경우
      const serverData = result.rows[0];
      
      // 현재 상태가 false(퇴장)인 경우에만 업데이트
      if (!serverData.current_status) {
        const updateQuery = `
          UPDATE bot_server_history
          SET join_count = join_count + 1,
              current_status = TRUE
          WHERE guild_id = $1
          RETURNING *;
        `;
        
        const updateResult = await pool.query(updateQuery, [guildId]);
        return { isNew: false, data: updateResult.rows[0] };
      }
      
      return { isNew: false, data: serverData };
    }
  } catch (err) {
    console.error('[ERROR] 서버 입장 기록 업데이트 오류:', err);
    return { isNew: false, error: err };
  }
}

// 초대자 정보 저장 함수
async function saveBotInviter(guildId, inviterId) {
  try {
    const query = `
      INSERT INTO bot_inviter_tracking (guild_id, inviter_id)
      VALUES ($1, $2)
      ON CONFLICT (inviter_id, guild_id) 
      DO UPDATE SET invite_date = CURRENT_TIMESTAMP;
    `;
    
    await pool.query(query, [guildId, inviterId]);
    return true;
  } catch (err) {
    console.error('[ERROR] 초대자 정보 저장 오류:', err);
    return false;
  }
}

module.exports = {
  name: Events.GuildCreate,
  async execute(guild) {
    try {
      console.log(`[WAN-DB] 봇이 새로운 서버에 추가되었습니다: ${guild.name} (ID: ${guild.id})`);
      
      // 서버 입장 기록 업데이트
      const serverHistory = await updateBotServerHistory(guild.id);
      
      // 초대자 정보 (가능한 경우)
      // Discord API의 제한으로 인해 초대자 정보를 정확히 가져오기 어려울 수 있음
      // 여기서는 서버 소유자를 초대자로 가정
      const inviterId = guild.ownerId;
      await saveBotInviter(guild.id, inviterId);
      
      // 기본 채널 찾기 (공지 채널 또는 일반 채팅 채널)
      let targetChannel = guild.systemChannel; // 시스템 메시지 채널
      
      if (!targetChannel) {
        // 시스템 채널이 없으면 일반 텍스트 채널 중 첫 번째 채널 사용
        targetChannel = guild.channels.cache
          .filter(channel => channel.type === 0) // 0은 텍스트 채널
          .sort((a, b) => a.position - b.position)
          .first();
      }
      
      if (!targetChannel) {
        console.log(`[WAN-DB] 서버 ${guild.name}에 메시지를 보낼 채널을 찾을 수 없습니다.`);
        return;
      }
      
      // 환영 메시지 생성
      let introMessage, aboutMessage, helpMessage, serverMessage, tipMessage, warningMessage;
      
      // 공통 메시지 부분
      introMessage = `저를 대리고 와주신 유저님! ${serverHistory.isNew ? '처음' : '다시'} 뵙겠습니다!\n나는 하나의 작은 별과 꿈을 가지고 나아가는 동행자 HYolss 이라고해!\n이 서버에 대려와준 <@${inviterId}>님, 대리고 와줘서 고마워!`;
      
      helpMessage = `명령어를 사용하는데 모르는 점이 있어?\n'/help'를 사용하여 각각의 명령어에 대한 설명과 사용법을 확인해 볼 수 있어!`;
      
      tipMessage = `[TIP] 기초 작업 시작 명령어인 '/setup'를 사용하여 서버에서 봇을 사용하기 위한 작업을 간편하게 진행을 할 수 있습니다!`;
      
      warningMessage = `[!] 운영중인 HYolss은 테스트 버전 및 경험을 위해 제작 및 활동중인 봇이므로 봇이 종료되거나 버그 및 오류가 발생 할 수 있습니다.`;
      
      if (serverHistory.isNew) {
        // 신규 서버인 경우
        aboutMessage = `일단 내가 작동하는 방식에 대해 짧개 알려줄깨!\n기본은 슬레시(/)를 사용하고 다른 방식으로는\n접두사 방식인 ! or = 으로 호출 및 명령어, 기능 사용이 가능하고\n명령어를 사용하면 버튼과 메뉴 선택이라는 기능을 주로 작동되니 이점 알아줘!`;
        
        serverMessage = `여기는 처음 왔는데 어떤 서버일까? 궁굼하다! 알려줄 동행자는 없나?`;
      } else if (serverHistory.data.join_count > 1) {
        // 기존 서버에 재입장한 경우
        aboutMessage = `날 대리고온 동행자 <@${inviterId}>님! 그리고 날 알고 있는 동행자가 보이네!\n그렇다면! 나에 대해 잘 알고 있는 동행자가 있으니 설명을 생략할깨!`;
        
        serverMessage = `글고보니 어라 여기는 와본적이 있는 것 같아!\n이 서버의 데이터가 복구 가능해! 동행자님 복구 시스템을 시작할까!?`;
      }
      
      // 임베드 메시지 생성
      const welcomeEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('HYolss가 유저에게 인사합니다! 👋')
        .addFields(
          { name: '👋 인사', value: introMessage, inline: false },
          { name: '💫 소개', value: aboutMessage, inline: false },
          { name: '❓ 도움말', value: helpMessage, inline: false },
          { name: '🏠 서버', value: serverMessage, inline: false },
          { name: '💡 팁', value: tipMessage, inline: false },
          { name: '⚠️ 주의사항', value: warningMessage, inline: false }
        )
        .setTimestamp();
      
      // 메시지 전송
      await targetChannel.send({ embeds: [welcomeEmbed] });
      
    } catch (error) {
      console.error('[ERROR] 서버 입장 처리 오류:', error);
    }
  },
  
  // 테이블 초기화 함수 내보내기
  initializeBotServerTables
};