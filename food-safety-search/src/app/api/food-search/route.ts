import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 요청 파라미터 추출
    const apiId = searchParams.get('apiId');
    const startIdx = searchParams.get('startIdx') || '1';
    const endIdx = searchParams.get('endIdx') || '20';
    
    // API 기본 설정 - 식품안전나라 API 사용
    const API_BASE_URL = 'https://openapi.foodsafetykorea.go.kr/api';
    const API_KEY = process.env.NEXT_PUBLIC_FOOD_SAFETY_API_KEY;
    
    // API 키가 없거나 샘플인 경우 임시 데모 데이터 반환
    if (!API_KEY || API_KEY === 'sample') {
      return getDemoData(apiId!, searchParams);
    }
    
    if (!apiId) {
      return NextResponse.json(
        { error: 'API ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // API URL 구성 - 식품안전나라 API 형식
    let url = `${API_BASE_URL}/${API_KEY}/${apiId}/json/${startIdx}/${endIdx}`;
    
    // 추가 검색 파라미터들 - 쿼리 파라미터로 추가
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (!['apiId', 'startIdx', 'endIdx'].includes(key) && value) {
        params.append(key, value);
      }
    });
    
    const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;
    
    console.log('프록시 API 호출:', fullUrl);
    
    // 외부 API 호출
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Food-Safety-Search/1.0'
      },
    });
    
    if (!response.ok) {
      console.error('API 응답 오류:', response.status, response.statusText);
      return NextResponse.json(
        { error: `API 호출 실패: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('API 응답 성공:', Object.keys(data));
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('프록시 API 에러:', error);
    
    // API 연결 실패 시 데모 데이터 반환
    const { searchParams } = new URL(request.url);
    const apiId = searchParams.get('apiId');
    if (apiId) {
      console.log('API 연결 실패, 데모 데이터로 대체');
      return getDemoData(apiId, searchParams);
    }
    
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 데모 데이터 생성 함수
function getDemoData(apiId: string, searchParams: URLSearchParams) {
  const searchTerm = searchParams.get('DESC_KOR') || searchParams.get('CMPNY_NM') || searchParams.get('PRDLST_NM') || searchParams.get('BIZPLC_NM') || '';
  
  const demoDataSets: Record<string, any> = {
    'I2790': { // 식품영양성분
      I2790: {
        RESULT: { CODE: 'INFO-000', MSG: '정상 처리되었습니다.' },
        total_count: '150',
        row: [
          {
            NUM: 1,
            DESC_KOR: '쌀(백미)',
            GROUP_NAME: '곡류',
            NUTR_CONT1: '365',
            NUTR_CONT2: '6.8',
            NUTR_CONT3: '0.6',
            NUTR_CONT4: '80.0',
            RESEARCH_YEAR: '2024'
          },
          {
            NUM: 2,
            DESC_KOR: '현미',
            GROUP_NAME: '곡류',
            NUTR_CONT1: '363',
            NUTR_CONT2: '7.4',
            NUTR_CONT3: '2.7',
            NUTR_CONT4: '73.1',
            RESEARCH_YEAR: '2024'
          },
          {
            NUM: 3,
            DESC_KOR: '찹쌀',
            GROUP_NAME: '곡류',
            NUTR_CONT1: '348',
            NUTR_CONT2: '6.2',
            NUTR_CONT3: '0.8',
            NUTR_CONT4: '77.8',
            RESEARCH_YEAR: '2024'
          }
        ]
      }
    },
    'I0490': { // 식품제조업체
      I0490: {
        RESULT: { CODE: 'INFO-000', MSG: '정상 처리되었습니다.' },
        total_count: '85',
        row: [
          {
            NUM: 1,
            CMPNY_NM: '롯데제과(주)',
            SITE_ADDR: '서울특별시 영등포구',
            INDUTY_NM: '과자류제조업',
            PRDUCT: '초콜릿, 캔디류'
          },
          {
            NUM: 2,
            CMPNY_NM: '농심(주)',
            SITE_ADDR: '서울특별시 동작구',
            INDUTY_NM: '면류제조업',
            PRDUCT: '라면, 스낵류'
          }
        ]
      }
    },
    'C005': { // 식품첨가물
      C005: {
        RESULT: { CODE: 'INFO-000', MSG: '정상 처리되었습니다.' },
        total_count: '45',
        row: [
          {
            NUM: 1,
            PRDLST_NM: '아스파탐',
            ENTRPS: '(주)식품첨가물',
            PRDUCT: '인공감미료'
          },
          {
            NUM: 2,
            PRDLST_NM: '구연산',
            ENTRPS: '한국첨가물(주)',
            PRDUCT: '산미료'
          }
        ]
      }
    },
    'I0261': { // 회수/판매중단
      I0261: {
        RESULT: { CODE: 'INFO-000', MSG: '정상 처리되었습니다.' },
        total_count: '12',
        row: [
          {
            NUM: 1,
            PRDLST_NM: '닭고기 가공품',
            ENTRPS: '(주)육류가공',
            TAKE_STEP: '회수조치',
            VLTCRN: '살모넬라 검출'
          }
        ]
      }
    },
    'I2570': { // 음식점정보
      I2570: {
        RESULT: { CODE: 'INFO-000', MSG: '정상 처리되었습니다.' },
        total_count: '234',
        row: [
          {
            NUM: 1,
            BIZPLC_NM: '맛있는 한식당',
            SANITTN_BIZCOND_NM: '일반음식점',
            REFINE_ROADNM_ADDR: '서울특별시 강남구 테헤란로 123',
            GRADE_DIV_NM: '매우우수'
          },
          {
            NUM: 2,
            BIZPLC_NM: '깔끔한 카페',
            SANITTN_BIZCOND_NM: '카페',
            REFINE_ROADNM_ADDR: '서울특별시 서초구 서초대로 456',
            GRADE_DIV_NM: '우수'
          }
        ]
      }
    },
    'I1250': { // 수입식품
      I1250: {
        RESULT: { CODE: 'INFO-000', MSG: '정상 처리되었습니다.' },
        total_count: '67',
        row: [
          {
            NUM: 1,
            PRDLST_NM: '수입 바나나',
            EXPORTER: 'Global Foods Co.',
            ORIGIN_NM: '필리핀',
            VLTCRN: '잔류농약 기준초과'
          },
          {
            NUM: 2,
            PRDLST_NM: '수입 견과류',
            EXPORTER: 'Nuts Export Ltd.',
            ORIGIN_NM: '미국',
            VLTCRN: '곰팡이독소 검출'
          }
        ]
      }
    }
  };

  const demoData = demoDataSets[apiId];
  if (!demoData) {
    return NextResponse.json(
      { error: '지원하지 않는 API입니다.' },
      { status: 400 }
    );
  }

  console.log('데모 데이터 반환:', apiId, '검색어:', searchTerm);
  return NextResponse.json(demoData);
}