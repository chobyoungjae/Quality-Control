'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * 영양성분 페이지 - nutrition 카테고리로 리다이렉트
 */
export default function NutritionPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/category/nutrition');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🔄</div>
        <p className="text-gray-600">영양성분 페이지로 이동 중...</p>
      </div>
    </div>
  );
}