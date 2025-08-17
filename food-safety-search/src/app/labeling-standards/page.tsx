'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// 식품 유형 데이터 (식품등의 표시기준_2.pdf 22-27페이지 기준)
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
  '자연상태식품'
];

// 식품 유형별 표시기준 데이터
const LABELING_STANDARDS = {
  '복합조미식품': {
    category: '조미식품 > 소스류',
    required: [
      '제품명',
      '식품유형',
      '영업소(장)의 명칭(상호) 및 소재지',
      '소비기한',
      '내용량 및 내용량에 해당하는 열량 (내용량 뒤에 괄호로 표시)',
      '원재료명',
      '영양성분',
      '용기․포장 재질',
      '품목보고번호',
      '성분명 및 함량 (해당 경우에 한함)',
      '보관방법 (해당 경우에 한함)',
      '주의사항'
    ],
    nutritionRequired: true,
    nutritionExample: {
      title: '영양성분표 (100g당)',
      components: [
        { name: '열량', value: '350kcal', required: true },
        { name: '탄수화물', value: '45g', required: true },
        { name: '당류', value: '8g', required: true },
        { name: '지방', value: '15g', required: true },
        { name: '포화지방', value: '3g', required: true },
        { name: '트랜스지방', value: '0g', required: true },
        { name: '콜레스테롤', value: '0mg', required: true },
        { name: '단백질', value: '8g', required: true },
        { name: '나트륨', value: '1200mg', required: true }
      ]
    },
    specificRequirements: [
      '일반 소비자용 제품은 조리시의 사용방법을 표시하여야 한다',
      '소스류로서 살균 또는 멸균공정을 거친 경우 "살균제품" 또는 "멸균제품"으로 구분․표시하여야 한다'
    ],
    commonStandards: {
      labeling: {
        title: '주표시면 및 정보표시면 구분',
        details: [
          '주표시면: 소비자가 식품을 구매할 때 가장 먼저 보는 면 (앞면, 윗면)',
          '정보표시면: 상세 정보가 표시되는 면 (뒷면, 측면)',
          '표시면적 비율: 주표시면 2/3, 정보표시면 1/3 (스티커 제품은 각각 1/2씩)'
        ]
      },
      fontRequirements: {
        title: '글씨 크기 및 표시방법 기준',
        details: [
          '영양성분 표시: 열량․영양성분 명칭, 함량 및 1일 영양성분 기준치에 대한 비율의 글씨크기는 10포인트 이상',
          '열량 표시: 총 내용량 글씨크기보다 크거나 같아야 하고 굵게(bold) 표시',
          '1일 영양성분 기준치 비율: 영양성분 글씨 및 함량의 글씨크기보다 크거나 같아야 하며, 굵게(bold) 표시',
          '내용량 표시: 중량(g) 또는 용량(ml)으로 표시하고 소수점 첫째자리에서 반올림하여 1g(ml)단위로 표시'
        ]
      },
      nutritionLabel: {
        title: '영양성분 표시서식도안',
        types: [
          '기본형 (총 내용량당, 100g(ml)당, 단위내용량당)',
          '세로형, 가로형, 그래픽형, 텍스트형',
          '병행표기 (단위내용량당과 총내용량/100g 병행)',
          '조리되지 않은 손질된 자연상태 식품-가공식품 구분형'
        ]
      },
      additives: {
        title: '식품첨가물 표시기준',
        categories: [
          '명칭과 용도를 함께 표시: 감미료(사카린나트륨, 아스파탐 등), 착색료(식용색소), 보존료, 산화방지제, 발색제, 향미증진제',
          '명칭 또는 간략명 표시: 가티검, 구아검, 잔탄검, 글리세린, 레시틴 등',
          '명칭, 간략명 또는 주용도 표시: 영양강화제, 효소제, 산도조절제, 유화제 등'
        ]
      }
    },
    additionalNotes: [
      '부정․불량식품 신고: 국번없이 1399',
      '알레르기 유발물질 표시 (해당 경우에 한함) - 달걀, 우유, 메밀, 땅콩, 대두, 밀, 고등어, 게, 새우, 돼지고기, 복숭아, 토마토, 아황산류, 호두, 닭고기, 쇠고기, 오징어, 조개류, 잣 함유',
      '조사처리식품 표시 (해당 경우에 한함)',
      '유전자변형식품 표시 (해당 경우에 한함)',
      '장기보존식품의 경우 별도 표시기준 적용',
      '인삼 또는 홍삼성분 함유 식품의 경우 원산지 및 함량 표시'
    ]
  },
  '과자류': {
    category: '과자류, 빵류 또는 떡류',
    required: [
      '제품명',
      '식품의 유형',
      '업소명 및 소재지',
      '제조년월일',
      '유통기한 또는 품질유지기한',
      '내용량',
      '원재료명 및 함량',
      '영양성분',
      '보관방법'
    ],
    nutritionRequired: true,
    nutritionExample: {
      title: '영양성분표 (100g당)',
      components: [
        { name: '열량', value: '450kcal', required: true },
        { name: '탄수화물', value: '65g', required: true },
        { name: '당류', value: '25g', required: true },
        { name: '지방', value: '18g', required: true },
        { name: '포화지방', value: '8g', required: true },
        { name: '트랜스지방', value: '0g', required: true },
        { name: '콜레스테롤', value: '5mg', required: true },
        { name: '단백질', value: '6g', required: true },
        { name: '나트륨', value: '250mg', required: true }
      ]
    },
    commonStandards: {
      labeling: {
        title: '주표시면 및 정보표시면 구분',
        details: [
          '주표시면: 소비자가 식품을 구매할 때 가장 먼저 보는 면 (앞면, 윗면)',
          '정보표시면: 상세 정보가 표시되는 면 (뒷면, 측면)',
          '표시면적 비율: 주표시면 2/3, 정보표시면 1/3 (스티커 제품은 각각 1/2씩)'
        ]
      },
      fontRequirements: {
        title: '글씨 크기 및 표시방법 기준',
        details: [
          '영양성분 표시: 열량․영양성분 명칭, 함량 및 1일 영양성분 기준치에 대한 비율의 글씨크기는 10포인트 이상',
          '열량 표시: 총 내용량 글씨크기보다 크거나 같아야 하고 굵게(bold) 표시',
          '1일 영양성분 기준치 비율: 영양성분 글씨 및 함량의 글씨크기보다 크거나 같아야 하며, 굵게(bold) 표시',
          '내용량 표시: 중량(g) 또는 용량(ml)으로 표시하고 소수점 첫째자리에서 반올림하여 1g(ml)단위로 표시'
        ]
      },
      nutritionLabel: {
        title: '영양성분 표시서식도안',
        types: [
          '기본형 (총 내용량당, 100g(ml)당, 단위내용량당)',
          '세로형, 가로형, 그래픽형, 텍스트형',
          '병행표기 (단위내용량당과 총내용량/100g 병행)',
          '조리되지 않은 손질된 자연상태 식품-가공식품 구분형'
        ]
      },
      additives: {
        title: '식품첨가물 표시기준',
        categories: [
          '명칭과 용도를 함께 표시: 감미료(사카린나트륨, 아스파탐 등), 착색료(식용색소), 보존료, 산화방지제, 발색제, 향미증진제',
          '명칭 또는 간략명 표시: 가티검, 구아검, 잔탄검, 글리세린, 레시틴 등',
          '명칭, 간략명 또는 주용도 표시: 영양강화제, 효소제, 산도조절제, 유화제 등'
        ]
      }
    },
    additionalNotes: [
      '개별포장 단위로 판매하는 경우 개별포장지에도 표시사항 기재',
      '어린이 기호식품 품질인증 대상 제품의 경우 관련 표시 필요',
      '견과류 함유 제품은 알레르기 주의문구 표시',
      '유통기한은 제조일로부터 적절한 기간 설정'
    ]
  },
  '빵류': {
    category: '과자류, 빵류 또는 떡류',
    required: [
      '제품명',
      '식품의 유형',
      '업소명 및 소재지',
      '제조년월일',
      '유통기한 또는 품질유지기한',
      '내용량',
      '원재료명 및 함량',
      '영양성분',
      '보관방법'
    ],
    nutritionRequired: true,
    nutritionExample: {
      title: '영양성분표 (100g당)',
      components: [
        { name: '열량', value: '280kcal', required: true },
        { name: '탄수화물', value: '50g', required: true },
        { name: '당류', value: '8g', required: true },
        { name: '지방', value: '6g', required: true },
        { name: '포화지방', value: '2g', required: true },
        { name: '트랜스지방', value: '0g', required: true },
        { name: '콜레스테롤', value: '15mg', required: true },
        { name: '단백질', value: '9g', required: true },
        { name: '나트륨', value: '450mg', required: true }
      ]
    },
    commonStandards: {
      labeling: {
        title: '주표시면 및 정보표시면 구분',
        details: [
          '주표시면: 소비자가 식품을 구매할 때 가장 먼저 보는 면 (앞면, 윗면)',
          '정보표시면: 상세 정보가 표시되는 면 (뒷면, 측면)',
          '표시면적 비율: 주표시면 2/3, 정보표시면 1/3 (스티커 제품은 각각 1/2씩)'
        ]
      },
      fontRequirements: {
        title: '글씨 크기 및 표시방법 기준',
        details: [
          '영양성분 표시: 열량․영양성분 명칭, 함량 및 1일 영양성분 기준치에 대한 비율의 글씨크기는 10포인트 이상',
          '열량 표시: 총 내용량 글씨크기보다 크거나 같아야 하고 굵게(bold) 표시',
          '1일 영양성분 기준치 비율: 영양성분 글씨 및 함량의 글씨크기보다 크거나 같아야 하며, 굵게(bold) 표시',
          '내용량 표시: 중량(g) 또는 용량(ml)으로 표시하고 소수점 첫째자리에서 반올림하여 1g(ml)단위로 표시'
        ]
      },
      nutritionLabel: {
        title: '영양성분 표시서식도안',
        types: [
          '기본형 (총 내용량당, 100g(ml)당, 단위내용량당)',
          '세로형, 가로형, 그래픽형, 텍스트형',
          '병행표기 (단위내용량당과 총내용량/100g 병행)',
          '조리되지 않은 손질된 자연상태 식품-가공식품 구분형'
        ]
      },
      additives: {
        title: '식품첨가물 표시기준',
        categories: [
          '명칭과 용도를 함께 표시: 감미료(사카린나트륨, 아스파탐 등), 착색료(식용색소), 보존료, 산화방지제, 발색제, 향미증진제',
          '명칭 또는 간략명 표시: 가티검, 구아검, 잔탄검, 글리세린, 레시틴 등',
          '명칭, 간략명 또는 주용도 표시: 영양강화제, 효소제, 산도조절제, 유화제 등'
        ]
      }
    },
    additionalNotes: [
      '밀가루 사용 제품은 글루텐 함유 표시',
      '달걀, 유제품 사용시 알레르기 유발요소 표시',
      '보관온도 및 습도 조건 명시',
      '개봉 후 섭취기한 안내'
    ]
  },
  '음료류': {
    category: '음료류',
    required: [
      '제품명',
      '식품의 유형',
      '업소명 및 소재지',
      '제조년월일',
      '유통기한 또는 품질유지기한',
      '내용량',
      '원재료명 및 함량',
      '영양성분',
      '보관방법'
    ],
    nutritionRequired: true,
    nutritionExample: {
      title: '영양성분표 (100ml당)',
      components: [
        { name: '열량', value: '42kcal', required: true },
        { name: '탄수화물', value: '10.5g', required: true },
        { name: '당류', value: '10.2g', required: true },
        { name: '지방', value: '0g', required: true },
        { name: '포화지방', value: '0g', required: true },
        { name: '트랜스지방', value: '0g', required: true },
        { name: '콜레스테롤', value: '0mg', required: true },
        { name: '단백질', value: '0g', required: true },
        { name: '나트륨', value: '8mg', required: true }
      ]
    },
    commonStandards: {
      labeling: {
        title: '주표시면 및 정보표시면 구분',
        details: [
          '주표시면: 소비자가 식품을 구매할 때 가장 먼저 보는 면 (앞면, 윗면)',
          '정보표시면: 상세 정보가 표시되는 면 (뒷면, 측면)',
          '표시면적 비율: 주표시면 2/3, 정보표시면 1/3 (스티커 제품은 각각 1/2씩)'
        ]
      },
      fontRequirements: {
        title: '글씨 크기 및 표시방법 기준',
        details: [
          '영양성분 표시: 열량․영양성분 명칭, 함량 및 1일 영양성분 기준치에 대한 비율의 글씨크기는 10포인트 이상',
          '열량 표시: 총 내용량 글씨크기보다 크거나 같아야 하고 굵게(bold) 표시',
          '1일 영양성분 기준치 비율: 영양성분 글씨 및 함량의 글씨크기보다 크거나 같아야 하며, 굵게(bold) 표시',
          '내용량 표시: 중량(g) 또는 용량(ml)으로 표시하고 소수점 첫째자리에서 반올림하여 1g(ml)단위로 표시'
        ]
      },
      nutritionLabel: {
        title: '영양성분 표시서식도안',
        types: [
          '기본형 (총 내용량당, 100g(ml)당, 단위내용량당)',
          '세로형, 가로형, 그래픽형, 텍스트형',
          '병행표기 (단위내용량당과 총내용량/100g 병행)',
          '조리되지 않은 손질된 자연상태 식품-가공식품 구분형'
        ]
      },
      additives: {
        title: '식품첨가물 표시기준',
        categories: [
          '명칭과 용도를 함께 표시: 감미료(사카린나트륨, 아스파탐 등), 착색료(식용색소), 보존료, 산화방지제, 발색제, 향미증진제',
          '명칭 또는 간략명 표시: 가티검, 구아검, 잔탄검, 글리세린, 레시틴 등',
          '명칭, 간략명 또는 주용도 표시: 영양강화제, 효소제, 산도조절제, 유화제 등'
        ]
      }
    },
    additionalNotes: [
      '카페인 함량 표시 (카페인 함유 제품)',
      '당류 첨가량이 많은 경우 주의문구 표시',
      '개봉 후 냉장보관 및 빠른 섭취 안내',
      '인공감미료 사용시 용도명과 함께 표시'
    ]
  },
  '유가공품': {
    category: '유가공품',
    required: [
      '제품명',
      '식품의 유형',
      '업소명 및 소재지',
      '제조년월일',
      '유통기한',
      '내용량',
      '원재료명 및 함량',
      '영양성분',
      '보관방법',
      '축산물이력추적관리번호'
    ],
    nutritionRequired: true,
    nutritionExample: {
      title: '영양성분표 (200ml당)',
      components: [
        { name: '열량', value: '130kcal', required: true },
        { name: '탄수화물', value: '9.4g', required: true },
        { name: '당류', value: '9.4g', required: true },
        { name: '지방', value: '7.6g', required: true },
        { name: '포화지방', value: '4.8g', required: true },
        { name: '트랜스지방', value: '0g', required: true },
        { name: '콜레스테롤', value: '24mg', required: true },
        { name: '단백질', value: '6.4g', required: true },
        { name: '나트륨', value: '110mg', required: true },
        { name: '칼슘', value: '226mg', required: false }
      ]
    },
    commonStandards: {
      labeling: {
        title: '주표시면 및 정보표시면 구분',
        details: [
          '주표시면: 소비자가 식품을 구매할 때 가장 먼저 보는 면 (앞면, 윗면)',
          '정보표시면: 상세 정보가 표시되는 면 (뒷면, 측면)',
          '표시면적 비율: 주표시면 2/3, 정보표시면 1/3 (스티커 제품은 각각 1/2씩)'
        ]
      },
      fontRequirements: {
        title: '글씨 크기 및 표시방법 기준',
        details: [
          '영양성분 표시: 열량․영양성분 명칭, 함량 및 1일 영양성분 기준치에 대한 비율의 글씨크기는 10포인트 이상',
          '열량 표시: 총 내용량 글씨크기보다 크거나 같아야 하고 굵게(bold) 표시',
          '1일 영양성분 기준치 비율: 영양성분 글씨 및 함량의 글씨크기보다 크거나 같아야 하며, 굵게(bold) 표시',
          '내용량 표시: 중량(g) 또는 용량(ml)으로 표시하고 소수점 첫째자리에서 반올림하여 1g(ml)단위로 표시'
        ]
      },
      nutritionLabel: {
        title: '영양성분 표시서식도안',
        types: [
          '기본형 (총 내용량당, 100g(ml)당, 단위내용량당)',
          '세로형, 가로형, 그래픽형, 텍스트형',
          '병행표기 (단위내용량당과 총내용량/100g 병행)',
          '조리되지 않은 손질된 자연상태 식품-가공식품 구분형'
        ]
      },
      additives: {
        title: '식품첨가물 표시기준',
        categories: [
          '명칭과 용도를 함께 표시: 감미료(사카린나트륨, 아스파탐 등), 착색료(식용색소), 보존료, 산화방지제, 발색제, 향미증진제',
          '명칭 또는 간략명 표시: 가티검, 구아검, 잔탄검, 글리세린, 레시틴 등',
          '명칭, 간략명 또는 주용도 표시: 영양강화제, 효소제, 산도조절제, 유화제 등'
        ]
      }
    },
    additionalNotes: [
      '냉장보관 필수 (4℃ 이하)',
      '유통기한 경과 제품 섭취 금지',
      '개봉 후 빠른 시일 내 섭취',
      '락토오스 불내증 관련 주의사항 (해당시)'
    ]
  },
  '장류': {
    category: '장류',
    required: [
      '제품명',
      '식품의 유형',
      '업소명 및 소재지',
      '제조년월일',
      '유통기한 또는 품질유지기한',
      '내용량',
      '원재료명 및 함량',
      '영양성분',
      '보관방법'
    ],
    nutritionRequired: true,
    nutritionExample: {
      title: '영양성분표 (100g당)',
      components: [
        { name: '열량', value: '180kcal', required: true },
        { name: '탄수화물', value: '20g', required: true },
        { name: '당류', value: '8g', required: true },
        { name: '지방', value: '6g', required: true },
        { name: '포화지방', value: '1g', required: true },
        { name: '트랜스지방', value: '0g', required: true },
        { name: '콜레스테롤', value: '0mg', required: true },
        { name: '단백질', value: '12g', required: true },
        { name: '나트륨', value: '3800mg', required: true }
      ]
    },
    commonStandards: {
      labeling: {
        title: '주표시면 및 정보표시면 구분',
        details: [
          '주표시면: 소비자가 식품을 구매할 때 가장 먼저 보는 면 (앞면, 윗면)',
          '정보표시면: 상세 정보가 표시되는 면 (뒷면, 측면)',
          '표시면적 비율: 주표시면 2/3, 정보표시면 1/3 (스티커 제품은 각각 1/2씩)'
        ]
      },
      fontRequirements: {
        title: '글씨 크기 및 표시방법 기준',
        details: [
          '영양성분 표시: 열량․영양성분 명칭, 함량 및 1일 영양성분 기준치에 대한 비율의 글씨크기는 10포인트 이상',
          '열량 표시: 총 내용량 글씨크기보다 크거나 같아야 하고 굵게(bold) 표시',
          '1일 영양성분 기준치 비율: 영양성분 글씨 및 함량의 글씨크기보다 크거나 같아야 하며, 굵게(bold) 표시',
          '내용량 표시: 중량(g) 또는 용량(ml)으로 표시하고 소수점 첫째자리에서 반올림하여 1g(ml)단위로 표시'
        ]
      },
      nutritionLabel: {
        title: '영양성분 표시서식도안',
        types: [
          '기본형 (총 내용량당, 100g(ml)당, 단위내용량당)',
          '세로형, 가로형, 그래픽형, 텍스트형',
          '병행표기 (단위내용량당과 총내용량/100g 병행)',
          '조리되지 않은 손질된 자연상태 식품-가공식품 구분형'
        ]
      },
      additives: {
        title: '식품첨가물 표시기준',
        categories: [
          '명칭과 용도를 함께 표시: 감미료(사카린나트륨, 아스파탐 등), 착색료(식용색소), 보존료, 산화방지제, 발색제, 향미증진제',
          '명칭 또는 간략명 표시: 가티검, 구아검, 잔탄검, 글리세린, 레시틴 등',
          '명칭, 간략명 또는 주용도 표시: 영양강화제, 효소제, 산도조절제, 유화제 등'
        ]
      }
    },
    additionalNotes: [
      '나트륨 함량이 높으므로 과다섭취 주의문구 필수 표시',
      '개봉 후 냉장보관 권장',
      '전통발효식품 인증마크 표시 (해당시)',
      '원료콩의 원산지 표시'
    ]
  },
  '식초류': {
    category: '조미식품 > 식초류',
    required: [
      '제품명',
      '식품유형',
      '영업소(장)의 명칭(상호) 및 소재지',
      '소비기한 또는 품질유지기한',
      '내용량 및 내용량에 해당하는 열량 (내용량 뒤에 괄호로 표시)',
      '원재료명',
      '영양성분 (희석초산 제외)',
      '용기․포장 재질',
      '품목보고번호',
      '성분명 및 함량 (해당 경우에 한함)',
      '보관방법 (해당 경우에 한함)',
      '주의사항'
    ],
    nutritionRequired: true,
    nutritionExample: {
      title: '영양성분표 (100ml당)',
      components: [
        { name: '열량', value: '15kcal', required: true },
        { name: '탄수화물', value: '3.8g', required: true },
        { name: '당류', value: '0g', required: true },
        { name: '지방', value: '0g', required: true },
        { name: '포화지방', value: '0g', required: true },
        { name: '트랜스지방', value: '0g', required: true },
        { name: '콜레스테롤', value: '0mg', required: true },
        { name: '단백질', value: '0.1g', required: true },
        { name: '나트륨', value: '8mg', required: true }
      ]
    },
    specificRequirements: [
      '초산의 함량을 표시하여야 함',
      '발효식초의 경우 과실·곡물술덧, 과실주, 과실착즙액, 곡물주, 곡물당화액, 주정 또는 주류 등의 원재료명 및 함량을 표시하여야 함',
      '해당 원재료 명칭을 제품명에 사용할 수 있음'
    ],
    commonStandards: {
      labeling: {
        title: '주표시면 및 정보표시면 구분',
        details: [
          '주표시면: 소비자가 식품을 구매할 때 가장 먼저 보는 면 (앞면, 윗면)',
          '정보표시면: 상세 정보가 표시되는 면 (뒷면, 측면)',
          '표시면적 비율: 주표시면 2/3, 정보표시면 1/3 (스티커 제품은 각각 1/2씩)'
        ]
      },
      fontRequirements: {
        title: '글씨 크기 및 표시방법 기준',
        details: [
          '영양성분 표시: 열량․영양성분 명칭, 함량 및 1일 영양성분 기준치에 대한 비율의 글씨크기는 10포인트 이상',
          '열량 표시: 총 내용량 글씨크기보다 크거나 같아야 하고 굵게(bold) 표시',
          '1일 영양성분 기준치 비율: 영양성분 글씨 및 함량의 글씨크기보다 크거나 같아야 하며, 굵게(bold) 표시',
          '내용량 표시: 중량(g) 또는 용량(ml)으로 표시하고 소수점 첫째자리에서 반올림하여 1g(ml)단위로 표시'
        ]
      },
      nutritionLabel: {
        title: '영양성분 표시서식도안',
        types: [
          '기본형 (총 내용량당, 100g(ml)당, 단위내용량당)',
          '세로형, 가로형, 그래픽형, 텍스트형',
          '병행표기 (단위내용량당과 총내용량/100g 병행)',
          '조리되지 않은 손질된 자연상태 식품-가공식품 구분형'
        ]
      },
      additives: {
        title: '식품첨가물 표시기준',
        categories: [
          '명칭과 용도를 함께 표시: 감미료(사카린나트륨, 아스파탐 등), 착색료(식용색소), 보존료, 산화방지제, 발색제, 향미증진제',
          '명칭 또는 간략명 표시: 가티검, 구아검, 잔탄검, 글리세린, 레시틴 등',
          '명칭, 간략명 또는 주용도 표시: 영양강화제, 효소제, 산도조절제, 유화제 등'
        ]
      }
    },
    additionalNotes: [
      '부정․불량식품신고표시 필수',
      '알레르기 유발물질 표시 (해당 경우에 한함)',
      '조사처리식품 표시 (해당 경우에 한함)',
      '유전자변형식품 표시 (해당 경우에 한함)',
      '희석초산의 경우 내용량에 해당하는 열량 표시 제외',
      '희석초산의 경우 영양성분 표시 제외'
    ]
  },
  '소스류': {
    category: '조미식품 > 소스류',
    required: [
      '제품명',
      '식품유형',
      '영업소(장)의 명칭(상호) 및 소재지',
      '소비기한',
      '내용량 및 내용량에 해당하는 열량 (내용량 뒤에 괄호로 표시)',
      '원재료명',
      '영양성분',
      '용기․포장 재질',
      '품목보고번호',
      '성분명 및 함량 (해당 경우에 한함)',
      '보관방법 (해당 경우에 한함)',
      '주의사항'
    ],
    nutritionRequired: true,
    nutritionExample: {
      title: '영양성분표 (100g당)',
      components: [
        { name: '열량', value: '120kcal', required: true },
        { name: '탄수화물', value: '28g', required: true },
        { name: '당류', value: '22g', required: true },
        { name: '지방', value: '0.2g', required: true },
        { name: '포화지방', value: '0.1g', required: true },
        { name: '트랜스지방', value: '0g', required: true },
        { name: '콜레스테롤', value: '0mg', required: true },
        { name: '단백질', value: '1.8g', required: true },
        { name: '나트륨', value: '980mg', required: true }
      ]
    },
    specificRequirements: [
      '살균 또는 멸균공정을 거친 경우 "살균제품" 또는 "멸균제품"으로 구분․표시하여야 함'
    ],
    commonStandards: {
      labeling: {
        title: '주표시면 및 정보표시면 구분',
        details: [
          '주표시면: 소비자가 식품을 구매할 때 가장 먼저 보는 면 (앞면, 윗면)',
          '정보표시면: 상세 정보가 표시되는 면 (뒷면, 측면)',
          '표시면적 비율: 주표시면 2/3, 정보표시면 1/3 (스티커 제품은 각각 1/2씩)'
        ]
      },
      fontRequirements: {
        title: '글씨 크기 및 표시방법 기준',
        details: [
          '영양성분 표시: 열량․영양성분 명칭, 함량 및 1일 영양성분 기준치에 대한 비율의 글씨크기는 10포인트 이상',
          '열량 표시: 총 내용량 글씨크기보다 크거나 같아야 하고 굵게(bold) 표시',
          '1일 영양성분 기준치 비율: 영양성분 글씨 및 함량의 글씨크기보다 크거나 같아야 하며, 굵게(bold) 표시',
          '내용량 표시: 중량(g) 또는 용량(ml)으로 표시하고 소수점 첫째자리에서 반올림하여 1g(ml)단위로 표시'
        ]
      },
      nutritionLabel: {
        title: '영양성분 표시서식도안',
        types: [
          '기본형 (총 내용량당, 100g(ml)당, 단위내용량당)',
          '세로형, 가로형, 그래픽형, 텍스트형',
          '병행표기 (단위내용량당과 총내용량/100g 병행)',
          '조리되지 않은 손질된 자연상태 식품-가공식품 구분형'
        ]
      },
      additives: {
        title: '식품첨가물 표시기준',
        categories: [
          '명칭과 용도를 함께 표시: 감미료(사카린나트륨, 아스파탐 등), 착색료(식용색소), 보존료, 산화방지제, 발색제, 향미증진제',
          '명칭 또는 간략명 표시: 가티검, 구아검, 잔탄검, 글리세린, 레시틴 등',
          '명칭, 간략명 또는 주용도 표시: 영양강화제, 효소제, 산도조절제, 유화제 등'
        ]
      }
    },
    additionalNotes: [
      '부정․불량식품신고표시 필수',
      '알레르기 유발물질 표시 (해당 경우에 한함)',
      '조사처리식품 표시 (해당 경우에 한함)',
      '유전자변형식품 표시 (해당 경우에 한함)',
      '나트륨 함량이 높은 경우 과다섭취 주의문구 표시'
    ]
  },
  '향신료가공품': {
    category: '조미식품 > 향신료가공품',
    required: [
      '제품명',
      '식품유형',
      '영업소(장)의 명칭(상호) 및 소재지',
      '소비기한',
      '내용량 및 내용량에 해당하는 열량 (천연향신료는 열량 표시 제외)',
      '원재료명',
      '영양성분 (천연향신료 제외)',
      '용기․포장 재질',
      '품목보고번호',
      '성분명 및 함량 (해당 경우에 한함)',
      '보관방법 (해당 경우에 한함)',
      '주의사항'
    ],
    nutritionRequired: false,
    specificRequirements: [
      '건조하거나 살균한 제품은 "건조제품" 또는 "살균제품"으로 구분 표시하여야 함',
      '천연향신료의 경우 내용량에 해당하는 열량 표시 제외',
      '천연향신료의 경우 영양성분 표시 제외'
    ],
    commonStandards: {
      labeling: {
        title: '주표시면 및 정보표시면 구분',
        details: [
          '주표시면: 소비자가 식품을 구매할 때 가장 먼저 보는 면 (앞면, 윗면)',
          '정보표시면: 상세 정보가 표시되는 면 (뒷면, 측면)',
          '표시면적 비율: 주표시면 2/3, 정보표시면 1/3 (스티커 제품은 각각 1/2씩)'
        ]
      },
      fontRequirements: {
        title: '글씨 크기 및 표시방법 기준',
        details: [
          '영양성분 표시: 열량․영양성분 명칭, 함량 및 1일 영양성분 기준치에 대한 비율의 글씨크기는 10포인트 이상',
          '열량 표시: 총 내용량 글씨크기보다 크거나 같아야 하고 굵게(bold) 표시',
          '1일 영양성분 기준치 비율: 영양성분 글씨 및 함량의 글씨크기보다 크거나 같아야 하며, 굵게(bold) 표시',
          '내용량 표시: 중량(g) 또는 용량(ml)으로 표시하고 소수점 첫째자리에서 반올림하여 1g(ml)단위로 표시'
        ]
      },
      nutritionLabel: {
        title: '영양성분 표시서식도안',
        types: [
          '기본형 (총 내용량당, 100g(ml)당, 단위내용량당)',
          '세로형, 가로형, 그래픽형, 텍스트형',
          '병행표기 (단위내용량당과 총내용량/100g 병행)',
          '조리되지 않은 손질된 자연상태 식품-가공식품 구분형'
        ]
      },
      additives: {
        title: '식품첨가물 표시기준',
        categories: [
          '명칭과 용도를 함께 표시: 감미료(사카린나트륨, 아스파탐 등), 착색료(식용색소), 보존료, 산화방지제, 발색제, 향미증진제',
          '명칭 또는 간략명 표시: 가티검, 구아검, 잔탄검, 글리세린, 레시틴 등',
          '명칭, 간략명 또는 주용도 표시: 영양강화제, 효소제, 산도조절제, 유화제 등'
        ]
      }
    },
    additionalNotes: [
      '부정․불량식품신고표시 필수',
      '알레르기 유발물질 표시 (해당 경우에 한함)',
      '조사처리식품 표시 (해당 경우에 한함)',
      '유전자변형식품 표시 (해당 경우에 한함)',
      '원산지 표시 권장'
    ]
  },
  '식염': {
    category: '조미식품 > 식염',
    required: [
      '제품명',
      '식품유형',
      '영업소(장)의 명칭(상호) 및 소재지',
      '제조연월일',
      '내용량',
      '원재료명',
      '용기․포장 재질',
      '품목보고번호',
      '성분명 및 함량 (해당 경우에 한함)',
      '보관방법 (해당 경우에 한함)',
      '주의사항'
    ],
    nutritionRequired: false,
    specificRequirements: [
      '식품첨가물을 첨가하여 제조한 가공소금에 있어서는 첨가한 식품첨가물의 명칭과 함량을 표시하여야 함',
      '천일염의 경우 주표시면에 식용임을 표시하여야 함'
    ],
    commonStandards: {
      labeling: {
        title: '주표시면 및 정보표시면 구분',
        details: [
          '주표시면: 소비자가 식품을 구매할 때 가장 먼저 보는 면 (앞면, 윗면)',
          '정보표시면: 상세 정보가 표시되는 면 (뒷면, 측면)',
          '표시면적 비율: 주표시면 2/3, 정보표시면 1/3 (스티커 제품은 각각 1/2씩)'
        ]
      },
      fontRequirements: {
        title: '글씨 크기 및 표시방법 기준',
        details: [
          '영양성분 표시: 열량․영양성분 명칭, 함량 및 1일 영양성분 기준치에 대한 비율의 글씨크기는 10포인트 이상',
          '열량 표시: 총 내용량 글씨크기보다 크거나 같아야 하고 굵게(bold) 표시',
          '1일 영양성분 기준치 비율: 영양성분 글씨 및 함량의 글씨크기보다 크거나 같아야 하며, 굵게(bold) 표시',
          '내용량 표시: 중량(g) 또는 용량(ml)으로 표시하고 소수점 첫째자리에서 반올림하여 1g(ml)단위로 표시'
        ]
      },
      nutritionLabel: {
        title: '영양성분 표시서식도안',
        types: [
          '기본형 (총 내용량당, 100g(ml)당, 단위내용량당)',
          '세로형, 가로형, 그래픽형, 텍스트형',
          '병행표기 (단위내용량당과 총내용량/100g 병행)',
          '조리되지 않은 손질된 자연상태 식품-가공식품 구분형'
        ]
      },
      additives: {
        title: '식품첨가물 표시기준',
        categories: [
          '명칭과 용도를 함께 표시: 감미료(사카린나트륨, 아스파탐 등), 착색료(식용색소), 보존료, 산화방지제, 발색제, 향미증진제',
          '명칭 또는 간략명 표시: 가티검, 구아검, 잔탄검, 글리세린, 레시틴 등',
          '명칭, 간략명 또는 주용도 표시: 영양강화제, 효소제, 산도조절제, 유화제 등'
        ]
      }
    },
    additionalNotes: [
      '부정․불량식품신고표시 필수',
      '조사처리식품 표시 (해당 경우에 한함)',
      '유전자변형식품 표시 (해당 경우에 한함)',
      '영양성분 표시 제외',
      '내용량에 해당하는 열량 표시 제외'
    ]
  }
};

