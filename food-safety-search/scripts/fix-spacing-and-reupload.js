/**
 * 식품공전 데이터의 불필요한 공백 제거 및 Supabase 재업로드 스크립트
 * 
 * 문제: 기존 데이터가 "1 7 - 1 햄 류 ( * 축 산 물 가 공 품 )" 형태로 
 *      모든 글자 사이에 공백이 들어가 있어서 포맷팅이 제대로 되지 않음
 * 
 * 해결: 
 * 1. 기존 JSON 데이터에서 content 필드의 불필요한 공백 제거
 * 2. 올바른 한국어 텍스트로 복원
 * 3. Supabase에 재업로드
 */

const fs = require('fs');
const path = require('path');

/**
 * 텍스트에서 불필요한 공백 제거 및 올바른 한국어로 복원
 * @param {string} text - 공백이 많이 포함된 텍스트
 * @returns {string} - 정리된 텍스트
 */
function cleanSpacingInText(text) {
  if (!text) return '';

  let cleaned = text;

  // 1. 기본 한글 글자 사이 불필요한 공백 제거
  // "1 7 - 1" -> "17-1"
  cleaned = cleaned.replace(/(\d)\s+(\d)/g, '$1$2');
  // "( * " -> "(*"  
  cleaned = cleaned.replace(/\(\s*\*\s*/g, '(*');
  // " * )" -> "*)"
  cleaned = cleaned.replace(/\s*\*\s*\)/g, '*)');
  
  // 2. 한글 단어들 사이의 불필요한 공백 정리 - 더 적극적으로
  // 먼저 모든 한글 글자 사이의 공백을 제거하고, 필요한 곳만 다시 추가
  cleaned = cleaned.replace(/([가-힣])\s+([가-힣])/g, '$1$2');
  
  // 3. 필요한 띄어쓰기만 다시 추가
  const spacingRules = [
    // 기본 문법 요소
    ['라함은', '라 함은'],
    ['등의', '등의'], // 이건 붙여쓰기 유지
    ['또는', '또는'], // 이것도 붙여쓰기 유지  
    ['그대로', '그대로'],
    ['에서', '에서'],
    ['으로', '으로'],
    ['하여', '하여'],
    ['시켜', '시켜'],
    ['처리한', '처리한'],
    ['제조', '제조'],
    ['가공', '가공'],
    ['보존료', '보존료'],
    ['검출', '검출'],
    ['세균수', '세균수'],
    ['대장균', '대장균'],
    ['살모넬라', '살모넬라'],
    ['리스테리아', '리스테리아'],
    ['모노사이토제네스', '모노사이토제네스'],
    ['황색포도상구균', '황색포도상구균'],
    ['일반시험법', '일반시험법'],
    ['에따라', '에 따라'],
    ['따라', '따라'],
    ['이상', '이상'],
    ['이하', '이하'],
    ['미만', '미만'],
    ['한한다', '한한다'],
    ['경우', '경우'],
    ['다만', '다만'],
    ['아니된다', '아니 된다'],
    ['서는', '서는'],
    ['말한다', '말한다']
  ];
  
  // 띄어쓰기 규칙 적용
  spacingRules.forEach(([wrong, correct]) => {
    const regex = new RegExp(wrong, 'g');
    cleaned = cleaned.replace(regex, correct);
  });
  
  // 4. 숫자와 단위 사이 공백 정리
  // "7 0 %" -> "70%"
  cleaned = cleaned.replace(/(\d)\s+(\d)\s*%/g, '$1$2%');
  // "0 . 0 7" -> "0.07"
  cleaned = cleaned.replace(/(\d)\s*\.\s*(\d)\s*(\d)/g, '$1.$2$3');
  // "2 . 0" -> "2.0"  
  cleaned = cleaned.replace(/(\d)\s*\.\s*(\d)(?!\d)/g, '$1.$2');
  // "2 5 g" -> "25g"
  cleaned = cleaned.replace(/(\d)\s+(\d)\s*g/g, '$1$2g');
  
  // 5. 특수 문자와의 공백 정리
  // "g / k g" -> "g/kg"
  cleaned = cleaned.replace(/g\s*\/\s*k\s*g/g, 'g/kg');
  // "n = 5" -> "n=5"
  cleaned = cleaned.replace(/n\s*=\s*(\d)/g, 'n=$1');
  cleaned = cleaned.replace(/c\s*=\s*(\d)/g, 'c=$1');  
  cleaned = cleaned.replace(/m\s*=\s*(\d)/g, 'm=$1');
  cleaned = cleaned.replace(/M\s*=\s*(\d)/g, 'M=$1');
  
  // 6. 문장 부호와 공백 정리
  // " ∶ " -> "∶ "
  cleaned = cleaned.replace(/\s*∶\s*/g, '∶ ');
  // " . " -> ". "
  cleaned = cleaned.replace(/\s*\.\s*/g, '. ');
  // " , " -> ", "
  cleaned = cleaned.replace(/\s*,\s*/g, ', ');
  
  // 7. 연속된 공백을 하나로
  cleaned = cleaned.replace(/\s{2,}/g, ' ');
  
  // 8. 문장 끝 공백 정리
  cleaned = cleaned.trim();
  
  return cleaned;
}

