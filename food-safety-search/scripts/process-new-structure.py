#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
새로운 테이블 구조에 맞춘 대용량 한글 파일 처리 스크립트
- food_codex_sections: 식품공전 조항
- search_keywords: 드롭다운용 키워드
- section_keywords: 조항-키워드 연결
"""

import re
import json
import os
from datetime import datetime
from typing import List, Dict, Set, Tuple

class NewStructureProcessor:
    def __init__(self, input_file: str, output_dir: str = "data/processed"):
        self.input_file = input_file
        self.output_dir = output_dir
        self.sections = []
        self.keywords_set = set()
        self.section_keywords_map = {}
        
        # 출력 디렉토리 생성
        os.makedirs(output_dir, exist_ok=True)
        
    def clean_text(self, text: str) -> str:
        """텍스트 정리: 표, 그림, 페이지 번호 등 제거 및 가독성 개선"""
        
        # 1단계: 불필요한 요소 제거
        # 표 관련 패턴
        table_patterns = [
            r'┌[─┬┐]*┐.*?└[─┴┘]*┘',  # 표 테두리
            r'\│.*?\│',  # 표 내용
            r'[─┬┐┌┘└┴┤├]*',  # 표 선
        ]
        
        # 그림/이미지 관련
        image_patterns = [
            r'\[그림.*?\]',
            r'\[사진.*?\]',
            r'\[도.*?\]',
            r'<그림.*?>',
        ]
        
        # 페이지 번호 및 기타
        misc_patterns = [
            r'\n\s*-\s*\d+\s*-\s*\n',  # 페이지 번호
            r'\n\s*\d+\s*/\s*\d+\s*\n',  # 페이지 표시
            r'\n\s*제\d+장.*?\n',  # 장 제목
        ]
        
        # 패턴 적용
        for pattern in table_patterns + image_patterns + misc_patterns:
            text = re.sub(pattern, ' ', text, flags=re.DOTALL)
        
        # 2단계: 한글 텍스트 정리 (핵심!)
        # 특수 문자 제거 (인코딩 문제 방지) - 더 강력한 정리
        # 허용할 문자만 남기기: 한글, 영문, 숫자, 기본 특수문자
        text = re.sub(r'[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ0-9A-Za-z().,;:!?\-=<>%/∶∙･]', ' ', text)
        
        # 문제가 되는 특수 유니코드 문자들 완전 제거
        text = text.encode('utf-8', errors='ignore').decode('utf-8')
        
        # cp949로 인코딩 불가능한 문자 제거
        try:
            text.encode('cp949')
        except UnicodeEncodeError:
            # cp949로 인코딩 가능한 문자만 남기기
            safe_chars = []
            for char in text:
                try:
                    char.encode('cp949')
                    safe_chars.append(char)
                except UnicodeEncodeError:
                    safe_chars.append(' ')  # 문제 문자는 공백으로 대체
            text = ''.join(safe_chars)
        
        # 한글 단어 사이의 불필요한 공백 제거
        text = re.sub(r'([가-힣])\s+([가-힣])', r'\1\2', text)
        
        # 숫자와 한글 사이 공백 정리
        text = re.sub(r'(\d)\s+([가-힣])', r'\1 \2', text)
        text = re.sub(r'([가-힣])\s+(\d)', r'\1 \2', text)
        
        # 괄호 안 공백 정리
        text = re.sub(r'\(\s+([^)]+)\s+\)', r'(\1)', text)
        
        # 3단계: 구조화된 텍스트로 변환
        # 조항 번호 앞에 줄바꿈
        text = re.sub(r'(\d+)\s*\)\s*([가-힣]+)', r'\n\1) \2', text)
        
        # 소항목 번호 앞에 줄바꿈  
        text = re.sub(r'\((\d+)\)\s*([가-힣]+)', r'\n  (\1) \2', text)
        
        # 영문 소항목 앞에 줄바꿈
        text = re.sub(r'\(([a-zA-Z])\)\s*([가-힣]+)', r'\n    (\1) \2', text)
        
        # 4단계: 최종 정리
        # 연속된 공백을 하나로
        text = re.sub(r'\s{2,}', ' ', text)
        
        # 연속된 줄바꿈을 정리
        text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)
        text = re.sub(r'\n\s*\n', '\n', text)
        
        # 앞뒤 공백 제거
        return text.strip()
    
    def extract_keywords(self, title: str, content: str) -> List[str]:
        """제목과 내용에서 키워드 추출"""
        keywords = []
        
        # 제목에서 주요 키워드 추출
        title_match = re.search(r'(\d+-\d+)\s*(.+?)(?:\(|$)', title)
        if title_match:
            section_num = title_match.group(1)
            main_title = title_match.group(2).strip()
            
            # 메인 키워드
            keywords.append(main_title)
            
            # 축산물가공품 등 괄호 내용 제거한 키워드
            clean_title = re.sub(r'\([^)]*\)', '', main_title).strip()
            if clean_title != main_title:
                keywords.append(clean_title)
            
            # 개별 단어 추출
            words = re.findall(r'[가-힣]{2,}', main_title)
            keywords.extend(words)
        
        # 내용에서 식품 관련 키워드 추출
        food_patterns = [
            r'([가-힣]+류)',  # ~류
            r'([가-힣]+제품)',  # ~제품
            r'([가-힣]+가공품)',  # ~가공품
        ]
        
        for pattern in food_patterns:
            matches = re.findall(pattern, content)
            keywords.extend(matches)
        
        # 중복 제거 및 정리
        unique_keywords = []
        for keyword in keywords:
            keyword = keyword.strip()
            if len(keyword) >= 2 and keyword not in unique_keywords:
                unique_keywords.append(keyword)
        
        return unique_keywords[:10]  # 최대 10개 키워드
    
    def parse_sections(self) -> bool:
        """파일에서 조항 파싱"""
        try:
            print(f"파일 처리 시작: {self.input_file}")
            
            # 다양한 인코딩으로 파일 읽기 시도
            encodings = ['utf-8', 'cp949', 'euc-kr', 'utf-8-sig']
            content = None
            
            for encoding in encodings:
                try:
                    with open(self.input_file, 'r', encoding=encoding, errors='ignore') as f:
                        content = f.read()
                    print(f"파일 인코딩: {encoding}")
                    break
                except:
                    continue
            
            if content is None:
                print("파일 읽기 실패: 지원되는 인코딩을 찾을 수 없습니다.")
                return False
            
            print(f"파일 크기: {len(content)} 문자")
            
            # 조항 패턴 (예: 17-1, 17-2 등)
            section_pattern = r'(\d+-\d+)\s*([^\n]+)'
            
            # 모든 조항 찾기
            section_matches = list(re.finditer(section_pattern, content))
            print(f"발견된 조항 패턴: {len(section_matches)}개")
            
            if not section_matches:
                print("조항 패턴을 찾을 수 없습니다.")
                return False
            
            # 각 조항 처리
            for i, match in enumerate(section_matches):
                section_start = match.start()
                section_end = section_matches[i + 1].start() if i + 1 < len(section_matches) else len(content)
                
                section_num = match.group(1)
                title_part = match.group(2).strip()
                full_title = f"{section_num} {title_part}"
                
                # 조항 내용 추출
                section_content = content[section_start:section_end]
                cleaned_content = self.clean_text(section_content)
                
                if len(cleaned_content) < 50:  # 너무 짧은 내용 제외
                    continue
                
                # 카테고리 추출
                category = "기타"
                if "축산물가공품" in title_part:
                    category = "축산물가공품"
                elif "가공품" in title_part:
                    category = "가공품류"
                elif "식품" in title_part:
                    category = "식품류"
                
                # 키워드 추출
                keywords = self.extract_keywords(full_title, cleaned_content)
                
                # 고유 ID 생성 (중복 방지)
                base_id = f"section-{section_num.replace('-', '_')}"
                unique_id = base_id
                counter = 1
                
                # 중복된 ID가 있으면 번호 추가
                while any(s["id"] == unique_id for s in self.sections):
                    unique_id = f"{base_id}_{counter}"
                    counter += 1
                
                # 조항 데이터 생성
                section_data = {
                    "id": unique_id,
                    "title": full_title,
                    "content": cleaned_content,
                    "category": category,
                    "file_source": os.path.basename(self.input_file),
                    "character_count": len(cleaned_content),
                    "section_number": section_num
                }
                
                self.sections.append(section_data)
                self.section_keywords_map[section_data["id"]] = keywords
                self.keywords_set.update(keywords)
                
                print(f"처리 완료: {full_title} ({len(cleaned_content)}자, 키워드 {len(keywords)}개)")
            
            print(f"\n총 처리된 조항: {len(self.sections)}개")
            print(f"총 추출된 키워드: {len(self.keywords_set)}개")
            
            return True
            
        except Exception as e:
            print(f"파일 처리 오류: {e}")
            return False
    
    def generate_json_files(self) -> bool:
        """JSON 파일들 생성"""
        try:
            # 1. 조항 데이터
            sections_file = os.path.join(self.output_dir, "food_codex_sections.json")
            with open(sections_file, 'w', encoding='utf-8') as f:
                json.dump({
                    "sections": self.sections,
                    "metadata": {
                        "source_file": self.input_file,
                        "processed_at": datetime.now().isoformat(),
                        "total_sections": len(self.sections)
                    }
                }, f, ensure_ascii=False, indent=2)
            
            # 2. 키워드 데이터
            keywords_data = []
            for i, keyword in enumerate(sorted(self.keywords_set), 1):
                keywords_data.append({
                    "id": i,
                    "keyword": keyword,
                    "search_count": 0,
                    "category": "자동추출"
                })
            
            keywords_file = os.path.join(self.output_dir, "search_keywords.json")
            with open(keywords_file, 'w', encoding='utf-8') as f:
                json.dump({
                    "keywords": keywords_data,
                    "metadata": {
                        "total_keywords": len(keywords_data),
                        "processed_at": datetime.now().isoformat()
                    }
                }, f, ensure_ascii=False, indent=2)
            
            # 3. 조항-키워드 연결 데이터
            connections = []
            connection_id = 1
            
            for section_id, keywords in self.section_keywords_map.items():
                for keyword in keywords:
                    # 키워드 ID 찾기
                    keyword_id = None
                    for kw_data in keywords_data:
                        if kw_data["keyword"] == keyword:
                            keyword_id = kw_data["id"]
                            break
                    
                    if keyword_id:
                        connections.append({
                            "id": connection_id,
                            "section_id": section_id,
                            "keyword_id": keyword_id
                        })
                        connection_id += 1
            
            connections_file = os.path.join(self.output_dir, "section_keywords.json")
            with open(connections_file, 'w', encoding='utf-8') as f:
                json.dump({
                    "connections": connections,
                    "metadata": {
                        "total_connections": len(connections),
                        "processed_at": datetime.now().isoformat()
                    }
                }, f, ensure_ascii=False, indent=2)
            
            print(f"JSON 파일 생성 완료:")
            print(f"  - 조항: {sections_file}")
            print(f"  - 키워드: {keywords_file}")
            print(f"  - 연결: {connections_file}")
            
            return True
            
        except Exception as e:
            print(f"JSON 파일 생성 오류: {e}")
            return False

def main():
    # 입력 파일 경로
    input_file = "data/hwp_texts/제1~5_계정.txt"
    
    if not os.path.exists(input_file):
        print(f"파일을 찾을 수 없습니다: {input_file}")
        return
    
    # 처리기 생성 및 실행
    processor = NewStructureProcessor(input_file)
    
    print("새로운 구조로 파일 처리 시작...")
    
    if processor.parse_sections():
        if processor.generate_json_files():
            print("처리 완료!")
            print(f"결과:")
            print(f"  - 조항 수: {len(processor.sections)}개")
            print(f"  - 키워드 수: {len(processor.keywords_set)}개")
            print(f"  - 연결 수: {sum(len(kws) for kws in processor.section_keywords_map.values())}개")
        else:
            print("JSON 파일 생성 실패")
    else:
        print("파일 파싱 실패")

if __name__ == "__main__":
    main()