/**
 * 식품등의 표시기준 서비스 페이지
 * 식품 유형별 표시기준을 검색하고 확인할 수 있는 페이지
 */
export default function LabelingStandards() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // 검색어에 따른 식품 유형 필터링
  const filteredFoodTypes = useMemo(() => {
    if (!searchTerm) return [];
    return FOOD_TYPES.filter(type => 
      type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // 식품 유형 선택 핸들러
  const handleSelectType = (type: string) => {
    setSelectedType(type);
    setSearchTerm(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 페이지 제목 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            식품등의 표시기준
          </h1>
          <p className="text-xl text-gray-600">
            식품 유형을 검색하여 해당하는 표시기준을 확인하세요
          </p>
        </div>

        {/* 검색 섹션 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            식품 유형 검색
          </h2>
          
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="식품 유형을 입력하세요 (예: 복합조미식품)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            
            {/* 드롭다운 결과 */}
            {searchTerm && filteredFoodTypes.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
                {filteredFoodTypes.map((type, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectType(type)}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                  >
                    <span className="font-medium text-gray-800">{type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 검색어가 있지만 결과가 없는 경우 */}
          {searchTerm && filteredFoodTypes.length === 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                "{searchTerm}"에 해당하는 식품 유형을 찾을 수 없습니다.
              </p>
            </div>
          )}
        </div>

        {/* 선택된 식품 유형의 표시기준 */}
        {selectedType && LABELING_STANDARDS[selectedType as keyof typeof LABELING_STANDARDS] && (
          <div className="space-y-8">
            {(() => {
              const standards = LABELING_STANDARDS[selectedType as keyof typeof LABELING_STANDARDS];
              
              return (
                <>
                  {/* 식품 분류 정보 */}
                  {standards.category && (
                    <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6 mb-8">
                      <h3 className="text-lg font-bold text-blue-800 mb-2">
                        📂 식품 분류
                      </h3>
                      <p className="text-blue-700 font-medium">{standards.category}</p>
                    </div>
                  )}

                  {/* 필수 표시사항 */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                      📋 {selectedType} 필수 표시사항
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {standards.required.map((item, index) => (
                        <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-white text-sm font-bold">{index + 1}</span>
                          </div>
                          <span className="font-medium text-gray-800 leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 특별 요구사항 */}
                  {standards.specificRequirements && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                      <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        ⭐ {selectedType} 특별 요구사항
                      </h3>
                      <div className="space-y-4">
                        {standards.specificRequirements.map((requirement, index) => (
                          <div key={index} className="flex items-start p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                            <div className="flex-shrink-0 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center mr-3 mt-0.5">
                              <span className="text-white text-sm font-bold">!</span>
                            </div>
                            <p className="text-gray-700 leading-relaxed font-medium">{requirement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 영양성분표 */}
                  {standards.nutritionRequired && standards.nutritionExample && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                      <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        📊 영양성분표 작성 예시
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-4 text-center border-b border-gray-300 pb-2">
                          {standards.nutritionExample.title}
                        </h4>
                        <div className="space-y-2">
                          {standards.nutritionExample.components.map((component, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                              <span className="font-medium text-gray-700">{component.name}</span>
                              <span className="font-bold text-gray-900">{component.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 영양성분 표시 제외 안내 */}
                  {!standards.nutritionRequired && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                      <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        📊 영양성분표 관련 안내
                      </h3>
                      <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-lg font-bold">✓</span>
                          </div>
                          <h4 className="text-lg font-bold text-green-800">영양성분 표시 제외 대상</h4>
                        </div>
                        <p className="text-green-700 leading-relaxed">
                          이 식품 유형은 영양성분 표시가 <strong>면제</strong>됩니다.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 공통 표시기준 */}
                  {standards.commonStandards && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                      <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        📖 공통 표시기준 상세 안내
                      </h3>
                      
                      {/* 표시면 구분 */}
                      <div className="mb-8">
                        <h4 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-bold">1</span>
                          </div>
                          {standards.commonStandards.labeling.title}
                        </h4>
                        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                          {standards.commonStandards.labeling.details.map((detail, index) => (
                            <div key={index} className="flex items-start mb-3 last:mb-0">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 mt-2"></div>
                              <p className="text-gray-700 leading-relaxed">{detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 글씨 크기 및 표시방법 */}
                      <div className="mb-8">
                        <h4 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-bold">2</span>
                          </div>
                          {standards.commonStandards.fontRequirements.title}
                        </h4>
                        <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                          {standards.commonStandards.fontRequirements.details.map((detail, index) => (
                            <div key={index} className="flex items-start mb-3 last:mb-0">
                              <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3 mt-2"></div>
                              <p className="text-gray-700 leading-relaxed">{detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 영양성분 표시서식 */}
                      <div className="mb-8">
                        <h4 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-bold">3</span>
                          </div>
                          {standards.commonStandards.nutritionLabel.title}
                        </h4>
                        <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
                          {standards.commonStandards.nutritionLabel.types.map((type, index) => (
                            <div key={index} className="flex items-start mb-3 last:mb-0">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 mt-2"></div>
                              <p className="text-gray-700 leading-relaxed">{type}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 식품첨가물 표시기준 */}
                      <div className="mb-8">
                        <h4 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-bold">4</span>
                          </div>
                          {standards.commonStandards.additives.title}
                        </h4>
                        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                          {standards.commonStandards.additives.categories.map((category, index) => (
                            <div key={index} className="flex items-start mb-3 last:mb-0">
                              <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 mt-2"></div>
                              <p className="text-gray-700 leading-relaxed">{category}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 추가 주의사항 */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                      ⚠️ 추가 표시 주의사항
                    </h3>
                    <div className="space-y-4">
                      {standards.additionalNotes.map((note, index) => (
                        <div key={index} className="flex items-start p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                          <div className="flex-shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-white text-sm font-bold">{index + 1}</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* 서비스 안내 */}
        {!selectedType && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              🔍 사용 방법
            </h3>
            <div className="space-y-4 text-gray-600">
              <p>1. 위의 검색창에 식품 유형을 입력하세요</p>
              <p>2. 드롭다운에서 원하는 식품 유형을 선택하세요</p>
              <p>3. 해당 식품의 표시기준과 영양성분표 예시를 확인하세요</p>
            </div>
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">
                💡 팁: "복합조미식품"을 검색해보세요!
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}