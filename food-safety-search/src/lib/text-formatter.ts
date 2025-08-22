/**
 * 식품공전 텍스트 포맷팅 유틸리티
 * 공백이 제거된 식품공전 텍스트를 가독성 있게 포맷팅
 */

/**
 * 식품공전 텍스트를 가독성 있게 포맷팅
 * @param text 원본 텍스트
 * @returns 포맷팅된 텍스트
 */
export function formatFoodCodexText(text: string): string {
  if (!text) return '';

  let formatted = text;

  // 1. 기본 띄어쓰기 복원
  formatted = formatted
    // 기본 단어 사이 띄어쓰기 복원
    .replace(/([가-힣])([가-힣]{1,}은|는|이|가|을|를|에|의|와|과|도|만|부터|까지|에서|으로|로|라고|라|함은)/g, '$1 $2')
    .replace(/([가-힣])([가-힣]{2,})/g, (match, p1, p2) => {
      // 특정 패턴은 띄어쓰기 추가
      if (p2.match(/^(또는|그리고|이거나|이나|등의|등을|등이|가공|처리|제조|건조|숙성|염지|훈연|가열|식품|첨가물|고깃덩어리|부위|분류|정형|말한다|것을|것이|것으로|경우|미만|이어야|한다|아니|된다)/)) {
        return p1 + ' ' + p2;
      }
      return match;
    })
    
    // 숫자와 단위 사이 띄어쓰기
    .replace(/([0-9])([가-힣%])/g, '$1 $2')
    .replace(/([0-9])\s*%/g, '$1%')
    
    // 특정 단어 조합 띄어쓰기
    .replace(/식육또는/g, '식육 또는')
    .replace(/식육가공품을/g, '식육가공품을')
    .replace(/부위에따라/g, '부위에 따라')
    .replace(/분류하여/g, '분류하여')
    .replace(/정형염지한/g, '정형 염지한')
    .replace(/후숙성/g, '후 숙성')
    .replace(/건조한것/g, '건조한 것')
    .replace(/가열처리한/g, '가열처리한')
    .replace(/것이거나/g, '것이거나')
    .replace(/고깃덩어리에/g, '고깃덩어리에')
    .replace(/첨가물을/g, '첨가물을')
    .replace(/가한후/g, '가한 후')
    .replace(/또는가열처리하여/g, '또는 가열처리하여')
    .replace(/가공한것을/g, '가공한 것을')
    .replace(/말한다/g, '말한다')
    
    // 원료등의구비요건 -> 원료 등의 구비요건
    .replace(/원료등의구비요건/g, '원료 등의 구비요건')
    .replace(/어육을혼합하여/g, '어육을 혼합하여')
    .replace(/프레스햄을제조하는/g, '프레스햄을 제조하는')
    .replace(/경우어육은/g, '경우 어육은')
    .replace(/전체육함량의/g, '전체 육함량의')
    .replace(/미만이어야한다/g, '미만이어야 한다')
    
    // 제조･가공기준
    .replace(/제조･가공기준/g, '제조･가공기준')
    
    // 식품유형 관련
    .replace(/식품유형/g, '식품유형')
    .replace(/햄:식육을/g, '햄∶식육을')
    .replace(/부위에따라분류하여/g, '부위에 따라 분류하여')
    .replace(/정형염지한후/g, '정형 염지한 후')
    .replace(/숙성･건조하거나/g, '숙성･건조하거나')
    .replace(/훈연또는/g, '훈연 또는')
    .replace(/가열처리하여/g, '가열처리하여')
    .replace(/가공한것을말한다/g, '가공한 것을 말한다')
    .replace(/뼈나껍질이있는것도포함한다/g, '뼈나 껍질이 있는 것도 포함한다')
    
    // 생햄 관련
    .replace(/생햄:식육의/g, '생햄∶식육의')
    .replace(/부위를염지한/g, '부위를 염지한')
    .replace(/것이나이에/g, '것이나 이에')
    .replace(/식품첨가물을가하여/g, '식품첨가물을 가하여')
    .replace(/저온에서훈연/g, '저온에서 훈연')
    .replace(/숙성･건조한/g, '숙성･건조한')
    
    // 프레스햄 관련
    .replace(/프레스햄:식육의/g, '프레스햄∶식육의')
    .replace(/고깃덩어리를염지한/g, '고깃덩어리를 염지한')
    .replace(/것이나이에식품/g, '것이나 이에 식품')
    .replace(/식품또는식품첨가물을/g, '식품 또는 식품첨가물을')
    .replace(/가한후숙성･건조하거나/g, '가한 후 숙성･건조하거나')
    .replace(/훈연또는가열처리한/g, '훈연 또는 가열처리한')
    .replace(/것으로육함량/g, '것으로 육함량')
    .replace(/이상,전분/g, '이상, 전분')
    .replace(/이하의것을말한다/g, '이하의 것을 말한다')
    
    // 규격 관련
    .replace(/아질산이온/g, '아질산 이온')
    .replace(/미만/g, '미만')
    .replace(/타르색소:/g, '타르색소∶')
    .replace(/검출되어서는아니된다/g, '검출되어서는 아니 된다')
    .replace(/보존료/g, '보존료')
    .replace(/다음에서정하는이외의/g, '다음에서 정하는 이외의')
    .replace(/보존료가검출되어서는아니된다/g, '보존료가 검출되어서는 아니 된다')
    .replace(/이하\(/g, '이하(')
    .replace(/소브산으로서/g, '소브산으로서')
    
    // 세균 관련
    .replace(/멸균제품에한한다/g, '멸균제품에 한한다')
    .replace(/생햄에한한다/g, '생햄에 한한다')
    .replace(/살균제품에한한다/g, '살균제품에 한한다')
    .replace(/살균제품또는그대로섭취하는제품에한한다/g, '살균제품 또는 그대로 섭취하는 제품에 한한다')
    .replace(/다만,생햄의경우/g, '다만, 생햄의 경우')
    .replace(/이어야한다/g, '이어야 한다')
    
    // 시험방법
    .replace(/시험방법제/g, '시험방법\n제')
    .replace(/일반시험법에따라/g, '일반시험법에 따라')
    .replace(/시험한다/g, '시험한다');

  // 2. 번호 매기기 및 들여쓰기 정리
  formatted = formatted
    // 주 번호 (1), 2), 3) 등) 앞에 줄바꿈과 들여쓰기
    .replace(/([가-힣])\s*([0-9]+\))/g, '$1\n $2')
    
    // 부 번호 ((1), (2) 등) 앞에 줄바꿈과 들여쓰기
    .replace(/([가-힣])\s*(\([0-9]+\))/g, '$1\n   $2')
    
    // 첫 번째 항목 앞 불필요한 줄바꿈 제거
    .replace(/^(\s*1\))/g, ' 1)')

  // 3. 기타 정리
  formatted = formatted
    // 콜론을 ∶로 변경 (한글 문서 표준)
    .replace(/:/g, '∶')
    
    // 단위 표기 정리
    .replace(/\(g\/k\s*g\)/g, '(g/kg)')
    .replace(/0\.\s*0\s*7/g, '0.07')
    .replace(/7\s*5\s*%/g, '75%')
    .replace(/8\s*%/g, '8%')
    .replace(/1\s*0\s*%/g, '10%')
    .replace(/2\.\s*0/g, '2.0')
    .replace(/1\s*0\s*,/g, '10,')
    .replace(/1\s*0\s*0/g, '100')
    .replace(/2\s*5\s*g/g, '25g')
    
    // n=, c=, m=, M= 표기 정리
    .replace(/n\s*=\s*5/g, 'n=5')
    .replace(/c\s*=\s*([0-9])/g, 'c=$1')
    .replace(/m\s*=\s*([0-9])/g, 'm=$1')
    .replace(/M\s*=\s*([0-9])/g, 'M=$1')
    
    // 중복 공백 정리
    .replace(/\s{2,}/g, ' ')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();

  return formatted;
}

