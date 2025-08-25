// 식품공전 검색 데이터 및 키워드 매핑

export interface SearchKeyword {
  keyword: string
  pdfUrl: string
  pageNumber: number
  section: string
  description: string
}

// 검색 키워드와 PDF 페이지 매핑
export const SEARCH_KEYWORDS: SearchKeyword[] = [
  // 복합조미식품 관련 (여러 항목)
  {
    keyword: '복합조미식품',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 250,
    section: '제5장 13. 조미식품 - 정의',
    description: '복합조미식품의 정의 및 분류 기준'
  },
  {
    keyword: '복합조미식품',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 251,
    section: '제5장 13. 조미식품 - 원료기준',
    description: '복합조미식품의 사용 원료 및 첨가물 기준'
  },
  {
    keyword: '복합조미식품',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 252,
    section: '제5장 13. 조미식품 - 제조기준',
    description: '복합조미식품의 제조·가공기준 및 보관 방법'
  },
  {
    keyword: '복합조미식품',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 253,
    section: '제5장 13. 조미식품 - 성분규격',
    description: '복합조미식품의 성분 규격 및 시험 방법'
  },
  {
    keyword: '복합조미식품',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 254,
    section: '제5장 13. 조미식품 - 표시기준',
    description: '복합조미식품의 표시기준 및 영양성분 표시 방법'
  },
  {
    keyword: '조미료',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 248,
    section: '제5장 13. 조미식품',
    description: '조미료의 정의 및 분류'
  },
  // MSG 관련 (여러 항목)
  {
    keyword: 'MSG',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 248,
    section: '제5장 13. 조미식품 - MSG 정의',
    description: 'L-글루탐산나트륨(MSG)의 정의 및 특성'
  },
  {
    keyword: 'MSG',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 251,
    section: '제5장 13. 조미식품 - MSG 규격',
    description: 'L-글루탐산나트륨(MSG)의 성분 규격 및 품질 기준'
  },
  {
    keyword: 'MSG',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 255,
    section: '제5장 13. 조미식품 - MSG 사용기준',
    description: 'L-글루탐산나트륨(MSG)의 사용량 및 표시 기준'
  },
  {
    keyword: 'MSG',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(2).pdf',
    pageNumber: 65,
    section: '제2장 식품첨가물 - MSG',
    description: '식품첨가물로서 MSG의 사용기준 및 제한사항'
  },
  {
    keyword: '글루탐산',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 251,
    section: '제5장 13. 조미식품',
    description: 'L-글루탐산 및 그 염류 규격'
  },
  {
    keyword: '천연조미료',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 252,
    section: '제5장 13. 조미식품',
    description: '천연조미료의 정의 및 제조기준'
  },
  {
    keyword: '향미증진제',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 253,
    section: '제5장 13. 조미식품',
    description: '향미증진제의 사용기준'
  },
  
  // 장류 관련 (여러 항목)
  {
    keyword: '간장',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 225,
    section: '제5장 12. 장류 - 간장 정의',
    description: '간장의 정의 및 종류 (양조간장, 산분해간장, 효소분해간장 등)'
  },
  {
    keyword: '간장',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 226,
    section: '제5장 12. 장류 - 간장 원료',
    description: '간장 제조에 사용되는 원료 및 첨가물 기준'
  },
  {
    keyword: '간장',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 227,
    section: '제5장 12. 장류 - 간장 제조기준',
    description: '간장의 제조·가공기준 및 숙성 방법'
  },
  {
    keyword: '간장',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 228,
    section: '제5장 12. 장류 - 간장 성분규격',
    description: '간장의 성분 규격 (염분, 총질소, 아미노산성질소 등)'
  },
  {
    keyword: '된장',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 230,
    section: '제5장 12. 장류 - 된장 정의',
    description: '된장의 정의 및 분류 기준'
  },
  {
    keyword: '된장',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 231,
    section: '제5장 12. 장류 - 된장 원료',
    description: '된장 제조에 사용되는 원료 및 첨가물 기준'
  },
  {
    keyword: '된장',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 232,
    section: '제5장 12. 장류 - 된장 제조기준',
    description: '된장의 제조·가공기준 및 발효 조건'
  },
  {
    keyword: '된장',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 233,
    section: '제5장 12. 장류 - 된장 성분규격',
    description: '된장의 성분 규격 (염분, 수분, 조단백질 등)'
  },
  {
    keyword: '고추장',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 235,
    section: '제5장 12. 장류 - 고추장',
    description: '고추장의 정의, 원료, 제조기준 및 품질규격'
  },
  
  // 식품첨가물 관련
  {
    keyword: '식품첨가물',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(2).pdf',
    pageNumber: 45,
    section: '제2장 3. 식품일반의 기준 및 규격',
    description: '식품첨가물 사용기준'
  },
  {
    keyword: '보존료',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(2).pdf',
    pageNumber: 48,
    section: '제2장 3. 식품일반의 기준 및 규격',
    description: '보존료 사용기준 및 허용량'
  },
  {
    keyword: '착색료',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(2).pdf',
    pageNumber: 52,
    section: '제2장 3. 식품일반의 기준 및 규격',
    description: '착색료 사용기준'
  },
  
  // 미생물 기준 (여러 항목)
  {
    keyword: '대장균',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(8).pdf',
    pageNumber: 120,
    section: '제8장 일반시험법 - 대장균 시험',
    description: '대장균 시험법 및 배지 제조'
  },
  {
    keyword: '대장균',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(2).pdf',
    pageNumber: 75,
    section: '제2장 미생물기준 - 대장균',
    description: '식품별 대장균 기준치 및 허용 한계'
  },
  {
    keyword: '대장균',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 160,
    section: '제5장 식품별 - 대장균 기준',
    description: '식품별 대장균 허용 기준 및 시험 주기'
  },
  {
    keyword: '대장균군',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(8).pdf',
    pageNumber: 118,
    section: '제8장 일반시험법 - 대장균군',
    description: '대장균군 시험법 및 판정 기준'
  },
  {
    keyword: '세균수',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(8).pdf',
    pageNumber: 115,
    section: '제8장 일반시험법 - 일반세균수',
    description: '일반세균수 시험법 및 배양 조건'
  },
  {
    keyword: '세균수',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(2).pdf',
    pageNumber: 72,
    section: '제2장 미생물기준 - 일반세균수',
    description: '식품별 일반세균수 기준치'
  },
  {
    keyword: '살모넬라',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(8).pdf',
    pageNumber: 125,
    section: '제8장 일반시험법 - 살모넬라',
    description: '살모넬라 시험법 및 동정'
  },
  {
    keyword: '살모넬라',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(2).pdf',
    pageNumber: 78,
    section: '제2장 미생물기준 - 살모넬라',
    description: '살모넬라 검출 기준 및 조치사항'
  },
  
  // 영양성분
  {
    keyword: '영양성분',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(2).pdf',
    pageNumber: 85,
    section: '제2장 3. 식품일반의 기준 및 규격',
    description: '영양성분 표시기준'
  },
  {
    keyword: '열량',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(8).pdf',
    pageNumber: 200,
    section: '제8장 일반시험법',
    description: '열량 계산법'
  },
  {
    keyword: '나트륨',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(8).pdf',
    pageNumber: 210,
    section: '제8장 일반시험법',
    description: '나트륨 시험법'
  },
  
  // 원료 관련
  {
    keyword: '식품원료',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(2).pdf',
    pageNumber: 10,
    section: '제2장 1. 식품원료 기준',
    description: '식품원료 사용기준'
  },
  {
    keyword: '농산물',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(1).pdf',
    pageNumber: 25,
    section: '제1장 4. 식품원료 분류',
    description: '농산물 원료 분류'
  },
  {
    keyword: '축산물',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(1).pdf',
    pageNumber: 30,
    section: '제1장 4. 식품원료 분류',
    description: '축산물 원료 분류'
  },
  {
    keyword: '수산물',
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(1).pdf',
    pageNumber: 35,
    section: '제1장 4. 식품원료 분류',
    description: '수산물 원료 분류'
  }
]

