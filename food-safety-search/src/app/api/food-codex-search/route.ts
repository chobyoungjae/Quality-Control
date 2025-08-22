// src/app/api/food-codex-search/route.ts
// Supabase에서 식품공전 데이터 검색

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ 
        error: '검색어가 필요합니다',
        data: [],
        total: 0 
      }, { status: 400 });
    }

    console.log(`🔍 식품공전 검색: "${query}"`);

    // Supabase에서 검색 (제목과 내용에서 검색)
    const { data, error } = await supabase
      .from('food_codex_sections')
      .select(`
        id,
        title,
        content,
        category,
        file_source,
        character_count,
        section_number
      `)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('section_number', { ascending: true })
      .limit(50);

    if (error) {
      console.error('❌ Supabase 검색 오류:', error);
      return NextResponse.json({ 
        error: 'Supabase 검색 중 오류가 발생했습니다',
        data: [],
        total: 0 
      }, { status: 500 });
    }

    // 검색 결과 포맷팅
    const formattedData = data?.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      category: item.category,
      source: item.file_source,
      characterCount: item.character_count,
      sectionNumber: item.section_number
    })) || [];

    console.log(`✅ 검색 완료: ${formattedData.length}개 결과`);

    return NextResponse.json({
      data: formattedData,
      total: formattedData.length,
      query: query,
      message: `"${query}"에 대한 ${formattedData.length}개 결과를 찾았습니다.`
    });

  } catch (error) {
    console.error('💥 API 처리 오류:', error);
    return NextResponse.json({ 
      error: '서버 오류가 발생했습니다',
      data: [],
      total: 0 
    }, { status: 500 });
  }
}

// 키워드 자동완성용 API
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('autocomplete');
    
    if (!query || query.length < 1) {
      return NextResponse.json({ suggestions: [] });
    }

    // 새로운 키워드 테이블에서 자동완성 검색
    const { data, error } = await supabase
      .from('search_keywords')
      .select('keyword')
      .ilike('keyword', `%${query}%`)
      .order('search_count', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ 자동완성 검색 오류:', error);
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = data?.map(item => item.keyword) || [];

    return NextResponse.json({ 
      suggestions: suggestions.slice(0, 8) // 최대 8개
    });

  } catch (error) {
    console.error('💥 자동완성 API 오류:', error);
    return NextResponse.json({ suggestions: [] });
  }
}