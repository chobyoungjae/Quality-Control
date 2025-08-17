'use client';

import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FOOD_CATEGORIES, UnifiedSearchResult, UnifiedSearchConditions } from '@/types/food-types';
import { searchUnifiedData, getPopularTermsByCategory, getFilterOptions } from '@/lib/unified-api';
import DataVisualization from '@/components/DataVisualization';

/**
 * 카테고리별 검색 페이지 컴포넌트
 */
export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  // 카테고리 정보 찾기
  const category = FOOD_CATEGORIES.find(cat => cat.id === categoryId);

  // 상태 관리
  const [searchResult, setSearchResult] = useState<UnifiedSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [selectedAPI, setSelectedAPI] = useState('');

  // 검색 실행
  const handleSearch = useCallback(async (conditions?: Partial<UnifiedSearchConditions>) => {
    if (!selectedAPI || !category) return;

    setIsLoading(true);
    setError(null);

    try {
      const searchConditions: UnifiedSearchConditions = {
        apiId: selectedAPI,
        category: categoryId,
        searchTerm: conditions?.searchTerm || searchTerm,
        filters: conditions?.filters || selectedFilters,
        page_no: conditions?.page_no || 1,
        num_of_rows: 20,
      };

      const result = await searchUnifiedData(searchConditions);
      setSearchResult(result);
    } catch (err) {
      console.error('검색 중 오류 발생:', err);
      setError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.');
      setSearchResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, selectedAPI, searchTerm, selectedFilters, category]);

  // 페이지 변경
  const handlePageChange = useCallback(async (page: number) => {
    await handleSearch({ page_no: page });
  }, [handleSearch]);

  // 필터 변경
  const handleFilterChange = useCallback((filterKey: string, value: string) => {
    const newFilters = { ...selectedFilters };
    if (value) {
      newFilters[filterKey] = value;
    } else {
      delete newFilters[filterKey];
    }
    setSelectedFilters(newFilters);
  }, [selectedFilters]);

  // 첫 번째 API를 기본 선택
  useEffect(() => {
    if (category && category.apis.length > 0 && !selectedAPI) {
      setSelectedAPI(category.apis[0].id);
    }
  }, [category, selectedAPI]);

  // 인기 검색어 (항상 실행)
  const popularTerms = category ? getPopularTermsByCategory(categoryId) : [];
  const filterOptions = (selectedAPI && category) ? getFilterOptions(categoryId, selectedAPI) : {};

  // 카테고리가 없으면 404
  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">카테고리를 찾을 수 없습니다</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 페이지 헤더 */}
      <section className="bg-gradient-to-r from-blue-50 to-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{category.icon}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {category.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  {category.description}
                </p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>{category.apis.length}개 서비스</div>
              <div>실시간 데이터</div>
            </div>
          </div>
        </div>
      </section>

      {/* 메인 컨텐츠 */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* API 선택 */}
        {category.apis.length > 1 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">서비스 선택</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.apis.map((api) => (
                <button
                  key={api.id}
                  onClick={() => setSelectedAPI(api.id)}
                  className={`p-4 rounded-lg border text-left transition-colors ${
                    selectedAPI === api.id
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h4 className="font-medium mb-1">{api.name}</h4>
                  <p className="text-sm text-gray-600">{api.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 검색 폼 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">검색</h3>
          
          {/* 검색어 입력 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              검색어
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`${category.name} 정보를 검색하세요...`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={() => handleSearch()}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '검색 중...' : '검색'}
              </button>
            </div>
          </div>

          {/* 필터 */}
          {Object.entries(filterOptions).map(([filterKey, options]) => (
            <div key={filterKey} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {filterKey === 'GROUP_NAME' ? '식품군' :
                 filterKey === 'GRADE_DIV_NM' ? '위생등급' :
                 filterKey === 'SANITTN_BIZCOND_NM' ? '업태구분' :
                 filterKey === 'ORIGIN_NM' ? '원산지' : filterKey}
              </label>
              <select
                value={selectedFilters[filterKey] || ''}
                onChange={(e) => handleFilterChange(filterKey, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">전체</option>
                {options.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* 인기 검색어 */}
          {popularTerms.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">인기 검색어</h4>
              <div className="flex flex-wrap gap-2">
                {popularTerms.map(term => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchTerm(term);
                      handleSearch({ searchTerm: term });
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">⚠️</div>
              <div>
                <h3 className="text-red-800 font-medium">오류가 발생했습니다</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 검색 결과 */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">검색 중...</p>
          </div>
        ) : searchResult ? (
          <div className="space-y-8">
            {/* 데이터 시각화 */}
            <DataVisualization result={searchResult} category={categoryId} />
            
            {/* 검색 결과 테이블 */}
            <SearchResultsDisplay
              result={searchResult}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <div className="text-6xl mb-4">{category.icon}</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {category.name} 검색을 시작하세요
            </h3>
            <p className="text-gray-500">
              검색어를 입력하거나 인기 검색어를 클릭해보세요
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * 검색 결과 표시 컴포넌트
 */
interface SearchResultsDisplayProps {
  result: UnifiedSearchResult;
  onPageChange: (page: number) => void;
}

function SearchResultsDisplay({ result, onPageChange }: SearchResultsDisplayProps) {
  if (result.data.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <div className="text-6xl mb-4">😞</div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          검색 결과가 없습니다
        </h3>
        <p className="text-gray-500">
          다른 검색어로 다시 시도해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 검색 결과 요약 */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">검색 결과</h3>
        <p className="text-blue-700">
          총 <span className="font-bold">{result.totalCount.toLocaleString()}</span>개의 결과 중{' '}
          <span className="font-bold">{result.currentPage}</span>페이지{' '}
          ({((result.currentPage - 1) * 20 + 1).toLocaleString()} - {' '}
          {Math.min(result.currentPage * 20, result.totalCount).toLocaleString()}번째)
        </p>
      </div>

      {/* 데이터 테이블 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(result.data[0] || {}).slice(0, 6).map((key) => (
                  <th
                    key={key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {getFieldDisplayName(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {result.data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {Object.entries(item).slice(0, 6).map(([key, value]) => (
                    <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {String(value || '-')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이지네이션 */}
      {result.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => onPageChange(result.currentPage - 1)}
            disabled={result.currentPage === 1}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            이전
          </button>
          
          {Array.from({ length: Math.min(5, result.totalPages) }, (_, i) => {
            const page = Math.max(1, result.currentPage - 2) + i;
            if (page > result.totalPages) return null;
            
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 text-sm border rounded-lg ${
                  page === result.currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={() => onPageChange(result.currentPage + 1)}
            disabled={result.currentPage === result.totalPages}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * 필드명을 한글로 변환
 */
function getFieldDisplayName(key: string): string {
  const fieldNames: Record<string, string> = {
    // 공통
    NUM: '순번',
    
    // 영양성분
    DESC_KOR: '식품명',
    GROUP_NAME: '식품군',
    NUTR_CONT1: '에너지(kcal)',
    NUTR_CONT2: '단백질(g)',
    NUTR_CONT3: '지방(g)',
    NUTR_CONT4: '탄수화물(g)',
    
    // 업체정보
    CMPNY_NM: '업체명',
    SITE_ADDR: '소재지',
    INDUTY_NM: '업종명',
    PRDUCT: '제품',
    
    // 식품첨가물
    PRDLST_NM: '품목명',
    ENTRPS: '업체명',
    
    // 회수/판매중단
    TAKE_STEP: '조치사항',
    VLTCRN: '위반내용',
    
    // 음식점
    BIZPLC_NM: '업소명',
    SANITTN_BIZCOND_NM: '업태구분',
    REFINE_ROADNM_ADDR: '도로명주소',
    GRADE_DIV_NM: '위생등급',
    
    // 수입식품
    EXPORTER: '수출업체',
    ORIGIN_NM: '원산지',
  };

  return fieldNames[key] || key;
}