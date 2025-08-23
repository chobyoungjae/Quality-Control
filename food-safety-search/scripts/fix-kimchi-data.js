/**
 * 김치류 데이터 수정 스크립트
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const cleanKimchiData = {
  "id": "section-14_1",
  "title": "14-1 김치류",
  "content": `14-1 김치류

 1) 정의
   김치류라 함은 배추 등 채소류를 주원료로 하여 절임, 양념혼합공정을 거쳐 그대로 또는 발효시켜 가공한 김치와 김치를 제조하기 위해 사용하는 김칫속을 말한다.
   
 2) 원료 등의 구비요건
 
 3) 제조･가공기준
   (1) 원료로 사용되는 채소류는 이물이 제거될 수 있도록 충분히 세척하여야 한다.
   
 4) 식품유형
   (1) 김칫속∶식물성 원료에 고춧가루, 당류, 식염 등을 가하여 혼합한 것으로 채소류 등에 첨가, 혼합하여 김치를 만드는 데 사용하는 것을 말한다.
   (2) 김치∶배추 등 채소류를 주원료로 하여 절임, 양념혼합 과정 등을 거쳐 그대로 또는 발효시킨 것이거나 이를 가공한 것을 말한다.
   
 5) 규격
   (1) 납(mg/kg)∶0.3 이하
   (2) 카드뮴(mg/kg)∶0.2 이하
   (3) 타르색소∶검출되어서는 아니 된다.
   (4) 보존료∶검출되어서는 아니 된다.
   (5) 대장균군∶n=5, c=1, m=0, M=10(살균제품에 한한다).
   
 6) 시험방법
   (1) 납 및 카드뮴∶제8. 일반시험법 9.1 중금속에 따라 시험한다.
   (2) 타르색소∶제8. 일반시험법 3.4 착색료에 따라 시험한다.
   (3) 보존료∶제8. 일반시험법 3.1 보존료에 따라 시험한다.
   (4) 대장균군∶제8. 일반시험법 4. 미생물시험법 4.7 대장균군에 따라 시험한다.`,
  "category": "절임류또는조림류",
  "file_source": "manual_clean_fixed",
  "character_count": 689,
  "section_number": "14-1"
};

async function updateKimchiData() {
  try {
    console.log('🥬 김치류 데이터 수정 중...');
    
    // 기존 김치류 데이터 삭제
    const { error: deleteError } = await supabase
      .from('food_codex_sections')
      .delete()
      .eq('id', 'section-14_1');
    
    if (deleteError) {
      console.error('❌ 삭제 오류:', deleteError);
    } else {
      console.log('🗑️ 기존 김치류 데이터 삭제 완료');
    }
    
    // 새로운 김치류 데이터 삽입
    const { data, error } = await supabase
      .from('food_codex_sections')
      .insert([cleanKimchiData])
      .select();
    
    if (error) {
      console.error('❌ 삽입 오류:', error);
      throw error;
    }
    
    console.log('✅ 새로운 김치류 데이터 삽입 완료');
    
    // 확인
    const { data: verifyData, error: verifyError } = await supabase
      .from('food_codex_sections')
      .select('title, content')
      .eq('id', 'section-14_1')
      .single();
    
    if (!verifyError && verifyData) {
      console.log('📋 업데이트 확인:');
      console.log('제목:', verifyData.title);
      console.log('내용 미리보기:', verifyData.content.substring(0, 150) + '...');
    }
    
    console.log('🎉 김치류 데이터 수정 완료!');
    
  } catch (error) {
    console.error('💥 오류 발생:', error);
  }
}

updateKimchiData();