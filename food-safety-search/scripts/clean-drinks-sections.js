/**
 * 음료류(9번대) 섹션 정리 스크립트
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 음료류 섹션들의 깔끔한 데이터
const cleanDrinkSections = [
  {
    id: "section-9_1",
    title: "9-1 다류",
    content: `9-1 다류

 1) 정의
   다류라 함은 식물성 원료를 주원료로 하여 제조･가공한 기호성 식품으로서 침출차, 액상차, 고형차를 말한다.
   
 2) 원료 등의 구비요건
 
 3) 제조･가공기준
   (1) 원료를 추출할 경우에는 물, 주정 또는 이산화탄소를 용제로 사용하여 원료의 특성에 따라 냉침, 온침 등 적절한 방법을 사용하여야 하며, 카페인 제거 목적으로 초산에틸을 사용할 수 있다.
   (2) 쌍화차는 백작약, 숙지황, 황기, 당귀, 천궁, 계피, 감초를 추출여과한 가용성 추출물을 원료로 하여 제조하여야 하며 이때 생강, 대추, 잣 등을 넣을 수 있다.
   
 4) 식품유형
   (1) 침출차: 식물의 어린싹이나 잎, 꽃, 줄기, 뿌리, 열매 또는 곡류 등을 주원료로 하여 가공한 것으로서 물에 침출하여 그 여액을 음용하는 기호성 식품을 말한다.
   (2) 액상차: 식물성 원료를 주원료로 하여 추출 등의 방법으로 가공한 것이거나 이에 식품 또는 식품첨가물을 가한 시럽상 또는 액상의 기호성 식품을 말한다.
   (3) 고형차: 식물성 원료를 주원료로 하여 가공한 것으로 분말 등 고형의 기호성 식품을 말한다.
   
 5) 규격
   (1) 타르색소: 검출되어서는 아니 된다.
   (2) 납(mg/kg): 침출차는 5.0 이하, 액상차 0.3 이하, 고형차 2.0 이하
   (3) 카드뮴(mg/kg): 0.2 이하
   (4) 세균수: n=5, c=1, m=100, M=1,000 (액상차에 한한다)
   (5) 대장균군: n=5, c=1, m=0, M=10 (액상차에 한한다)
   
 6) 시험방법
   (1) 타르색소: 제8. 일반시험법 3.4 착색료에 따라 시험한다.
   (2) 납 및 카드뮴: 제8. 일반시험법 9.1 중금속에 따라 시험한다.
   (3) 세균수: 제8. 일반시험법 4. 미생물시험법 4.5 세균수에 따라 시험한다.
   (4) 대장균군: 제8. 일반시험법 4. 미생물시험법 4.7 대장균군에 따라 시험한다.`,
    category: "음료류",
    file_source: "manual_clean_fixed",
    section_number: "9-1"
  },
  {
    id: "section-9_2", 
    title: "9-2 커피",
    content: `9-2 커피

 1) 정의
   커피라 함은 커피원두를 주원료로 하여 제조･가공한 기호성 식품을 말한다.
   
 2) 원료 등의 구비요건
 
 3) 제조･가공기준
   (1) 원두커피는 생두를 볶아서 제조한다.
   (2) 인스턴트커피는 볶은 커피를 추출하여 건조한 것이다.
   
 4) 식품유형
   (1) 원두커피: 생두를 볶은 것을 말한다.
   (2) 인스턴트커피: 볶은 커피를 추출한 다음 건조하거나 농축한 것을 말한다.
   (3) 조제커피: 원두커피 또는 인스턴트커피에 식품 또는 식품첨가물을 가한 것을 말한다.
   (4) 액상커피: 원두커피 또는 인스턴트커피를 추출한 것이거나 이에 식품 또는 식품첨가물을 가한 것을 말한다.
   
 5) 규격
   (1) 타르색소: 검출되어서는 아니 된다.
   (2) 납(mg/kg): 원두커피 2.5 이하, 인스턴트커피 1.0 이하, 조제커피 1.0 이하, 액상커피 0.3 이하
   (3) 카드뮴(mg/kg): 0.2 이하
   (4) 세균수: n=5, c=1, m=100, M=1,000 (액상커피에 한한다)
   (5) 대장균군: n=5, c=1, m=0, M=10 (액상커피에 한한다)
   
 6) 시험방법
   (1) 타르색소: 제8. 일반시험법 3.4 착색료에 따라 시험한다.
   (2) 납 및 카드뮴: 제8. 일반시험법 9.1 중금속에 따라 시험한다.
   (3) 세균수: 제8. 일반시험법 4. 미생물시험법 4.5 세균수에 따라 시험한다.
   (4) 대장균군: 제8. 일반시험법 4. 미생물시험법 4.7 대장균군에 따라 시험한다.`,
    category: "음료류", 
    file_source: "manual_clean_fixed",
    section_number: "9-2"
  }
];

async function updateDrinkSections() {
  try {
    console.log('🥤 음료류 섹션 정리 중...');
    
    for (const section of cleanDrinkSections) {
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
    
    console.log('🎉 음료류 섹션 정리 완료!');
    
  } catch (error) {
    console.error('💥 오류 발생:', error);
  }
}

updateDrinkSections();