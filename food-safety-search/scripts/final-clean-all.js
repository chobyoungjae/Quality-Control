/**
 * 모든 나머지 섹션 일괄 정리 스크립트 
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 정교한 텍스트 정리 함수
function smartCleanText(text) {
  if (!text) return text;
  
  // Step 1: 기본 글자간 공백 제거
  let cleaned = text.replace(/([가-힣])\s+([가-힣])/g, '$1$2');
  
  // Step 2: 영어-숫자간 공백 제거  
  cleaned = cleaned.replace(/([a-zA-Z])\s+([0-9])/g, '$1$2');
  cleaned = cleaned.replace(/([0-9])\s+([a-zA-Z])/g, '$1$2');
  
  // Step 3: 제목과 1)정의 사이 줄바꿈
  cleaned = cleaned.replace(/^([0-9\-]+\s*[^1)]+)(1\)정의)/m, '$1\n\n 1) 정의');
  
  // Step 4: 주요 항목 번호들 앞 줄바꿈
  cleaned = cleaned.replace(/([^)\n])([2-9]\)[가-힣])/g, '$1\n $2');
  cleaned = cleaned.replace(/([^)\n])(1[0-9]\)[가-힣])/g, '$1\n $2');
  
  // Step 5: 소항목 (1), (2) 등 앞 줄바꿈과 들여쓰기
  cleaned = cleaned.replace(/([^)\n])\(([0-9]+)\)([가-힣])/g, '$1\n   ($2) $3');
  
  // Step 6: 주요 섹션 키워드 앞 줄바꿈 (단, 이미 줄바꿈 있는 경우 제외)
  const sectionKeywords = ['원료등의구비요건', '제조･가공기준', '제조·가공기준', '식품유형', '규격', '시험방법'];
  sectionKeywords.forEach(keyword => {
    const regex = new RegExp(`([^\\n])(${keyword})`, 'g');
    cleaned = cleaned.replace(regex, '$1\n $2');
  });
  
  // Step 7: 숫자와 단위 사이 공백 정리
  cleaned = cleaned.replace(/([0-9]+)\s+(mg|g|kg|%|ppm|℃)/g, '$1$2');
  cleaned = cleaned.replace(/([0-9]+)\.\s*([0-9]+)/g, '$1.$2');
  
  // Step 8: 구두점 정리
  cleaned = cleaned.replace(/\s*:\s*/g, ': ');
  cleaned = cleaned.replace(/\s*,\s*/g, ', ');
  cleaned = cleaned.replace(/\s*\.\s*/g, '. ');
  cleaned = cleaned.replace(/\s*;\s*/g, '; ');
  
  // Step 9: n=, c=, m=, M= 패턴 정리
  cleaned = cleaned.replace(/n\s*=\s*([0-9]+)/g, 'n=$1');
  cleaned = cleaned.replace(/c\s*=\s*([0-9]+)/g, 'c=$1');  
  cleaned = cleaned.replace(/m\s*=\s*([0-9]+)/g, 'm=$1');
  cleaned = cleaned.replace(/M\s*=\s*([0-9,]+)/g, 'M=$1');
  
  // Step 10: 괄호 안 내용 정리
  cleaned = cleaned.replace(/\(\s+([^)]+)\s+\)/g, '($1)');
  
  // Step 11: 연속 줄바꿈 정리
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Step 12: 시작/끝 공백 제거
  cleaned = cleaned.trim();
  
  return cleaned;
}

async function cleanAllRemainingSections() {
  try {
    console.log('🚀 모든 나머지 섹션 일괄 정리 시작...');
    
    // 정리가 필요한 섹션들 조회
    const { data: sectionsToClean, error: fetchError } = await supabase
      .from('food_codex_sections')
      .select('*')
      .eq('file_source', '제1~5_계정.txt')
      .gte('character_count', 200)
      .order('section_number', { ascending: true });
    
    if (fetchError) {
      console.error('❌ 데이터 조회 오류:', fetchError);
      return;
    }
    
    console.log(`📋 정리할 섹션: ${sectionsToClean.length}개`);
    
    // 10개씩 배치 처리
    const batchSize = 10;
    let totalProcessed = 0;
    
    for (let i = 0; i < sectionsToClean.length; i += batchSize) {
      const batch = sectionsToClean.slice(i, i + batchSize);
      const batchNum = Math.floor(i/batchSize) + 1;
      const totalBatches = Math.ceil(sectionsToClean.length/batchSize);
      
      console.log(`\n🔄 배치 ${batchNum}/${totalBatches} 처리 중...`);
      
      // 각 배치의 섹션들을 정리
      for (const section of batch) {
        try {
          const cleanedContent = smartCleanText(section.content);
          
          // 기존 삭제
          await supabase
            .from('food_codex_sections')
            .delete()
            .eq('id', section.id);
          
          // 새로 삽입
          const { error: insertError } = await supabase
            .from('food_codex_sections')
            .insert([{
              ...section,
              content: cleanedContent,
              file_source: 'auto_cleaned_v2',
              character_count: cleanedContent.length
            }]);
          
          if (insertError) {
            console.error(`❌ ${section.id} 삽입 오류:`, insertError);
          } else {
            console.log(`✅ ${section.id}: ${section.title.substring(0, 30)}...`);
            totalProcessed++;
          }
          
        } catch (err) {
          console.error(`❌ ${section.id} 처리 오류:`, err);
        }
      }
      
      console.log(`📈 진행률: ${totalProcessed}/${sectionsToClean.length} (${Math.round(totalProcessed/sectionsToClean.length*100)}%)`);
      
      // API 제한 고려 잠시 대기
      if (i + batchSize < sectionsToClean.length) {
        console.log('⏱️ 잠시 대기 중...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // 완료 확인
    console.log('\n🔍 정리 완료 확인...');
    const { data: result, error: checkError } = await supabase
      .from('food_codex_sections') 
      .select('file_source')
      .in('file_source', ['manual_clean', 'manual_clean_fixed', 'auto_cleaned_v2']);
      
    if (!checkError) {
      const cleanedCount = result.length;
      console.log(`✨ 총 ${cleanedCount}개 섹션이 깔끔하게 정리되었습니다!`);
    }
    
    console.log('\n🎉 모든 섹션 정리 완료!');
    console.log('💫 이제 웹사이트에서 모든 식품공전 데이터가 읽기 쉽게 표시됩니다!');
    
  } catch (error) {
    console.error('💥 오류 발생:', error);
  }
}

cleanAllRemainingSections();