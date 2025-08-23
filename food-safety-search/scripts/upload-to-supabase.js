/**
 * 깔끔한 식품공전 데이터를 Supabase에 업로드하는 스크립트
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

// Supabase 클라이언트 설정
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ 설정됨' : '❌ 없음');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅ 설정됨' : '❌ 없음');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 메인 업로드 함수
 */
async function uploadToSupabase() {
  try {
    console.log('🚀 Supabase 업로드 시작...');
    
    // 1. 새로운 데이터 읽기
    const dataPath = path.join(__dirname, '../data/processed/food_codex_sections_clean.json');
    
    if (!fs.existsSync(dataPath)) {
      throw new Error('깔끔한 데이터 파일을 찾을 수 없습니다: ' + dataPath);
    }
    
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const { sections } = JSON.parse(rawData);
    
    console.log(`📊 업로드할 데이터: ${sections.length}개 섹션`);
    
    // 2. 기존 데이터 삭제 (특정 섹션만)
    const sectionIds = sections.map(s => s.id);
    console.log('🗑️ 기존 데이터 삭제 중...', sectionIds);
    
    const { error: deleteError } = await supabase
      .from('food_codex_sections')
      .delete()
      .in('id', sectionIds);
      
    if (deleteError) {
      console.error('❌ 삭제 중 오류:', deleteError);
      // 삭제 오류는 경고로만 처리 (기존 데이터가 없을 수 있음)
      console.log('⚠️ 삭제 오류 무시하고 계속 진행...');
    } else {
      console.log('✅ 기존 데이터 삭제 완료');
    }
    
    // 3. 새로운 데이터 삽입
    console.log('📤 새로운 데이터 삽입 중...');
    
    // 배치로 나누어서 삽입
    const batchSize = 10;
    let uploadedCount = 0;
    
    for (let i = 0; i < sections.length; i += batchSize) {
      const batch = sections.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('food_codex_sections')
        .insert(batch)
        .select();
        
      if (error) {
        console.error('❌ 배치 삽입 오류:', error);
        console.error('오류 발생 배치:', batch.map(item => ({ id: item.id, title: item.title })));
        throw error;
      }
      
      uploadedCount += batch.length;
      console.log(`📈 진행률: ${uploadedCount}/${sections.length} (${Math.round(uploadedCount / sections.length * 100)}%)`);
    }
    
    // 4. 업로드 확인
    console.log('🔍 업로드 확인 중...');
    
    const { data: verificationData, error: verificationError } = await supabase
      .from('food_codex_sections')
      .select('id, title, section_number')
      .in('id', sectionIds)
      .order('section_number', { ascending: true });
    
    if (verificationError) {
      console.error('❌ 확인 중 오류:', verificationError);
      throw verificationError;
    }
    
    console.log('\n📋 업로드 완료된 데이터:');
    console.log('='.repeat(60));
    verificationData?.forEach(item => {
      console.log(`✅ ${item.section_number}: ${item.title}`);
    });
    console.log('='.repeat(60));
    
    // 5. 테스트 검색
    console.log('\n🧪 테스트 검색 실행...');
    
    const { data: testData, error: testError } = await supabase
      .from('food_codex_sections')
      .select('id, title, content')
      .ilike('title', '%소시지%')
      .limit(3);
    
    if (testError) {
      console.error('❌ 테스트 검색 오류:', testError);
    } else if (testData && testData.length > 0) {
      console.log('🎉 테스트 검색 성공!');
      console.log(`검색 결과: "${testData[0].title}"`);
      console.log(`내용 미리보기: ${testData[0].content.substring(0, 100)}...`);
    } else {
      console.log('⚠️ 테스트 검색 결과 없음');
    }
    
    console.log('\n✅ Supabase 업로드 완전히 완료!');
    console.log('🌐 이제 웹사이트에서 검색해보세요.');
    
  } catch (error) {
    console.error('💥 업로드 중 오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  uploadToSupabase();
}