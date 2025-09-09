// status-server.js
const express = require('express');
const app = express();
const PORT = process.env.STATUS_PORT || 3000;

// 전역 변수로 봇 클라이언트 참조 저장
let botClient = null;

// 봇 클라이언트 참조 설정 함수
function setBotClient(client) {
  botClient = client;
}

// CORS 설정 (Uptime Kuma에서 접근할 수 있도록)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// OPTIONS 요청 처리
app.options('*', (req, res) => {
  res.sendStatus(200);
});

// 봇 상태 확인 함수
function getBotStatus() {
  if (!botClient) {
    return {
      connected: false,
      ping: null,
      guilds: 0,
      status: 'Bot client not initialized'
    };
  }

  // Discord WebSocket 상태 확인
  const wsStatus = botClient.ws.status;
  const isConnected = wsStatus === 0; // 0 = READY

  return {
    connected: isConnected,
    ping: botClient.ws.ping || null,
    guilds: botClient.guilds.cache.size,
    wsStatus: getStatusText(wsStatus),
    user: botClient.user ? {
      id: botClient.user.id,
      username: botClient.user.username,
      discriminator: botClient.user.discriminator
    } : null
  };
}

// WebSocket 상태 텍스트 변환
function getStatusText(status) {
  const statusMap = {
    0: 'READY',
    1: 'CONNECTING',
    2: 'RECONNECTING', 
    3: 'IDLE',
    4: 'NEARLY',
    5: 'DISCONNECTED',
    6: 'WAITING_FOR_GUILDS',
    7: 'IDENTIFYING',
    8: 'RESUMING'
  };
  return statusMap[status] || 'UNKNOWN';
}

// 기본 상태 엔드포인트 (Uptime Kuma용)
app.get('/health', (req, res) => {
  try {
    const botStatus = getBotStatus();
    const isHealthy = botStatus.connected;
    
    const response = {
      status: isHealthy ? 'ok' : 'error',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      discord: botStatus,
      database: botClient ? botClient.databaseStatus : { supabase: false, mongodb: false }
    };
    
    // Uptime Kuma가 인식할 수 있도록 적절한 HTTP 상태코드 반환
    const statusCode = isHealthy ? 200 : 503; // Service Unavailable
    res.status(statusCode).json(response);
  } catch (error) {
    console.error('[ERROR] 상태 엔드포인트 오류:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime())
    });
  }
});

// 간단한 ping 엔드포인트 (Uptime Kuma 대안)
app.get('/ping', (req, res) => {
  try {
    const botStatus = getBotStatus();
    
    if (botStatus.connected) {
      res.status(200).send('pong');
    } else {
      res.status(503).send('Bot disconnected');
    }
  } catch (error) {
    res.status(500).send('Error');
  }
});

// 상세 상태 정보 (디버깅용)
app.get('/status', (req, res) => {
  try {
    const botStatus = getBotStatus();
    
    const detailedStatus = {
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
        platform: process.platform
      },
      discord: botStatus,
      database: botClient ? botClient.databaseStatus : { supabase: false, mongodb: false },
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(detailedStatus);
  } catch (error) {
    console.error('[ERROR] 상세 상태 엔드포인트 오류:', error);
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 루트 경로
app.get('/', (req, res) => {
  res.json({
    message: 'Discord Bot Status Server',
    endpoints: ['/health', '/ping', '/status'],
    timestamp: new Date().toISOString()
  });
});

// 404 처리
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: ['/health', '/ping', '/status'],
    timestamp: new Date().toISOString()
  });
});

// 에러 핸들링 미들웨어
app.use((error, req, res, next) => {
  console.error('[ERROR] Express 에러:', error);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 서버 시작 함수
function startStatusServer() {
  return new Promise((resolve, reject) => {
    try {
      const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`[INFO] 상태 서버가 포트 ${PORT}에서 실행 중입니다 (모든 인터페이스)`);
        console.log(`[INFO] Health check: http://0.0.0.0:${PORT}/health`);
        console.log(`[INFO] Ping check: http://0.0.0.0:${PORT}/ping`);
        resolve(server);
      });

      // 서버 에러 처리
      server.on('error', (error) => {
        console.error('[ERROR] 상태 서버 에러:', error);
        reject(error);
      });

    } catch (error) {
      console.error('[ERROR] 상태 서버 시작 실패:', error);
      reject(error);
    }
  });
}

module.exports = { startStatusServer, setBotClient };