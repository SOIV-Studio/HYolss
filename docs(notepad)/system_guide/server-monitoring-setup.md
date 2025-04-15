# 🖥️ HYolss 서버 운영 및 모니터링 구성 가이드

이 문서는 HYolss 디스코드 봇과 관련된 서버 운영 및 모니터링 시스템을 구축하는 데 필요한 정보를 담고 있습니다. 최소한의 자동화, 안정성, 그리고 상태 페이지 구성까지 고려하여 작성되었습니다.

---

## ✅ 운영 환경 개요

- **운영 시스템**: Ubuntu (tmux로 수동 실행 중)
- **실행 대상**:
  - HYolss Discord 봇
  - 일부 Node.js 기반 웹 서비스 (메인 웹사이트, 대시보드 등)
- **추가 계획 없음**: Node.js 앱은 더 이상 추가되지 않을 예정
- **클라우드 운영 대상**: 일부 서비스는 Cloudflare Pages 등 외부 서비스에서 구동 예정

---

## 🚀 목표

- 서버 재부팅 후 자동 실행
- 봇 또는 서비스 장애 시 자동 재시작
- 외부에서도 확인 가능한 Statuspage 스타일의 상태 페이지 제공
- 최소한의 구성과 유지보수로 안정적인 운영

---

## 🧰 사용 도구 및 구성

### 1. systemd

- Ubuntu의 기본 서비스 관리 도구
- 자동 실행 및 자동 복구 기능 제공
- 로그는 `journalctl`을 통해 확인 가능

#### ✅ 예시 서비스 파일: `/etc/systemd/system/hyolss-bot.service`

```ini
[Unit]
Description=HYolss Discord Bot
After=network.target

[Service]
WorkingDirectory=/home/ubuntu/HYolss
ExecStart=/usr/bin/node index.js
Restart=always
User=ubuntu
Environment=NODE_ENV=production
EnvironmentFile=/home/ubuntu/HYolss/.env

[Install]
WantedBy=multi-user.target
```

```bash
# 서비스 등록 및 시작
sudo systemctl daemon-reexec
sudo systemctl enable hyolss-bot
sudo systemctl start hyolss-bot

# 상태 확인 및 로그 보기
sudo systemctl status hyolss-bot
sudo systemctl restart hyolss-bot
sudo systemctl stop hyolss-bot
journalctl -u hyolss-bot -f
```

---

### 2. 모니터링 도구

#### ✅ Uptime Kuma (추천)

- 셀프 호스팅 가능
- 다양한 감시 방식 (HTTP, TCP, Ping 등)
- Discord Webhook 연동
- 상태 변화 시 알림 전송 가능

```bash
docker run -d \
  --restart=always \
  -p 3001:3001 \
  -v uptime-kuma:/app/data \
  --name uptime-kuma \
  louislam/uptime-kuma
```

접속: `http://<서버 IP>:3001`

**Discord Webhook 연동 방법**:
- Uptime Kuma 접속 → `설정(Settings)` → `알림(Notifications)` → `새 알림 추가`
- 알림 타입: Discord → Webhook URL 입력 후 저장

**예시 체크 항목**:
- HYolss 봇 API 포트 (TCP 혹은 HTTP)
- URL Shortener 도메인 응답 확인
- Cloudflare에서 운영 중인 웹페이지의 HTTP 응답 확인

#### 대안 도구

- Statping: Statuspage 스타일 UI
- Better Uptime: SaaS 기반, 더 쉬운 연동 (무료 플랜 존재)

---

### 3. 상태 페이지

> Uptime Kuma 또는 Statping에서 직접 외부에 공개 가능한 상태 페이지 제공

구성 예시:

```txt
[systemd] - HYolss 봇 운영
     ↓
[Uptime Kuma or Statping] - 상태 체크 및 장애 감지
     ↓
[Status Page] - 외부에 서비스 상태 공개
```

---

## 🔁 연동 흐름 예시

1. `systemd`로 봇 실행 및 복구 자동화
2. `Uptime Kuma`에서 1분 간격으로 상태 체크
3. 응답 없음 → Discord Webhook으로 알림 전송
4. 동시에 상태 페이지에 자동 반영

---

## 📌 정리

| 기능             | 구성                         |
| -------------- | -------------------------- |
| 서버 재부팅 자동 실행   | systemd                    |
| 장애 발생 시 자동 재시작 | systemd (`Restart=always`) |
| 상태 체크 및 시각화    | Uptime Kuma or Statping    |
| 상태 알림          | Discord Webhook 연동         |
| 대시보드           | Statuspage 스타일 웹페이지        |

---

## ✅ 향후 확장 고려 사항

- HYolss 외 Node.js 앱 추가 계획이 없다면 systemd + 외부 모니터링 조합으로 충분함
- 여러 서버 또는 다중 서비스 통합 운영 시, Prometheus + Grafana 또는 Better Uptime도 고려 가능

---

## 🔗 참고 자료

- [Uptime Kuma GitHub](https://github.com/louislam/uptime-kuma)
- [systemd 서비스 작성 공식 문서](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
- [Better Uptime](https://betterstack.com/uptime/)
