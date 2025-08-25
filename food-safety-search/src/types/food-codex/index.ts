// 식품공전 관련 타입 정의

// 목차 항목 타입
export interface TOCItem {
  id: string
  title: string
  sectionNumber: string
  children?: TOCItem[]
  pdfUrl?: string
  pageNumber?: number
  level: number
}

// PDF 문서 타입
export interface FoodCodexDocument {
  id: string
  title: string
  sectionNumber: string
  parentId?: string
  pdfUrl: string
  pageNumber?: number
  content?: string
  searchVector?: string
  createdAt: Date
  updatedAt: Date
}

// 검색 결과 타입
export interface SearchResult {
  id: string
  title: string
  sectionNumber: string
  pdfUrl: string
  pageNumber?: number
  content: string
  highlight?: string
  rank?: number
}

// 북마크 타입
export interface Bookmark {
  id: string
  userId: string
  documentId: string
  document?: FoodCodexDocument
  createdAt: Date
}

// 검색 필터 타입
export interface SearchFilters {
  category?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  documentType?: string[]
}

// 검색 조건 타입
export interface SearchConditions {
  query: string
  filters?: SearchFilters
  page?: number
  limit?: number
  sortBy?: 'relevance' | 'date' | 'title'
}

// PDF 뷰어 상태 타입
export interface PDFViewerState {
  url: string
  currentPage: number
  totalPages: number
  scale: number
  searchTerm?: string
  isLoading: boolean
  error?: string
}

