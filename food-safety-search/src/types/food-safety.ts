// 식품안전나라 API 데이터 타입 정의

// 기본 API 응답 구조
export interface ApiResponse<T> {
  I2790: {
    total_count: string;
    row: T[];
    RESULT: {
      MSG: string;
      CODE: string;
    };
  };
}

// 식품 영양성분 데이터 타입
export interface FoodNutrient {
  NUM: string;                    // 순번
  FOOD_CD: string;               // 식품코드
  SAMPLING_REGION_NAME: string;   // 지역명
  SAMPLING_MONTH_NAME: string;    // 채취월
  SAMPLING_REGION_CD: string;     // 지역코드
  SAMPLING_MONTH_CD: string;      // 채취월코드
  GROUP_NAME: string;             // 식품군
  DESC_KOR: string;               // 식품명
  RESEARCH_YEAR: string;          // 조사년도
  MAKER_NAME: string;             // 제조사명
  SUB_REF_NAME: string;           // 자료출처
  SERVING_SIZE: string;           // 1회제공량
  NUTR_CONT1: string;             // 에너지(㎉)
  NUTR_CONT2: string;             // 단백질(g)
  NUTR_CONT3: string;             // 지방(g)
  NUTR_CONT4: string;             // 탄수화물(g)
  NUTR_CONT5: string;             // 당류(g)
  NUTR_CONT6: string;             // 나트륨(㎎)
  NUTR_CONT7: string;             // 콜레스테롤(㎎)
  NUTR_CONT8: string;             // 포화지방산(g)
  NUTR_CONT9: string;             // 트랜스지방산(g)
}

// 검색 조건 타입
export interface SearchConditions {
  desc_kor?: string;              // 식품명
  group_name?: string;            // 식품군
  research_year?: string;         // 조사년도
  page_no?: number;               // 페이지 번호
  num_of_rows?: number;           // 한 페이지 결과 수
}

// 검색 결과 타입
export interface SearchResult {
  data: FoodNutrient[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// 식품군 옵션
export const FOOD_GROUPS = [
  '곡류',
  '감자 및 전분류',
  '당류',
  '두류',
  '견과 및 종실류',
  '채소류',
  '버섯류',
  '과일류',
  '육류',
  '가금류',
  '난류',
  '어패류',
  '해조류',
  '우유 및 유제품류',
  '유지류',
  '음료류',
  '조미료류',
  '기타',
  '조리식품',
  '과자류',
] as const;

export type FoodGroup = typeof FOOD_GROUPS[number];