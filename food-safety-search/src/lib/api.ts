// 식품안전나라 API 호출 함수들

import { ApiResponse, FoodNutrient, SearchConditions, SearchResult } from '@/types/food-safety';

// API 기본 설정
const API_BASE_URL = 'http://openapi.foodsafetykorea.go.kr/api';
// 실제 사용 시에는 환경변수로 관리해야 합니다
const API_KEY = process.env.NEXT_PUBLIC_FOOD_SAFETY_API_KEY || 'sample';

// 개발용 목업 데이터
const MOCK_FOODS: FoodNutrient[] = [
  {
    NUM: '1',
    FOOD_CD: 'F001',
    SAMPLING_REGION_NAME: '전국',
    SAMPLING_MONTH_NAME: '연평균',
    SAMPLING_REGION_CD: '00',
    SAMPLING_MONTH_CD: '00',
    GROUP_NAME: '곡류',
    DESC_KOR: '쌀(백미)',
    RESEARCH_YEAR: '2023',
    MAKER_NAME: '',
    SUB_REF_NAME: '국립농업과학원',
    SERVING_SIZE: '100g',
    NUTR_CONT1: '364',    // 에너지(kcal)
    NUTR_CONT2: '6.8',    // 단백질(g)
    NUTR_CONT3: '0.6',    // 지방(g)
    NUTR_CONT4: '80.0',   // 탄수화물(g)
    NUTR_CONT5: '0.2',    // 당류(g)
    NUTR_CONT6: '1.0',    // 나트륨(mg)
    NUTR_CONT7: '0',      // 콜레스테롤(mg)
    NUTR_CONT8: '0.1',    // 포화지방산(g)
    NUTR_CONT9: '0',      // 트랜스지방산(g)
  },
  {
    NUM: '2',
    FOOD_CD: 'F002',
    SAMPLING_REGION_NAME: '전국',
    SAMPLING_MONTH_NAME: '연평균',
    SAMPLING_REGION_CD: '00',
    SAMPLING_MONTH_CD: '00',
    GROUP_NAME: '육류',
    DESC_KOR: '닭고기(가슴살)',
    RESEARCH_YEAR: '2023',
    MAKER_NAME: '',
    SUB_REF_NAME: '국립농업과학원',
    SERVING_SIZE: '100g',
    NUTR_CONT1: '165',    // 에너지(kcal)
    NUTR_CONT2: '31.0',   // 단백질(g)
    NUTR_CONT3: '3.6',    // 지방(g)
    NUTR_CONT4: '0',      // 탄수화물(g)
    NUTR_CONT5: '0',      // 당류(g)
    NUTR_CONT6: '74',     // 나트륨(mg)
    NUTR_CONT7: '85',     // 콜레스테롤(mg)
    NUTR_CONT8: '1.0',    // 포화지방산(g)
    NUTR_CONT9: '0',      // 트랜스지방산(g)
  },
  {
    NUM: '3',
    FOOD_CD: 'F003',
    SAMPLING_REGION_NAME: '전국',
    SAMPLING_MONTH_NAME: '연평균',
    SAMPLING_REGION_CD: '00',
    SAMPLING_MONTH_CD: '00',
    GROUP_NAME: '난류',
    DESC_KOR: '계란(전체)',
    RESEARCH_YEAR: '2023',
    MAKER_NAME: '',
    SUB_REF_NAME: '국립농업과학원',
    SERVING_SIZE: '100g',
    NUTR_CONT1: '155',    // 에너지(kcal)
    NUTR_CONT2: '12.6',   // 단백질(g)
    NUTR_CONT3: '10.5',   // 지방(g)
    NUTR_CONT4: '1.1',    // 탄수화물(g)
    NUTR_CONT5: '0.7',    // 당류(g)
    NUTR_CONT6: '142',    // 나트륨(mg)
    NUTR_CONT7: '372',    // 콜레스테롤(mg)
    NUTR_CONT8: '3.1',    // 포화지방산(g)
    NUTR_CONT9: '0.05',   // 트랜스지방산(g)
  },
  {
    NUM: '4',
    FOOD_CD: 'F004',
    SAMPLING_REGION_NAME: '전국',
    SAMPLING_MONTH_NAME: '연평균',
    SAMPLING_REGION_CD: '00',
    SAMPLING_MONTH_CD: '00',
    GROUP_NAME: '과일류',
    DESC_KOR: '바나나',
    RESEARCH_YEAR: '2023',
    MAKER_NAME: '',
    SUB_REF_NAME: '국립농업과학원',
    SERVING_SIZE: '100g',
    NUTR_CONT1: '89',     // 에너지(kcal)
    NUTR_CONT2: '1.1',    // 단백질(g)
    NUTR_CONT3: '0.3',    // 지방(g)
    NUTR_CONT4: '22.8',   // 탄수화물(g)
    NUTR_CONT5: '12.2',   // 당류(g)
    NUTR_CONT6: '1',      // 나트륨(mg)
    NUTR_CONT7: '0',      // 콜레스테롤(mg)
    NUTR_CONT8: '0.1',    // 포화지방산(g)
    NUTR_CONT9: '0',      // 트랜스지방산(g)
  },
  {
    NUM: '5',
    FOOD_CD: 'F005',
    SAMPLING_REGION_NAME: '전국',
    SAMPLING_MONTH_NAME: '연평균',
    SAMPLING_REGION_CD: '00',
    SAMPLING_MONTH_CD: '00',
    GROUP_NAME: '채소류',
    DESC_KOR: '감자',
    RESEARCH_YEAR: '2023',
    MAKER_NAME: '',
    SUB_REF_NAME: '국립농업과학원',
    SERVING_SIZE: '100g',
    NUTR_CONT1: '77',     // 에너지(kcal)
    NUTR_CONT2: '2.0',    // 단백질(g)
    NUTR_CONT3: '0.1',    // 지방(g)
    NUTR_CONT4: '17.6',   // 탄수화물(g)
    NUTR_CONT5: '0.8',    // 당류(g)
    NUTR_CONT6: '6',      // 나트륨(mg)
    NUTR_CONT7: '0',      // 콜레스테롤(mg)
    NUTR_CONT8: '0.03',   // 포화지방산(g)
    NUTR_CONT9: '0',      // 트랜스지방산(g)
  },
  {
    NUM: '6',
    FOOD_CD: 'F006',
    SAMPLING_REGION_NAME: '전국',
    SAMPLING_MONTH_NAME: '연평균',
    SAMPLING_REGION_CD: '00',
    SAMPLING_MONTH_CD: '00',
    GROUP_NAME: '우유 및 유제품류',
    DESC_KOR: '우유(일반)',
    RESEARCH_YEAR: '2023',
    MAKER_NAME: '',
    SUB_REF_NAME: '국립농업과학원',
    SERVING_SIZE: '100g',
    NUTR_CONT1: '60',     // 에너지(kcal)
    NUTR_CONT2: '3.2',    // 단백질(g)
    NUTR_CONT3: '3.3',    // 지방(g)
    NUTR_CONT4: '4.8',    // 탄수화물(g)
    NUTR_CONT5: '4.8',    // 당류(g)
    NUTR_CONT6: '43',     // 나트륨(mg)
    NUTR_CONT7: '10',     // 콜레스테롤(mg)
    NUTR_CONT8: '2.1',    // 포화지방산(g)
    NUTR_CONT9: '0.1',    // 트랜스지방산(g)
  },
  {
    NUM: '7',
    FOOD_CD: 'F007',
    SAMPLING_REGION_NAME: '전국',
    SAMPLING_MONTH_NAME: '연평균',
    SAMPLING_REGION_CD: '00',
    SAMPLING_MONTH_CD: '00',
    GROUP_NAME: '채소류',
    DESC_KOR: '양파',
    RESEARCH_YEAR: '2023',
    MAKER_NAME: '',
    SUB_REF_NAME: '국립농업과학원',
    SERVING_SIZE: '100g',
    NUTR_CONT1: '40',     // 에너지(kcal)
    NUTR_CONT2: '1.1',    // 단백질(g)
    NUTR_CONT3: '0.1',    // 지방(g)
    NUTR_CONT4: '9.3',    // 탄수화물(g)
    NUTR_CONT5: '4.2',    // 당류(g)
    NUTR_CONT6: '4',      // 나트륨(mg)
    NUTR_CONT7: '0',      // 콜레스테롤(mg)
    NUTR_CONT8: '0.03',   // 포화지방산(g)
    NUTR_CONT9: '0',      // 트랜스지방산(g)
  },
  {
    NUM: '8',
    FOOD_CD: 'F008',
    SAMPLING_REGION_NAME: '전국',
    SAMPLING_MONTH_NAME: '연평균',
    SAMPLING_REGION_CD: '00',
    SAMPLING_MONTH_CD: '00',
    GROUP_NAME: '채소류',
    DESC_KOR: '당근',
    RESEARCH_YEAR: '2023',
    MAKER_NAME: '',
    SUB_REF_NAME: '국립농업과학원',
    SERVING_SIZE: '100g',
    NUTR_CONT1: '41',     // 에너지(kcal)
    NUTR_CONT2: '0.9',    // 단백질(g)
    NUTR_CONT3: '0.2',    // 지방(g)
    NUTR_CONT4: '9.6',    // 탄수화물(g)
    NUTR_CONT5: '4.7',    // 당류(g)
    NUTR_CONT6: '69',     // 나트륨(mg)
    NUTR_CONT7: '0',      // 콜레스테롤(mg)
    NUTR_CONT8: '0.04',   // 포화지방산(g)
    NUTR_CONT9: '0',      // 트랜스지방산(g)
  },
  {
    NUM: '9',
    FOOD_CD: 'F009',
    SAMPLING_REGION_NAME: '전국',
    SAMPLING_MONTH_NAME: '연평균',
    SAMPLING_REGION_CD: '00',
    SAMPLING_MONTH_CD: '00',
    GROUP_NAME: '과일류',
    DESC_KOR: '사과',
    RESEARCH_YEAR: '2023',
    MAKER_NAME: '',
    SUB_REF_NAME: '국립농업과학원',
    SERVING_SIZE: '100g',
    NUTR_CONT1: '52',     // 에너지(kcal)
    NUTR_CONT2: '0.3',    // 단백질(g)
    NUTR_CONT3: '0.2',    // 지방(g)
    NUTR_CONT4: '13.8',   // 탄수화물(g)
    NUTR_CONT5: '10.4',   // 당류(g)
    NUTR_CONT6: '1',      // 나트륨(mg)
    NUTR_CONT7: '0',      // 콜레스테롤(mg)
    NUTR_CONT8: '0.03',   // 포화지방산(g)
    NUTR_CONT9: '0',      // 트랜스지방산(g)
  },
  {
    NUM: '10',
    FOOD_CD: 'F010',
    SAMPLING_REGION_NAME: '전국',
    SAMPLING_MONTH_NAME: '연평균',
    SAMPLING_REGION_CD: '00',
    SAMPLING_MONTH_CD: '00',
    GROUP_NAME: '채소류',
    DESC_KOR: '배추',
    RESEARCH_YEAR: '2023',
    MAKER_NAME: '',
    SUB_REF_NAME: '국립농업과학원',
    SERVING_SIZE: '100g',
    NUTR_CONT1: '16',     // 에너지(kcal)
    NUTR_CONT2: '1.6',    // 단백질(g)
    NUTR_CONT3: '0.2',    // 지방(g)
    NUTR_CONT4: '3.0',    // 탄수화물(g)
    NUTR_CONT5: '1.9',    // 당류(g)
    NUTR_CONT6: '9',      // 나트륨(mg)
    NUTR_CONT7: '0',      // 콜레스테롤(mg)
    NUTR_CONT8: '0.04',   // 포화지방산(g)
    NUTR_CONT9: '0',      // 트랜스지방산(g)
  },
  {
    NUM: '11',
    FOOD_CD: 'F011',
    SAMPLING_REGION_NAME: '전국',
    SAMPLING_MONTH_NAME: '연평균',
    SAMPLING_REGION_CD: '00',
    SAMPLING_MONTH_CD: '00',
    GROUP_NAME: '육류',
    DESC_KOR: '돼지고기(삼겹살)',
    RESEARCH_YEAR: '2023',
    MAKER_NAME: '',
    SUB_REF_NAME: '국립농업과학원',
    SERVING_SIZE: '100g',
    NUTR_CONT1: '331',    // 에너지(kcal)
    NUTR_CONT2: '17.0',   // 단백질(g)
    NUTR_CONT3: '29.0',   // 지방(g)
    NUTR_CONT4: '0',      // 탄수화물(g)
    NUTR_CONT5: '0',      // 당류(g)
    NUTR_CONT6: '47',     // 나트륨(mg)
    NUTR_CONT7: '70',     // 콜레스테롤(mg)
    NUTR_CONT8: '10.5',   // 포화지방산(g)
    NUTR_CONT9: '0.1',    // 트랜스지방산(g)
  },
  {
    NUM: '12',
    FOOD_CD: 'F012',
    SAMPLING_REGION_NAME: '전국',
    SAMPLING_MONTH_NAME: '연평균',
    SAMPLING_REGION_CD: '00',
    SAMPLING_MONTH_CD: '00',
    GROUP_NAME: '어패류',
    DESC_KOR: '고등어',
    RESEARCH_YEAR: '2023',
    MAKER_NAME: '',
    SUB_REF_NAME: '국립농업과학원',
    SERVING_SIZE: '100g',
    NUTR_CONT1: '230',    // 에너지(kcal)
    NUTR_CONT2: '19.3',   // 단백질(g)
    NUTR_CONT3: '16.9',   // 지방(g)
    NUTR_CONT4: '0',      // 탄수화물(g)
    NUTR_CONT5: '0',      // 당류(g)
    NUTR_CONT6: '90',     // 나트륨(mg)
    NUTR_CONT7: '67',     // 콜레스테롤(mg)
    NUTR_CONT8: '4.2',    // 포화지방산(g)
    NUTR_CONT9: '0.1',    // 트랜스지방산(g)
  },
];

