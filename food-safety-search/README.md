# 🏛️ 식품안전나라 통합 검색 포털

식품의약품안전처에서 제공하는 다양한 공공데이터를 통합하여 제공하는 종합 식품 정보 검색 서비스입니다.

## ✨ 주요 기능

### 🔗 **통합 포털 서비스**
- **6개 주요 카테고리**: 영양성분, 업체정보, 식품첨가물, 회수/판매중단, 음식점정보, 수입식품
- **15+ API 서비스**: 식품안전나라의 다양한 공공데이터 API 통합 지원
- **카테고리별 전문 검색**: 각 분야에 특화된 검색 인터페이스 제공

### 🔍 **고급 검색 기능**
- **실시간 검색**: 각 카테고리별 최적화된 검색 기능
- **스마트 필터링**: 카테고리별 맞춤형 필터 옵션 제공
- **인기 검색어**: 카테고리별 인기 검색어 추천
- **자동완성**: 실시간 검색어 자동완성 지원

### 📊 **데이터 시각화**
- **영양성분 분석**: 평균 영양성분 및 식품군별 분포 차트
- **업체정보 통계**: 지역별, 업종별 업체 분포 시각화
- **음식점 등급 분석**: 위생등급별 분포 및 통계
- **실시간 통계**: 데이터 최신화율 및 검색 결과 요약

### 🎨 **사용자 경험**
- **📱 모바일 친화적**: 모든 기기에서 최적화된 반응형 디자인
- **🚀 빠른 성능**: Next.js 15와 Turbopack을 활용한 최적화된 성능
- **🧭 직관적 네비게이션**: 카테고리 간 쉬운 이동 및 탐색
- **📄 페이지네이션**: 대량 데이터의 효율적인 페이지별 조회

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4.0
- **API Integration**: 식품안전나라 15+ 공공데이터 Open API
- **Data Visualization**: 커스텀 차트 및 통계 컴포넌트
- **Development**: ESLint, Turbopack (자동 설정)

## 🚀 설치 및 실행

### 1. 저장소 클론

```bash
git clone [repository-url]
cd food-safety-search
```

### 2. 의존성 설치

```bash
npm install
# 또는
yarn install
# 또는
pnpm install
```

### 3. 환경변수 설정

`.env.example` 파일을 참고하여 `.env.local` 파일을 생성하고 API 키를 설정하세요.

```bash
cp .env.example .env.local
```

`.env.local` 파일에 다음과 같이 설정:

```env
NEXT_PUBLIC_FOOD_SAFETY_API_KEY=your_api_key_here
```

**API 키 발급 방법:**
1. [식품안전나라 공공데이터 사이트](https://www.foodsafetykorea.go.kr/apiMain.do) 접속
2. 회원가입 및 로그인
3. API 키 신청 및 발급받기
4. 발급받은 API 키를 `.env.local` 파일에 설정

### 4. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 📖 사용법

### 🏠 홈페이지 이용
1. **카테고리 선택**: 6개 주요 카테고리 중 원하는 분야 선택
2. **서비스 개요**: 각 카테고리별 제공 서비스 및 API 수 확인
3. **바로가기**: 관심 있는 카테고리 카드 클릭으로 즉시 이동

### 🔍 카테고리별 검색
1. **서비스 선택**: 해당 카테고리에서 제공하는 API 서비스 선택
2. **검색어 입력**: 카테고리에 맞는 검색어 입력 (자동완성 지원)
3. **필터 적용**: 카테고리별 맞춤 필터 옵션 활용
4. **인기 검색어**: 추천 검색어를 클릭하여 빠른 검색

### 📊 결과 분석
- **시각화 차트**: 검색 결과를 차트와 그래프로 분석
- **상세 테이블**: 전체 데이터를 테이블 형태로 확인
- **통계 정보**: 데이터 개수, 최신화율 등 요약 통계
- **페이지네이션**: 대량 데이터의 효율적인 탐색

### 🧭 네비게이션
- **상단 메뉴**: 카테고리 간 빠른 이동
- **모바일 메뉴**: 모바일에서 접기/펼치기 메뉴 이용
- **홈 버튼**: 언제든 메인 페이지로 복귀

## 🏗️ 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 메인 홈페이지 (카테고리 선택)
│   ├── layout.tsx         # 전역 레이아웃 (네비게이션 포함)
│   ├── category/[id]/     # 동적 카테고리 페이지
│   │   └── page.tsx       # 카테고리별 검색 페이지
│   ├── nutrition/         # 기존 영양성분 페이지 (리다이렉트)
│   └── globals.css        # 전역 스타일
├── components/            # React 컴포넌트
│   ├── Navigation.tsx     # 상단 네비게이션 바
│   ├── DataVisualization.tsx  # 데이터 시각화 컴포넌트
│   ├── SearchForm.tsx     # 검색 폼 컴포넌트 (기존)
│   ├── SearchResults.tsx  # 검색 결과 컴포넌트 (기존)
│   ├── NoResultsMessage.tsx   # 검색 결과 없음 메시지
│   └── InfoBanner.tsx     # 정보 배너 컴포넌트
├── lib/                   # 유틸리티 함수
│   ├── unified-api.ts     # 통합 API 서비스
│   └── api.ts            # 기존 영양성분 API (호환성)
└── types/                 # TypeScript 타입 정의
    ├── food-types.ts      # 통합 식품 타입 시스템
    └── food-safety.ts     # 기존 영양성분 타입 (호환성)
```

## 🔧 개발 스크립트

```bash
# 개발 서버 실행 (Turbopack 사용)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 코드 린팅
npm run lint
```

## 📊 API 정보

이 프로젝트는 [식품안전나라 공공데이터 API](https://www.foodsafetykorea.go.kr/apiMain.do)를 사용합니다.

**주요 API:**
- `I2790`: 식품영양성분 데이터베이스 조회
- 지원 형식: JSON, XML
- 응답 데이터: 영양성분 9종 (에너지, 단백질, 지방, 탄수화물, 당류, 나트륨, 콜레스테롤, 포화지방산, 트랜스지방산)

## 🌟 주요 특징

### 사용자 경험 (UX)
- **직관적인 인터페이스**: 간단하고 명확한 검색 폼
- **즉시 피드백**: 실시간 자동완성 및 로딩 상태 표시
- **접근성**: 키보드 네비게이션 지원
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화

### 개발자 경험 (DX)
- **TypeScript**: 타입 안정성 및 개발 생산성 향상
- **컴포넌트 기반**: 재사용 가능한 모듈형 구조
- **에러 처리**: 포괄적인 에러 핸들링 및 사용자 피드백
- **성능 최적화**: Next.js 15의 최신 기능 활용

## 🚀 배포

### Vercel 배포
1. [Vercel](https://vercel.com)에 계정 생성
2. GitHub 저장소 연결
3. 환경변수 설정 (`NEXT_PUBLIC_FOOD_SAFETY_API_KEY`)
4. 자동 배포 완료

### 기타 플랫폼
- Netlify, AWS Amplify, Google Cloud Platform 등에서도 배포 가능
- Docker를 사용한 컨테이너 배포도 지원

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원 및 문의

- **데이터 출처**: [식품의약품안전처 식품안전나라](https://www.foodsafetykorea.go.kr)
- **기술 문의**: GitHub Issues를 통해 문의해주세요
- **API 관련 문의**: 식품안전나라 고객센터

---

**개발자**: Quality-Control Team  
**마지막 업데이트**: 2025년 8월  
**버전**: 1.0.0
