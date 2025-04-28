require('dotenv').config();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { WebhookClient, EmbedBuilder } = require('discord.js');
const semver = require('semver');

// 환경 변수에서 관리 서버 웹훅 URL 가져오기
const adminWebhookUrl = process.env.ADMIN_WEBHOOK_URL;
const webhookClient = adminWebhookUrl ? new WebhookClient({ url: adminWebhookUrl }) : null;

// 현재 버전 가져오기
// getCurrentVersion 함수에 버전 유효성 검사 추가
function getCurrentVersion() {
    try {
        const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
        const version = packageJson.version;
        
        // 유효한 버전인지 확인
        if (!semver.valid(version)) {
            console.warn('[WARNING] package.json에 유효하지 않은 버전 형식이 있습니다:', version);
        }
        
        return version;
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
            path: '/SOIV-Studio/HYolss/main/package.json',
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

// GitHub에서 최신 커밋 정보 가져오기
function getLatestCommitInfo() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: '/repos/SOIV-Studio/HYolss/commits/main',
            method: 'GET',
            headers: {
                'User-Agent': 'HYolss-Bot-Updater',
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    // 응답 데이터 로깅
                    console.log('[DEBUG] GitHub API 응답:', data.substring(0, 500) + '...');
                    
                    const commitInfo = JSON.parse(data);
                    
                    // 응답 구조 확인
                    if (!commitInfo) {
                        return reject(new Error('GitHub API 응답이 비어 있습니다.'));
                    }
                    
                    // API 오류 확인
                    if (commitInfo.message && commitInfo.documentation_url) {
                        return reject(new Error(`GitHub API 오류: ${commitInfo.message}`));
                    }
                    
                    // 필요한 필드 확인
                    if (!commitInfo.commit) {
                        console.log('[DEBUG] 전체 응답 구조:', JSON.stringify(commitInfo, null, 2));
                        return reject(new Error('GitHub API 응답에 commit 필드가 없습니다.'));
                    }
                    
                    resolve({
                        message: commitInfo.commit.message || '커밋 메시지 없음',
                        author: commitInfo.commit.author ? commitInfo.commit.author.name || '작성자 정보 없음' : '작성자 정보 없음',
                        date: commitInfo.commit.author ? new Date(commitInfo.commit.author.date).toLocaleString('ko-KR') : '날짜 정보 없음',
                        url: commitInfo.html_url || 'https://github.com/SOIV-Studio/HYolss',
                        hash: commitInfo.sha ? commitInfo.sha.substring(0, 7) : '알 수 없음' // 커밋 해시 추가 (7자리로 축약)
                    });
                } catch (error) {
                    console.error('[ERROR] GitHub 커밋 정보 파싱 실패:', error);
                    console.error('[ERROR] 원본 데이터:', data);
                    reject(new Error(`GitHub 커밋 정보 파싱 실패: ${error.message}`));
                }
            });
        });

        req.on('error', (error) => {
            console.error('[ERROR] GitHub API 요청 실패:', error);
            reject(new Error(`GitHub 커밋 정보 확인 실패: ${error.message}`));
        });

        // 타임아웃 설정
        req.setTimeout(10000, () => {
            req.abort();
            reject(new Error('GitHub API 요청 타임아웃'));
        });

        req.end();
    });
}

// 버전 비교 (semver 형식: x.y.z 또는 x.y.z-suffix)
// 버전 비교 (semver 라이브러리 사용)
function isNewerVersion(current, latest) {
    if (!current || !latest) return false;
    
    try {
        // semver.valid로 유효한 버전인지 확인하고 정규화
        const validCurrent = semver.valid(current);
        const validLatest = semver.valid(latest);
        
        if (!validCurrent || !validLatest) {
            console.error('[ERROR] 유효하지 않은 버전 형식:', { current, latest });
            return false;
        }
        
        // latest가 current보다 크면(newer) true 반환
        return semver.gt(validLatest, validCurrent);
    } catch (error) {
        console.error('[ERROR] 버전 비교 실패:', error);
        return false;
    }
}

// 관리 서버에 로그 전송
async function sendLogToAdminServer(message, isError = false) {
    console.log('--------------------------------------------');
    console.log('[DEBUG] sendLogToAdminServer 실행됨');
    console.log('[DEBUG] ADMIN_WEBHOOK_URL:', process.env.ADMIN_WEBHOOK_URL);
    console.log('[DEBUG] webhookClient 존재 여부:', !!webhookClient);
    console.log('[DEBUG] 전송할 메시지:', message);

    if (!webhookClient) {
        console.log('[INFO] 관리 서버 웹훅이 설정되지 않았습니다. 로그 전송을 건너뜁니다.');
        console.log('--------------------------------------------');
        return;
    }

    try {
        await webhookClient.send({
            content: isError ? `⚠️ **오류**: ${message}` : `🔄 **업데이트**: ${message}`,
            username: 'HYolss 업데이트 시스템',
            avatarURL: 'https://github.com/SOIV/HYolss_js/raw/main/assets/logo.png'
        });

        console.log('[DEBUG] 웹훅 전송 성공!');
    } catch (error) {
        console.error('[ERROR] 웹훅 전송 중 오류 발생:', error);
    }

    console.log('--------------------------------------------');
}

