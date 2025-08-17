'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { SearchConditions, FOOD_GROUPS, FoodGroup } from '@/types/food-safety';
import { searchFoodNames, getPopularSearchTerms } from '@/lib/api';

interface SearchFormProps {
  onSearch: (conditions: SearchConditions) => void;
  isLoading?: boolean;
}

/**
 * 식품 검색 폼 컴포넌트
 * 사용자가 식품명, 식품군, 조사년도로 검색할 수 있는 폼을 제공
 */
export default function SearchForm({ onSearch, isLoading = false }: SearchFormProps) {
  // 검색 조건 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<FoodGroup | ''>('');
  const [selectedYear, setSelectedYear] = useState('');
  
  // 자동완성 관련 상태
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  
  // 인기 검색어 상태
  const [popularTerms] = useState(getPopularSearchTerms());
  
  // 참조
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 제안 선택 처리
  const selectSuggestion = useCallback((suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    searchInputRef.current?.focus();
  }, []);

  // 검색 실행
  const handleSearch = useCallback(() => {
    const conditions: SearchConditions = {};
    
    if (searchTerm.trim()) {
      conditions.desc_kor = searchTerm.trim();
    }
    if (selectedGroup) {
      conditions.group_name = selectedGroup;
    }
    if (selectedYear) {
      conditions.research_year = selectedYear;
    }

    onSearch(conditions);
    setShowSuggestions(false);
  }, [searchTerm, selectedGroup, selectedYear, onSearch]);

  // 검색어 자동완성 처리
  const handleSearchTermChange = useCallback(async (value: string) => {
    setSearchTerm(value);
    setActiveSuggestionIndex(-1);

    if (value.length >= 2) {
      try {
        const results = await searchFoodNames(value);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('자동완성 검색 중 오류:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  // 키보드 네비게이션 처리
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0) {
          selectSuggestion(suggestions[activeSuggestionIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
    }
  }, [showSuggestions, suggestions, activeSuggestionIndex, selectSuggestion, handleSearch]);

  // 폼 제출 처리
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  }, [handleSearch]);

  // 인기 검색어 클릭 처리
  const handlePopularTermClick = useCallback((term: string) => {
    setSearchTerm(term);
    handleSearchTermChange(term);
  }, [handleSearchTermChange]);

  // 검색 조건 초기화
  const handleReset = useCallback(() => {
    setSearchTerm('');
    setSelectedGroup('');
    setSelectedYear('');
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  }, []);

  // 외부 클릭 시 자동완성 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        식품 영양성분 검색
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 검색어 입력 */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            식품명
          </label>
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchTermChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="검색할 식품명을 입력하세요 (예: 쌀, 닭고기)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            disabled={isLoading}
          />

          {/* 자동완성 제안 */}
          {showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => selectSuggestion(suggestion)}
                  className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors ${
                    index === activeSuggestionIndex ? 'bg-blue-100' : ''
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 필터 옵션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 식품군 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              식품군
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value as FoodGroup)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              disabled={isLoading}
            >
              <option value="">전체</option>
              {FOOD_GROUPS.map(group => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          {/* 조사년도 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              조사년도
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              disabled={isLoading}
            >
              <option value="">전체</option>
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year.toString()}>
                  {year}년
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '검색 중...' : '검색'}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="flex-1 sm:flex-initial bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            초기화
          </button>
        </div>
      </form>

      {/* 인기 검색어 */}
      {searchTerm === '' && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">인기 검색어</h3>
          <div className="flex flex-wrap gap-2">
            {popularTerms.map(term => (
              <button
                key={term}
                type="button"
                onClick={() => handlePopularTermClick(term)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}