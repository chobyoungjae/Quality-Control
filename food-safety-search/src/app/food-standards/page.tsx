'use client';

import { useState, useMemo, useEffect } from 'react';
import { formatFoodCodexText, formatFoodCodexStructured, formatSpecValue, formatDate } from '@/lib/text-formatter';

interface FoodStandardsItem {
  PRDLST_NM?: string;
  T_KOR_NM?: string;
  FNPRT_ITM_NM?: string;
  SPEC_VAL?: string;
  UNIT_NM?: string;
  SPEC_VAL_SUMUP?: string;
  VALD_BEGN_DT?: string;
  VALD_END_DT?: string;
  MXMM_VAL?: string;
  MIMM_VAL?: string;
}

interface CodexSection {
  title: string;
  content: string;
}

/**
 * 식품공전 규격기준 검색 페이지
 * 식품공전에서 제공하는 공식 규격기준 정보를 검색하는 전용 페이지
 */
export default function FoodStandardsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<FoodStandardsItem[]>([]);
  const [codexSections, setCodexSections] = useState<CodexSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Supabase에서 키워드 자동완성 가져오기
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchTerm.trim() || searchTerm.length < 1) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`/api/food-codex-search?autocomplete=${encodeURIComponent(searchTerm)}`, {
          method: 'POST'
        });
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } catch (err) {
        console.error('자동완성 오류:', err);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // 식품 유형 선택 핸들러
  const handleSelectType = (type: string) => {
    setSearchTerm(type);
    setShowDropdown(false);
  };

  // 식품공전 규격기준 검색 함수
  const handleSearch = async () => {
    const trimmedSearchTerm = searchTerm.trim();
    if (!trimmedSearchTerm) {
      setError('검색어를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);
    setCodexSections([]);

    try {
      // 1. Supabase에서 식품공전 조항 검색
      const supabaseResponse = await fetch(`/api/food-codex-search?q=${encodeURIComponent(trimmedSearchTerm)}`);
      const supabaseData = await supabaseResponse.json();

      // 2. 공공API에서 세부 규격 데이터 검색
      const publicApiResponse = await fetch(`/api/food-code?q=${encodeURIComponent(trimmedSearchTerm)}`);
      const publicApiData = await publicApiResponse.json();

      // 3. 결과 처리
      let hasResults = false;

      // Supabase 결과 처리 (식품공전 조항)
      if (supabaseData.data && supabaseData.data.length > 0) {
        const formattedSections = supabaseData.data.map((item: any) => ({
          title: item.title,
          content: item.content
        }));
        setCodexSections(formattedSections);
        hasResults = true;
      }

      // 공공API 결과 처리 (세부 규격 데이터)
      if (publicApiResponse.ok && publicApiData.success && publicApiData.data && publicApiData.data.length > 0) {
        setResults(publicApiData.data);
        hasResults = true;
      }

      if (!hasResults) {
        setError('검색 결과를 찾을 수 없습니다. 다른 검색어를 시도해보세요.');
      }
    } catch (err) {
      console.error('식품공전 API 검색 오류:', err);
      setError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* 헤더 섹션 */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            🔍 식품공전 규격기준 검색
          </h1>
          <p className="text-xl text-orange-100">
            식품공전에서 제공하는 공식 규격기준 정보를 검색하고 확인하세요
          </p>
        </div>
      </section>

      {/* 메인 컨텐츠 */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* 검색 섹션 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            품목명 검색
          </h2>
          <p className="text-gray-600 mb-6">
            검색하고자 하는 식품의 품목명을 입력하세요. 식품공전의 공식 규격기준 정보를 찾아드립니다.
          </p>
          
          <div className="relative mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                  }}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => {
                    // 약간의 지연을 주어 클릭 이벤트가 먼저 처리되도록 함
                    setTimeout(() => setShowDropdown(false), 200);
                  }}
                  placeholder="품목명이나 식품 유형을 입력하세요 (예: 라면, 우유, 김치, 소)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                />
                
                {/* 드롭다운 결과 (Supabase 기반) */}
                {showDropdown && searchTerm && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectType(suggestion)}
                        className="w-full px-4 py-3 text-left hover:bg-orange-50 focus:bg-orange-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                      >
                        <span className="font-medium text-gray-800">{suggestion}</span>
                      </button>
                    ))}
                    {suggestions.length >= 8 && (
                      <div className="px-4 py-2 text-center text-sm text-gray-500 bg-gray-50">
                        더 많은 결과가 있습니다
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium min-w-[120px]"
              >
                {isLoading ? '검색중...' : '검색'}
              </button>
            </div>
          </div>

          {/* 검색 예시 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-2">💡 검색 팁:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 정확한 품목명으로 검색하면 더 정확한 결과를 얻을 수 있습니다</li>
              <li>• 식품 유형을 입력하면 자동완성 목록이 나타납니다 (예: "소", "우유" 입력 시)</li>
              <li>• 예시: "즉석라면", "우유", "김치", "식빵", "두부", "치즈", "소시지" 등</li>
              <li>• 검색 결과에는 해당 식품의 기준규격 정보가 표시됩니다</li>
            </ul>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* 검색 결과 */}
        {results.length > 0 && (
          <div className="space-y-8">
            {/* 식품공전 조항 표시 */}
            {codexSections.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  📖 식품공전 조항
                </h3>
                <div className="space-y-6">
                  {codexSections.map((section, index) => (
                    <div key={index} className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <h4 className="text-xl font-bold text-blue-800 mb-4">{section.title}</h4>
                      <div className="text-gray-800 whitespace-pre-line leading-relaxed text-sm md:text-base">
                        {section.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 세부 규격 데이터 - 표 형식 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                📊 세부 규격 데이터
                <span className="text-lg font-normal text-gray-600 ml-2">
                  ({results.length}건)
                </span>
              </h3>
              
              {/* 품목명별로 그룹화 */}
              {(() => {
                const groupedResults = results.reduce((acc: any, item) => {
                  const productName = item.PRDLST_NM || '품목명 없음';
                  if (!acc[productName]) {
                    acc[productName] = [];
                  }
                  acc[productName].push(item);
                  return acc;
                }, {});

                return Object.entries(groupedResults).map(([productName, items]: [string, any[]]) => (
                  <div key={productName} className="mb-8">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-orange-200">
                      {productName}
                    </h4>
                    
                    {/* 테이블 */}
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 rounded-lg text-sm">
                        <thead>
                          <tr className="bg-orange-50">
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 min-w-[120px]">
                              시험항목
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 min-w-[100px]">
                              세부항목
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 min-w-[150px]">
                              기준규격값
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 min-w-[60px]">
                              단위
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 min-w-[130px]">
                              유효기간
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 min-w-[200px]">
                              규격값 요약
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-3 py-2 text-gray-800 font-medium">
                                {item.T_KOR_NM || '-'}
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-gray-800">
                                {item.FNPRT_ITM_NM || '-'}
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-gray-800 font-semibold">
                                <div className="whitespace-pre-wrap break-words">
                                  {item.SPEC_VAL ? formatSpecValue(item.SPEC_VAL) : '-'}
                                </div>
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-gray-800">
                                {item.UNIT_NM || '-'}
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-gray-800 text-xs whitespace-nowrap">
                                <div className="space-y-1">
                                  {item.VALD_BEGN_DT && (
                                    <div className="whitespace-nowrap">시작: {formatDate(item.VALD_BEGN_DT)}</div>
                                  )}
                                  {item.VALD_END_DT && item.VALD_END_DT !== '99991231' && (
                                    <div className="whitespace-nowrap">종료: {formatDate(item.VALD_END_DT)}</div>
                                  )}
                                  {item.VALD_END_DT === '99991231' && (
                                    <div className="text-green-600 font-medium whitespace-nowrap">유효</div>
                                  )}
                                </div>
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-gray-700">
                                {item.SPEC_VAL_SUMUP ? (
                                  <div className="text-xs bg-blue-50 p-2 rounded border-l-2 border-blue-400">
                                    <div className="whitespace-pre-line break-words leading-relaxed">
                                      {item.SPEC_VAL_SUMUP}
                                    </div>
                                  </div>
                                ) : (
                                  '-'
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}

        {/* 검색 결과가 없을 때 */}
        {!isLoading && searchTerm && results.length === 0 && !error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 text-lg">
              "{searchTerm}"에 대한 검색 결과가 없습니다.
            </p>
            <p className="text-yellow-600 mt-2">
              다른 검색어로 시도해보세요.
            </p>
          </div>
        )}

        {/* 안내 정보 */}
        {!searchTerm && !isLoading && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              🏛️ 식품공전이란?
            </h3>
            <div className="space-y-4 text-gray-600">
              <p>
                식품공전은 식품의약품안전처에서 발간하는 식품 관련 법령집으로, 
                식품의 기준 및 규격을 정의하는 공식 문서입니다.
              </p>
              <p>
                이 검색 서비스를 통해 다음과 같은 정보를 확인할 수 있습니다:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>식품별 기준규격 정보</li>
                <li>시험 항목 및 방법</li>
                <li>허용 기준치 및 단위</li>
                <li>관련 조항 및 세부 내용</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}