/**
 * 식품 영양성분 데이터 검색
 * @param conditions 검색 조건
 * @returns 검색 결과
 */
export async function searchFoodNutrients(conditions: SearchConditions): Promise<SearchResult> {
  try {
    // 개발 환경에서는 목업 데이터 사용
    if (!API_KEY || API_KEY === 'sample') {
      return searchMockData(conditions);
    }

    // 기본 매개변수 설정
    const pageNo = conditions.page_no || 1;
    const numOfRows = conditions.num_of_rows || 20;
    const startIdx = (pageNo - 1) * numOfRows + 1;
    const endIdx = startIdx + numOfRows - 1;

    // API URL 구성
    const url = `${API_BASE_URL}/${API_KEY}/I2790/json/${startIdx}/${endIdx}`;
    
    // URL 매개변수 구성
    const params = new URLSearchParams();
    if (conditions.desc_kor) {
      params.append('DESC_KOR', conditions.desc_kor);
    }
    if (conditions.group_name) {
      params.append('GROUP_NAME', conditions.group_name);
    }
    if (conditions.research_year) {
      params.append('RESEARCH_YEAR', conditions.research_year);
    }

    const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;

    // API 호출
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
    }

    const apiResponse: ApiResponse<FoodNutrient> = await response.json();

    // 에러 응답 처리
    if (apiResponse.I2790?.RESULT?.CODE !== 'INFO-000') {
      throw new Error(`API 에러: ${apiResponse.I2790?.RESULT?.MSG || '알 수 없는 오류'}`);
    }

    // 결과 데이터 처리
    const totalCount = parseInt(apiResponse.I2790.total_count) || 0;
    const data = apiResponse.I2790.row || [];
    const totalPages = Math.ceil(totalCount / numOfRows);

    return {
      data,
      totalCount,
      currentPage: pageNo,
      totalPages,
    };

  } catch (error) {
    console.error('식품 영양성분 검색 중 오류 발생:', error);
    // API 호출 실패 시 목업 데이터로 폴백
    console.log('목업 데이터로 폴백합니다.');
    return searchMockData(conditions);
  }
}

