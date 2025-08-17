'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FOOD_CATEGORIES } from '@/types/food-types';

/**
 * 메인 네비게이션 컴포넌트
 */
export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🏛️</span>
            <span className="font-bold text-gray-800 hidden sm:block">식품안전나라</span>
          </Link>

          {/* 카테고리 메뉴 */}
          <div className="hidden md:flex items-center space-x-1">
            {FOOD_CATEGORIES.map((category) => {
              const isActive = pathname === `/category/${category.id}`;
              return (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-base">{category.icon}</span>
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}

/**
 * 모바일 메뉴 컴포넌트
 */
function MobileMenu() {
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <details className="relative">
        <summary className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer list-none">
          <span>메뉴</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {FOOD_CATEGORIES.map((category) => {
            const isActive = pathname === `/category/${category.id}`;
            return (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-800'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <div>
                  <div className="font-medium">{category.name}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {category.description}
                  </div>
                </div>
              </Link>
            );
          })}
          
          <div className="border-t border-gray-200 mt-2 pt-2">
            <Link
              href="/"
              className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
            >
              <span className="text-lg">🏠</span>
              <span>홈으로</span>
            </Link>
          </div>
        </div>
      </details>
    </div>
  );
}