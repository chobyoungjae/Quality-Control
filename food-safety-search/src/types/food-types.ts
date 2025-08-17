// 식품안전나라의 다양한 서비스 타입 정의

// 서비스 카테고리 정의
export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  apis: FoodSafetyAPI[];
}

// API 서비스 정의
export interface FoodSafetyAPI {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  category: string;
  fields: APIField[];
  searchable: boolean;
}

// API 필드 정의
export interface APIField {
  key: string;
  name: string;
  type: 'string' | 'number' | 'date';
  searchable?: boolean;
  filterable?: boolean;
}

// 식품 유형 정의
export const FOOD_CATEGORIES: ServiceCategory[] = [
  {
    id: 'nutrition',
    name: '영양성분',
    description: '식품의 영양성분 정보를 검색할 수 있습니다',
    icon: '🥗',
    color: 'green',
    apis: [
      {
        id: 'I2790',
        name: '식품영양성분',
        description: '식품의 영양성분 정보',
        endpoint: 'I2790',
        category: 'nutrition',
        searchable: true,
        fields: [
          { key: 'DESC_KOR', name: '식품명', type: 'string', searchable: true },
          { key: 'GROUP_NAME', name: '식품군', type: 'string', filterable: true },
          { key: 'NUTR_CONT1', name: '에너지(kcal)', type: 'number' },
          { key: 'NUTR_CONT2', name: '단백질(g)', type: 'number' },
          { key: 'NUTR_CONT3', name: '지방(g)', type: 'number' },
          { key: 'NUTR_CONT4', name: '탄수화물(g)', type: 'number' },
        ]
      }
    ]
  },
  {
    id: 'business',
    name: '업체정보',
    description: '식품 관련 업체 및 허가 정보를 조회할 수 있습니다',
    icon: '🏢',
    color: 'blue',
    apis: [
      {
        id: 'I0490',
        name: '식품제조업체',
        description: '식품제조업체 현황',
        endpoint: 'I0490',
        category: 'business',
        searchable: true,
        fields: [
          { key: 'CMPNY_NM', name: '업체명', type: 'string', searchable: true },
          { key: 'SITE_ADDR', name: '소재지', type: 'string', filterable: true },
          { key: 'INDUTY_NM', name: '업종명', type: 'string', filterable: true },
          { key: 'PRDUCT', name: '제품', type: 'string', searchable: true },
        ]
      }
    ]
  },
  {
    id: 'additives',
    name: '식품첨가물',
    description: '식품첨가물 정보 및 기준 규격을 확인할 수 있습니다',
    icon: '🧪',
    color: 'purple',
    apis: [
      {
        id: 'C005',
        name: '식품첨가물',
        description: '식품첨가물 정보',
        endpoint: 'C005',
        category: 'additives',
        searchable: true,
        fields: [
          { key: 'PRDLST_NM', name: '품목명', type: 'string', searchable: true },
          { key: 'ENTRPS', name: '업체명', type: 'string', searchable: true },
          { key: 'PRDUCT', name: '제품명', type: 'string', searchable: true },
        ]
      }
    ]
  },
  {
    id: 'recall',
    name: '회수/판매중단',
    description: '식품 회수 및 판매중단 정보를 확인할 수 있습니다',
    icon: '⚠️',
    color: 'red',
    apis: [
      {
        id: 'I0261',
        name: '축산물회수판매중단',
        description: '축산물 회수 및 판매중단 정보',
        endpoint: 'I0261',
        category: 'recall',
        searchable: true,
        fields: [
          { key: 'PRDLST_NM', name: '제품명', type: 'string', searchable: true },
          { key: 'ENTRPS', name: '업체명', type: 'string', searchable: true },
          { key: 'TAKE_STEP', name: '조치사항', type: 'string' },
          { key: 'VLTCRN', name: '위반내용', type: 'string' },
        ]
      }
    ]
  },
  {
    id: 'restaurant',
    name: '음식점정보',
    description: '음식점 위생등급 및 영업허가 정보를 조회할 수 있습니다',
    icon: '🍽️',
    color: 'orange',
    apis: [
      {
        id: 'I2570',
        name: '음식점위생등급지정업소',
        description: '음식점 위생등급 지정업소 정보',
        endpoint: 'I2570',
        category: 'restaurant',
        searchable: true,
        fields: [
          { key: 'BIZPLC_NM', name: '업소명', type: 'string', searchable: true },
          { key: 'SANITTN_BIZCOND_NM', name: '업태구분명', type: 'string', filterable: true },
          { key: 'REFINE_ROADNM_ADDR', name: '도로명주소', type: 'string', searchable: true },
          { key: 'GRADE_DIV_NM', name: '등급구분명', type: 'string', filterable: true },
        ]
      }
    ]
  },
  {
    id: 'import',
    name: '수입식품',
    description: '수입식품 신고 및 통관 정보를 확인할 수 있습니다',
    icon: '🌍',
    color: 'teal',
    apis: [
      {
        id: 'I1250',
        name: '수입식품등검사명령',
        description: '수입식품 등 검사명령 정보',
        endpoint: 'I1250',
        category: 'import',
        searchable: true,
        fields: [
          { key: 'PRDLST_NM', name: '품목명', type: 'string', searchable: true },
          { key: 'EXPORTER', name: '수출업체명', type: 'string', searchable: true },
          { key: 'ORIGIN_NM', name: '원산지명', type: 'string', filterable: true },
          { key: 'VLTCRN', name: '위반내용', type: 'string' },
        ]
      }
    ]
  }
];

// 검색 결과 통합 타입
export interface UnifiedSearchResult {
  apiId: string;
  category: string;
  data: Record<string, unknown>[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// 검색 조건 통합 타입
export interface UnifiedSearchConditions {
  apiId: string;
  category: string;
  searchTerm?: string;
  filters?: Record<string, string>;
  page_no?: number;
  num_of_rows?: number;
}