/**
 * 목업 데이터에서 검색
 * @param conditions 검색 조건
 * @returns 검색 결과
 */
function searchMockData(conditions: SearchConditions): Promise<SearchResult> {
  return new Promise((resolve) => {
    // 로딩 시뮬레이션
    setTimeout(() => {
      let filteredData = [...MOCK_FOODS];

      // 식품명 필터링
      if (conditions.desc_kor) {
        const searchTerm = conditions.desc_kor.toLowerCase();
        filteredData = filteredData.filter(food => 
          food.DESC_KOR.toLowerCase().includes(searchTerm)
        );
      }

      // 식품군 필터링
      if (conditions.group_name) {
        filteredData = filteredData.filter(food => 
          food.GROUP_NAME === conditions.group_name
        );
      }

      // 조사년도 필터링
      if (conditions.research_year) {
        filteredData = filteredData.filter(food => 
          food.RESEARCH_YEAR === conditions.research_year
        );
      }

      // 페이지네이션
      const pageNo = conditions.page_no || 1;
      const numOfRows = conditions.num_of_rows || 20;
      const startIndex = (pageNo - 1) * numOfRows;
      const endIndex = startIndex + numOfRows;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      const totalCount = filteredData.length;
      const totalPages = Math.ceil(totalCount / numOfRows);

      resolve({
        data: paginatedData,
        totalCount,
        currentPage: pageNo,
        totalPages,
      });
    }, 500); // 0.5초 로딩 시뮬레이션
  });
}

