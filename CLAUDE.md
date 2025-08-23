# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

식품안전나라 통합 검색 포털 - 식품의약품안전처 공공데이터를 활용한 종합 식품 정보 검색 서비스

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript 5.9.2
- **스타일링**: Tailwind CSS 4.0
- **패키지 매니저**: npm
- **개발 도구**: ESLint, Turbopack (개발 서버)

## 개발 명령어

```bash
# 개발 서버 실행 (Turbopack 사용)
cd food-safety-search && npm run dev

# 프로덕션 빌드
cd food-safety-search && npm run build

# 프로덕션 서버 실행
cd food-safety-search && npm start

# 린트 검사
cd food-safety-search && npm run lint
```

## 프로젝트 구조

```
food-safety-search/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API 라우트
│   │   │   ├── food-search/   # 통합 검색 프록시 API
│   │   │   └── food-code/     # 식품코드 검색 API
│   │   ├── category/[id]/     # 카테고리별 페이지
│   │   ├── labeling-standards/ # 라벨링 표준 페이지
│   │   ├── nutrition-calculator/ # 영양 계산기
│   │   └── nutrition/         # 영양성분 검색
│   ├── components/            # 재사용 가능한 컴포넌트
│   ├── lib/                   # 유틸리티 및 API 함수
│   └── types/                 # TypeScript 타입 정의
└── public/                    # 정적 파일
```

## 아키텍처 핵심

### API 통합 시스템
- **unified-api.ts**: 식품안전나라의 6개 주요 API를 통합하는 단일 인터페이스
- **프록시 패턴**: CORS 문제 해결을 위한 서버사이드 프록시 구현
- **데모 데이터**: API 키가 없거나 연결 실패 시 자동으로 데모 데이터 제공

### 타입 시스템
- **food-types.ts**: 6개 카테고리별 API 서비스 정의
- **food-safety.ts**: 식품영양성분 API 전용 타입
- 통합 검색 결과와 조건을 위한 `UnifiedSearchResult`, `UnifiedSearchConditions`

### 컴포넌트 설계
- **Navigation**: 전역 네비게이션
- **SearchForm**: 카테고리별 검색 폼
- **SearchResults**: 통합 검색 결과 표시
- **DataVisualization**: 영양성분 시각화

## 식품안전나라 API 서비스 목록

### 현재 승인된 서비스
- **I0930**: 식품공전 (식품의 기준 및 규격/개별기준규격)
- **I1250**: 식품(첨가물)품목제조보고

### 기타 주요 서비스 (별도 신청 필요)
- **I2790**: 식품영양성분 정보
- **I0490**: 식품제조업체 현황  
- **C005**: 식품첨가물 정보
- **I0261**: 축산물 회수/판매중단 정보
- **I2570**: 음식점 위생등급
- **C002**: 식품공전 (일반기준규격)
- **C003**: 식품공전 (개별기준규격)

### 서비스별 요청 URL 형식
```
http://openapi.foodsafetykorea.go.kr/api/689a583b18ee4d40b6e3/[서비스ID]/json/1/100
```

예시:
- 식품공전: `http://openapi.foodsafetykorea.go.kr/api/689a583b18ee4d40b6e3/I0930/json/1/100`
- 품목제조보고: `http://openapi.foodsafetykorea.go.kr/api/689a583b18ee4d40b6e3/I1250/json/1/100`

## 환경 변수

```
NEXT_PUBLIC_FOOD_SAFETY_API_KEY=689a583b18ee4d40b6e3
```

## 텍스트 포맷팅 주의사항 ⚠️

**IMPORTANT: 이미 잘 포맷팅된 데이터를 건드리지 마세요!**

### 문제 사례와 해결책

1. **❌ 잘못된 접근**: 
   - 이미 줄바꿈이 포함된 올바른 데이터를 포맷팅 함수로 다시 가공
   - 결과: 모든 줄바꿈이 사라져서 한 줄로 붙어버림

