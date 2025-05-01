> 내가 참고하려고 작성된 문서이므로 실제로 셋팅 할때와는 다른 부분이 있을 수 있습니다.<br>또한 GCP VM을 기준으로 작성되었기에 그외 다른 서비스에 대해서는 별도로 찻아서 확인을 해보시기 바랍니다.

### 1. **SSH 활성화 후 필수 패키지 설치 목록**

**시스템 패키지 업데이트 및 필수 유틸리티 설치**
```bash
# 시스템 패키지 업데이트
sudo apt update && sudo apt upgrade -y

# 필수 유틸리티 설치
sudo apt install -y \
    curl \
    wget \
    git \
    vim \
    unzip \
    htop \
    net-tools \
    lsb-release \
    software-properties-common \
    build-essential \
    ufw
```

- **curl**: HTTP 요청 및 파일 다운로드
- **wget**: 파일 다운로드
- **git**: 버전 관리
- **vim**: 텍스트 편집기
- **unzip**: 압축 해제
- **htop**: 시스템 리소스 모니터링 도구
- **net-tools**: 네트워크 관련 도구들 (예: ifconfig)
- **lsb-release**: 배포판 정보 확인
- **software-properties-common**: PPA 관리 도구
- **build-essential**: 빌드 도구(컴파일러 등)
- **ufw**: 방화벽 관리 도구

### 2. **Node.js 설치 명령어** (v22.14.0 또는 최신 버전)
**NodeSource에서 LTS 버전 설치 (최신 LTS 버전 설치)**
```bash
# Node.js v22.14.0 버전 또는 최신 버전 설치
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs
```

- `setup_16.x`는 **LTS 버전**을 설정하는 스크립트입니다. `v22.14.0`과 같은 최신 버전도 지원됩니다. 하지만 기본적으로 최신 **LTS 버전**을 사용하는 것이 안정성이 좋습니다.
- **버전 확인**: 설치가 완료된 후 `node -v`와 `npm -v`를 입력하여 버전 확인이 가능합니다.

### 3. **Swap 파일 생성**
만약 메모리가 부족한 상태에서 실행될 수 있도록 **swap 파일**을 생성하는 방법입니다.

```bash
# Swap 파일 생성 (1GB)
sudo fallocate -l 1G /swapfile

# 올바른 권한 설정
sudo chmod 600 /swapfile

# swap 영역 설정
sudo mkswap /swapfile

# swap 활성화
sudo swapon /swapfile

# 시스템이 재부팅할 때 자동으로 swap 활성화되도록 설정
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

- 위 명령어는 **1GB의 swap 파일**을 생성합니다. 필요에 따라 크기를 조정할 수 있습니다 (예: `2G`, `4G`).
- **`sudo swapon /swapfile`** 명령어로 즉시 활성화하며, `/etc/fstab`에 추가하여 시스템 재부팅 시 자동으로 활성화되도록 합니다.

### 4. **PM2 설치 및 관련 명령어**
`pm2`는 Node.js 애플리케이션을 관리하고, 프로세스를 백그라운드에서 실행하는 데 유용한 도구입니다.

**PM2 설치**
```bash
# pm2 설치 (글로벌)
sudo npm install -g pm2
```

**PM2 명령어 예시**
1. **디스코드 봇 실행**
   ```bash
   pm2 start index.js --name "discord-bot"
   ```
   - `index.js`는 봇의 메인 파일입니다. 파일명에 맞게 변경하세요.
   - `--name` 옵션을 사용하여 프로세스에 이름을 지정할 수 있습니다.

2. **디스코드 봇 종료**
   ```bash
   pm2 stop "discord-bot"
   ```

3. **디스코드 봇 재시작**
   ```bash
   pm2 restart "discord-bot"
   ```

4. **디스코드 봇 상태 확인**
   ```bash
   pm2 status
   ```

5. **PM2 로그 확인**
   ```bash
   pm2 logs "discord-bot"
   ```

6. **시스템 재부팅 시 PM2 자동 실행 설정**
   ```bash
   pm2 startup
   # 위 명령어 실행 후 출력되는 명령어를 그대로 복사하여 붙여넣기 (시스템에 따라 다름)
   ```

7. **현재 실행 중인 프로세스 리스트 저장**
   ```bash
   pm2 save
   ```

### **요약**

1. **시스템 패키지 업데이트 및 필수 유틸리티 설치**: 기본적인 시스템 유틸리티 설치 및 업데이트
2. **Node.js 설치**: LTS 버전 설치
3. **Swap 파일 생성**: 메모리 부족 시 swap 파일 설정
4. **PM2 설치 및 사용법**: 디스코드 봇을 백그라운드에서 실행하고 관리하는 방법

이렇게 설치 및 설정을 마친 후, 봇 코딩과 관련된 부분은 직접 구현하시면 됩니다. 이 과정은 디스코드 봇을 24/7으로 안정적으로 운영하기 위한 환경을 설정하는 데 필요한 기본적인 작업들입니다.