'use client';

import { useState } from 'react';
import { FoodNutrient, SearchResult } from '@/types/food-safety';
import NoResultsMessage from './NoResultsMessage';

interface SearchResultsProps {
  searchResult: SearchResult | null;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  searchTerm?: string;
  selectedGroup?: string;
  selectedYear?: string;
}

/**
 * 영양성분 상세 정보 표시 컴포넌트
 */
function NutrientDetails({ food }: { food: FoodNutrient }) {
  const nutrients = [
    { label: '에너지', value: food.NUTR_CONT1, unit: 'kcal' },
    { label: '단백질', value: food.NUTR_CONT2, unit: 'g' },
    { label: '지방', value: food.NUTR_CONT3, unit: 'g' },
    { label: '탄수화물', value: food.NUTR_CONT4, unit: 'g' },
    { label: '당류', value: food.NUTR_CONT5, unit: 'g' },
    { label: '나트륨', value: food.NUTR_CONT6, unit: 'mg' },
    { label: '콜레스테롤', value: food.NUTR_CONT7, unit: 'mg' },
    { label: '포화지방산', value: food.NUTR_CONT8, unit: 'g' },
    { label: '트랜스지방산', value: food.NUTR_CONT9, unit: 'g' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 p-4 bg-gray-50 rounded-lg">
      {nutrients.map(({ label, value, unit }) => (
        <div key={label} className="text-center">
          <div className="text-xs text-gray-600 mb-1">{label}</div>
          <div className="text-sm font-semibold text-gray-800">
            {value || '0'} {unit}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 개별 식품 카드 컴포넌트
 */
function FoodCard({ food }: { food: FoodNutrient }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* 기본 정보 */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {food.DESC_KOR}
          </h3>
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {food.GROUP_NAME}
            </span>
            {food.RESEARCH_YEAR && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                {food.RESEARCH_YEAR}년
              </span>
            )}
          </div>
        </div>
        
        {/* 주요 영양소 미리보기 */}
        <div className="text-right">
          <div className="text-sm text-gray-600">에너지</div>
          <div className="text-lg font-bold text-orange-600">
            {food.NUTR_CONT1 || '0'} kcal
          </div>
        </div>
      </div>

      {/* 추가 정보 */}
      {(food.MAKER_NAME || food.SERVING_SIZE || food.SAMPLING_REGION_NAME) && (
        <div className="text-sm text-gray-600 mb-3 space-y-1">
          {food.MAKER_NAME && (
            <div>제조사: {food.MAKER_NAME}</div>
          )}
          {food.SERVING_SIZE && (
            <div>1회 제공량: {food.SERVING_SIZE}</div>
          )}
          {food.SAMPLING_REGION_NAME && (
            <div>지역: {food.SAMPLING_REGION_NAME}</div>
          )}
        </div>
      )}

      {/* 상세 영양정보 토글 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        {isExpanded ? '영양정보 접기' : '영양정보 펼치기'}
      </button>

      {/* 상세 영양정보 */}
      {isExpanded && <NutrientDetails food={food} />}
    </div>
  );
}

/**
 * 페이지네이션 컴포넌트
 */
function Pagination({ searchResult, onPageChange }: { 
  searchResult: SearchResult; 
  onPageChange: (page: number) => void;
}) {
  const { currentPage, totalPages } = searchResult;
  
  // 페이지 번호 목록 생성 (현재 페이지 주변 5개)
  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      {/* 이전 페이지 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        이전
      </button>

      {/* 첫 페이지 */}
      {currentPage > 3 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            1
          </button>
          {currentPage > 4 && <span className="text-gray-500">...</span>}
        </>
      )}

      {/* 페이지 번호들 */}
      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      {/* 마지막 페이지 */}
      {currentPage < totalPages - 2 && (
        <>
          {currentPage < totalPages - 3 && <span className="text-gray-500">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 다음 페이지 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        다음
      </button>
    </div>
  );
}

/**
 * 검색 결과 표시 컴포넌트
 */
export default function SearchResults({ 
  searchResult, 
  isLoading, 
  onPageChange, 
  searchTerm, 
  selectedGroup, 
  selectedYear 
}: SearchResultsProps) {
  // 로딩 상태
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">검색 중...</p>
        </div>
      </div>
    );
  }

  // 검색 결과 없음
  if (!searchResult) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            검색어를 입력해주세요
          </h3>
          <p className="text-gray-500">
            식품명, 식품군, 조사년도로 검색할 수 있습니다
          </p>
        </div>
      </div>
    );
  }

  // 결과가 없는 경우
  if (searchResult.data.length === 0) {
    return (
      <NoResultsMessage 
        searchTerm={searchTerm}
        selectedGroup={selectedGroup}
        selectedYear={selectedYear}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* 검색 결과 요약 */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">
          검색 결과
        </h2>
        <p className="text-blue-700">
          총 <span className="font-bold">{searchResult.totalCount.toLocaleString()}</span>개의 결과 중{' '}
          <span className="font-bold">{searchResult.currentPage}</span>페이지{' '}
          ({((searchResult.currentPage - 1) * 20 + 1).toLocaleString()} - {' '}
          {Math.min(searchResult.currentPage * 20, searchResult.totalCount).toLocaleString()}번째)
        </p>
      </div>

      {/* 검색 결과 목록 */}
      <div className="space-y-4 mb-8">
        {searchResult.data.map((food, index) => (
          <FoodCard key={`${food.FOOD_CD}-${index}`} food={food} />
        ))}
      </div>

      {/* 페이지네이션 */}
      <Pagination searchResult={searchResult} onPageChange={onPageChange} />
    </div>
  );
}