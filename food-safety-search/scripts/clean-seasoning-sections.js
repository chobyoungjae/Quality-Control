/**
 * 조미료류(13번대) 섹션 정리 스크립트
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 조미료류 섹션들의 깔끔한 데이터
const cleanSeasoningSections = [
  {
    id: "section-13_1",
    title: "13-1 식초류",
    content: `13-1 식초류

 1) 정의
   식초류라 함은 곡류, 과실류, 주류 등을 주원료로 하여 발효시켜 제조하거나 빙초산 또는 초산을 먹는물로 희석하여 제조한 것을 말한다.
   
 2) 원료 등의 구비요건
 
 3) 제조･가공기준
   (1) 발효식초는 알코올 발효시킨 후 초산발효시켜 제조하여야 한다.
   (2) 희석초산은 빙초산 또는 초산을 먹는물로 희석하여 제조하여야 한다.
   
 4) 식품유형
   (1) 발효식초: 곡류, 과실류, 주류 등을 주원료로 하여 발효시켜 제조한 것
   (2) 희석초산: 빙초산 또는 초산을 먹는물로 희석하여 제조한 것
   (3) 조제식초: 발효식초 또는 희석초산에 식품 또는 식품첨가물을 가하여 제조한 것
   
 5) 규격
   (1) 총산(초산으로서, %): 4.0 이상
   (2) 메탄올(mg/L): 100 이하
   (3) 납(mg/kg): 0.3 이하
   (4) 비소(mg/kg): 0.2 이하
   (5) 대장균군: n=5, c=1, m=0, M=10
   
 6) 시험방법
   (1) 총산: 제8. 일반시험법 2.1.2 총산에 따라 시험한다.
   (2) 메탄올: 제8. 일반시험법 2.1.4.2 메탄올에 따라 시험한다.
   (3) 납: 제8. 일반시험법 9.1 중금속에 따라 시험한다.
   (4) 비소: 제8. 일반시험법 9.2 비소에 따라 시험한다.
   (5) 대장균군: 제8. 일반시험법 4. 미생물시험법 4.7 대장균군에 따라 시험한다.`,
    category: "조미료류",
    file_source: "manual_clean_fixed",
    section_number: "13-1"
  },
  {
    id: "section-13_2",
    title: "13-2 소스류", 
    content: `13-2 소스류

 1) 정의
   소스류라 함은 향신료, 조미료 등을 주원료로 하여 제조･가공한 것으로 식품의 조미에 사용되는 것을 말한다.
   
 2) 원료 등의 구비요건
 
 3) 제조･가공기준
   (1) 원료는 깨끗이 선별하여 이물을 제거한 후 사용하여야 한다.
   (2) 가열 또는 살균처리하여야 한다.
   
 4) 식품유형
   (1) 토마토소스: 토마토를 주원료로 하여 제조한 것
   (2) 칠리소스: 고추를 주원료로 하여 제조한 것  
   (3) 우스터소스: 향신료, 채소, 과실 등을 주원료로 하여 발효 또는 숙성시켜 제조한 것
   (4) 기타소스: 위에 해당하지 않는 소스류
   
 5) 규격
   (1) 타르색소: 검출되어서는 아니 된다. (다만, 착색을 목적으로 사용하는 제품 제외)
   (2) 보존료(g/kg): 소브산 2.0 이하, 안식향산 0.6 이하 (각각을 단독 또는 병용 사용시)
   (3) 대장균군: n=5, c=1, m=0, M=10
   
 6) 시험방법
   (1) 타르색소: 제8. 일반시험법 3.4 착색료에 따라 시험한다.
   (2) 보존료: 제8. 일반시험법 3.1 보존료에 따라 시험한다.
   (3) 대장균군: 제8. 일반시험법 4. 미생물시험법 4.7 대장균군에 따라 시험한다.`,
    category: "조미료류",
    file_source: "manual_clean_fixed", 
    section_number: "13-2"
  },
  {
    id: "section-13_6",
    title: "13-6 식염",
    content: `13-6 식염

 1) 정의
   식염이라 함은 바닷물, 암염, 호수물 등을 원료로 하여 정제한 것을 말한다.
   
 2) 원료 등의 구비요건
 
 3) 제조･가공기준
   (1) 원료는 깨끗하고 위생적이어야 한다.
   (2) 정제과정을 거쳐야 한다.
   
 4) 식품유형
 
 5) 규격
   (1) 염화나트륨(%): 95.0 이상
   (2) 수분(%): 5.0 이하
   (3) 수불용분(%): 0.5 이하
   (4) 납(mg/kg): 2.0 이하
   (5) 카드뮴(mg/kg): 0.5 이하
   (6) 비소(mg/kg): 0.5 이하
   (7) 수은(mg/kg): 0.1 이하
   
 6) 시험방법
   (1) 염화나트륨: 제8. 일반시험법 2.1.8 염화나트륨에 따라 시험한다.
   (2) 수분: 제8. 일반시험법 2.1.1 수분에 따라 시험한다.
   (3) 수불용분: 제8. 일반시험법 2.1.9 수불용분에 따라 시험한다.
   (4) 납, 카드뮴: 제8. 일반시험법 9.1 중금속에 따라 시험한다.
   (5) 비소: 제8. 일반시험법 9.2 비소에 따라 시험한다.
   (6) 수은: 제8. 일반시험법 9.3 수은에 따라 시험한다.`,
    category: "조미료류",
    file_source: "manual_clean_fixed",
    section_number: "13-6"
  }
];

async function updateSeasoningSections() {
  try {
    console.log('🧂 조미료류 섹션 정리 중...');
    
    for (const section of cleanSeasoningSections) {
      // 기존 데이터 삭제
      const { error: deleteError } = await supabase
        .from('food_codex_sections')
        .delete()
        .eq('id', section.id);
      
      if (deleteError) {
        console.error(`❌ ${section.id} 삭제 오류:`, deleteError);
        continue;
      }
      
      // 새 데이터 삽입
      const { error: insertError } = await supabase
        .from('food_codex_sections')
        .insert([{
          ...section,
          character_count: section.content.length
        }]);
      
      if (insertError) {
        console.error(`❌ ${section.id} 삽입 오류:`, insertError);
        continue;
      }
      
      console.log(`✅ ${section.id}: ${section.title} 정리 완료`);
    }
    
    console.log('🎉 조미료류 섹션 정리 완료!');
    
  } catch (error) {
    console.error('💥 오류 발생:', error);
  }
}

updateSeasoningSections();