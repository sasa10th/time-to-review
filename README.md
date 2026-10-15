# time-to-review

## 어른이 될 시간 — 연극 감상 접수

세종과학예술영재학교(SASA) 연극 프로젝트 기반 연구 **「어른이 될 시간」**의 관객 감상을 접수하는 정적 웹 페이지입니다. 학교 계정으로 접속한 관객은 공연 감상을 작성하고 제출할 수 있습니다.

## 주요 기능

- 접수 기간 및 접수 상태 표시
- Google 계정 로그인과 학교 도메인(`sasa.hs.kr`) 확인
- 학번·이름과 연극 감상 입력 및 글자 수 표시
- 현재 탭의 `sessionStorage`를 이용한 작성 중 내용 임시 저장과 복원
- Google Forms를 통한 감상 제출
- 데스크톱과 모바일 화면을 고려한 반응형 레이아웃

## 화면 구성

```text
.
├── index.html              # 페이지 마크업 및 Google 로그인 설정
├── assets/
│   ├── css/style.css       # 레이아웃과 화면 스타일
│   ├── js/script.js        # 접수 일정, 폼, 임시 저장 및 제출 처리
│   ├── img/favicon.png
│   └── fonts/              # 페이지에서 사용하는 글꼴
└── LICENSE                 # MIT License
```

## 실행

별도의 빌드 과정이나 패키지 설치는 필요하지 않습니다. 프로젝트 루트에서 정적 파일 서버를 실행한 뒤 브라우저에서 접속하세요.

```bash
python -m http.server 8000
```

브라우저에서 `http://localhost:8000`을 엽니다. Google 로그인을 사용하려면 해당 주소가 Google Cloud의 OAuth 클라이언트에 승인된 JavaScript 원본으로 등록되어 있어야 합니다.

## 배포 및 설정

HTTPS를 지원하는 정적 호스팅 서비스에 프로젝트 파일을 배포할 수 있습니다. Google 로그인과 감상 접수를 사용할 경우 다음 설정을 확인하세요.

### Google 로그인

`index.html`의 인라인 스크립트에서 다음 값을 관리합니다.

- `CLIENT_ID`: Google Identity Services의 OAuth 웹 클라이언트 ID
- `SCHOOL_DOMAIN`: 로그인 허용 도메인

Google Cloud Console에서 배포 주소의 **승인된 JavaScript 원본**을 등록해야 합니다. 로컬 개발 주소를 사용하는 경우에도 해당 원본을 별도로 등록하세요.

> 학교 도메인 확인은 브라우저에서 수행됩니다. 이 페이지 자체는 서버를 통한 사용자 인증이나 접근 제어를 제공하지 않으므로, 로그인 검사를 강한 보안 경계로 간주하지 마세요.

### 접수 일정 및 Google Forms

`assets/js/script.js` 상단의 `schedule` 설정에서 접수 기간과 제출 폼 정보를 관리합니다.

- `receiptStart`, `receiptEnd`: 접수 시작일과 마감일 (`YYYY-MM-DD`)
- `config.action`: Google Forms의 제출 URL
- `config.entryName`, `config.entryBody`: Google Forms에서 각 입력 항목에 대응하는 entry ID

Google Form을 바꾸거나 항목을 수정했다면 URL과 entry ID를 함께 갱신하고 실제 배포 환경에서 제출을 확인하세요. 브라우저의 `no-cors` 요청 특성상 페이지는 Google Forms의 저장 결과를 직접 검증할 수 없습니다.

## 이용 안내

- 접수 기간 중 학교 계정으로 로그인하면 감상 작성 폼이 표시됩니다.
- 감상은 최대 1,000자까지 작성할 수 있습니다. 내용이 비어 있으면 제출할 수 없습니다.
- 이름과 감상은 현재 브라우저 탭에 임시 저장되며, 탭을 닫으면 임시 저장 내용은 유지되지 않습니다.
- 제출 후 페이지에 접수 완료 메시지가 표시됩니다. 접수 데이터는 설정된 Google Forms로 전송됩니다.
- 감상에 개인정보가 노출되지 않도록 유의해 주세요.

## 기술 및 외부 서비스

- HTML, CSS, JavaScript — 별도 프레임워크 및 빌드 도구 없음
- Google Identity Services — Google 로그인
- Google Forms — 감상 접수
- Google Fonts — 외부 글꼴

외부 서비스 이용 기능은 인터넷 연결이 필요합니다.

## 라이선스

이 프로젝트는 [MIT License](./LICENSE)에 따라 배포됩니다. 단, 저장소에 포함된 글꼴 및 기타 제3자 리소스에는 각 리소스의 별도 라이선스가 적용될 수 있으므로 재배포 전에 해당 조건을 확인하세요.