2. **✅ 올바른 접근**:
   - 원본 데이터가 이미 올바르게 포맷팅되어 있다면 그대로 사용
   - CSS `whitespace-pre-line`으로 줄바꿈 보존
   - 포맷팅 함수는 꼭 필요한 경우만 사용

### 코드 적용 원칙

```tsx
// ❌ 잘못된 방식
<div className="whitespace-pre-line">
  {formatFoodCodexStructured(section.content)} {/* 불필요한 가공 */}
</div>

// ✅ 올바른 방식  
<div className="whitespace-pre-line">
  {section.content} {/* 원본 데이터 그대로 */}
</div>
```

### 데이터 처리 우선순위

1. **먼저 원본 데이터 확인** - 이미 올바르게 포맷팅되어 있는지 체크
2. **CSS 적용** - `whitespace-pre-line` 또는 `whitespace-pre-wrap` 사용
3. **포맷팅 함수는 최후의 수단** - 정말 필요한 경우만 사용

## 식품안전나라 API 연결 가이드

### API 키 및 서비스 확인 필수사항

1. **서비스 ID 정확성 확인**
   - API 키별로 승인된 서비스만 사용 가능
   - 현재 승인된 서비스: I0930 (식품 규격기준)
   - 다른 서비스 사용 시 "인증키가 유효하지 않습니다" 오류 발생

2. **API 테스트 순서**
   ```bash
   # 1단계: 작은 데이터로 연결 테스트
   http://openapi.foodsafetykorea.go.kr/api/689a583b18ee4d40b6e3/I0930/json/1/5
   
   # 2단계: 응답 확인 후 데이터 범위 확장
   http://openapi.foodsafetykorea.go.kr/api/689a583b18ee4d40b6e3/I0930/json/1/50
   
   # 3단계: 검색 파라미터 추가 테스트
   http://openapi.foodsafetykorea.go.kr/api/689a583b18ee4d40b6e3/I0930/json/1/100/PRDLST_NM=김치
   ```

3. **일반적인 문제 해결**
   - **인증키 오류**: 승인된 서비스 ID 목록 재확인
   - **타임아웃**: 요청 데이터 범위 축소 (endIdx 값 줄이기)
   - **CORS 오류**: 프록시 API (/api/food-search) 사용
   - **응답 없음**: HTTP vs HTTPS 프로토콜 변경 시도

4. **성능 최적화**
   - 대량 데이터 요청 시 배치 처리 (50-100개씩 나누어 요청)
   - 브라우저 테스트 후 코드 구현
   - 응답 속도가 느린 경우 캐싱 고려

### API 상세 문서

모든 API 서비스별 상세 정보는 별도 문서 참조:
- [API 레퍼런스 문서](./docs/api-reference.md)

## 한국어 코딩 규칙 및 가이드라인

### 필수사항

- **함수명/변수명**: 직관적이고 명확하게 작성 (getUserSheetId, generateEmployeeNumber)
- **한글 주석 필수**: 코드 맥락, 이유, 목적을 한글로 설명
- **최신 문법 사용**: const/let, 템플릿 리터럴, 화살표 함수, async/await 활용
- **예외처리 필수**: try-catch, 입력값 검증, API 호출 에러 처리 포함
- **상수 분리**: 하드코딩 금지, 환경변수 및 설정 객체 활용
- **단일 책임**: 함수는 하나의 역할만 수행
- **TypeScript**: 타입 정의 필수, 인터페이스 적극 활용

### 금지사항

- var 사용, 축약어, 불명확한 이름
- 하드코딩된 문자열/숫자/URL
- 예외처리 없는 외부 호출
- 주석 없는 복잡한 로직
- any 타입 사용

### 응답방식

- 한글로 자세한 설명 제공
- 예제 코드 포함
- 단계별 구현 설명
- 성능 및 주의사항 명시
- 모바일 친화적 UI (Tailwind CSS 활용)

### 프로젝트 개발 시 주의사항

- 기술 스택: Next.js 15 + TypeScript + Tailwind CSS 4.0
- 단계별 구현 요청 (한 번에 전체 구현하지 말고)
- 구체적 요구사항 명시
- 한국어로 소통 및 응답
