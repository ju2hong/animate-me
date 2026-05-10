# 🎌 AnimateMe - 애니메이션 추천 시스템

생성형 AI를 활용하여 React로 개발한 애니메이션 추천 웹 시스템입니다.

## 🌐 서비스 URL

> AWS URL (세션 유효 시간 내 업데이트 예정)

## 🎬 시연 영상

> YouTube 링크 (배포 후 업데이트 예정)

---

## 📖 시스템 소개

**AnimateMe**는 MyAnimeList 데이터를 기반으로 사용자에게 최적의 애니메이션을 추천해주는 웹 서비스입니다.  
무료 Jikan API를 활용하여 실시간 애니메이션 정보를 제공합니다.

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 🏆 인기 TOP | MyAnimeList 기준 상위 랭킹 애니메이션 목록 |
| 🔍 검색 | 제목으로 애니메이션 실시간 검색 |
| 🏷 장르 필터 | 액션, 로맨스, 판타지 등 20개 장르별 필터링 |
| ♥ 즐겨찾기 | 관심 애니메이션 로컬 저장 및 관리 |
| 📋 상세 정보 | 평점, 줄거리, 제작사, 에피소드 수 등 상세 정보 모달 |
| ▶ 트레일러 | YouTube 트레일러 링크 연결 |

## 🛠 기술 스택

- **Frontend**: React 19 + TypeScript + Vite
- **API**: [Jikan API v4](https://jikan.moe/) (MyAnimeList 비공식 API, 무료/키 불필요)
- **Styling**: Pure CSS (CSS Variables, Flexbox, Grid)
- **상태 관리**: React Hooks (useState, useEffect, useCallback)
- **배포**: AWS S3 + CloudFront (GitHub Actions CI/CD)

## 🚀 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build
```

## ⚙️ GitHub Actions CI/CD 환경

`.github/workflows/deploy.yml` 파일로 자동 배포 파이프라인이 구성되어 있습니다.

### 파이프라인 흐름

```
Push to main
    │
    ├─ 1. Checkout code
    ├─ 2. Setup Node.js 20
    ├─ 3. npm ci (의존성 설치)
    ├─ 4. npm run lint (코드 검사)
    ├─ 5. npm run build (프로덕션 빌드)
    ├─ 6. AWS 자격증명 설정
    ├─ 7. S3 배포 (dist/ → S3 버킷)
    └─ 8. CloudFront 캐시 무효화
```

### GitHub Secrets 설정 항목

| Secret 이름 | 설명 |
|-------------|------|
| `AWS_ACCESS_KEY_ID` | AWS Academy Access Key |
| `AWS_SECRET_ACCESS_KEY` | AWS Academy Secret Key |
| `AWS_SESSION_TOKEN` | AWS Academy Session Token |
| `S3_BUCKET_NAME` | S3 버킷 이름 |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront 배포 ID |

> GitHub 저장소 → Settings → Secrets and variables → Actions 에서 설정

### 트리거 조건
- `main` 브랜치에 push 시 자동 빌드 + 배포
- PR 생성 시 빌드 + 린트 검사만 실행 (배포 제외)

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── AnimeCard.tsx      # 애니메이션 카드 컴포넌트
│   ├── AnimeModal.tsx     # 상세 정보 모달
│   ├── SearchBar.tsx      # 검색 바
│   └── GenreFilter.tsx    # 장르 필터
├── hooks/
│   └── useAnime.ts        # API 호출 커스텀 훅
├── types/
│   └── anime.ts           # TypeScript 타입 정의
├── App.tsx                # 메인 앱 컴포넌트
└── App.css                # 전체 스타일
```
