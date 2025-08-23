/**
 * 키워드 테이블 수정 및 유용한 키워드 추가
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 자주 검색될 만한 실용적인 키워드들
const practicalKeywords = [
  // 기본 식품 유형
  '라면', '우유', '김치', '소시지', '햄', '치즈', '두부', '빵', '과자',
  '음료', '커피', '차', '주스', '요구르트', '아이스크림', '초콜릿',
  '설탕', '소금', '식초', '소스', '기름', '버터', '계란', 
  
  // 조리 형태별
  '즉석조리식품', '즉석식품', '냉동식품', '건조식품', '발효식품', 
  '가공식품', '조리식품', '편의식품', '즉석라면', '냉동만두',
  
  // 카테고리별
  '육류', '어류', '채소류', '과일류', '곡류', '유제품', '음료류',
  '조미료', '향신료', '건조식품', '냉동식품', '통조림', '젓갈',
  
  // 구체적인 식품명
  '식빵', '케이크', '쿠키', '비스킷', '라면', '국수', '파스타',
  '된장', '고추장', '간장', '마요네즈', '케첩', '참기름',
  '올리브오일', '현미', '보리', '콩', '견과류', '건포도',
  
  // 음료류
  '탄산음료', '이온음료', '과채음료', '두유', '식물성음료',
  '에너지음료', '홍차', '녹차', '허브차',
  
  // 가공 형태
  '분말', '액상', '고형', '젤리', '시럽', '농축',
  
  // 특수 용도
  '이유식', '영아용', '어린이용', '고령자용', '임산부용',
  '다이어트식품', '체중조절식품', '영양보충식품'
];

async function fixKeywords() {
  try {
    console.log('🔧 키워드 테이블 수정 중...');
    
    // 1. 기존 테이블 내용 확인
    const { data: existingKeywords, error: checkError } = await supabase
      .from('search_keywords')
      .select('keyword')
      .limit(200);
    
    if (checkError) {
      console.error('기존 데이터 확인 오류:', checkError);
      return;
    }
    
    const existingKeywordSet = new Set(existingKeywords.map(item => item.keyword));
    console.log(`기존 키워드: ${existingKeywords.length}개`);
    
    // 2. 새로 추가할 키워드 필터링
    const newKeywords = practicalKeywords.filter(keyword => !existingKeywordSet.has(keyword));
    
    console.log(`추가할 새 키워드: ${newKeywords.length}개`);
    
    if (newKeywords.length === 0) {
      console.log('추가할 키워드가 없습니다.');
      return;
    }
    
    // 3. 새 키워드 데이터 준비 (ID 필드 제외)
    const keywordData = newKeywords.map(keyword => ({
      keyword: keyword,
      search_count: 0
    }));
    
    // 4. 배치로 삽입
    const batchSize = 20;
    let inserted = 0;
    
    for (let i = 0; i < keywordData.length; i += batchSize) {
      const batch = keywordData.slice(i, i + batchSize);
      
      const { error: insertError } = await supabase
        .from('search_keywords')
        .insert(batch);
      
      if (insertError) {
        console.error(`배치 ${Math.floor(i/batchSize) + 1} 삽입 오류:`, insertError);
      } else {
        inserted += batch.length;
        console.log(`✅ 배치 ${Math.floor(i/batchSize) + 1}: ${batch.length}개 키워드 추가`);
      }
    }
    
    console.log(`\n🎉 총 ${inserted}개 새 키워드 추가 완료!`);
    
    // 5. 즉석 관련 키워드 확인
    const { data: instantKeywords } = await supabase
      .from('search_keywords')
      .select('keyword')
      .ilike('keyword', '%즉석%')
      .order('keyword', { ascending: true });
    
    if (instantKeywords && instantKeywords.length > 0) {
      console.log('\n📋 "즉석" 관련 키워드:');
      instantKeywords.forEach(item => {
        console.log('- ' + item.keyword);
      });
    }
    
    // 6. 전체 키워드 수 확인
    const { count } = await supabase
      .from('search_keywords')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\n📊 현재 총 키워드: ${count}개`);
    
  } catch (error) {
    console.error('💥 오류 발생:', error);
  }
}

fixKeywords();