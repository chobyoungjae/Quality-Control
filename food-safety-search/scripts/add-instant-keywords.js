/**
 * 즉석 관련 키워드 직접 추가
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addInstantKeywords() {
  try {
    console.log('🥡 즉석 관련 키워드 추가 중...');
    
    const keywordsToAdd = [
      '즉석조리식품',
      '즉석식품', 
      '즉석라면',
      '즉석밥',
      '즉석국',
      '즉석카레',
      '편의식품',
      '냉동식품',
      '냉동만두',
      '레토르트',
      '간편식'
    ];
    
    let added = 0;
    
    for (const keyword of keywordsToAdd) {
      // 기존 키워드인지 확인
      const { data: existing } = await supabase
        .from('search_keywords')
        .select('keyword')
        .eq('keyword', keyword)
        .maybeSingle();
      
      if (!existing) {
        // 최대 ID 찾기
        const { data: maxData } = await supabase
          .from('search_keywords')
          .select('id')
          .order('id', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        const nextId = (maxData?.id || 0) + 1;
        
        // 새 키워드 삽입
        const { error } = await supabase
          .from('search_keywords')
          .insert([{
            id: nextId,
            keyword: keyword,
            search_count: 0
          }]);
        
        if (error) {
          console.error(`❌ ${keyword} 삽입 오류:`, error.message);
        } else {
          console.log(`✅ ${keyword} 추가 완료`);
          added++;
        }
      } else {
        console.log(`⚠️ ${keyword} 이미 존재`);
      }
      
      // API 제한 고려 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n🎉 총 ${added}개 키워드 추가 완료!`);
    
    // 결과 확인
    const { data: result } = await supabase
      .from('search_keywords')
      .select('keyword')
      .ilike('keyword', '%즉석%')
      .order('keyword', { ascending: true });
    
    console.log('\n📋 "즉석" 관련 키워드들:');
    if (result && result.length > 0) {
      result.forEach(item => console.log('- ' + item.keyword));
    } else {
      console.log('키워드가 없습니다.');
    }
    
    // 편의식품 관련도 확인
    const { data: convenienceResult } = await supabase
      .from('search_keywords')
      .select('keyword')
      .or('keyword.ilike.%편의%,keyword.ilike.%냉동%,keyword.ilike.%간편%')
      .order('keyword', { ascending: true });
    
    if (convenienceResult && convenienceResult.length > 0) {
      console.log('\n📋 편의/냉동/간편 관련 키워드들:');
      convenienceResult.forEach(item => console.log('- ' + item.keyword));
    }
    
  } catch (error) {
    console.error('💥 오류 발생:', error);
  }
}

addInstantKeywords();