'use client'

import React from 'react'
import { Search, FileText, ArrowRight, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SearchKeyword } from '@/lib/food-codex/search-data'

interface SearchResultsProps {
  results: SearchKeyword[]
  query: string
  onResultClick: (result: SearchKeyword) => void
  className?: string
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  query,
  onResultClick,
  className
}) => {
  if (results.length === 0) {
    return (
      <div className={cn("p-8 text-center", className)}>
        <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          검색 결과가 없습니다
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          "{query}"에 대한 결과를 찾을 수 없습니다.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm">
          <p className="text-blue-800 dark:text-blue-300 mb-2">💡 검색 팁:</p>
          <ul className="text-blue-700 dark:text-blue-400 space-y-1 text-left">
            <li>• "복합조미식품", "MSG", "간장" 등으로 검색해보세요</li>
            <li>• 띄어쓰기 없이 검색하거나 다른 키워드를 시도해보세요</li>
            <li>• 좌측 목차에서 직접 원하는 항목을 찾아보세요</li>
          </ul>
        </div>
      </div>
    )
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-700 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  return (
    <div className={cn("p-6 bg-gray-50 dark:bg-gray-900", className)}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          "{query}" 검색 결과 ({results.length}개)
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          원하는 항목을 클릭하면 해당 PDF 페이지로 바로 이동합니다.
        </p>
        {results.length > 1 && (
          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 <strong>"{query}"</strong>과 관련된 여러 항목을 찾았습니다. 
              원하는 세부 내용을 선택해주세요.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {results.map((result, index) => (
          <div
            key={`${result.keyword}-${index}`}
            onClick={() => onResultClick(result)}
            className={cn(
              "bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm",
              "border border-gray-200 dark:border-gray-700",
              "hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600",
              "cursor-pointer transition-all duration-200 transform hover:scale-[1.02]",
              "group"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {highlightText(result.keyword, query)}
                    </h4>
                    {result.keyword === '복합조미식품' && (
                      <Star className="h-4 w-4 text-orange-500 fill-current" />
                    )}
                  </div>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                    페이지 {result.pageNumber}
                  </span>
                </div>
                
                <div className="mb-2">
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    📍 {result.section}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {highlightText(result.description, query)}
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <p className="text-sm text-green-800 dark:text-green-300">
          💡 <strong>빠른 접근:</strong> "복합조미식품"을 찾으신다면 
          <strong className="mx-1">제5장 → 13. 조미식품</strong>을 확인해보세요!
        </p>
      </div>
    </div>
  )
}