// 목차 구조 매핑
export const TOC_STRUCTURE: TOCItem[] = [
  {
    id: 'section1',
    title: '총칙',
    sectionNumber: '제1',
    level: 1,
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(1).pdf',
    pageNumber: 1,
    children: [
      { id: 'section1-1', title: '일반원칙', sectionNumber: '1', level: 2, pageNumber: 5 },
      { id: 'section1-2', title: '기준 및 규격의 적용', sectionNumber: '2', level: 2, pageNumber: 8 },
      { id: 'section1-3', title: '용어의 풀이', sectionNumber: '3', level: 2, pageNumber: 12 },
      { id: 'section1-4', title: '식품원료 분류', sectionNumber: '4', level: 2, pageNumber: 25 }
    ]
  },
  {
    id: 'section2',
    title: '식품일반에 대한 공통기준 및 규격',
    sectionNumber: '제2',
    level: 1,
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(2).pdf',
    pageNumber: 1,
    children: [
      { id: 'section2-1', title: '식품원료 기준', sectionNumber: '1', level: 2, pageNumber: 8 },
      { id: 'section2-2', title: '제조·가공기준', sectionNumber: '2', level: 2, pageNumber: 25 },
      { id: 'section2-3', title: '식품일반의 기준 및 규격', sectionNumber: '3', level: 2, pageNumber: 45 },
      { id: 'section2-4', title: '보존 및 유통기준', sectionNumber: '4', level: 2, pageNumber: 85 }
    ]
  },
  {
    id: 'section3',
    title: '영·유아용, 고령자용 또는 대체식품으로 표시하여 판매하는 식품의 기준 및 규격',
    sectionNumber: '제3',
    level: 1,
    children: [
      { 
        id: 'section3-1', 
        title: '영·유아용으로 표시하여 판매하는 식품', 
        sectionNumber: '1', 
        level: 2,
        pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(3-1).pdf',
        pageNumber: 1
      },
      { 
        id: 'section3-2', 
        title: '고령자용으로 표시하여 판매하는 식품', 
        sectionNumber: '2', 
        level: 2,
        pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(3-2).pdf',
        pageNumber: 1
      },
      { 
        id: 'section3-3', 
        title: '대체식품으로 표시하여 판매하는 식품', 
        sectionNumber: '3', 
        level: 2,
        pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(3-3).pdf',
        pageNumber: 1
      }
    ]
  },
  {
    id: 'section4',
    title: '장기보존식품의 기준 및 규격',
    sectionNumber: '제4',
    level: 1,
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(4).pdf',
    pageNumber: 1,
    children: [
      { id: 'section4-1', title: '통·병조림식품', sectionNumber: '1', level: 2, pageNumber: 8 },
      { id: 'section4-2', title: '레토르트식품', sectionNumber: '2', level: 2, pageNumber: 25 },
      { id: 'section4-3', title: '냉동식품', sectionNumber: '3', level: 2, pageNumber: 40 }
    ]
  },
  {
    id: 'section5',
    title: '식품별 기준 및 규격',
    sectionNumber: '제5',
    level: 1,
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(5).pdf',
    pageNumber: 1,
    children: [
      { id: 'section5-1', title: '과자류, 빵류 또는 떡류', sectionNumber: '1', level: 2, pageNumber: 15 },
      { id: 'section5-2', title: '빙과류', sectionNumber: '2', level: 2, pageNumber: 45 },
      { id: 'section5-3', title: '코코아가공품류 또는 초콜릿류', sectionNumber: '3', level: 2, pageNumber: 65 },
      { id: 'section5-4', title: '당류', sectionNumber: '4', level: 2, pageNumber: 85 },
      { id: 'section5-5', title: '잼류', sectionNumber: '5', level: 2, pageNumber: 105 },
      { id: 'section5-6', title: '두부류 또는 묵류', sectionNumber: '6', level: 2, pageNumber: 125 },
      { id: 'section5-7', title: '식용유지류', sectionNumber: '7', level: 2, pageNumber: 145 },
      { id: 'section5-8', title: '면류', sectionNumber: '8', level: 2, pageNumber: 165 },
      { id: 'section5-9', title: '음료류', sectionNumber: '9', level: 2, pageNumber: 185 },
      { id: 'section5-10', title: '특수영양식품', sectionNumber: '10', level: 2, pageNumber: 205 },
      { id: 'section5-11', title: '특수의료용도식품', sectionNumber: '11', level: 2, pageNumber: 215 },
      { id: 'section5-12', title: '장류', sectionNumber: '12', level: 2, pageNumber: 225 },
      { id: 'section5-13', title: '조미식품', sectionNumber: '13', level: 2, pageNumber: 248 }, // 주요 관심 항목
      { id: 'section5-14', title: '절임류 또는 조림류', sectionNumber: '14', level: 2, pageNumber: 260 },
      { id: 'section5-15', title: '주류', sectionNumber: '15', level: 2, pageNumber: 280 },
      { id: 'section5-16', title: '농산가공식품류', sectionNumber: '16', level: 2, pageNumber: 300 },
      { id: 'section5-17', title: '식육가공품류 및 포장육', sectionNumber: '17', level: 2, pageNumber: 320 },
      { id: 'section5-18', title: '알가공품류', sectionNumber: '18', level: 2, pageNumber: 340 },
      { id: 'section5-19', title: '유가공품류', sectionNumber: '19', level: 2, pageNumber: 360 },
      { id: 'section5-20', title: '수산가공식품류', sectionNumber: '20', level: 2, pageNumber: 380 },
      { id: 'section5-21', title: '동물성가공식품류', sectionNumber: '21', level: 2, pageNumber: 400 },
      { id: 'section5-22', title: '벌꿀 및 화분가공품류', sectionNumber: '22', level: 2, pageNumber: 420 },
      { id: 'section5-23', title: '즉석식품류', sectionNumber: '23', level: 2, pageNumber: 440 },
      { id: 'section5-24', title: '기타식품류', sectionNumber: '24', level: 2, pageNumber: 460 }
    ]
  },
  {
    id: 'section6',
    title: '식품접객업소(집단급식소 포함)의 조리식품 등에 대한 기준 및 규격',
    sectionNumber: '제6',
    level: 1,
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(6).pdf',
    pageNumber: 1
  },
  {
    id: 'section7',
    title: '검체의 채취 및 취급방법',
    sectionNumber: '제7',
    level: 1,
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(7).pdf',
    pageNumber: 1
  },
  {
    id: 'section8',
    title: '일반시험법',
    sectionNumber: '제8',
    level: 1,
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(8).pdf',
    pageNumber: 1
  },
  {
    id: 'section9',
    title: '재검토기한',
    sectionNumber: '제9',
    level: 1,
    pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(9).pdf',
    pageNumber: 1
  },
  {
    id: 'appendix',
    title: '별표',
    sectionNumber: '별표',
    level: 1,
    children: [
      { id: 'appendix-1', title: '별표1', sectionNumber: '[별표1]', level: 2, pageNumber: 1, pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(9).pdf' },
      { id: 'appendix-2', title: '별표2', sectionNumber: '[별표2]', level: 2, pageNumber: 15, pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(9).pdf' },
      { id: 'appendix-3', title: '별표3', sectionNumber: '[별표3]', level: 2, pageNumber: 25, pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(9).pdf' },
      { id: 'appendix-4', title: '별표4', sectionNumber: '[별표4]', level: 2, pageNumber: 35, pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(9).pdf' },
      { id: 'appendix-5', title: '별표5', sectionNumber: '[별표5]', level: 2, pageNumber: 45, pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(9).pdf' },
      { id: 'appendix-6', title: '별표6', sectionNumber: '[별표6]', level: 2, pageNumber: 55, pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(9).pdf' },
      { id: 'appendix-7', title: '별표7', sectionNumber: '[별표7]', level: 2, pageNumber: 65, pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(9).pdf' },
      { id: 'appendix-8', title: '별표8', sectionNumber: '[별표8]', level: 2, pageNumber: 75, pdfUrl: 'https://uqkjgpshuhbwbwouwxbn.supabase.co/storage/v1/object/public/food-docs/food-docs(9).pdf' }
    ]
  }
]