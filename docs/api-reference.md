# 식품안전나라 API 레퍼런스

식품안전나라 공공데이터 API의 상세 정보를 정리한 문서입니다.

## 기본 정보

- **API 키**: `689a583b18ee4d40b6e3`
- **기본 URL**: `http://openapi.foodsafetykorea.go.kr/api`
- **요청 형식**: `http://openapi.foodsafetykorea.go.kr/api/{API_KEY}/{SERVICE_ID}/{DATA_TYPE}/{START_IDX}/{END_IDX}`

## 현재 승인된 서비스

### I0930 - 식품공전 (식품의 기준 및 규격)

**서비스 설명**: 각 식품별 안전 기준과 규격 정보

**요청 URL 예시**:
```
http://openapi.foodsafetykorea.go.kr/api/689a583b18ee4d40b6e3/I0930/json/1/100
```

**검색 파라미터**:
- `PRDLST_NM`: 품목명 (예: 김치, 라면)
- `T_KOR_NM`: 시험항목 (예: 납, 대장균군)
- `LAST_UPDT_DTM`: 최종수정일 (YYYYMMDD)

**응답 필드**:

| 필드명 | 한글명 | 타입 | 설명 | 예시 |
|--------|--------|------|------|------|
| PRDLST_NM | 품목명 | String | 식품 품목명 | 김치, 라면, 우유 |
| T_KOR_NM | 시험항목 | String | 검사 항목명 | 납, 대장균군, 보존료 |
| FNPRT_ITM_NM | 세부항목 | String | 시험항목의 세부 내용 | 소브산, 안식향산 |
| SPEC_VAL | 기준규격값 | String | 허용 기준값 | 0.3이하, 불검출 |
| SPEC_VAL_SUMUP | 규격값요약 | String | 기준값의 상세 설명 | 0.3 이하, 불검출 등 |
| UNIT_NM | 단위명 | String | 측정 단위 | mg/kg, CFU/g, g/kg |
| MXMM_VAL | 최대값 | String | 허용 최대치 | 0.3, 1 |
| MXMM_VAL_FNPRT_CD_NM | 최대값형식 | String | 최대값 표현 방식 | 이하, 미만 |
| MIMM_VAL | 최소값 | String | 허용 최소치 | - |
| MIMM_VAL_FNPRT_CD_NM | 최소값형식 | String | 최소값 표현 방식 | 이상, 초과 |
| VALD_BEGN_DT | 유효개시일자 | String | 기준 시작일 | 20140101 |
| VALD_END_DT | 유효종료일자 | String | 기준 종료일 | 99991231 |
| INJRY_YN | 위해여부 | String | 위해성 여부 | Y/N |
| JDGMNT_FNPRT_CD_NM | 판정형식 | String | 판정 방법 | 최대/최소, 적/부 |
| PIAM_KOR_NM | 품목항목속성 | String | 품목 속성 정보 | 살균 등 |
| CHOIC_FIT_FNPRT_CD_NM | 적합 | String | 적합 기준 | 불검출 등 |
| CHOIC_IMPROPT_FNPRT_CD_NM | 부적합 | String | 부적합 기준 | 검출 등 |

**응답 예시**:
```json
{
  "I0930": {
    "total_count": "19",
    "row": [
      {
        "PRDLST_NM": "김치",
        "T_KOR_NM": "납",
        "SPEC_VAL": "0.3이하",
        "UNIT_NM": "mg/kg",
        "MXMM_VAL": "0.3",
        "VALD_BEGN_DT": "20140101",
        "VALD_END_DT": "99991231",
        "INJRY_YN": "N"
      }
    ],
    "RESULT": {
      "MSG": "정상처리되었습니다.",
      "CODE": "INFO-000"
    }
  }
}
```

---

### I1250 - 식품(첨가물)품목제조보고

**서비스 설명**: 식품 및 첨가물의 품목제조보고 정보

**요청 URL 예시**:
```
http://openapi.foodsafetykorea.go.kr/api/689a583b18ee4d40b6e3/I1250/json/1/100
```

*이 서비스의 상세 필드 정보는 테스트 후 추가 예정*

---

## 기타 신청 가능한 서비스

### I2790 - 식품영양성분
**설명**: 식품의 영양성분 정보 (에너지, 단백질, 지방, 탄수화물 등)

### I0490 - 식품제조업체
**설명**: 식품제조업체 현황 정보

### C005 - 식품첨가물
**설명**: 식품첨가물 정보

### I0261 - 축산물 회수/판매중단
**설명**: 축산물 회수 및 판매중단 정보

### I2570 - 음식점 위생등급
**설명**: 음식점 위생등급 지정업소 정보

### C002 - 식품공전 (일반기준규격)
**설명**: 식품공전의 일반기준규격 정보

### C003 - 식품공전 (개별기준규격)
**설명**: 식품공전의 개별기준규격 정보

---

## 사용 팁

1. **데이터 확인**: 브라우저에서 URL 직접 입력하여 데이터 구조 확인
2. **배치 처리**: 대량 데이터는 50-100개씩 나누어 요청
3. **캐싱**: 자주 사용하는 데이터는 로컬 저장 고려
4. **에러 처리**: RESULT.CODE가 "INFO-000"인지 확인

---

## 업데이트 이력

- 2025-08-21: I0930 서비스 상세 정보 추가
- 2025-08-21: I1250 서비스 기본 정보 추가 (상세 정보 추가 예정)