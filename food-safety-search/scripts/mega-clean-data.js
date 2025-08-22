// 메가 강력 한글 텍스트 정리 - 완전히 새로운 방식
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
 * 메가 클린 - 한글 텍스트의 모든 공백 패턴을 완전 제거
 */
function megaCleanText(text) {
  if (!text) return text;
  
  console.log(`\n원본: ${text.substring(0, 150)}`);
  
  // 1단계: 모든 종류의 공백 문자를 일반 공백으로 통일
  let cleaned = text.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ');
  
  // 2단계: 한글과 한글 사이의 공백을 모두 제거 (반복적으로)
  let maxIterations = 100;
  for (let i = 0; i < maxIterations; i++) {
    let before = cleaned;
    
    // 한글 문자 사이의 모든 공백 제거
    cleaned = cleaned.replace(/([가-힣]+)\s+([가-힣]+)/g, '$1$2');
    // 숫자와 한글 사이
    cleaned = cleaned.replace(/(\d+)\s+([가-힣]+)/g, '$1$2');
    cleaned = cleaned.replace(/([가-힣]+)\s+(\d+)/g, '$1$2');
    // 특수문자와 한글
    cleaned = cleaned.replace(/([)}\]:;-]+)\s+([가-힣]+)/g, '$1$2');
    cleaned = cleaned.replace(/([가-힣]+)\s+([({[:;-]+)/g, '$1$2');
    
    if (before === cleaned) break; // 더 이상 변화가 없으면 중단
  }
  
  // 3단계: 조항 번호에만 공백 추가 (예: 14-1김치류 → 14-1 김치류)
  cleaned = cleaned.replace(/(\d+-\d+)([가-힣]+)/g, '$1 $2');
  
  // 4단계: 기본 정리
  cleaned = cleaned.replace(/\s{2,}/g, ' '); // 연속 공백을 하나로
  cleaned = cleaned.replace(/\(\s+/g, '(');   // ( 다음 공백 제거
  cleaned = cleaned.replace(/\s+\)/g, ')');   // ) 앞 공백 제거
  cleaned = cleaned.trim();
  
  console.log(`결과: ${cleaned.substring(0, 150)}`);
  
  return cleaned;
}

async function main() {
  console.log('🔥 메가 강력 텍스트 정리 시작...');
  
  try {
    // 김치류 조항 하나만 먼저 테스트
    const { data: sections, error: fetchError } = await supabase
      .from('food_codex_sections')
      .select('*')
      .ilike('title', '%김치%')
      .limit(1);
    
    if (fetchError) {
      console.error('❌ 데이터 가져오기 오류:', fetchError);
      return;
    }
    
    if (!sections || sections.length === 0) {
      console.log('김치 관련 조항을 찾을 수 없습니다.');
      return;
    }
    
    const section = sections[0];
    console.log(`\n📋 테스트 조항: ${section.title}`);
    
    const cleanedTitle = megaCleanText(section.title);
    const cleanedContent = megaCleanText(section.content);
    
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
      console.log(`\n✅ 업데이트 완료!`);
      console.log(`제목: ${cleanedTitle}`);
      console.log(`내용 샘플: ${cleanedContent.substring(0, 200)}...`);
    }
    
  } catch (error) {
    console.error('❌ 전체 처리 오류:', error);
  }
}

main().catch(console.error);