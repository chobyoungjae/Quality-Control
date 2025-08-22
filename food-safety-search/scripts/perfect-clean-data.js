// 완벽한 한글 텍스트 정리 - 조항번호까지 완전 정리
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
 * 완벽한 정리 - 조항번호 공백까지 완전 제거
 */
function perfectCleanText(text) {
  if (!text) return text;
  
  console.log(`\n원본: ${text.substring(0, 100)}`);
  
  let cleaned = text;
  
  // 1단계: 모든 유니코드 공백을 일반 공백으로 통일
  cleaned = cleaned.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\s]/g, ' ');
  
  // 2단계: 조항 번호의 공백 완전 제거 (1 4 - 1 → 14-1)
  cleaned = cleaned.replace(/(\d+)\s+(\d+)\s*-\s*(\d+)/g, '$1$2-$3');
  
  // 3단계: 한글과 모든 문자 사이의 공백을 반복적으로 제거
  let maxIterations = 200;
  let prevText = '';
  
  for (let i = 0; i < maxIterations && cleaned !== prevText; i++) {
    prevText = cleaned;
    
    // 모든 한글 문자 사이의 공백 제거
    cleaned = cleaned.replace(/([가-힣])\s+([가-힣])/g, '$1$2');
    // 숫자와 한글 사이
    cleaned = cleaned.replace(/(\d)\s+([가-힣])/g, '$1$2');
    cleaned = cleaned.replace(/([가-힣])\s+(\d)/g, '$1$2');
    // 영문과 한글 사이
    cleaned = cleaned.replace(/([a-zA-Z])\s+([가-힣])/g, '$1$2');
    cleaned = cleaned.replace(/([가-힣])\s+([a-zA-Z])/g, '$1$2');
    // 특수문자와 한글 사이
    cleaned = cleaned.replace(/([-(){}[\]:;.,!?])\s+([가-힣])/g, '$1$2');
    cleaned = cleaned.replace(/([가-힣])\s+([-(){}[\]:;.,!?])/g, '$1$2');
    // 하이픈과 숫자 사이
    cleaned = cleaned.replace(/(\d)\s*-\s*(\d)/g, '$1-$2');
  }
  
  // 4단계: 조항 번호 뒤에만 공백 추가 (14-1김치류 → 14-1 김치류)
  cleaned = cleaned.replace(/(\d+-\d+)([가-힣])/g, '$1 $2');
  
  // 5단계: 기본 정리
  cleaned = cleaned.replace(/\s{2,}/g, ' ');  // 연속 공백을 하나로
  cleaned = cleaned.replace(/\(\s+/g, '(');    // 괄호 정리
  cleaned = cleaned.replace(/\s+\)/g, ')');
  cleaned = cleaned.trim();
  
  console.log(`결과: ${cleaned.substring(0, 100)}`);
  
  return cleaned;
}

async function main() {
  console.log('💎 완벽한 텍스트 정리 시작...');
  
  try {
    // 김치류 조항만 테스트
    const { data: sections, error: fetchError } = await supabase
      .from('food_codex_sections')
      .select('*')
      .ilike('title', '%김치%')
      .limit(1);
    
    if (fetchError || !sections || sections.length === 0) {
      console.error('김치 조항을 찾을 수 없습니다.');
      return;
    }
    
    const section = sections[0];
    console.log(`📋 테스트: ${section.title}`);
    
    const cleanedTitle = perfectCleanText(section.title);
    const cleanedContent = perfectCleanText(section.content);
    
    console.log(`\n📝 정리된 제목: ${cleanedTitle}`);
    console.log(`📝 정리된 내용 앞부분: ${cleanedContent.substring(0, 300)}`);
    
    // 실제 업데이트
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
      console.log(`\n✅ 완벽하게 업데이트 완료!`);
    }
    
  } catch (error) {
    console.error('❌ 전체 처리 오류:', error);
  }
}

main().catch(console.error);