// 검색 함수
export function searchKeywords(query: string): SearchKeyword[] {
  const normalizedQuery = query.toLowerCase().trim()
  
  if (!normalizedQuery) return []
  
  // 정확한 매칭 우선
  const exactMatches = SEARCH_KEYWORDS.filter(item => 
    item.keyword.toLowerCase() === normalizedQuery
  )
  
  // 부분 매칭
  const partialMatches = SEARCH_KEYWORDS.filter(item => 
    item.keyword.toLowerCase().includes(normalizedQuery) ||
    item.description.toLowerCase().includes(normalizedQuery) ||
    item.section.toLowerCase().includes(normalizedQuery)
  )
  
  // 중복 제거 및 정렬 (정확한 매칭 우선)
  const results = [...new Set([...exactMatches, ...partialMatches])]
  
  return results
}

// 연관 검색어 추천
export function getSuggestions(query: string): string[] {
  const normalizedQuery = query.toLowerCase().trim()
  
  if (!normalizedQuery) return []
  
  const suggestions = SEARCH_KEYWORDS
    .filter(item => 
      item.keyword.toLowerCase().startsWith(normalizedQuery) ||
      item.keyword.toLowerCase().includes(normalizedQuery)
    )
    .map(item => item.keyword)
    .filter((value, index, self) => self.indexOf(value) === index) // 중복 제거
    .slice(0, 5) // 최대 5개
  
  return suggestions
}