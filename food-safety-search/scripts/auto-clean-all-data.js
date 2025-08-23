/**
 * 모든 식품공전 섹션 데이터 자동 정리 스크립트
 * 기존 김치류, 햄류, 소시지류처럼 모든 섹션을 깔끔하게 정리
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 텍스트 자동 정리 함수
 */
function autoCleanText(text, title) {
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

/**
 * 메인 실행 함수
 */
async function cleanAllSections() {
  try {
    console.log('🧹 모든 식품공전 섹션 자동 정리 시작...');
    
    // 정리가 필요한 섹션들 조회
    const { data: sectionsToClean, error: fetchError } = await supabase
      .from('food_codex_sections')
      .select('*')
      .eq('file_source', '제1~5_계정.txt')
      .gte('character_count', 200)  // 200자 이상인 것만
      .order('section_number', { ascending: true });
    
    if (fetchError) {
      console.error('❌ 데이터 조회 오류:', fetchError);
      return;
    }
    
    console.log(`📋 정리할 섹션 수: ${sectionsToClean.length}개`);
    
    // 배치 처리
    const batchSize = 5;
    let processedCount = 0;
    
    for (let i = 0; i < sectionsToClean.length; i += batchSize) {
      const batch = sectionsToClean.slice(i, i + batchSize);
      
      console.log(`\n🔄 배치 ${Math.floor(i/batchSize) + 1}/${Math.ceil(sectionsToClean.length/batchSize)} 처리 중...`);
      
      // 각 섹션 정리
      const cleanedBatch = batch.map(section => {
        const cleanedContent = autoCleanText(section.content, section.title);
        
        return {
          ...section,
          content: cleanedContent,
          file_source: 'auto_cleaned',
          character_count: cleanedContent.length
        };
      });
      
      // 기존 데이터 삭제
      const idsToDelete = batch.map(s => s.id);
      const { error: deleteError } = await supabase
        .from('food_codex_sections')
        .delete()
        .in('id', idsToDelete);
      
      if (deleteError) {
        console.error(`❌ 배치 삭제 오류:`, deleteError);
        continue;
      }
      
      // 새 데이터 삽입
      const { error: insertError } = await supabase
        .from('food_codex_sections')
        .insert(cleanedBatch);
      
      if (insertError) {
        console.error(`❌ 배치 삽입 오류:`, insertError);
        continue;
      }
      
      processedCount += batch.length;
      
      // 진행 상황 출력
      batch.forEach(section => {
        console.log(`✅ ${section.id}: ${section.title.substring(0, 30)}... 정리 완료`);
      });
      
      console.log(`📈 진행률: ${processedCount}/${sectionsToClean.length} (${Math.round(processedCount/sectionsToClean.length*100)}%)`);
      
      // API 요청 제한을 위한 잠시 대기
      if (i + batchSize < sectionsToClean.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // 완료 확인
    console.log('\n🔍 정리 결과 확인...');
    
    const { data: verifyData, error: verifyError } = await supabase
      .from('food_codex_sections')
      .select('id, title, file_source')
      .eq('file_source', 'auto_cleaned')
      .limit(10);
    
    if (!verifyError && verifyData) {
      console.log('\n📋 정리 완료된 샘플:');
      verifyData.forEach(item => {
        console.log(`✨ ${item.id}: ${item.title}`);
      });
    }
    
    console.log('\n🎉 모든 섹션 정리 완료!');
    console.log('💡 이제 웹사이트에서 모든 섹션이 깔끔하게 표시될 것입니다.');
    
  } catch (error) {
    console.error('💥 오류 발생:', error);
  }
}

// 스크립트 실행
if (require.main === module) {
  cleanAllSections();
}