/**
 * 제목도 정리
 * @param {string} title - 제목
 * @returns {string} - 정리된 제목  
 */
function cleanTitle(title) {
  if (!title) return '';
  
  return title
    .replace(/(\d)\s+(\d)/g, '$1$2') // "1 7 - 1" -> "17-1"
    .replace(/\s*-\s*/g, '-')        // " - " -> "-"
    .replace(/\(\s*\*\s*/g, '(*')    // "( * " -> "(*"
    .replace(/\s*\*\s*\)/g, '*)')    // " * )" -> "*)"
    .replace(/([가-힣])\s+([가-힣])/g, '$1$2') // 한글 사이 공백 제거
    .replace(/\s{2,}/g, ' ')         // 연속 공백 제거
    .trim();
}

/**
 * 메인 처리 함수
 */
async function processAndUpload() {
  try {
    console.log('🔄 식품공전 데이터 공백 정리 및 재업로드 시작...');
    
    // 1. 기존 JSON 파일 읽기
    const dataPath = path.join(__dirname, '../data/processed/food_codex_sections.json');
    console.log('📖 기존 데이터 읽는 중...');
    
    if (!fs.existsSync(dataPath)) {
      throw new Error('기존 데이터 파일을 찾을 수 없습니다: ' + dataPath);
    }
    
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const jsonData = JSON.parse(rawData);
    const sections = jsonData.sections || jsonData; // sections 배열이거나 직접 배열일 수 있음
    
    console.log(`📊 총 ${sections.length}개 섹션 발견`);
    
    // 2. 데이터 정리
    console.log('🧹 데이터 정리 중...');
    const cleanedSections = sections.map((section, index) => {
      if (index < 5) {
        console.log(`🔧 처리 중: ${section.title}`);
      } else if (index === 5) {
        console.log('...');
      }
      
      return {
        ...section,
        title: cleanTitle(section.title),
        content: cleanSpacingInText(section.content)
      };
    });
    
    // 3. 정리된 데이터 저장 (원본과 동일한 구조로)
    const cleanedDataPath = path.join(__dirname, '../data/processed/food_codex_sections_cleaned.json');
    const outputData = jsonData.sections ? { sections: cleanedSections } : cleanedSections;
    fs.writeFileSync(cleanedDataPath, JSON.stringify(outputData, null, 2), 'utf-8');
    console.log(`💾 정리된 데이터 저장: ${cleanedDataPath}`);
    
    // 4. 샘플 출력 (확인용)
    console.log('\n📋 정리 결과 샘플:');
    console.log('='.repeat(50));
    
    const sampleSection = cleanedSections.find(s => s.title.includes('17-2') || s.title.includes('소시지'));
    if (sampleSection) {
      console.log('제목:', sampleSection.title);
      console.log('내용 (처음 200자):');
      console.log(sampleSection.content.substring(0, 200) + '...');
    }
    
    console.log('='.repeat(50));
    console.log('✅ 데이터 정리 완료!');
    console.log('📝 다음 단계: Supabase에 업로드하시려면 upload 스크립트를 실행하세요.');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  processAndUpload();
}

module.exports = { cleanSpacingInText, cleanTitle };