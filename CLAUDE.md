# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

식품안전나라 통합 검색 포털 - 식품의약품안전처 공공데이터를 활용한 종합 식품 정보 검색 서비스

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript 5.9.2
- **스타일링**: Tailwind CSS 4.0
- **데이터베이스**: Supabase (PostgreSQL)
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
├── data/                      # 데이터 파일
│   ├── hwp_texts/            # 한글 파일 → TXT 변환본
│   └── processed/            # 처리된 JSON 데이터
├── scripts/                   # 데이터 처리 스크립트
└── public/                    # 정적 파일
```

## 환경 변수

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 식품안전나라 API
NEXT_PUBLIC_FOOD_SAFETY_API_KEY=689a583b18ee4d40b6e3
```

## 데이터베이스 스키마

### food_codex_sections 테이블
```sql
CREATE TABLE food_codex_sections (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  character_count INTEGER,
  file_source TEXT DEFAULT 'txt_auto_extraction_perfect',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 데이터 처리 가이드

### ✅ 권장 방식: 한글 파일 → TXT 자동 추출

1. **한글 파일을 TXT로 저장**
   - 인코딩: UTF-8
   - 줄바꿈: Windows(CR+LF)
   - 서식: 제거

2. **자동 처리 스크립트 실행**
   ```bash
   node scripts/txt-to-database-auto.js
   ```

3. **특징**
   - 원본 한글 파일 텍스트 100% 유지
   - 섹션 자동 분리 (패턴: "숫자-숫자 제목")
   - 완벽한 포맷 보존
   - file_source: 'txt_auto_extraction_perfect'

### ❌ 피해야 할 방식

- 복잡한 정규식 기반 텍스트 처리
- OCR이나 PDF 추출
- 수동 복사/붙여넣기
- 자동화된 텍스트 "복구" 알고리즘

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

### 서비스별 요청 URL 형식
```
http://openapi.foodsafetykorea.go.kr/api/689a583b18ee4d40b6e3/[서비스ID]/json/1/100
```

## 텍스트 포맷팅 원칙

### ✅ 올바른 접근
- 원본 데이터가 올바르게 포맷팅되어 있다면 그대로 사용
- CSS `whitespace-pre-line`으로 줄바꿈 보존
- 한글 파일에서 TXT로 변환된 데이터 직접 활용

### ❌ 피해야 할 접근
```tsx
// 잘못된 방식 - 불필요한 가공
<div className="whitespace-pre-line">
  {formatFoodCodexStructured(section.content)}
</div>

// 올바른 방식 - 원본 데이터 그대로
<div className="whitespace-pre-line">
  {section.content}
</div>
```

## 한국어 코딩 규칙

### 필수사항
- **함수명/변수명**: 직관적이고 명확하게 작성
- **한글 주석 필수**: 코드 맥락, 이유, 목적을 한글로 설명
- **최신 문법 사용**: const/let, 템플릿 리터럴, 화살표 함수, async/await 활용
- **예외처리 필수**: try-catch, 입력값 검증, API 호출 에러 처리 포함
- **TypeScript**: 타입 정의 필수, 인터페이스 적극 활용

### 금지사항
- var 사용, 축약어, 불명확한 이름
- 하드코딩된 문자열/숫자/URL
- 예외처리 없는 외부 호출
- any 타입 사용

## 주요 스크립트

### 데이터 처리
- `txt-to-database-auto.js`: TXT 파일 자동 처리 (권장)
- `cleanup-database.js`: 데이터베이스 정리

### 기타 유틸리티
- 모든 스크립트는 `scripts/` 폴더에 위치
- 실행 전 `.env` 파일 설정 필요

---

## 중요 지침

1. **데이터 품질 최우선**: 원본 한글 파일의 텍스트를 최대한 보존
2. **단순함 추구**: 복잡한 텍스트 처리보다는 단순한 방식 선택
3. **일관성 유지**: file_source를 통한 데이터 출처 추적
4. **사용자 경험**: 검색 결과의 가독성과 정확성 중시