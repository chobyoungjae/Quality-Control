/**
 * 식품등의 표시기준 FOOD_TYPES 배열을 추출해서 Supabase에 업로드
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 식품등의 표시기준에서 추출한 FOOD_TYPES 배열 (완전한 목록)
const FOOD_TYPES = [
  // 과자류, 빵류 또는 떡류 (표 3)
  '과자류',
  '빵류', 
  '떡류',
  '캔디류',
  '추잉껌',
  '피자',
  
  // 빙과류
  '아이스크림류',
  '아이스크림믹스류',
  '빙과',
  '얼음류',
  
  // 코코아가공품류 또는 초콜릿류
  '코코아가공품류',
  '초콜릿류',
  '초콜릿가공품',
  
  // 당류
  '설탕류',
  '당시럽류',
  '올리고당류',
  '포도당',
  '과당류',
  '엿류',
  '당류가공품',
  '잼류',
  
  // 두부류 또는 묵류
  '두부',
  '유바',
  '가공두부',
  '묵류',
  
  // 식용유지류
  '식물성유지류',
  '동물성유지류',
  '식용유지가공품',
  '혼합식용유',
  '향미유',
  '가공유지',
  '쇼트닝',
  '마가린',
  '모조치즈',
  '식물성크림',
  
  // 면류
  '생면',
  '숙면',
  '건면',
  '당면',
  '유탕면',
  
  // 음료류
  '다류',
  '침출차',
  '액상차',
  '고형차',
  '커피',
  '과일·채소류음료',
  '농축과·채즙',
  '과·채주스',
  '과·채음료',
  '탄산음료류',
  '탄산음료',
  '탄산수',
  '두유류',
  '발효음료류',
  '인삼·홍삼음료',
  '기타음료',
  '혼합음료',
  '음료베이스',
  
  // 특수영양식품
  '조제유류',
  '영아용 조제식',
  '성장기용 조제식',
  '영·유아용 이유식',
  '특수의료용도등식품',
  '체중조절용조제식품',
  '임산·수유부용식품',
  
  // 특수의료용도식품
  '표준형영양조제식품',
  '일반환자용균형영양조제식품',
  '당뇨환자용영양조제식품',
  '신장질환자용영양조제식품',
  '장질환자용단백가수분해영양조제식품',
  '열량및영양공급용식품',
  '연하곤란자용점도조절식품',
  '맞춤형영양조제식품',
  '선천성대사질환자용조제식품',
  '영·유아용특수조제식품',
  '기타환자용영양조제식품',
  '식단형식사관리식품',
  '당뇨환자용식단형식품',
  '신장질환자용식단형식품',
  
  // 장류
  '메주',
  '한식간장',
  '양조간장',
  '산분해간장',
  '효소분해간장',
  '혼합간장',
  '한식된장',
  '된장',
  '고추장',
  '춘장',
  '청국장',
  '나토',
  '혼합장',
  '기타장류',
  
  // 조미식품
  '식초',
  '소스류',
  '소스',
  '드레싱',
  '덮밥소스',
  '마요네즈',
  '토마토케첩',
  '복합조미식품',
  '카레(커리)',
  '레토르트식품',
  '고춧가루',
  '실고추',
  '향신료가공품',
  '식염',
  
  // 절임류 또는 조림류
  '김치류',
  '김칫속',
  '김치',
  '배추김치',
  '물김치',
  '기타김치',
  '절임류',
  '절임식품',
  '장아찌',
  '당절임',
  '조림류',
  
  // 주류
  '발효주류',
  '증류주류',
  '기타주류',
  '주정',
  
  // 농산가공식품류
  '전분류',
  '밀가루류',
  '땅콩또는견과류가공품류',
  '땅콩버터',
  '땅콩또는견과류가공품',
  '시리얼류',
  '찐쌀',
  '효소식품',
  '기타농산가공품류',
  '과·채가공품',
  '건과류',
  '곡류가공품',
  '누룽지',
  '서류가공품',
  '감자튀김',
  
  // 식육가공품 및 포장육
  '햄류',
  '햄',
  '프레스햄',
  '소시지류',
  '소시지',
  '발효소시지',
  '혼합소시지',
  '베이컨류',
  '건조저장육류',
  '양념육류',
  '양념육',
  '분쇄가공육제품',
  '갈비가공품',
  '식육추출가공품',
  '식육함유가공품',
  '육포등육류말린것',
  '포장육',
  
  // 알가공품류
  '알가공품',
  '알함유가공품',
  
  // 유가공품
  '우유류',
  '우유',
  '환원유',
  '가공유류',
  '강화우유',
  '유산균첨가우유',
  '유당분해우유',
  '가공유',
  '산양유',
  '발효유',
  '발효유분말',
  '버터유',
  '농축유류',
  '유크림류',
  '버터류',
  '버터',
  '가공버터',
  '치즈류',
  '치즈',
  '가공치즈',
  '분유류',
  '유청류',
  '유당',
  '유단백가수분해식품',
  
  // 수산가공식품류
  '어육가공품류',
  '어육살',
  '연육',
  '어육반제품',
  '어묵',
  '어육소시지',
  '기타어육가공품',
  '젓갈류',
  '건포류',
  '조미건어포',
  '건어포',
  '기타건포류',
  '염건강정',
  '염강정',
  '훈제품',
  '혼합젓갈',
  '젓갈',
  '액젓',
  '소스젓갈',
  '멸치액젓',
  '새우젓',
  '조미김',
  '김자반',
  '한천',
  '기타수산물가공품',
  
  // 동물성가공식품류
  '기타식육또는기타알제품',
  '곤충가공식품',
  '번데기통조림',
  '자라가공식품',
  '추출가공식품',
  
  // 벌꿀및화분가공품류
  '벌꿀류',
  '로얄젤리류',
  '화분가공식품',
  
  // 즉석식품류
  '생식류',
  '즉석섭취·편의식품류',
  '즉석섭취식품',
  '도시락',
  '김밥류',
  '햄버거',
  '샌드위치류',
  '즉석조리식품',
  '밥',
  '국',
  '탕',
  '찌개',
  '죽',
  '스프',
  '만두류',
  '만두',
  
  // 기타식품류
  '효모식품',
  '기타가공품',
  
  // 식용란
  '식용란',
  
  // 닭·오리의 식육
  '닭·오리의식육',
  
  // 자연상태 식품
  '자연상태식품',
  
  // 추가 실용적 키워드들
  '라면',
  '컵라면',
  '봉지라면',
  '냉면',
  '냉동만두',
  '피자',
  '햄버거',
  '치킨',
  '떡볶이',
  '순대',
  '어묵',
  '김밥',
  '초밥',
  '참치캔',
  '고등어캔',
  '토마토소스',
  '마늘',
  '양파',
  '생강',
  '고구마',
  '감자',
  '쌀',
  '현미',
  '보리',
  '콩',
  '팥',
  '견과류',
  '호두',
  '아몬드',
  '잣'
];

async function uploadFoodTypes() {
  try {
    console.log('📋 식품등의 표시기준 FOOD_TYPES 배열 업로드 시작...');
    console.log(`총 ${FOOD_TYPES.length}개 식품 유형`);
    
    // 1. 기존 키워드들 확인
    const { data: existingKeywords, error: fetchError } = await supabase
      .from('search_keywords')
      .select('keyword');
    
    if (fetchError) {
      console.error('기존 키워드 조회 오류:', fetchError);
      return;
    }
    
    const existingKeywordSet = new Set(existingKeywords.map(item => item.keyword));
    console.log(`기존 키워드: ${existingKeywords.length}개`);
    
    // 2. 새로 추가할 키워드 필터링
    const newKeywords = FOOD_TYPES
      .filter(keyword => !existingKeywordSet.has(keyword))
      .filter(keyword => keyword && keyword.trim().length > 0);
    
    console.log(`새로 추가할 키워드: ${newKeywords.length}개`);
    
    if (newKeywords.length === 0) {
      console.log('모든 키워드가 이미 존재합니다.');
      return;
    }
    
    // 3. 새 키워드들을 배치로 추가
    let totalAdded = 0;
    
    for (const keyword of newKeywords) {
      try {
        // 최대 ID 확인
        const { data: maxData } = await supabase
          .from('search_keywords')
          .select('id')
          .order('id', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        const nextId = (maxData?.id || 0) + 1;
        
        // 키워드 삽입
        const { error: insertError } = await supabase
          .from('search_keywords')
          .insert([{
            id: nextId,
            keyword: keyword,
            search_count: 0
          }]);
        
        if (insertError) {
          console.error(`❌ "${keyword}" 삽입 오류:`, insertError.message);
        } else {
          console.log(`✅ "${keyword}" 추가 완료`);
          totalAdded++;
        }
        
        // API 제한 고려 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 50));
        
      } catch (err) {
        console.error(`❌ "${keyword}" 처리 중 오류:`, err.message);
      }
    }
    
    console.log(`\n🎉 총 ${totalAdded}개 새 키워드 추가 완료!`);
    
    // 4. 즉석조리식품 관련 확인
    const { data: instantKeywords } = await supabase
      .from('search_keywords')
      .select('keyword')
      .ilike('keyword', '%즉석%')
      .order('keyword');
    
    console.log('\n📋 "즉석" 관련 키워드들:');
    if (instantKeywords) {
      instantKeywords.forEach(item => console.log('- ' + item.keyword));
    }
    
    // 5. 최종 키워드 수 확인
    const { count } = await supabase
      .from('search_keywords')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\n📊 현재 총 키워드: ${count}개`);
    
  } catch (error) {
    console.error('💥 오류 발생:', error);
  }
}

uploadFoodTypes();