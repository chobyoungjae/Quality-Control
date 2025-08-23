/**
 * 텍스트 정리 테스트
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function autoCleanText(text) {
  if (!text) return text;
  
  // 기본 정리 - 글자간 공백 제거
  let cleaned = text.replace(/([가-힣])\s+([가-힣])/g, '$1$2');
  
  // 구조 정리
  cleaned = cleaned
    // 제목과 정의 사이 줄바꿈
    .replace(/^([0-9\-]+\s*[^1]+?)(1\)\s*정의)/m, '$1\n\n 1) 정의')
    
    // 주 항목 번호 (1), 2), 3) 등 앞에 줄바꿈
    .replace(/([^\n])([0-9]+\)\s*[가-힣])/g, '$1\n $2')
    
    // 소 항목 (1), (2) 등 앞에 줄바꿈과 들여쓰기  
    .replace(/([^\n])\(([0-9]+)\)\s*([가-힣])/g, '$1\n   ($2) $3')
    
    // 숫자와 단위 사이 공백 제거
    .replace(/([0-9]+)\s+(mg|g|kg|%)/g, '$1$2')
    
    // 기호 앞뒤 공백 정리
    .replace(/\s*:\s*/g, ': ')
    .replace(/\s*,\s*/g, ', ')
    
    // 여러 줄바꿈 정리
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  
  return cleaned;
}

async function testClean() {
  try {
    const { data, error } = await supabase
      .from('food_codex_sections')
      .select('*')
      .eq('id', 'section-9_1')
      .single();
      
    if (error) {
      console.error('오류:', error);
      return;
    }
    
    const cleaned = autoCleanText(data.content);
    
    console.log('=== 원본 (첫 300자) ===');
    console.log(data.content.substring(0, 300));
    console.log('\n=== 정리 후 (첫 500자) ===');  
    console.log(cleaned.substring(0, 500));
    
    console.log('\n=== 글자 수 비교 ===');
    console.log('원본:', data.content.length + '자');
    console.log('정리 후:', cleaned.length + '자');
    
  } catch (error) {
    console.error('💥 오류:', error);
  }
}

testClean();