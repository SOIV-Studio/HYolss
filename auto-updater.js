require('dotenv').config();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { WebhookClient } = require('discord.js');

// 환경 변수에서 관리 서버 웹훅 URL 가져오기
const adminWebhookUrl = process.env.ADMIN_WEBHOOK_URL;
const webhookClient = adminWebhookUrl ? new WebhookClient({ url: adminWebhookUrl }) : null;

// 현재 버전 가져오기
function getCurrentVersion() {
    try {
        const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
        return packageJson.version;
    } catch (error) {
        console.error('[ERROR] 현재 버전 가져오기 실패:', error);
        return null;
    }
}

// GitHub에서 최신 버전 가져오기
function getLatestVersion() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'raw.githubusercontent.com',
            path: '/SOIV/HYolss_js/main/package.json',
            method: 'GET',
            headers: {
                'User-Agent': 'HYolss-Bot-Updater'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const packageJson = JSON.parse(data);
                    resolve(packageJson.version);
                } catch (error) {
                    reject(new Error(`GitHub 패키지 정보 파싱 실패: ${error.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error(`GitHub 최신 버전 확인 실패: ${error.message}`));
        });

        req.end();
    });
}

// 버전 비교 (semver 형식: x.y.z)
function isNewerVersion(current, latest) {
    if (!current || !latest) return false;
    
    const currentParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
        if (latestParts[i] > currentParts[i]) return true;
        if (latestParts[i] < currentParts[i]) return false;
    }
    
    return false; // 버전이 동일한 경우
}

// 관리 서버에 로그 전송
async function sendLogToAdminServer(message, isError = false) {
    if (!webhookClient) {
        console.log('[INFO] 관리 서버 웹훅이 설정되지 않았습니다. 로그 전송을 건너뜁니다.');
        return;
    }

    try {
        await webhookClient.send({
            content: isError ? `⚠️ **오류**: ${message}` : `🔄 **업데이트**: ${message}`,
            username: 'HYolss 업데이트 시스템',
            avatarURL: 'https://github.com/SOIV/HYolss_js/raw/main/assets/logo.png'
        });
    } catch (error) {
        console.error('[ERROR] 관리 서버에 로그 전송 실패:', error);
    }
}

// 명령 실행 함수
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`명령 실행 실패: ${error.message}\n${stderr}`));
                return;
            }
            resolve(stdout);
        });
    });
}

// 업데이트 프로세스 실행
async function runUpdateProcess() {
    try {
        // 1. 현재 버전과 최신 버전 확인
        const currentVersion = getCurrentVersion();
        const latestVersion = await getLatestVersion();
        
        console.log(`[INFO] 현재 버전: ${currentVersion}, 최신 버전: ${latestVersion}`);
        
        // 2. 버전 비교
        if (!isNewerVersion(currentVersion, latestVersion)) {
            console.log('[INFO] 이미 최신 버전입니다. 업데이트가 필요하지 않습니다.');
            return false;
        }
        
        // 3. 관리 서버에 업데이트 시작 로그 전송
        await sendLogToAdminServer(`업데이트 시작: ${currentVersion} → ${latestVersion}`);
        
        // 4. 점검 모드 실행 (system-maintenance.js)
        console.log('[INFO] 점검 모드로 전환 중...');
        const maintenanceProcess = exec('node system-maintenance.js');
        
        // 5. 잠시 대기 (점검 모드가 시작될 시간 부여)
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 6. Git pull 명령 실행
        console.log('[INFO] GitHub에서 최신 코드 가져오는 중...');
        await sendLogToAdminServer(`GitHub에서 최신 코드 가져오는 중...`);
        
        try {
            const gitOutput = await executeCommand('git pull origin main');
            console.log('[INFO] Git pull 결과:', gitOutput);
            await sendLogToAdminServer(`Git pull 완료: ${gitOutput.trim()}`);
        } catch (gitError) {
            console.error('[ERROR] Git pull 실패:', gitError);
            await sendLogToAdminServer(`Git pull 실패: ${gitError.message}`, true);
            throw gitError;
        }
        
        // 7. npm 패키지 업데이트 (필요한 경우)
        console.log('[INFO] 의존성 패키지 업데이트 중...');
        await sendLogToAdminServer(`의존성 패키지 업데이트 중...`);
        
        try {
            const npmOutput = await executeCommand('npm install');
            console.log('[INFO] npm install 결과:', npmOutput);
            await sendLogToAdminServer(`패키지 업데이트 완료`);
        } catch (npmError) {
            console.error('[ERROR] npm install 실패:', npmError);
            await sendLogToAdminServer(`패키지 업데이트 실패: ${npmError.message}`, true);
            throw npmError;
        }
        
        // 8. 점검 모드 종료 및 메인 봇 재시작
        console.log('[INFO] 점검 모드 종료 및 메인 봇 재시작 중...');
        await sendLogToAdminServer(`업데이트 완료. 버전 ${latestVersion}으로 봇 재시작 중...`);
        
        // 점검 모드 프로세스 종료
        if (maintenanceProcess && maintenanceProcess.pid) {
            process.kill(maintenanceProcess.pid);
        }
        
        // 메인 봇 재시작
        setTimeout(() => {
            const mainProcess = exec('node index.js');
            mainProcess.stdout.on('data', (data) => {
                console.log(data);
            });
            mainProcess.stderr.on('data', (data) => {
                console.error(data);
            });
        }, 2000);
        
        return true;
    } catch (error) {
        console.error('[ERROR] 업데이트 프로세스 실패:', error);
        await sendLogToAdminServer(`업데이트 프로세스 실패: ${error.message}`, true);
        
        // 오류 발생 시 메인 봇 재시작
        setTimeout(() => {
            exec('node index.js');
        }, 5000);
        
        return false;
    }
}

// 자동 업데이트 체크 (주기적으로 실행)
function scheduleUpdateCheck(intervalHours = 6) {
    // 초기 실행
    setTimeout(async () => {
        console.log('[INFO] 자동 업데이트 체크 실행 중...');
        await runUpdateProcess();
        
        // 주기적 실행 설정
        setInterval(async () => {
            console.log('[INFO] 자동 업데이트 체크 실행 중...');
            await runUpdateProcess();
        }, intervalHours * 60 * 60 * 1000);
    }, 60 * 1000); // 봇 시작 1분 후 첫 체크
}

module.exports = {
    getCurrentVersion,
    getLatestVersion,
    isNewerVersion,
    runUpdateProcess,
    scheduleUpdateCheck,
    sendLogToAdminServer
};