/*
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
*/

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
async function runUpdateProcess(force = false) {
    try {
        // 1. 현재 버전과 최신 버전 확인
        const currentVersion = getCurrentVersion();
        const latestVersion = await getLatestVersion();
        
        // 버전 차이 표시
        const currentSemver = semver.parse(currentVersion);
        const latestSemver = semver.parse(latestVersion);

        // 2. 버전 비교 및 상태에 따른 웹훅 메시지 전송
        if (!isNewerVersion(currentVersion, latestVersion) && !force) {
            console.log('[INFO] 이미 최신 버전입니다. 업데이트가 필요하지 않습니다.');
            
            // 최신 버전일 때 웹훅 메시지 (선택적)
            if (webhookClient) {
                const embed = new EmbedBuilder()
                    .setColor(0x00FF00) // 녹색
                    .setTitle('✅ 버전 확인 완료')
                    .setDescription(`현재 최신 버전 \`${currentVersion}\`을(를) 사용 중입니다.`)
                    .addFields(
                        { name: '봇 상태', value: '정상 작동 중', inline: true },
                        { name: '다음 확인', value: '다음 예정된 시간에 다시 확인합니다.', inline: true }
                    )
                    .setTimestamp();
                
                await webhookClient.send({
                    username: 'HYolss 업데이트 시스템',
                    avatarURL: 'https://github.com/SOIV-Studio/HYolss/raw/main/assets/logo.png',
                    embeds: [embed]
                });
            }
            
            return false;
        }
        
        // 최신 커밋 정보 가져오기
        let commitInfo = null;
        try {
            commitInfo = await getLatestCommitInfo();
            console.log('[INFO] 최신 커밋 정보:', commitInfo);
        } catch (error) {
            console.error('[ERROR] 최신 커밋 정보 가져오기 실패:', error);
            commitInfo = {
                message: '커밋 정보를 가져올 수 없습니다',
                author: '알 수 없음',
                date: new Date().toLocaleString('ko-KR'),
                url: 'https://github.com/SOIV-Studio/HYolss',
                hash: '알 수 없음'
            };
        }
        
        console.log(`[INFO] 현재 버전: ${currentVersion}, GitHub 버전: ${latestVersion}`);
        
        // 3. 업데이트가 필요할 때 - 더 자세한 웹훅 메시지 전송
        if (currentSemver && latestSemver) {
            let updateType = '패치';
            let updateColor = 0x3498DB; // 기본 파란색
            let updateEmoji = '🔄';
            
            // 업데이트 유형과 시각적 요소 결정
            if (latestSemver.major > currentSemver.major) {
                updateType = '메이저';
                updateColor = 0xFF0000; // 빨간색
                updateEmoji = '⚠️';
            } else if (latestSemver.minor > currentSemver.minor) {
                updateType = '마이너';
                updateColor = 0xFFA500; // 주황색
                updateEmoji = '📢';
            }
            
            console.log(`[INFO] ${updateType} 업데이트 발견: ${currentVersion} → ${latestVersion}`);
            await sendLogToAdminServer(`${updateType} 업데이트 발견: ${currentVersion} → ${latestVersion}`);
            
            // 업데이트 타입에 따른 맞춤형 웹훅 메시지
            if (webhookClient) {
                const embed = new EmbedBuilder()
                    .setColor(updateColor)
                    .setTitle(`${updateEmoji} ${updateType} 업데이트 발견`)
                    .setDescription(`버전 \`${currentVersion}\` → \`${latestVersion}\`(으)로 업데이트가 ${force ? '강제로 ' : ''}시작됩니다.`)
                    .addFields(
                        { name: '현재 버전', value: currentVersion || '알 수 없음', inline: true },
                        { name: 'GitHub 버전', value: latestVersion || '알 수 없음', inline: true },
                        { name: '업데이트 유형', value: updateType, inline: true }
                    )
                    .setTimestamp();
                
                if (commitInfo) {
                    embed.addFields(
                        { name: '최신 커밋 메시지', value: commitInfo.message || '알 수 없음' },
                        { name: '커밋 해시', value: commitInfo.hash || '알 수 없음', inline: true },
                        { name: '커밋 작성자', value: commitInfo.author || '알 수 없음', inline: true },
                        { name: '커밋 날짜', value: commitInfo.date || '알 수 없음', inline: true }
                    )
                    .setURL(commitInfo.url || 'https://github.com/SOIV-Studio/HYolss');
                }
                
                await webhookClient.send({
                    username: 'HYolss 업데이트 시스템',
                    avatarURL: 'https://github.com/SOIV-Studio/HYolss/raw/main/assets/logo.png',
                    embeds: [embed]
                });
            }
        }
        
        // 4. 점검 모드 활성화 - PM2 환경에 맞게 수정
        console.log('[INFO] 점검 모드로 전환 중...');
        await sendLogToAdminServer('점검 모드로 전환 중...');
        
        try {
            // PM2로 관리되는 점검 모드 시작
            // 옵션 1: 점검 모드용 별도 프로세스 시작 및 메인 프로세스 중지
            await executeCommand('pm2 start system-maintenance.js --name hyolss-maintenance');
            await executeCommand('pm2 stop hyolss');
            
            // 옵션 2: 환경변수로 제어하는 경우 (package.json에 설정 필요)
            // await executeCommand('pm2 restart hyolss --env maintenance');
            
            await sendLogToAdminServer('점검 모드 활성화 완료');
        } catch (maintenanceError) {
            console.error('[ERROR] 점검 모드 활성화 실패:', maintenanceError);
            await sendLogToAdminServer(`점검 모드 활성화 실패: ${maintenanceError.message}`, true);
            // 점검 모드 실패해도 업데이트 계속 진행
        }
        
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
        
        // 8. 점검 모드 종료 및 메인 봇 재시작 - PM2 환경에 맞게 수정
        console.log('[INFO] 점검 모드 종료 및 메인 봇 재시작 중...');
        await sendLogToAdminServer(`업데이트 완료. 버전 ${currentVersion} → ${latestVersion}으로 봇 재시작 중...`);
        
        try {
            // PM2 점검 모드 종료 및 메인 앱 재시작
            if (await isPM2ProcessRunning('hyolss-maintenance')) {
                await executeCommand('pm2 delete hyolss-maintenance');
            }
            
            // 메인 봇 재시작
            await executeCommand('pm2 restart hyolss');
            console.log('[INFO] PM2를 통해 봇이 성공적으로 재시작되었습니다.');
            await sendLogToAdminServer(`버전 ${latestVersion}으로 봇이 성공적으로 재시작되었습니다.`);
        } catch (restartError) {
            console.error('[ERROR] 봇 재시작 실패:', restartError);
            await sendLogToAdminServer(`봇 재시작 실패: ${restartError.message}`, true);
            
            // 재시작 실패 시 복구 시도
            try {
                await executeCommand('pm2 restart hyolss');
            } catch (recoveryError) {
                console.error('[ERROR] 봇 복구 시도 실패:', recoveryError);
                await sendLogToAdminServer(`봇 복구 시도 실패. 수동 개입이 필요할 수 있습니다.`, true);
            }
        }
        
        return true;
    } catch (error) {
        console.error('[ERROR] 업데이트 프로세스 실패:', error);
        await sendLogToAdminServer(`업데이트 프로세스 실패: ${error.message}`, true);
        
        // 오류 발생 시 메인 봇 재시작 (PM2 활용)
        try {
            // 점검 모드 프로세스 정리
            if (await isPM2ProcessRunning('hyolss-maintenance')) {
                await executeCommand('pm2 delete hyolss-maintenance');
            }
            
            // 메인 봇 재시작
            await executeCommand('pm2 restart hyolss');
            console.log('[INFO] 오류 복구: PM2를 통해 봇이 재시작되었습니다.');
            await sendLogToAdminServer(`오류 복구: 봇이 재시작되었습니다.`);
        } catch (restartError) {
            console.error('[ERROR] 오류 복구 실패:', restartError);
            await sendLogToAdminServer(`오류 복구 실패. 수동 개입이 필요합니다.`, true);
        }
        
        return false;
    }
}

