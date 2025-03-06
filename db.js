const { Pool } = require('pg');

// PostgreSQL 연결 설정
const pool = new Pool({
  user: process.env.DB_USER || 'bot_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'hyolssdb',
  password: process.env.DB_PASSWORD || 'your_password',
  port: process.env.DB_PORT || 5432,
});

// 데이터베이스 연결 테스트
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL 데이터베이스에 성공적으로 연결되었습니다.');
    client.release();
    return true;
  } catch (err) {
    console.error('PostgreSQL 데이터베이스 연결 오류:', err);
    return false;
  }
};

module.exports = {
  pool,
  testConnection
};