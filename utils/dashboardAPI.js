const axios = require('axios');
require('dotenv').config();

/**
 * HYolss Dashboard API 연동 클라이언트
 * 봇에서 대시보드 API와 통신하기 위한 유틸리티
 */
class DashboardAPI {
  constructor() {
    this.baseURL = process.env.DASHBOARD_API_URL || 'https://bot-api.soiv-studio.xyz';
    this.apiKey = process.env.DASHBOARD_API_KEY; // 봇 전용 API 키 (필요시)
    this.timeout = 5000; // 5초 타임아웃
  }

  /**
   * API 요청을 위한 기본 헤더 생성
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'HYolss-Bot/1.0.0'
    };

    if (this.apiKey) {
      headers['X-Bot-API-Key'] = this.apiKey;
    }

    return headers;
  }

  /**
   * 서버 설정 동기화
   * @param {string} guildId - 디스코드 서버 ID
   * @param {Object} serverData - 서버 데이터
   */
  async syncServerConfig(guildId, serverData) {
    try {
      const response = await axios.put(
        `${this.baseURL}/api/servers/${guildId}`,
        {
          serverId: guildId,
          serverName: serverData.name,
          serverIcon: serverData.icon,
          memberCount: serverData.memberCount,
          ownerId: serverData.ownerId,
          botActive: true,
          lastActivity: new Date()
        },
        {
          headers: this.getHeaders(),
          timeout: this.timeout
        }
      );

      console.log(`[INFO] 서버 ${guildId} 설정이 대시보드에 동기화되었습니다.`);
      return response.data;
    } catch (error) {
      console.error(`[ERROR] 서버 설정 동기화 오류 (${guildId}):`, error.message);
      return null;
    }
  }

  /**
   * 모듈 상태 업데이트
   * @param {string} guildId - 서버 ID
   * @param {string} moduleName - 모듈 이름
   * @param {boolean} enabled - 활성화 상태
   * @param {Object} moduleData - 추가 모듈 데이터
   */
  async updateModule(guildId, moduleName, enabled, moduleData = {}) {
    try {
      const response = await axios.put(
        `${this.baseURL}/api/servers/${guildId}/modules/${moduleName}`,
        {
          enabled,
          ...moduleData
        },
        {
          headers: this.getHeaders(),
          timeout: this.timeout
        }
      );

      console.log(`[INFO] 모듈 ${moduleName} 상태가 업데이트되었습니다 (${guildId}): ${enabled}`);
      return response.data;
    } catch (error) {
      console.error(`[ERROR] 모듈 업데이트 오류 (${guildId}, ${moduleName}):`, error.message);
      return null;
    }
  }

  /**
   * 명령어 사용 통계 전송
   * @param {string} guildId - 서버 ID
   * @param {string} commandName - 명령어 이름
   * @param {string} userId - 사용자 ID
   * @param {boolean} success - 성공 여부
   */
  async logCommandUsage(guildId, commandName, userId, success = true) {
    try {
      await axios.post(
        `${this.baseURL}/api/servers/${guildId}/logs`,
        {
          type: 'command',
          commandName,
          userId,
          success,
          timestamp: new Date()
        },
        {
          headers: this.getHeaders(),
          timeout: this.timeout
        }
      );
    } catch (error) {
      // 로그 전송 실패는 조용히 처리 (봇 기능에 영향 주지 않음)
      console.debug(`[DEBUG] 명령어 로그 전송 실패 (${guildId}):`, error.message);
    }
  }

  /**
   * 서버 상태 업데이트 (하트비트)
   * @param {Object} botStats - 봇 통계 정보
   */
  async updateBotStatus(botStats) {
    try {
      await axios.post(
        `${this.baseURL}/api/bot/heartbeat`,
        {
          serverCount: botStats.serverCount,
          userCount: botStats.userCount,
          uptime: botStats.uptime,
          memoryUsage: botStats.memoryUsage,
          timestamp: new Date()
        },
        {
          headers: this.getHeaders(),
          timeout: this.timeout
        }
      );
    } catch (error) {
      console.debug('[DEBUG] 봇 상태 업데이트 실패:', error.message);
    }
  }

  /**
   * 서버 탈퇴 알림
   * @param {string} guildId - 서버 ID
   * @param {string} guildName - 서버 이름
   */
  async notifyServerLeave(guildId, guildName) {
    try {
      await axios.delete(
        `${this.baseURL}/api/servers/${guildId}`,
        {
          headers: this.getHeaders(),
          timeout: this.timeout,
          data: { reason: 'bot_kicked_or_banned' }
        }
      );

      console.log(`[INFO] 서버 탈퇴가 대시보드에 기록되었습니다: ${guildName} (${guildId})`);
    } catch (error) {
      console.error(`[ERROR] 서버 탈퇴 알림 오류 (${guildId}):`, error.message);
    }
  }

  /**
   * 대시보드 API 연결 상태 확인
   */
  async checkConnection() {
    try {
      const response = await axios.get(`${this.baseURL}/health`, {
        timeout: 3000
      });

      console.log('[INFO] 대시보드 API 연결 상태: 정상');
      return true;
    } catch (error) {
      console.warn('[WARN] 대시보드 API 연결 불가:', error.message);
      return false;
    }
  }
}

// 싱글톤 인스턴스 생성
const dashboardAPI = new DashboardAPI();

module.exports = {
  DashboardAPI,
  dashboardAPI
};