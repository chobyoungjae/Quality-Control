/**
 * 현재 Supabase 데이터 상태 확인 스크립트
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  try {
    console.log('🔍 현재 Supabase 데이터 확인 중...');
    
    // 전체 데이터 개수 확인
    const { count, error: countError } = await supabase
      .from('food_codex_sections')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('❌ 개수 확인 오류:', countError);
      return;
    }
    
    console.log(`📊 총 데이터 개수: ${count}개`);
    
    // 모든 데이터 제목 확인
    const { data, error } = await supabase
      .from('food_codex_sections')
      .select('id, title, section_number, file_source, character_count')
      .order('section_number', { ascending: true });
      
    if (error) {
      console.error('❌ 데이터 조회 오류:', error);
      return;
    }
    
    console.log('\n📋 현재 저장된 모든 데이터:');
    console.log('='.repeat(80));
    console.log('ID'.padEnd(20) + 'TITLE'.padEnd(40) + 'SOURCE'.padEnd(15) + 'LENGTH');
    console.log('-'.repeat(80));
    
    data?.forEach(item => {
      console.log(
        (item.id || 'N/A').padEnd(20) + 
        (item.title || 'N/A').substring(0, 38).padEnd(40) + 
        (item.file_source || 'N/A').padEnd(15) + 
        (item.character_count || 0)
      );
    });
    
    console.log('='.repeat(80));
    
    // 17번대 섹션 상세 확인
    const { data: section17Data, error: section17Error } = await supabase
      .from('food_codex_sections')
      .select('id, title, content')
      .like('section_number', '17%')
      .order('section_number', { ascending: true });
      
    if (!section17Error && section17Data && section17Data.length > 0) {
      console.log('\n🔍 17번대 섹션 상세 (처음 200자):');
      console.log('='.repeat(60));
      
      section17Data.forEach(item => {
        console.log(`📄 ${item.title}`);
        console.log(item.content.substring(0, 200) + '...\n');
      });
    }
    
    // 샘플 검색 테스트
    console.log('🧪 검색 테스트:');
    const searchTests = ['김치', '라면', '소시지', '햄'];
    
    for (const term of searchTests) {
      const { data: searchData, error: searchError } = await supabase
        .from('food_codex_sections')
        .select('id, title')
        .or(`title.ilike.%${term}%,content.ilike.%${term}%`)
        .limit(3);
        
      if (!searchError) {
        console.log(`  "${term}": ${searchData?.length || 0}개 결과`);
      }
    }
    
  } catch (error) {
    console.error('💥 오류 발생:', error);
  }
}

checkData();