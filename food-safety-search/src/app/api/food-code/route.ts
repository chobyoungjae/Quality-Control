import { NextRequest, NextResponse } from 'next/server';
import { integrateSearchResults } from '@/lib/food-codex-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q');
    
    if (!searchQuery) {
      return NextResponse.json(
        { error: '검색어가 필요합니다.' },
        { status: 400 }
      );
    }

    // 식품공전 API 설정
    const API_KEY = '689a583b18ee4d40b6e3';
    const SERVICE_ID = 'I0930';
    const DATA_TYPE = 'json';
    const START_IDX = 1;
    const END_IDX = 10;
    
    // 식품공전 API 호출
    const apiUrl = `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/${SERVICE_ID}/${DATA_TYPE}/${START_IDX}/${END_IDX}/PRDLST_NM=${encodeURIComponent(searchQuery)}`;
    
    console.log('API 호출 URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    console.log('API 응답:', data);
    
    // API 응답 구조 확인 및 데이터 추출
    const apiResults = data[SERVICE_ID]?.row || [];
    
    // 식품공전 조항과 API 결과를 통합
    const integratedResults = integrateSearchResults(apiResults, searchQuery);
    
    if (integratedResults.hasCodexContent || apiResults.length > 0) {
      return NextResponse.json({
        success: true,
        data: apiResults,
        codexSections: integratedResults.codexSections,
        hasCodexContent: integratedResults.hasCodexContent
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '검색 결과가 없습니다.',
        data: [],
        codexSections: []
      });
    }
    
  } catch (error) {
    console.error('식품공전 API 호출 오류:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'API 호출 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}