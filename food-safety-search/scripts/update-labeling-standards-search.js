/**
 * 식품등의 표시기준 검색창을 Supabase 참조로 변경하는 스크립트
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'labeling-standards', 'page.tsx');

async function updateSearchLogic() {
  try {
    console.log('📝 식품등의 표시기준 검색창 업데이트 중...');
    
    // 파일 읽기
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. useState에 suggestions 추가
    const oldState = `const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [foodCodeResults, setFoodCodeResults] = useState<any[]>([]);
  const [codexSections, setCodexSections] = useState<any[]>([]);
  const [isLoadingFoodCode, setIsLoadingFoodCode] = useState(false);
  const [foodCodeError, setFoodCodeError] = useState('');`;
    
    const newState = `const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [foodCodeResults, setFoodCodeResults] = useState<any[]>([]);
  const [codexSections, setCodexSections] = useState<any[]>([]);
  const [isLoadingFoodCode, setIsLoadingFoodCode] = useState(false);
  const [foodCodeError, setFoodCodeError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);`;
    
    content = content.replace(oldState, newState);
    
    // 2. useEffect 추가 (Supabase에서 키워드 자동완성)
    const useEffectCode = `
  // Supabase에서 키워드 자동완성 가져오기
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchTerm.trim() || searchTerm.length < 1) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(\`/api/food-codex-search?autocomplete=\${encodeURIComponent(searchTerm)}\`, {
          method: 'POST'
        });
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } catch (err) {
        console.error('자동완성 오류:', err);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);
`;
    
    // 기존 filteredFoodTypes를 찾아서 useEffect 추가
    const insertPoint = content.indexOf('// 검색어에 따른 식품 유형 필터링');
    if (insertPoint !== -1) {
      content = content.slice(0, insertPoint) + useEffectCode + '\n  ' + content.slice(insertPoint);
    }
    
    // 3. filteredFoodTypes를 suggestions로 교체
    const oldFilteredFoodTypes = `// 검색어에 따른 식품 유형 필터링
  const filteredFoodTypes = useMemo(() => {
    if (!searchTerm) return [];
    return FOOD_TYPES.filter(type => 
      type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);`;
    
    const newFilteredFoodTypes = `// Supabase에서 가져온 자동완성 키워드 사용
  const filteredFoodTypes = suggestions;`;
    
    content = content.replace(oldFilteredFoodTypes, newFilteredFoodTypes);
    
    // 4. handleSelectType 수정
    const oldHandleSelectType = `// 식품 유형 선택 핸들러
  const handleSelectType = (type: string) => {
    setSelectedType(type);
    setSearchTerm(type);
  };`;
    
    const newHandleSelectType = `// 식품 유형 선택 핸들러
  const handleSelectType = (type: string) => {
    setSelectedType(type);
    setSearchTerm(type);
    setShowDropdown(false);
  };`;
    
    content = content.replace(oldHandleSelectType, newHandleSelectType);
    
    // 5. 드롭다운 UI 부분 업데이트 (onFocus, onBlur 추가)
    const oldInputEvents = `onChange={(e) => setSearchTerm(e.target.value)}`;
    const newInputEvents = `onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => {
                    setTimeout(() => setShowDropdown(false), 200);
                  }}`;
    
    content = content.replace(oldInputEvents, newInputEvents);
    
    // 6. 드롭다운 표시 조건 수정
    const oldDropdownCondition = `{searchTerm && filteredFoodTypes.length > 0 && (`;
    const newDropdownCondition = `{showDropdown && searchTerm && filteredFoodTypes.length > 0 && (`;
    
    content = content.replace(oldDropdownCondition, newDropdownCondition);
    
    // 파일 저장
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log('✅ 식품등의 표시기준 검색창 업데이트 완료!');
    console.log('이제 두 검색창이 동일한 Supabase 키워드를 사용합니다.');
    
  } catch (error) {
    console.error('💥 오류 발생:', error);
  }
}

updateSearchLogic();