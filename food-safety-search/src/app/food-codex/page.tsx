'use client'

import React, { useState, useCallback } from 'react'
import { Layout } from '@/components/food-codex/Layout'
import { TableOfContents } from '@/components/food-codex/TableOfContents'
import { SearchBar } from '@/components/food-codex/SearchBar'
import { PDFViewer } from '@/components/food-codex/PDFViewer'
import { SearchResults } from '@/components/food-codex/SearchResults'
import { TOCItem, TOC_STRUCTURE } from '@/types/food-codex'
import { searchKeywords, SearchKeyword } from '@/lib/food-codex/search-data'
import { FileText, Search, BookOpen } from 'lucide-react'

export default function FoodCodexPage() {
  const [selectedItem, setSelectedItem] = useState<TOCItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchKeyword[]>([])

  // 목차 아이템 클릭 핸들러
  const handleItemClick = useCallback((item: TOCItem) => {
    setSelectedItem(item)
    setSearchQuery('')
    
    // PDF URL 찾기 (자식이면 부모의 URL 사용)
    let pdfUrl = item.pdfUrl
    let currentItem = item
    
    // 부모를 찾아서 PDF URL 가져오기
    if (!pdfUrl && item.level > 1) {
      const findParentWithPdf = (items: TOCItem[], targetId: string): string | undefined => {
        for (const parentItem of items) {
          if (parentItem.children?.some(child => child.id === targetId)) {
            return parentItem.pdfUrl
          }
          if (parentItem.children) {
            const found = findParentWithPdf(parentItem.children, targetId)
            if (found) return found
          }
        }
        return undefined
      }
      pdfUrl = findParentWithPdf(TOC_STRUCTURE, item.id)
    }
    
    if (pdfUrl) {
      setSelectedItem({ ...item, pdfUrl })
    }
  }, [])

  // 검색 핸들러
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setIsSearching(true)
      // 검색 실행
      const results = searchKeywords(query)
      setSearchResults(results)
      setSelectedItem(null) // 검색 시 선택된 항목 초기화
      setTimeout(() => {
        setIsSearching(false)
      }, 300)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }, [])

  // 검색 결과 클릭 핸들러
  const handleSearchResultClick = useCallback((result: SearchKeyword) => {
    // 검색 결과로부터 TOCItem 생성
    const tocItem: TOCItem = {
      id: `search-${result.keyword}`,
      title: result.keyword,
      sectionNumber: result.section.split('.')[0] || '',
      level: 2,
      pdfUrl: result.pdfUrl,
      pageNumber: result.pageNumber
    }
    
    setSelectedItem(tocItem)
    setSearchQuery('')
    setSearchResults([])
  }, [])

  // 초기 화면 컴포넌트
  const WelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <BookOpen className="h-24 w-24 text-blue-600 dark:text-blue-400 mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        식품공전 디지털 플랫폼
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
        식품의 기준 및 규격을 쉽고 빠르게 검색하고 열람할 수 있습니다.
        좌측 목차에서 원하는 항목을 선택하거나 상단 검색창을 이용해보세요.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <FileText className="h-10 w-10 text-blue-500 mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            빠른 접근
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            계층형 목차로 원하는 조항을 빠르게 찾아보세요
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <Search className="h-10 w-10 text-green-500 mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            통합 검색
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            "복합조미식품" 등 키워드로 전체 내용을 검색하세요
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <BookOpen className="h-10 w-10 text-purple-500 mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            PDF 원본
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            공식 PDF 문서를 그대로 열람할 수 있습니다
          </p>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          💡 추천: <strong>"제5장 &gt; 13. 조미식품"</strong>에서 복합조미식품 관련 규정을 확인해보세요
        </p>
      </div>
    </div>
  )

  return (
    <Layout
      sidebar={
        <TableOfContents
          items={TOC_STRUCTURE}
          onItemClick={handleItemClick}
          selectedItemId={selectedItem?.id}
        />
      }
      header={
        <SearchBar
          onSearch={handleSearch}
          isLoading={isSearching}
        />
      }
    >
      {/* 검색 결과가 있으면 검색 결과 표시 */}
      {searchResults.length > 0 ? (
        <SearchResults
          results={searchResults}
          query={searchQuery}
          onResultClick={handleSearchResultClick}
        />
      ) : selectedItem?.pdfUrl ? (
        <PDFViewer
          url={selectedItem.pdfUrl}
          pageNumber={selectedItem.pageNumber}
          title={`${selectedItem.sectionNumber}. ${selectedItem.title}`}
        />
      ) : (
        <WelcomeScreen />
      )}
    </Layout>
  )
}