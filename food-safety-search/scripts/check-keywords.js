/**
 * 검색 키워드 테이블 확인 스크립트
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkKeywords() {
  try {
    // 즉석 관련 키워드 확인
    const { data, error } = await supabase
      .from('search_keywords')
      .select('*')
      .ilike('keyword', '%즉석%')
      .order('search_count', { ascending: false });
      
    if (error) {
      console.error('오류:', error);
      return;
    }
    
    console.log('"즉석" 관련 키워드들:');
    if (data && data.length > 0) {
      data.forEach(item => {
        console.log('- ' + item.keyword + ' (검색 횟수: ' + (item.search_count || 0) + ')');
      });
    } else {
      console.log('"즉석" 관련 키워드가 없습니다.');
    }
    
    // 전체 키워드 개수 확인
    const { count, error: countError } = await supabase
      .from('search_keywords')
      .select('*', { count: 'exact', head: true });
      
    if (!countError) {
      console.log('\n총 키워드 개수:', count + '개');
    }
    
    // 상위 10개 키워드 확인
    const { data: topKeywords, error: topError } = await supabase
      .from('search_keywords')
      .select('keyword, search_count')
      .order('search_count', { ascending: false })
      .limit(10);
      
    if (!topError && topKeywords) {
      console.log('\n상위 10개 키워드:');
      topKeywords.forEach((item, index) => {
        console.log((index + 1) + '. ' + item.keyword + ' (' + (item.search_count || 0) + '회)');
      });
    }
    
  } catch (error) {
    console.error('💥 오류:', error);
  }
}

checkKeywords();