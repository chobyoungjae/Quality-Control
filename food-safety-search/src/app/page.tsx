'use client';

import Link from 'next/link';

/**
 * 메인 홈페이지 컴포넌트
 * 식품 관련 다양한 서비스를 제공하는 포털 메인 페이지
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* 히어로 섹션 */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            식품 품질 관리 센터
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            안전하고 품질 좋은 식품을 위한 종합 정보 서비스
          </p>
        </div>
      </section>

      {/* 메인 서비스 */}
      <main className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 식품등의 표시기준 서비스 */}
          <Link
            href="/labeling-standards"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8"
          >
            <div className="text-center">
              <div className="text-6xl mb-6">📋</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">
                식품등의 표시기준
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                식품 유형별 표시기준을 검색하고<br />
                영양성분표 작성 가이드를 확인하세요
              </p>
              <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-medium inline-block">
                서비스 이용하기 →
              </div>
            </div>
          </Link>

          {/* 식품공전 규격기준 검색 */}
          <Link
            href="/food-standards"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8"
          >
            <div className="text-center">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors">
                식품공전 규격기준 검색
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                식품공전에서 제공하는<br />
                공식 규격기준 정보를 검색하세요
              </p>
              <div className="bg-orange-50 text-orange-800 px-4 py-2 rounded-full text-sm font-medium inline-block">
                검색하기 →
              </div>
            </div>
          </Link>

          {/* 영양성분 자동계산기 */}
          <Link
            href="/nutrition-calculator"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8"
          >
            <div className="text-center">
              <div className="text-6xl mb-6">🧮</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors">
                영양성분 자동계산기
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                원재료 정보를 입력하면<br />
                영양성분을 자동으로 계산해드립니다
              </p>
              <div className="bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm font-medium inline-block">
                계산기 사용하기 →
              </div>
            </div>
          </Link>
        </div>

      </main>

      {/* 푸터 */}
      <footer className="bg-white/80 border-t">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-sm text-gray-500">
            © 2025 식품 품질 관리 센터. 안전한 식품을 위한 정보 서비스
          </p>
        </div>
      </footer>
    </div>
  );
}
