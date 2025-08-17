// 식품안전나라 통합 API 서비스

import { UnifiedSearchConditions, UnifiedSearchResult, FOOD_CATEGORIES } from '@/types/food-types';

// API 기본 설정
const API_BASE_URL = 'http://openapi.foodsafetykorea.go.kr/api';
const API_KEY = process.env.NEXT_PUBLIC_FOOD_SAFETY_API_KEY || 'sample';

/**
 * 통합 검색 함수 - 다양한 API 서비스를 통일된 인터페이스로 검색
 * @param conditions 검색 조건
 * @returns 검색 결과
 */
export async function searchUnifiedData(conditions: UnifiedSearchConditions): Promise<UnifiedSearchResult> {
  try {
    const { apiId, category, searchTerm, filters, page_no = 1, num_of_rows = 20 } = conditions;

    // API 정보 찾기
    const categoryInfo = FOOD_CATEGORIES.find(cat => cat.id === category);
    const apiInfo = categoryInfo?.apis.find(api => api.id === apiId);
    
    if (!apiInfo) {
      throw new Error(`API 정보를 찾을 수 없습니다: ${apiId}`);
    }

    // 페이지네이션 설정
    const startIdx = (page_no - 1) * num_of_rows + 1;
    const endIdx = startIdx + num_of_rows - 1;

    // 프록시 API URL 구성
    const proxyUrl = '/api/food-search';
    const params = new URLSearchParams();
    
    // 기본 파라미터
    params.append('apiId', apiId);
    params.append('startIdx', startIdx.toString());
    params.append('endIdx', endIdx.toString());
    
    // 검색어 처리
    if (searchTerm) {
      // API별로 주요 검색 필드 설정
      const searchField = getMainSearchField(apiId);
      if (searchField) {
        params.append(searchField, searchTerm);
      }
    }
    
    // 필터 처리
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
    }

    const fullUrl = `${proxyUrl}?${params.toString()}`;

    console.log('프록시 API 호출 URL:', fullUrl);

    // 프록시를 통한 API 호출
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API 호출 실패: ${response.status} ${response.statusText}`);
    }

    const apiResponse = await response.json();
    console.log('API 응답:', apiResponse);

    // 응답 구조 파싱 (식품안전나라 API는 모두 동일한 구조)
    const dataKey = Object.keys(apiResponse)[0]; // 첫 번째 키가 데이터 키
    const responseData = apiResponse[dataKey];

    if (!responseData) {
      throw new Error('API 응답 데이터가 없습니다');
    }

    // 에러 응답 처리
    if (responseData.RESULT?.CODE !== 'INFO-000') {
      throw new Error(`API 에러: ${responseData.RESULT?.MSG || '알 수 없는 오류'}`);
    }

    // 결과 데이터 처리
    const totalCount = parseInt(responseData.total_count) || 0;
    const data = responseData.row || [];
    const totalPages = Math.ceil(totalCount / num_of_rows);

    return {
      apiId,
      category,
      data,
      totalCount,
      currentPage: page_no,
      totalPages,
    };

  } catch (error) {
    console.error('통합 검색 중 오류 발생:', error);
    throw error;
  }
}

/**
 * API별 주요 검색 필드 반환
 * @param apiId API ID
 * @returns 검색 필드명
 */
function getMainSearchField(apiId: string): string | null {
  const searchFields: Record<string, string> = {
    'I2790': 'DESC_KOR',        // 식품영양성분 - 식품명
    'I0490': 'CMPNY_NM',        // 식품제조업체 - 업체명
    'C005': 'PRDLST_NM',        // 식품첨가물 - 품목명
    'I0261': 'PRDLST_NM',       // 축산물회수판매중단 - 제품명
    'I2570': 'BIZPLC_NM',       // 음식점위생등급지정업소 - 업소명
    'I1250': 'PRDLST_NM',       // 수입식품등검사명령 - 품목명
  };

  return searchFields[apiId] || null;
}

/**
 * 특정 카테고리의 인기 검색어 반환
 * @param category 카테고리 ID
 * @returns 인기 검색어 목록
 */
export function getPopularTermsByCategory(category: string): string[] {
  const popularTerms: Record<string, string[]> = {
    nutrition: ['쌀', '닭고기', '계란', '우유', '바나나', '감자', '양파', '당근', '사과', '배추'],
    business: ['롯데', '농심', '오뚜기', '동원', '청우', '대상', '풀무원', '해태', '크라운', '삼진'],
    additives: ['아스파탐', '사카린', '소르비톨', '구연산', '타르타르산', '글루탐산나트륨'],
    recall: ['살모넬라', '대장균', '노로바이러스', '리스테리아', '곰팡이독소'],
    restaurant: ['맛집', '한식', '중식', '일식', '양식', '카페', '치킨', '피자', '햄버거'],
    import: ['중국', '미국', '베트남', '태국', '필리핀', '인도', '브라질', '칠레', '호주'],
  };

  return popularTerms[category] || [];
}

/**
 * 카테고리별 필터 옵션 반환
 * @param category 카테고리 ID
 * @param apiId API ID
 * @returns 필터 옵션 목록
 */
export function getFilterOptions(category: string, apiId: string): Record<string, string[]> {
  // 영양성분의 경우
  if (category === 'nutrition' && apiId === 'I2790') {
    return {
      GROUP_NAME: [
        '곡류', '감자 및 전분류', '당류', '두류', '견과 및 종실류',
        '채소류', '버섯류', '과일류', '육류', '가금류', '난류',
        '어패류', '해조류', '우유 및 유제품류', '유지류', '음료류',
        '조미료류', '기타', '조리식품', '과자류'
      ]
    };
  }
  
  // 음식점의 경우
  if (category === 'restaurant' && apiId === 'I2570') {
    return {
      GRADE_DIV_NM: ['매우우수', '우수', '좋음'],
      SANITTN_BIZCOND_NM: ['일반음식점', '휴게음식점', '제과점영업', '카페']
    };
  }

  // 수입식품의 경우
  if (category === 'import' && apiId === 'I1250') {
    return {
      ORIGIN_NM: ['중국', '미국', '베트남', '태국', '일본', '필리핀', '인도', '브라질']
    };
  }

  return {};
}