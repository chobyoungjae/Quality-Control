// 초강력 한글 텍스트 정리 스크립트
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
 * 초강력 텍스트 정리 함수 - 한글 문자 사이의 모든 공백 제거
 */
function ultraCleanText(text) {
  if (!text) return text;
  
  console.log(`원본 텍스트 샘플: ${text.substring(0, 100)}`);
  
  // 1. 한글 문자 사이의 모든 공백을 완전히 제거 (반복 실행)
  let cleaned = text;
  let iterations = 0;
  let prevText;
  
  do {
    prevText = cleaned;
    
    // 한글-한글 사이 공백 제거
    cleaned = cleaned.replace(/([가-힣])\s+([가-힣])/g, '$1$2');
    // 숫자-한글 사이 공백 제거  
    cleaned = cleaned.replace(/(\d)\s+([가-힣])/g, '$1$2');
    // 한글-숫자 사이 공백 제거
    cleaned = cleaned.replace(/([가-힣])\s+(\d)/g, '$1$2');
    // 특수문자-한글 사이 공백 제거
    cleaned = cleaned.replace(/([):\-])\s+([가-힣])/g, '$1$2');
    cleaned = cleaned.replace(/([가-힣])\s+([):\-])/g, '$1$2');
    
    iterations++;
  } while (cleaned !== prevText && iterations < 50); // 최대 50번 반복
  
  // 2. 조항 번호만 공백 유지 (14-1 김치류)
  cleaned = cleaned.replace(/(\d+-\d+)([가-힣])/g, '$1 $2');
  
  // 3. 기본 정리
  cleaned = cleaned.replace(/\s{2,}/g, ' '); // 연속 공백을 하나로
  cleaned = cleaned.replace(/\(\s+/g, '('); // 괄호 정리
  cleaned = cleaned.replace(/\s+\)/g, ')');
  cleaned = cleaned.trim();
  
  console.log(`정리된 텍스트 샘플: ${cleaned.substring(0, 100)}`);
  console.log(`반복 횟수: ${iterations}번`);
  
  return cleaned;
}

async function main() {
  console.log('🚀 초강력 텍스트 정리 시작...');
  
  try {
    // 모든 조항 데이터 가져오기
    const { data: sections, error: fetchError } = await supabase
      .from('food_codex_sections')
      .select('*')
      .limit(5); // 먼저 5개만 테스트
    
    if (fetchError) {
      console.error('❌ 데이터 가져오기 오류:', fetchError);
      return;
    }
    
    console.log(`📊 테스트할 조항 수: ${sections.length}개`);
    
    for (const section of sections) {
      console.log(`\n처리 중: ${section.title}`);
      
      const cleanedTitle = ultraCleanText(section.title);
      const cleanedContent = ultraCleanText(section.content);
      
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
        console.error(`❌ 업데이트 오류:`, updateError);
      } else {
        console.log(`✅ 완료: ${cleanedTitle}`);
      }
      
      // 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n🎉 테스트 완료! 결과를 확인해보세요.');
    
  } catch (error) {
    console.error('❌ 전체 처리 오류:', error);
  }
}

main().catch(console.error);