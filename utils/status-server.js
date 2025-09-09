// status-server.js
const express = require('express');
const app = express();
// Railway에서는 PORT 환경 변수를 사용해야 함
const PORT = process.env.PORT || process.env.STATUS_PORT || 3000;

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
    const dbStatus = botClient ? botClient.databaseStatus : { supabase: false, mongodb: false };
    
    // 봇이 연결되어 있고 필수 데이터베이스(MongoDB)가 연결되어 있어야 healthy
    const isHealthy = botStatus.connected && dbStatus.mongodb;
    
    // Uptime Kuma 호환성을 위한 응답 헤더 설정
    res.set({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'X-Bot-Status': isHealthy ? 'healthy' : 'unhealthy'
    });
    
    const response = {
      status: isHealthy ? 'ok' : 'error',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      discord: botStatus,
      database: dbStatus
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
    const dbStatus = botClient ? botClient.databaseStatus : { supabase: false, mongodb: false };
    
    // 봇과 필수 데이터베이스가 모두 연결되어 있어야 정상 응답
    if (botStatus.connected && dbStatus.mongodb) {
      res.status(200).send('pong');
    } else {
      const issues = [];
      if (!botStatus.connected) issues.push('Bot disconnected');
      if (!dbStatus.mongodb) issues.push('Database disconnected');
      res.status(503).send(issues.join(', '));
    }
  } catch (error) {
    console.error('[ERROR] Ping 엔드포인트 오류:', error);
    res.status(500).send('Internal server error');
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

// Uptime Kuma HTTP 키워드 체크용 엔드포인트
app.get('/uptime-check', (req, res) => {
  try {
    const botStatus = getBotStatus();
    const dbStatus = botClient ? botClient.databaseStatus : { supabase: false, mongodb: false };
    const isHealthy = botStatus.connected && dbStatus.mongodb;
    
    if (isHealthy) {
      // Uptime Kuma가 찾을 수 있는 키워드 포함
      res.status(200).send('HEALTHY: Discord bot is running and connected');
    } else {
      res.status(503).send('UNHEALTHY: Discord bot or database connection issue');
    }
  } catch (error) {
    console.error('[ERROR] Uptime check 엔드포인트 오류:', error);
    res.status(500).send('ERROR: Internal server error');
  }
});

// 루트 경로
app.get('/', (req, res) => {
  res.json({
    message: 'Discord Bot Status Server',
    endpoints: ['/health', '/ping', '/status', '/uptime-check'],
    timestamp: new Date().toISOString()
  });
});

// 404 처리
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: ['/health', '/ping', '/status', '/uptime-check'],
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
      // Railway 환경 변수 디버깅
      console.log(`[DEBUG] PORT 환경 변수: ${process.env.PORT}`);
      console.log(`[DEBUG] STATUS_PORT 환경 변수: ${process.env.STATUS_PORT}`);
      console.log(`[DEBUG] 사용할 포트: ${PORT}`);
      
      const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`[INFO] 상태 서버가 포트 ${PORT}에서 실행 중입니다 (모든 인터페이스)`);
        console.log(`[INFO] Health check: http://0.0.0.0:${PORT}/health`);
        console.log(`[INFO] Ping check: http://0.0.0.0:${PORT}/ping`);
        console.log(`[INFO] Railway 배포 환경에서 외부 접근 가능`);
        
        // Railway에서 서버가 정말로 시작되었는지 확인
        const address = server.address();
        console.log(`[DEBUG] 서버 주소 정보:`, address);
        
        resolve(server);
      });

      // 서버 에러 처리
      server.on('error', (error) => {
        console.error('[ERROR] 상태 서버 에러:', error);
        if (error.code === 'EADDRINUSE') {
          console.error(`[ERROR] 포트 ${PORT}가 이미 사용 중입니다`);
        }
        reject(error);
      });

      // 연결 에러 처리
      server.on('clientError', (err, socket) => {
        console.error('[ERROR] 클라이언트 연결 에러:', err);
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
      });

    } catch (error) {
      console.error('[ERROR] 상태 서버 시작 실패:', error);
      reject(error);
    }
  });
}

module.exports = { startStatusServer, setBotClient };