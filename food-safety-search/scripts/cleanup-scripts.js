/**
 * 🧹 스크립트 파일 정리
 * 새로운 TXT 방식 관련 스크립트만 남기고 나머지 삭제
 */

const fs = require('fs');
const path = require('path');

const scriptsDir = __dirname;

// 유지할 스크립트 목록
const KEEP_SCRIPTS = [
  'txt-to-database-auto.js',    // ✅ 새로운 TXT 자동 처리 (메인)
  'cleanup-database.js',        // ✅ 데이터베이스 정리 
  'cleanup-scripts.js',         // ✅ 이 파일 자체
  'generate-search-keywords.js', // ✅ 검색 키워드 생성 (유용함)
  'check-supabase-data.js'      // ✅ 데이터 확인용
];

// 삭제할 스크립트들 (나머지 모든 것)
const DELETE_SCRIPTS = [
  'PERMANENT-FORMAT-SYSTEM.js',
  'ULTIMATE-ALL-SECTIONS-UPGRADE.js',
  'add-instant-keywords.js',
  'apply-kimchi-success-to-all.js',
  'apply-perfect-clean.js',
  'auto-clean-all-data.js',
  'batch-10-manual-extraction.js',
  'claude-perfect-formatting.js',
  'clean-drinks-sections.js',
  'clean-existing-data.js',
  'clean-kimchi-only.js',
  'clean-seasoning-sections.js',
  'complete-10-sections.js',
  'create-clean-data.js',
  'final-clean-all.js',
  'final-perfect-fix.js',
  'finish-remaining-kimchi-style.js',
  'finish-remaining.js',
  'fix-all-database-now.js',
  'fix-kimchi-correct.js',
  'fix-kimchi-data.js',
  'fix-kimchi-final-correct.js',
  'fix-spacing-and-reupload.js',
  'fix-to-correct-format.js',
  'future-ready-format.js',
  'manual-clean-extraction.js',
  'mega-clean-data.js',
  'pdf-to-database.js',
  'perfect-clean-data.js',
  'perfect-format-all-final.js',
  'process-new-structure.py',
  'smart-format-system.js',
  'test-10-sections.js',
  'test-clean.js',
  'test-unified-dropdown.js',
  'ultra-clean-data.js',
  'upload-all-kimchi-style.js',
  'upload-new-structure.js',
  'upload-sausage-kimchi-style.js',
  'upload-to-supabase.js'
];

async function cleanupScripts() {
  try {
    console.log('🧹🧹🧹 스크립트 파일 정리 시작! 🧹🧹🧹');
    console.log(`📂 스크립트 폴더: ${scriptsDir}\n`);
    
    console.log('✅ 유지할 스크립트:');
    KEEP_SCRIPTS.forEach(script => {
      console.log(`  - ${script}`);
    });
    
    console.log(`\n❌ 삭제할 스크립트: ${DELETE_SCRIPTS.length}개`);
    
    let deleteCount = 0;
    let errorCount = 0;
    let skipCount = 0;
    
    for (const scriptFile of DELETE_SCRIPTS) {
      const filePath = path.join(scriptsDir, scriptFile);
      
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`🗑️ ${scriptFile} 삭제 완료`);
          deleteCount++;
        } else {
          console.log(`⏭️ ${scriptFile} 파일 없음 (건너뜀)`);
          skipCount++;
        }
      } catch (error) {
        console.error(`❌ ${scriptFile} 삭제 실패:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n🎉🎉🎉 스크립트 정리 완료! 🎉🎉🎉');
    console.log(`🗑️ 삭제됨: ${deleteCount}개`);
    console.log(`⏭️ 건너뜀: ${skipCount}개`);
    console.log(`❌ 실패: ${errorCount}개`);
    console.log(`✅ 남은 스크립트: ${KEEP_SCRIPTS.length}개`);
    
    if (errorCount === 0) {
      console.log('\n💎 완벽! 이제 scripts 폴더가 깔끔하게 정리되었습니다!');
      console.log('🚀 새로운 TXT 자동 처리 방식 관련 스크립트만 남았습니다!');
    }
    
  } catch (error) {
    console.error('💥 스크립트 정리 오류:', error);
  }
}

// 🚀 실행!
cleanupScripts().catch(console.error);