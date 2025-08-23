/**
 * 검색 키워드 자동 생성 스크립트
 * 식품공전 섹션에서 실용적인 검색 키워드를 추출하고 생성
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
  '가공식품', '조리식품', '편의식품',
  
  // 카테고리별
  '육류', '어류', '채소류', '과일류', '곡류', '유제품', '음료류',
  '조미료', '향신료', '건조식품', '냉동식품', '통조림',
  
  // 영양성분 관련
  '단백질', '탄수화물', '지방', '나트륨', '당분', '칼슘', '비타민',
  '식이섬유', '포화지방', '트랜스지방', '콜레스테롤',
  
  // 첨가물 관련
  '보존료', '착색료', '감미료', '방부제', '산화방지제', '유화제',
  
  // 안전 관련
  '대장균', '살모넬라', '세균수', '중금속', '납', '카드뮴', '수은',
  '농약', '잔류농약', '항생제', '호르몬',
  
  // 특수 용도식품
  '이유식', '영아용', '어린이', '고령자용', '임산부용', '환자용',
  '다이어트', '체중조절', '영양조제식품', '건강기능식품'
];

async function generateKeywords() {
  try {
    console.log('🎯 실용적인 검색 키워드 생성 중...');
    
    // 1. 기존 키워드 테이블 비우기
    const { error: deleteError } = await supabase
      .from('search_keywords')
      .delete()
      .neq('id', 'dummy'); // 모든 행 삭제
    
    if (deleteError) {
      console.error('기존 키워드 삭제 오류:', deleteError);
    } else {
      console.log('✅ 기존 키워드 정리 완료');
    }
    
    // 2. 식품공전 섹션에서 키워드 추출
    const { data: sections, error: sectionsError } = await supabase
      .from('food_codex_sections')
      .select('title, content')
      .limit(50);
    
    if (sectionsError) {
      console.error('섹션 조회 오류:', sectionsError);
      return;
    }
    
    // 3. 섹션에서 유용한 키워드들 추출
    const extractedKeywords = new Set();
    
    sections.forEach(section => {
      const title = section.title || '';
      const content = section.content || '';
      
      // 제목에서 키워드 추출
      const titleMatch = title.match(/[0-9\-]+\s*(.+)/);
      if (titleMatch) {
        const foodType = titleMatch[1].replace(/\([^)]*\)/g, '').trim();
        if (foodType && foodType.length > 1 && foodType.length < 15) {
          extractedKeywords.add(foodType);
        }
      }
      
      // 내용에서 주요 식품명 추출
      const foodPatterns = [
        /([가-힣]{2,8}류)/g,
        /([가-힣]{2,6}가공품)/g,
        /([가-힣]{2,8}제품)/g
      ];
      
      foodPatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach(match => {
            if (match.length > 1 && match.length < 15) {
              extractedKeywords.add(match);
            }
          });
        }
      });
    });
    
    // 4. 모든 키워드 합치기
    const allKeywords = [...practicalKeywords, ...Array.from(extractedKeywords)];
    
    // 5. 중복 제거 및 정리
    const uniqueKeywords = [...new Set(allKeywords)]
      .filter(keyword => keyword && keyword.length > 1 && keyword.length < 20)
      .map(keyword => keyword.trim())
      .sort();
    
    console.log(`📝 생성될 키워드: ${uniqueKeywords.length}개`);
    
    // 6. 키워드 데이터 생성
    const keywordData = uniqueKeywords.map(keyword => ({
      keyword: keyword,
      search_count: 0,
      category: getKeywordCategory(keyword),
      created_at: new Date().toISOString()
    }));
    
    // 7. 배치로 삽입
    const batchSize = 50;
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
        console.log(`✅ 배치 ${Math.floor(i/batchSize) + 1}: ${batch.length}개 키워드 삽입`);
      }
    }
    
    console.log(`\n🎉 총 ${inserted}개 키워드 생성 완료!`);
    
    // 8. 샘플 확인
    const { data: sampleKeywords } = await supabase
      .from('search_keywords')
      .select('keyword')
      .ilike('keyword', '%즉석%')
      .limit(5);
    
    if (sampleKeywords && sampleKeywords.length > 0) {
      console.log('\n📋 "즉석" 관련 키워드 샘플:');
      sampleKeywords.forEach(item => {
        console.log('- ' + item.keyword);
      });
    }
    
  } catch (error) {
    console.error('💥 오류 발생:', error);
  }
}

// 키워드 카테고리 분류
function getKeywordCategory(keyword) {
  if (keyword.includes('류') || keyword.includes('가공품') || keyword.includes('제품')) {
    return '식품유형';
  }
  if (keyword.includes('즉석') || keyword.includes('냉동') || keyword.includes('건조')) {
    return '가공형태';
  }
  if (keyword.includes('보존료') || keyword.includes('착색료') || keyword.includes('첨가물')) {
    return '첨가물';
  }
  if (keyword.includes('단백질') || keyword.includes('비타민') || keyword.includes('칼슘')) {
    return '영양성분';
  }
  if (keyword.includes('대장균') || keyword.includes('중금속') || keyword.includes('농약')) {
    return '안전성';
  }
  return '일반';
}

generateKeywords();