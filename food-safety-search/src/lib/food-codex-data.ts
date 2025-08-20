// 식품공전 조항 데이터
export interface FoodCodexSection {
  id: string;
  title: string;
  content: string;
  searchKeywords: string[];
}

export const FOOD_CODEX_SECTIONS: FoodCodexSection[] = [
  {
    id: '13-2',
    title: '13-2 소스류',
    searchKeywords: ['복합조미식품', '소스류', '마요네즈', '토마토케첩', '소스'],
    content: `13-2 소스류
1) 정의
소스류라 함은 동･식물성 원료에 향신료, 장류, 당류, 식염, 식초, 식용유지 등을 가하여 가공한 것으로 식품의 조리전･후에 풍미증진을 목적으로 사용되는 것을 말한다. 다만, 따로 기준 및 규격이 정하여진 것은 제외한다.

2) 원료 등의 구비요건
(1) 풍미증진의 목적으로 알코올 성분을 사용할 수 있다.

3) 제조･가공기준

4) 식품유형
(1) 복합조미식품
식품에 당류, 식염, 향신료, 단백가수분해물, 효모 또는 그 추출물, 식품첨가물 등을 혼합하여 수분함량이 8% 이하가 되도록 분말, 과립 또는 고형상 등으로 가공한 것으로 식품에 특유의 맛과 향을 부여하기 위해 사용하는 것을 말한다.

(2) 마요네즈
식용유지, 난황 또는 전란, 식초 또는 과즙을 주원료로 사용하거나, 이에 다른 식품 또는 식품첨가물을 가하여 유화 등의 방법으로 제조한 것을 말한다.

(3) 토마토케첩
토마토 또는 토마토 농축물(가용성 고형분 25% 기준으로 20% 이상이어야 한다)을 주원료로 하여 이에 당류, 식초, 식염, 향신료, 구연산 등을 가하여 제조한 것을 말한다.

(4) 소스
동･식물성 원료에 향신료, 장류, 당류, 식염, 식초 등을 가하여 혼합한 것이거나 또는 이를 발효･숙성시킨 것을 말한다. 다만, 따로 기준 및 규격이 정하여져 있는 것은 제외한다.

5) 규격
(1) 대장균군∶n=5, c=1, m=0, M=10(살균제품에 한한다)
(2) 대장균∶n=5, c=1, m=0, M=10(비살균제품에 한하며, 복합조미식품은 n=5, c=2, m=0, M=10으로 한다.)
(3) 세균수∶n=5, c=0, m=0(멸균제품에 한한다.)
(4) 허용외 타르색소∶검출되어서는 아니 된다.
(5) 보존료(g/kg)∶다음에서 정하는 것 이외의 보존료가 검출되어서는 아니 된다.

파라옥시안식향산메틸
파라옥시안식향산에틸 0.2 이하(파라옥시안식향산으로서, 소스에 한한다.)

소브산
소브산칼륨
소브산칼슘
1.0 이하(소스에 한한다. 파라옥시안식향산메틸 또는 파라옥시안식향산에틸과 병용할 때에는 소브산으로서 사용량과 파라옥시안식향산으로서 사용량의 합계가 1.0 이하이어야 하며, 그 중 파라옥시안식향산으로서의 사용량은 0.2 이하)
0.5 이하(소브산으로서, 토마토케첩에 한한다.)
1.0 이하(소브산으로서, 마요네즈에 한한다. 안식향산, 안식향산나트륨, 안식향산칼륨 또는 안식향산칼슘과 병용할 때에는 소브산으로서 사용량과 안식향으로서 사용량의 합계가 1.5g/kg 이하이어야 하며, 그 중 안식향산으로서의 사용량은 1.0g/kg 이하)

안식향산
안식향산나트륨
안식향산칼륨
안식향산칼슘
1.0 이하(안식향산으로서, 마요네즈에 한한다.)

6) 시험방법
(1) 대장균군
제8. 일반시험법 4. 미생물시험법 4.7 대장균군에 따라 시험한다.
(2) 대장균
제8. 일반시험법 4. 미생물시험법 4.8 대장균에 따라 시험한다.
(3) 세균수
제8. 일반시험법 4. 미생물시험법 4.5.1 일반세균수에 따라 시험한다.
(4) 허용외 타르색소
제8. 일반시험법 3. 식품첨가물시험법 3.1 타르색소에 따라 시험한다.
(5) 보존료
제8. 일반시험법 3. 식품첨가물시험법 3.2 보존료에 따라 시험한다.`
  }
];

/**
 * 검색어에 해당하는 식품공전 조항을 찾는 함수
 * @param searchTerm 검색어
 * @returns 매칭되는 식품공전 조항들
 */
export function findFoodCodexSections(searchTerm: string): FoodCodexSection[] {
  if (!searchTerm.trim()) return [];
  
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  
  return FOOD_CODEX_SECTIONS.filter(section => 
    section.searchKeywords.some(keyword => 
      keyword.toLowerCase().includes(normalizedSearchTerm) ||
      normalizedSearchTerm.includes(keyword.toLowerCase())
    )
  );
}

/**
 * API 결과와 식품공전 조항을 통합하여 반환하는 함수
 * @param apiResults API 검색 결과
 * @param searchTerm 검색어
 * @returns 통합된 검색 결과
 */
export function integrateSearchResults(apiResults: any[], searchTerm: string) {
  const codexSections = findFoodCodexSections(searchTerm);
  
  return {
    codexSections,
    apiResults,
    hasCodexContent: codexSections.length > 0
  };
}