/**
 * 식품 규격 테이블 데이터 포맷팅
 * @param value 규격값
 * @returns 포맷팅된 규격값
 */
export function formatSpecValue(value: string): string {
  if (!value) return '';

  return value
    // 기본 공백 정리
    .replace(/\s+/g, ' ')
    // 단위 표기 정리
    .replace(/([0-9])\s*([a-zA-Z]+\/[a-zA-Z]+)/g, '$1 $2')
    // 퍼센트 정리
    .replace(/([0-9])\s*%/g, '$1%')
    // 온도 정리
    .replace(/([0-9])\s*℃/g, '$1℃')
    // 검출 표현 정리
    .replace(/(검출되어서는아니된다)/g, '검출되어서는 아니 된다')
    .replace(/(음성이어야한다)/g, '음성이어야 한다')
    .trim();
}

/**
 * 날짜 포맷팅 (YYYYMMDD -> YYYY-MM-DD)
 * @param dateStr 날짜 문자열
 * @returns 포맷팅된 날짜
 */
export function formatDate(dateStr: string): string {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  
  if (dateStr === '99991231') return '유효';
  
  return dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
}

/**
 * 시험방법 텍스트 포맷팅
 * @param text 시험방법 텍스트
 * @returns 포맷팅된 텍스트
 */
export function formatTestMethod(text: string): string {
  if (!text) return '';

  return text
    .replace(/제([0-9]+)\./g, '제$1. ')
    .replace(/일반시험법/g, '일반시험법')
    .replace(/에따라/g, '에 따라')
    .replace(/시험한다/g, '시험한다')
    .trim();
}