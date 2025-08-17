'use client';

import { useState } from 'react';

/**
 * 서비스 정보 및 도움말 배너 컴포넌트
 */
export default function InfoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 mb-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="text-blue-600 text-xl">💡</div>
            <div className="flex-1">
              <h3 className="text-blue-800 font-medium mb-2">
                개발 버전 안내
              </h3>
              <div className="text-blue-700 text-sm space-y-1">
                <p>• 현재 <strong>목업 데이터</strong>로 동작하고 있습니다</p>
                <p>• 실제 API 연동을 위해서는 <strong>식품안전나라 API 키</strong>가 필요합니다</p>
                <p>• 현재 12개의 샘플 식품 데이터를 제공합니다</p>
                <p>• 검색, 필터링, 페이지네이션 등 모든 기능을 체험할 수 있습니다</p>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="text-xs text-blue-600">
                  <strong>API 키 발급:</strong> 
                  <a 
                    href="https://www.foodsafetykorea.go.kr/apiMain.do" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-1 underline hover:text-blue-800"
                  >
                    식품안전나라 →
                  </a>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-blue-600 hover:text-blue-800 text-lg leading-none"
            aria-label="배너 닫기"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}