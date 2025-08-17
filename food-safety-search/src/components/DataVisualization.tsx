'use client';

import { UnifiedSearchResult } from '@/types/food-types';

interface DataVisualizationProps {
  result: UnifiedSearchResult;
  category: string;
}

/**
 * 데이터 시각화 컴포넌트
 * 카테고리별로 적절한 시각화를 제공
 */
export default function DataVisualization({ result, category }: DataVisualizationProps) {
  if (!result.data.length) return null;

  return (
    <div className="space-y-6">
      {/* 영양성분 카테고리 시각화 */}
      {category === 'nutrition' && <NutritionVisualization data={result.data} />}
      
      {/* 업체정보 카테고리 시각화 */}
      {category === 'business' && <BusinessVisualization data={result.data} />}
      
      {/* 음식점 카테고리 시각화 */}
      {category === 'restaurant' && <RestaurantVisualization data={result.data} />}
      
      {/* 기타 카테고리 통계 */}
      <GeneralStatistics data={result.data} />
    </div>
  );
}

/**
 * 영양성분 시각화
 */
function NutritionVisualization({ data }: { data: Record<string, unknown>[] }) {
  // 영양성분이 있는 데이터만 필터링
  const nutritionData = data.filter(item => item.NUTR_CONT1);
  
  if (nutritionData.length === 0) return null;

  // 평균 영양성분 계산
  const avgNutrition = {
    energy: Math.round(nutritionData.reduce((sum, item) => sum + (parseFloat(String(item.NUTR_CONT1)) || 0), 0) / nutritionData.length),
    protein: Math.round(nutritionData.reduce((sum, item) => sum + (parseFloat(String(item.NUTR_CONT2)) || 0), 0) / nutritionData.length * 10) / 10,
    fat: Math.round(nutritionData.reduce((sum, item) => sum + (parseFloat(String(item.NUTR_CONT3)) || 0), 0) / nutritionData.length * 10) / 10,
    carbs: Math.round(nutritionData.reduce((sum, item) => sum + (parseFloat(String(item.NUTR_CONT4)) || 0), 0) / nutritionData.length * 10) / 10,
  };

  // 식품군별 분포
  const groupDistribution = nutritionData.reduce((acc: Record<string, number>, item) => {
    const group = String(item.GROUP_NAME || '기타');
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">영양성분 분석</h3>
      
      {/* 평균 영양성분 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{avgNutrition.energy}</div>
          <div className="text-sm text-gray-600">평균 에너지 (kcal)</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{avgNutrition.protein}g</div>
          <div className="text-sm text-gray-600">평균 단백질</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{avgNutrition.fat}g</div>
          <div className="text-sm text-gray-600">평균 지방</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{avgNutrition.carbs}g</div>
          <div className="text-sm text-gray-600">평균 탄수화물</div>
        </div>
      </div>

      {/* 식품군별 분포 */}
      <div>
        <h4 className="font-medium text-gray-800 mb-4">식품군별 분포</h4>
        <div className="space-y-2">
          {Object.entries(groupDistribution)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([group, count]) => {
              const percentage = Math.round((count / nutritionData.length) * 100);
              return (
                <div key={group} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{group}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12">{count}개</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

/**
 * 업체정보 시각화
 */
function BusinessVisualization({ data }: { data: Record<string, unknown>[] }) {
  // 지역별 분포
  const regionDistribution = data.reduce((acc: Record<string, number>, item) => {
    const region = String(item.SITE_ADDR || '').split(' ')[0] || '기타';
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {});

  // 업종별 분포
  const industryDistribution = data.reduce((acc: Record<string, number>, item) => {
    const industry = String(item.INDUTY_NM || '기타');
    acc[industry] = (acc[industry] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 지역별 분포 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="font-medium text-gray-800 mb-4">지역별 업체 분포</h4>
        <div className="space-y-2">
          {Object.entries(regionDistribution)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([region, count]) => {
              const percentage = Math.round((count / data.length) * 100);
              return (
                <div key={region} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{region}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* 업종별 분포 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="font-medium text-gray-800 mb-4">업종별 분포</h4>
        <div className="space-y-2">
          {Object.entries(industryDistribution)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([industry, count]) => {
              const percentage = Math.round((count / data.length) * 100);
              return (
                <div key={industry} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 truncate" title={industry}>
                    {industry.length > 15 ? industry.substring(0, 15) + '...' : industry}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

/**
 * 음식점 시각화
 */
function RestaurantVisualization({ data }: { data: Record<string, unknown>[] }) {
  // 위생등급별 분포
  const gradeDistribution = data.reduce((acc: Record<string, number>, item) => {
    const grade = String(item.GRADE_DIV_NM || '미지정');
    acc[grade] = (acc[grade] || 0) + 1;
    return acc;
  }, {});

  const gradeColors: Record<string, string> = {
    '매우우수': 'bg-green-600',
    '우수': 'bg-blue-600',
    '좋음': 'bg-yellow-600',
    '미지정': 'bg-gray-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h4 className="font-medium text-gray-800 mb-4">위생등급별 분포</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(gradeDistribution).map(([grade, count]) => {
          const percentage = Math.round((count / data.length) * 100);
          return (
            <div key={grade} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`inline-block w-8 h-8 rounded-full ${gradeColors[grade] || 'bg-gray-400'} mb-2`}></div>
              <div className="text-lg font-bold text-gray-800">{count}</div>
              <div className="text-sm text-gray-600">{grade}</div>
              <div className="text-xs text-gray-500">{percentage}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 일반 통계
 */
function GeneralStatistics({ data }: { data: Record<string, unknown>[] }) {
  // 최근 업데이트 통계
  const currentYear = new Date().getFullYear();
  const recentData = data.filter(item => {
    const year = String(item.RESEARCH_YEAR || item.REGIST_DT || '');
    return year.includes(currentYear.toString()) || year.includes((currentYear - 1).toString());
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h4 className="font-medium text-gray-800 mb-4">데이터 통계</h4>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-600">{data.length}</div>
          <div className="text-sm text-gray-600">총 데이터 수</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">{recentData.length}</div>
          <div className="text-sm text-gray-600">최근 데이터</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">
            {Math.round((recentData.length / data.length) * 100)}%
          </div>
          <div className="text-sm text-gray-600">최신화율</div>
        </div>
      </div>
    </div>
  );
}