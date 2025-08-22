// 새로운 테이블 구조에 맞춘 Supabase 업로드 스크립트
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 조항 데이터 업로드
 */
async function uploadSections(sectionsData) {
  console.log('📤 조항 데이터 업로드 시작...');
  
  try {
    const { data, error } = await supabase
      .from('food_codex_sections')
      .insert(sectionsData.sections);

    if (error) {
      console.error('❌ 조항 업로드 오류:', error);
      return false;
    }

    console.log(`✅ 조항 업로드 완료: ${sectionsData.sections.length}개`);
    return true;
  } catch (err) {
    console.error('❌ 조항 업로드 예외:', err);
    return false;
  }
}

/**
 * 키워드 데이터 업로드
 */
async function uploadKeywords(keywordsData) {
  console.log('📤 키워드 데이터 업로드 시작...');
  
  try {
    const { data, error } = await supabase
      .from('search_keywords')
      .insert(keywordsData.keywords);

    if (error) {
      console.error('❌ 키워드 업로드 오류:', error);
      return false;
    }

    console.log(`✅ 키워드 업로드 완료: ${keywordsData.keywords.length}개`);
    return true;
  } catch (err) {
    console.error('❌ 키워드 업로드 예외:', err);
    return false;
  }
}

/**
 * 조항-키워드 연결 데이터 업로드
 */
async function uploadConnections(connectionsData) {
  console.log('📤 조항-키워드 연결 데이터 업로드 시작...');
  
  try {
    const { data, error } = await supabase
      .from('section_keywords')
      .insert(connectionsData.connections);

    if (error) {
      console.error('❌연결 데이터 업로드 오류:', error);
      return false;
    }

    console.log(`✅ 연결 데이터 업로드 완료: ${connectionsData.connections.length}개`);
    return true;
  } catch (err) {
    console.error('❌ 연결 데이터 업로드 예외:', err);
    return false;
  }
}

/**
 * 기존 데이터 삭제
 */
async function clearExistingData() {
  console.log('🗑️ 기존 데이터 삭제 중...');
  
  try {
    // 역순으로 삭제 (외래키 제약조건 고려)
    await supabase.from('section_keywords').delete().neq('id', 0);
    await supabase.from('search_keywords').delete().neq('id', 0);
    await supabase.from('food_codex_sections').delete().neq('id', '');
    
    console.log('✅ 기존 데이터 삭제 완료');
    return true;
  } catch (err) {
    console.error('❌ 기존 데이터 삭제 오류:', err);
    return false;
  }
}

/**
 * 메인 업로드 함수
 */
async function main() {
  const dataDir = 'data/processed';
  
  // 파일 경로들
  const sectionsFile = path.join(dataDir, 'food_codex_sections.json');
  const keywordsFile = path.join(dataDir, 'search_keywords.json');
  const connectionsFile = path.join(dataDir, 'section_keywords.json');
  
  // 파일 존재 확인
  if (!fs.existsSync(sectionsFile) || !fs.existsSync(keywordsFile) || !fs.existsSync(connectionsFile)) {
    console.error('❌ 필요한 JSON 파일들이 없습니다. Python 스크립트를 먼저 실행하세요.');
    console.error('   python scripts/process-new-structure.py');
    process.exit(1);
  }

  try {
    // JSON 파일 로드
    console.log('📖 JSON 파일 로드 중...');
    const sectionsData = JSON.parse(fs.readFileSync(sectionsFile, 'utf8'));
    const keywordsData = JSON.parse(fs.readFileSync(keywordsFile, 'utf8'));
    const connectionsData = JSON.parse(fs.readFileSync(connectionsFile, 'utf8'));

    console.log('📊 데이터 정보:');
    console.log(`  - 조항: ${sectionsData.sections.length}개`);
    console.log(`  - 키워드: ${keywordsData.keywords.length}개`);
    console.log(`  - 연결: ${connectionsData.connections.length}개`);

    // 기존 데이터 삭제 (선택사항)
    if (process.argv.includes('--clear')) {
      if (!(await clearExistingData())) {
        process.exit(1);
      }
    }

    // 순서대로 업로드
    console.log('🚀 Supabase 업로드 시작...');
    
    // 1. 조항 업로드 (다른 테이블이 참조하므로 먼저)
    if (!(await uploadSections(sectionsData))) {
      process.exit(1);
    }

    // 2. 키워드 업로드
    if (!(await uploadKeywords(keywordsData))) {
      process.exit(1);
    }

    // 3. 연결 데이터 업로드
    if (!(await uploadConnections(connectionsData))) {
      process.exit(1);
    }

    console.log('🎉 모든 업로드 완료!');
    console.log('💡 이제 웹사이트에서 검색해보세요!');

  } catch (error) {
    console.error('❌ 처리 중 오류 발생:', error);
    process.exit(1);
  }
}

// 실행
main().catch(console.error);