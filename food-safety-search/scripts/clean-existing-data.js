// 기존 Supabase 데이터의 텍스트를 깔끔하게 정리하는 스크립트
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 텍스트 정리 함수
 */
function cleanText(text) {
  if (!text) return text;
  
  // 완전히 새로운 접근법: 모든 한글 문자 사이의 공백을 완전 제거
  // 연속된 한글 문자 사이의 모든 공백 패턴을 반복 처리
  let prevText;
  do {
    prevText = text;
    // 한글 문자 사이의 공백 제거 (여러 공백 포함)
    text = text.replace(/([가-힣])\s+([가-힣])/g, '$1$2');
    // 숫자와 한글 사이 공백 (조항 번호 등)
    text = text.replace(/(\d)\s+([가-힣])/g, '$1$2');
    text = text.replace(/([가-힣])\s+(\d)/g, '$1$2');
    // 특수문자와 한글 사이
    text = text.replace(/([):])\s+([가-힣])/g, '$1$2');
    text = text.replace(/([가-힣])\s+([():])/g, '$1$2');
    // 하이픈과 숫자/한글 사이
    text = text.replace(/(\d)\s*-\s*(\d)/g, '$1-$2');
    text = text.replace(/([가-힣])\s*-\s*([가-힣])/g, '$1-$2');
  } while (text !== prevText); // 더 이상 변화가 없을 때까지 반복
  
  // 2단계: 특수 패턴 완전 정리
  // mg / kg → mg/kg, n = 5 → n=5
  text = text.replace(/(\w+)\s*\/\s*(\w+)/g, '$1/$2');
  text = text.replace(/(\w+)\s*=\s*(\w+)/g, '$1=$2');
  text = text.replace(/([가-힣])\s*･\s*([가-힣])/g, '$1･$2'); // 중점 처리
  
  // 3단계: 구조화 - 완전히 새로운 방식
  // 제목 처리 (14-1 김치류 등)
  text = text.replace(/(\d+-\d+)\s*([가-힣]+)/g, '$1 $2');
  
  // 조항 번호 정리 (1) 정의 → \n 1) 정의)
  text = text.replace(/(\d+)\)\s*([가-힣]+)/g, '\n $1) $2');
  
  // 소항목 정리 ((1) → \n   (1))
  text = text.replace(/\((\d+)\)\s*([가-힣]+)/g, '\n   ($1) $2');
  
  // 4단계: 특수 문자 정리
  // ∶ → : 변환
  text = text.replace(/∶/g, ':');
  text = text.replace(/\s*:\s*/g, ': ');
  
  // 5단계: 완벽한 단어 결합
  // 특정 단어들을 강제로 결합
  text = text.replace(/김치\s*류/g, '김치류');
  text = text.replace(/김칫\s*속/g, '김칫속');
  text = text.replace(/채소\s*류/g, '채소류');
  text = text.replace(/원료\s*로/g, '원료로');
  text = text.replace(/하여\s*야/g, '하여야');
  text = text.replace(/되어\s*서는/g, '되어서는');
  text = text.replace(/아니\s*된다/g, '아니된다');
  text = text.replace(/제품\s*에/g, '제품에');
  text = text.replace(/한한\s*다/g, '한한다');
  text = text.replace(/따라\s*시험/g, '따라시험');
  text = text.replace(/시험\s*한다/g, '시험한다');
  text = text.replace(/일반\s*시험법/g, '일반시험법');
  text = text.replace(/시험\s*법/g, '시험법');
  text = text.replace(/미생물\s*시험법/g, '미생물시험법');
  text = text.replace(/대장균\s*군/g, '대장균군');
  text = text.replace(/중금\s*속/g, '중금속');
  text = text.replace(/착색\s*료/g, '착색료');
  text = text.replace(/보존\s*료/g, '보존료');
  
  // 6단계: 괄호와 공백 정리
  text = text.replace(/\(\s+/g, '(');
  text = text.replace(/\s+\)/g, ')');
  
  // 7단계: 최종 구조 정리
  // 연속 공백을 하나로
  text = text.replace(/\s{2,}/g, ' ');
  
  // 줄바꿈 후 불필요한 공백 제거
  text = text.replace(/\n\s+/g, '\n');
  text = text.replace(/\n{3,}/g, '\n\n');
  
  // 8단계: 마지막 손질
  // 문장 끝 정리
  text = text.replace(/\s+\./g, '.');
  text = text.replace(/\.\s*\n/g, '.\n');
  
  return text.trim();
}

/**
 * 메인 함수
 */
async function main() {
  console.log('🧹 기존 데이터 텍스트 정리 시작...');
  
  try {
    // 1. 모든 조항 데이터 가져오기
    const { data: sections, error: fetchError } = await supabase
      .from('food_codex_sections')
      .select('*');
    
    if (fetchError) {
      console.error('❌ 데이터 가져오기 오류:', fetchError);
      return;
    }
    
    console.log(`📊 처리할 조항 수: ${sections.length}개`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // 2. 각 조항의 텍스트 정리 및 업데이트
    for (const section of sections) {
      try {
        const cleanedTitle = cleanText(section.title);
        const cleanedContent = cleanText(section.content);
        
        // 업데이트
        const { error: updateError } = await supabase
          .from('food_codex_sections')
          .update({
            title: cleanedTitle,
            content: cleanedContent,
            character_count: cleanedContent.length
          })
          .eq('id', section.id);
        
        if (updateError) {
          console.error(`❌ 업데이트 오류 (${section.id}):`, updateError);
          errorCount++;
        } else {
          console.log(`✅ 정리 완료: ${cleanedTitle.substring(0, 50)}...`);
          successCount++;
        }
        
        // 속도 조절 (너무 빠르면 서버 부하)
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (err) {
        console.error(`❌ 처리 오류 (${section.id}):`, err);
        errorCount++;
      }
    }
    
    console.log('\n🎉 텍스트 정리 완료!');
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`❌ 실패: ${errorCount}개`);
    console.log('💡 이제 웹사이트에서 깔끔한 텍스트를 확인하세요!');
    
  } catch (error) {
    console.error('❌ 전체 처리 오류:', error);
  }
}

// 실행
main().catch(console.error);