// PM2 프로세스 존재 확인 헬퍼 함수
async function isPM2ProcessRunning(processName) {
    try {
        const result = await executeCommand(`pm2 id ${processName}`);
        // 정상적인 ID가 반환되면 프로세스가 존재
        return !result.includes('[]') && !result.includes('error');
    } catch (error) {
        console.error(`[ERROR] PM2 프로세스 ${processName} 확인 실패:`, error);
        return false;
    }
}

// 자동 업데이트 체크 (주기적으로 실행)
function scheduleUpdateCheck(intervalHours = 6) { // 6시간에서 12시간으로 변경
    console.log(`[INFO] 자동 업데이트 체크 예약됨: 봇 시작 1분 후 첫 체크, 이후 ${intervalHours}시간마다 체크`);
    
    // 초기 실행
    setTimeout(async () => {
        console.log('[INFO] 자동 업데이트 첫 체크 실행 중...');
        await runUpdateProcess();
        
        // 주기적 실행 설정
        const intervalId = setInterval(async () => {
            console.log(`[INFO] 자동 업데이트 정기 체크 실행 중... (${intervalHours}시간 간격)`);
            await runUpdateProcess();
        }, intervalHours * 60 * 60 * 1000);
        
        // 인터벌 ID 로깅 (디버깅용)
        console.log(`[DEBUG] 업데이트 체크 인터벌 ID: ${intervalId}`);
    }, 60 * 1000); // 봇 시작 1분 후 첫 체크
}

module.exports = {
    getCurrentVersion,
    getLatestVersion,
    getLatestCommitInfo,
    isNewerVersion,
    runUpdateProcess,
    scheduleUpdateCheck,
    sendLogToAdminServer
};