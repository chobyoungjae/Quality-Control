'use client';

interface NoResultsMessageProps {
  searchTerm?: string;
  selectedGroup?: string;
  selectedYear?: string;
}

/**
 * 검색 결과가 없을 때 표시하는 안내 메시지 컴포넌트
 */
export default function NoResultsMessage({ 
  searchTerm, 
  selectedGroup, 
  selectedYear 
}: NoResultsMessageProps) {
  const hasFilters = searchTerm || selectedGroup || selectedYear;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="text-6xl mb-4">😞</div>
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          검색 결과가 없습니다
        </h3>
        
        {hasFilters && (
          <div className="mb-6 text-sm text-gray-600">
            <p className="mb-2">현재 검색 조건:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {searchTerm && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  식품명: {searchTerm}
                </span>
              )}
              {selectedGroup && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  식품군: {selectedGroup}
                </span>
              )}
              {selectedYear && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  조사년도: {selectedYear}년
                </span>
              )}
            </div>
          </div>
        )}

        <div className="text-gray-600 space-y-2">
          <p className="text-base mb-4">다음과 같이 시도해보세요:</p>
          <ul className="text-sm space-y-2 max-w-md mx-auto">
            <li className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              검색어의 철자를 확인해보세요
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              더 일반적인 키워드로 검색해보세요
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              필터 조건을 줄여보세요
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              유사한 식품명으로 검색해보세요
            </li>
          </ul>
        </div>

        <div className="mt-8">
          <h4 className="text-sm font-medium text-gray-700 mb-3">추천 검색어</h4>
          <div className="flex flex-wrap justify-center gap-2">
            {['쌀', '닭고기', '계란', '우유', '바나나', '감자', '양파', '당근'].map(term => (
              <button
                key={term}
                onClick={() => {
                  // 부모 컴포넌트에서 검색 실행
                  const event = new CustomEvent('searchSuggestion', { 
                    detail: { term } 
                  });
                  window.dispatchEvent(event);
                }}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}