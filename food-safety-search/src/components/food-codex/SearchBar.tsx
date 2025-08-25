'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Search, X, Loader2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSuggestions } from '@/lib/food-codex/search-data'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
  isLoading?: boolean
  autoFocus?: boolean
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "식품공전 내용 검색 (예: 복합조미식품)",
  className,
  isLoading = false,
  autoFocus = false
}) => {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // 최근 검색어 로드
  useEffect(() => {
    const stored = localStorage.getItem('food-codex-recent-searches')
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch (e) {
        console.warn('Failed to parse recent searches')
      }
    }
  }, [])

  // 디바운싱 및 자동완성 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
      
      // 자동완성 생성
      if (query.trim()) {
        const newSuggestions = getSuggestions(query)
        setSuggestions(newSuggestions)
        setShowSuggestions(true)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // 디바운싱된 검색어로 검색 실행
  useEffect(() => {
    if (debouncedQuery.trim()) {
      onSearch(debouncedQuery.trim())
    } else {
      onSearch('')
    }
  }, [debouncedQuery, onSearch])

  // 최근 검색어 저장
  const saveRecentSearch = useCallback((searchQuery: string) => {
    const newRecents = [searchQuery, ...recentSearches.filter(item => item !== searchQuery)].slice(0, 5)
    setRecentSearches(newRecents)
    localStorage.setItem('food-codex-recent-searches', JSON.stringify(newRecents))
  }, [recentSearches])

  const handleClear = useCallback(() => {
    setQuery('')
    setDebouncedQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    onSearch('')
  }, [onSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      saveRecentSearch(query.trim())
      onSearch(query.trim())
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    saveRecentSearch(suggestion)
    onSearch(suggestion)
    setShowSuggestions(false)
  }

  const handleInputFocus = () => {
    if (query.trim()) {
      setShowSuggestions(suggestions.length > 0)
    } else if (recentSearches.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    // 딜레이를 주어서 클릭 이벤트가 먼저 실행되도록 함
    setTimeout(() => {
      setShowSuggestions(false)
    }, 200)
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            "block w-full pl-10 pr-10 py-2.5 text-sm",
            "border border-gray-300 rounded-lg",
            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100",
            "placeholder-gray-400 dark:placeholder-gray-500",
            "transition-colors duration-200"
          )}
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        )}
      </div>
      
      {/* 자동완성 드롭다운 */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {/* 검색 제안 */}
          {suggestions.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                추천 검색어
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={`suggestion-${index}`}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <Search className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
          
          {/* 최근 검색어 */}
          {!query.trim() && recentSearches.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                최근 검색어
              </div>
              {recentSearches.map((recent, index) => (
                <button
                  key={`recent-${index}`}
                  type="button"
                  onClick={() => handleSuggestionClick(recent)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">{recent}</span>
                </button>
              ))}
            </div>
          )}
          
          {/* 빠른 접근 */}
          {!query.trim() && (
            <div>
              <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                인기 검색어
              </div>
              {['복합조미식품', 'MSG', '간장', '된장', '대장균'].map((popular, index) => (
                <button
                  key={`popular-${index}`}
                  type="button"
                  onClick={() => handleSuggestionClick(popular)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <Search className="h-4 w-4 text-orange-400" />
                  <span className="text-gray-900 dark:text-gray-100">{popular}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 검색 힌트 */}
      {!query && !showSuggestions && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          💡 팁: "조미식품", "복합조미", "MSG" 등으로 검색해보세요
        </div>
      )}
    </form>
  )
}