/**
 * 식품명으로 자동완성 검색
 * @param query 검색어
 * @returns 식품명 목록
 */
export async function searchFoodNames(query: string): Promise<string[]> {
  try {
    if (query.length < 2) {
      return [];
    }

    // 개발 환경에서는 목업 데이터 사용
    if (!API_KEY || API_KEY === 'sample') {
      return searchMockFoodNames(query);
    }

    const result = await searchFoodNutrients({
      desc_kor: query,
      num_of_rows: 10,
    });

    // 중복 제거된 식품명 목록 반환
    const uniqueNames = Array.from(new Set(
      result.data.map(item => item.DESC_KOR)
    ));

    return uniqueNames.slice(0, 5); // 최대 5개까지만 반환

  } catch (error) {
    console.error('식품명 자동완성 검색 중 오류 발생:', error);
    // 에러 시 목업 데이터로 폴백
    return searchMockFoodNames(query);
  }
}

/**
 * 목업 데이터에서 식품명 자동완성 검색
 * @param query 검색어
 * @returns 식품명 목록
 */
function searchMockFoodNames(query: string): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const searchTerm = query.toLowerCase();
      const matchingFoods = MOCK_FOODS
        .filter(food => food.DESC_KOR.toLowerCase().includes(searchTerm))
        .map(food => food.DESC_KOR)
        .slice(0, 5);
      
      resolve(matchingFoods);
    }, 200); // 0.2초 시뮬레이션
  });
}

/**
 * 인기 검색어 목록 (임시 데이터)
 * 실제로는 별도 API나 통계 데이터로 관리
 */
export function getPopularSearchTerms(): string[] {
  return [
    '쌀',
    '닭고기',
    '계란',
    '우유',
    '바나나',
    '감자',
    '양파',
    '당근',
    '사과',
    '배추',
  ];
}