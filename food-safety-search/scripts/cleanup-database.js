/**
 * 🧹 데이터베이스 정리 - 새로운 TXT 추출 방식만 남기고 나머지 삭제
 * 기존 방식들: ultimate_kimchi_quality_upgrade, manual_clean_extraction 등
 * 남길 방식: txt_auto_extraction_perfect
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function cleanupDatabase() {
  try {
    console.log('🧹🧹🧹 데이터베이스 정리 시작! 🧹🧹🧹');
    console.log('✅ 남길 방식: txt_auto_extraction_perfect');
    console.log('❌ 삭제할 방식: 기존 모든 방식\n');
    
    // 1. 현재 데이터베이스 상태 확인
    const { data: allSections, error: fetchError } = await supabase
      .from('food_codex_sections')
      .select('id, title, file_source');
      
    if (fetchError) {
      throw fetchError;
    }
    
    console.log(`📊 전체 섹션: ${allSections.length}개`);
    
    // file_source별 통계
    const sourceStats = {};
    allSections.forEach(section => {
      const source = section.file_source || 'null';
      sourceStats[source] = (sourceStats[source] || 0) + 1;
    });
    
    console.log('📋 file_source별 현황:');
    Object.entries(sourceStats).forEach(([source, count]) => {
      console.log(`  - ${source}: ${count}개`);
    });
    
    // 2. 새로운 방식이 아닌 것들 찾기
    const toDelete = allSections.filter(section => 
      section.file_source !== 'txt_auto_extraction_perfect'
    );
    
    console.log(`\n❌ 삭제할 섹션: ${toDelete.length}개`);
    console.log(`✅ 남길 섹션: ${allSections.length - toDelete.length}개\n`);
    
    if (toDelete.length === 0) {
      console.log('🎉 정리할 데이터가 없습니다! 모든 데이터가 이미 새 방식입니다.');
      return;
    }
    
    // 3. 기존 방식 데이터들 삭제
    console.log('🗑️ 기존 방식 데이터 삭제 중...\n');
    
    let deleteCount = 0;
    let errorCount = 0;
    
    for (const section of toDelete) {
      try {
        console.log(`🗑️ ${section.id} (${section.file_source}) 삭제 중...`);
        
        const { error: deleteError } = await supabase
          .from('food_codex_sections')
          .delete()
          .eq('id', section.id);
          
        if (deleteError) {
          console.error(`❌ ${section.id} 삭제 실패:`, deleteError.message);
          errorCount++;
        } else {
          console.log(`✅ ${section.id} 삭제 완료`);
          deleteCount++;
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (err) {
        console.error(`💥 ${section.id} 삭제 오류:`, err.message);
        errorCount++;
      }
    }
    
    console.log('\n🎉🎉🎉 데이터베이스 정리 완료! 🎉🎉🎉');
    console.log(`🗑️ 삭제됨: ${deleteCount}개`);
    console.log(`❌ 실패: ${errorCount}개`);
    console.log(`✅ 남은 깔끔한 섹션: ${allSections.length - deleteCount}개`);
    
    if (errorCount === 0) {
      console.log('\n💎 완벽! 이제 데이터베이스에는 txt_auto_extraction_perfect만 남았습니다!');
      console.log('🚀 모든 섹션이 원본 한글 파일 기반의 깔끔한 텍스트입니다!');
    }
    
  } catch (error) {
    console.error('💥 데이터베이스 정리 오류:', error);
  }
}

// 🚀 실행!
cleanupDatabase().catch(console.error);