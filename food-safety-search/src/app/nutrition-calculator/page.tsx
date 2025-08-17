'use client';

import { useState } from 'react';
import Link from 'next/link';

// 원재료별 영양성분 데이터 (100g당)
const INGREDIENT_NUTRITION = {
  '쌀': { calories: 356, carbs: 76.9, protein: 6.8, fat: 0.6, sodium: 0 },
  '밀가루': { calories: 348, carbs: 73.1, protein: 10.5, fat: 1.3, sodium: 2 },
  '설탕': { calories: 387, carbs: 99.8, protein: 0, fat: 0, sodium: 0 },
  '소금': { calories: 0, carbs: 0, protein: 0, fat: 0, sodium: 38758 },
  '간장': { calories: 63, carbs: 8.0, protein: 8.9, fat: 0.1, sodium: 5493 },
  '식용유': { calories: 884, carbs: 0, protein: 0, fat: 100, sodium: 0 },
  '마늘': { calories: 130, carbs: 28.5, protein: 6.0, fat: 0.3, sodium: 1 },
  '양파': { calories: 37, carbs: 8.5, protein: 1.1, fat: 0.1, sodium: 3 },
  '당근': { calories: 34, carbs: 8.0, protein: 0.9, fat: 0.2, sodium: 20 },
  '감자': { calories: 66, carbs: 15.0, protein: 2.0, fat: 0.1, sodium: 4 }
};

interface Ingredient {
  name: string;
  amount: number;
}

interface NutritionResult {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sodium: number;
}

/**
 * 영양성분 자동계산기 페이지
 * 원재료와 함량을 입력하면 영양성분을 자동으로 계산해주는 페이지
 */
export default function NutritionCalculator() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: 0 }
  ]);
  const [totalWeight, setTotalWeight] = useState<number>(100);
  const [calculatedNutrition, setCalculatedNutrition] = useState<NutritionResult | null>(null);

  // 원재료 추가
  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: 0 }]);
  };

  // 원재료 제거
  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  // 원재료 정보 업데이트
  const updateIngredient = (index: number, field: 'name' | 'amount', value: string | number) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  // 영양성분 계산
  const calculateNutrition = () => {
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalSodium = 0;

    ingredients.forEach(ingredient => {
      const nutritionData = INGREDIENT_NUTRITION[ingredient.name as keyof typeof INGREDIENT_NUTRITION];
      if (nutritionData && ingredient.amount > 0) {
        const ratio = ingredient.amount / 100; // 100g 기준으로 계산
        totalCalories += nutritionData.calories * ratio;
        totalCarbs += nutritionData.carbs * ratio;
        totalProtein += nutritionData.protein * ratio;
        totalFat += nutritionData.fat * ratio;
        totalSodium += nutritionData.sodium * ratio;
      }
    });

    // 총 중량에 따른 100g당 영양성분 계산
    const per100g = totalWeight > 0 ? 100 / totalWeight : 0;
    
    setCalculatedNutrition({
      calories: Math.round(totalCalories * per100g * 10) / 10,
      carbs: Math.round(totalCarbs * per100g * 10) / 10,
      protein: Math.round(totalProtein * per100g * 10) / 10,
      fat: Math.round(totalFat * per100g * 10) / 10,
      sodium: Math.round(totalSodium * per100g)
    });
  };

  // 초기화
  const resetCalculator = () => {
    setIngredients([{ name: '', amount: 0 }]);
    setTotalWeight(100);
    setCalculatedNutrition(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            href="/"
            className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 페이지 제목 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            영양성분 자동계산기
          </h1>
          <p className="text-xl text-gray-600">
            원재료와 함량을 입력하면 영양성분을 자동으로 계산해드립니다
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 입력 섹션 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              🧮 원재료 입력
            </h2>

            {/* 총 중량 입력 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                총 중량 (g)
              </label>
              <input
                type="number"
                value={totalWeight}
                onChange={(e) => setTotalWeight(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="완성품 총 중량을 입력하세요"
              />
            </div>

            {/* 원재료 입력 */}
            <div className="space-y-4 mb-6">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <div className="flex-1">
                    <select
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">원재료 선택</option>
                      {Object.keys(INGREDIENT_NUTRITION).map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      value={ingredient.amount}
                      onChange={(e) => updateIngredient(index, 'amount', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="함량(g)"
                    />
                  </div>
                  <button
                    onClick={() => removeIngredient(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                    disabled={ingredients.length === 1}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* 버튼들 */}
            <div className="flex gap-3">
              <button
                onClick={addIngredient}
                className="flex-1 bg-green-100 text-green-800 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors"
              >
                + 원재료 추가
              </button>
              <button
                onClick={calculateNutrition}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                계산하기
              </button>
              <button
                onClick={resetCalculator}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                초기화
              </button>
            </div>
          </div>

          {/* 결과 섹션 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              📊 영양성분 결과
            </h2>

            {calculatedNutrition ? (
              <div className="space-y-6">
                {/* 영양성분표 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 text-center border-b border-gray-300 pb-2">
                    영양성분표 (100g당)
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">열량</span>
                      <span className="font-bold text-gray-900">{calculatedNutrition.calories}kcal</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">탄수화물</span>
                      <span className="font-bold text-gray-900">{calculatedNutrition.carbs}g</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">단백질</span>
                      <span className="font-bold text-gray-900">{calculatedNutrition.protein}g</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">지방</span>
                      <span className="font-bold text-gray-900">{calculatedNutrition.fat}g</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium text-gray-700">나트륨</span>
                      <span className="font-bold text-gray-900">{calculatedNutrition.sodium}mg</span>
                    </div>
                  </div>
                </div>

                {/* 나트륨 경고 */}
                {calculatedNutrition.sodium > 600 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <span className="text-yellow-600 mr-2">⚠️</span>
                      <span className="text-yellow-800 font-medium">
                        나트륨 함량이 높습니다. 표시기준에 따른 주의문구 표시가 필요할 수 있습니다.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📊</div>
                <p>원재료를 입력하고 "계산하기" 버튼을 눌러주세요</p>
              </div>
            )}
          </div>
        </div>

        {/* 사용 가능한 원재료 안내 */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            📝 사용 가능한 원재료
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Object.keys(INGREDIENT_NUTRITION).map(ingredient => (
              <div key={ingredient} className="bg-gray-50 rounded-lg p-3 text-center">
                <span className="font-medium text-gray-700">{ingredient}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">
              💡 현재는 기본 원재료만 지원됩니다. 향후 더 많은 원재료가 추가될 예정입니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}