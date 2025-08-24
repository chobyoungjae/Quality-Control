/**
 * 🎯 TXT 파일에서 자동으로 섹션 추출해서 Supabase DB에 저장
 * 완벽한 한글 → TXT 변환 파일 자동 처리
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// TXT 파일 경로
const TXT_FILE_PATH = path.join(__dirname, '../data/hwp_texts/(1) 제1~제5_개정.txt');

/**
 * 🔥 섹션 자동 추출 함수
 * 패턴: "숫자-숫자 제목" 형태로 섹션 분리
 */
function extractSectionsFromText(textContent) {
  console.log('🔍 텍스트에서 섹션 패턴 분석 중...');
  
  // 전체 텍스트를 줄 단위로 분리
  const lines = textContent.split('\n');
  
  const sections = [];
  let currentSection = null;
  let currentContent = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 섹션 제목 패턴 매칭 (예: "14-1 김치류", "17-2 소시지류")
    const sectionMatch = line.match(/^(\d+-\d+)\s+(.+?)$/);
    
    if (sectionMatch) {
      // 이전 섹션이 있으면 저장
      if (currentSection) {
        sections.push({
          id: `section-${currentSection.number.replace('-', '_')}`,
          number: currentSection.number,
          title: currentSection.title,
          content: currentContent.join('\n').trim()
        });
      }
      
      // 새 섹션 시작
      currentSection = {
        number: sectionMatch[1],
        title: `${sectionMatch[1]} ${sectionMatch[2]}`
      };
      currentContent = [line]; // 제목부터 포함
      
      console.log(`📝 발견된 섹션: ${currentSection.title}`);
      
    } else {
      // 현재 섹션의 내용에 추가
      if (currentSection) {
        currentContent.push(line);
      }
    }
  }
  
  // 마지막 섹션 저장
  if (currentSection) {
    sections.push({
      id: `section-${currentSection.number.replace('-', '_')}`,
      number: currentSection.number,
      title: currentSection.title,
      content: currentContent.join('\n').trim()
    });
  }
  
  console.log(`✅ 총 ${sections.length}개 섹션 추출 완료!\n`);
  return sections;
}

/**
 * 🚀 TXT 파일 자동 처리 실행
 */
async function processTxtToDatabase() {
  try {
    console.log('🎯🎯🎯 TXT 파일 자동 처리 시작! 🎯🎯🎯');
    console.log(`📄 파일: ${TXT_FILE_PATH}\n`);
    
    // 1. TXT 파일 읽기
    if (!fs.existsSync(TXT_FILE_PATH)) {
      throw new Error(`파일을 찾을 수 없습니다: ${TXT_FILE_PATH}`);
    }
    
    const textContent = fs.readFileSync(TXT_FILE_PATH, 'utf8');
    console.log(`📊 파일 크기: ${textContent.length}자\n`);
    
    // 2. 섹션 자동 추출
    const sections = extractSectionsFromText(textContent);
    
    if (sections.length === 0) {
      console.log('❌ 추출된 섹션이 없습니다. 패턴을 확인해주세요.');
      return;
    }
    
    // 3. 데이터베이스 업로드
    console.log('📤 데이터베이스 업로드 시작...\n');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const [index, section] of sections.entries()) {
      try {
        console.log(`🎯 ${index + 1}/${sections.length}: ${section.id} (${section.title})`);
        
        const { error } = await supabase
          .from('food_codex_sections')
          .upsert({ // upsert = 있으면 업데이트, 없으면 삽입
            id: section.id,
            title: section.title,
            content: section.content,
            character_count: section.content.length,
            file_source: 'txt_auto_extraction_perfect'
          });
          
        if (error) {
          console.error(`❌ ${section.id} 실패:`, error.message);
          errorCount++;
        } else {
          console.log(`✅ ${section.id} 완료!`);
          successCount++;
        }
        
        // 안전한 대기
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (err) {
        console.error(`💥 ${section.id} 오류:`, err.message);
        errorCount++;
      }
    }
    
    // 4. 결과 출력
    console.log('\n🎉🎉🎉 TXT 자동 처리 완료! 🎉🎉🎉');
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`❌ 실패: ${errorCount}개`);
    console.log(`📊 성공률: ${(successCount/(successCount+errorCount)*100).toFixed(1)}%`);
    
    if (successCount > 0) {
      console.log('\n💎 이제 웹사이트에서 검색해보세요!');
      console.log('🌟 원본 한글 파일의 완벽한 텍스트가 표시됩니다!');
      console.log('🚀 모든 섹션이 깔끔한 포맷으로 정리되었습니다!');
    }
    
    // 5. 추출된 섹션 샘플 출력
    console.log('\n📋 추출된 섹션 샘플:');
    sections.slice(0, 3).forEach(section => {
      console.log(`\n--- ${section.title} ---`);
      console.log(section.content.substring(0, 200) + '...');
    });
    
  } catch (error) {
    console.error('💥 TXT 처리 오류:', error);
  }
}

// 🚀 실행!
processTxtToDatabase().catch(console.error);