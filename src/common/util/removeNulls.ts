export const removeNulls = <T>(obj: T): T => {
  // 객체가 배열인 경우
  if (Array.isArray(obj)) {
    // 배열의 모든 요소를 재귀적으로 처리하여 null이 아닌 요소만 유지
    const cleanedArray = obj.map(removeNulls).filter((item) => item !== null);

    // 배열이 모두 null 요소만 있거나 비어 있다면 null 반환
    return (cleanedArray.length === 0 ? null : cleanedArray) as T;
  }

  // 특별한 객체 타입들을 예외적으로 처리
  if (
    obj instanceof Date ||
    obj instanceof RegExp ||
    obj instanceof Function ||
    obj instanceof Map ||
    obj instanceof Set ||
    ArrayBuffer.isView(obj) || // TypedArray와 같은 뷰들 체크
    obj instanceof Promise
  ) {
    return obj;
  }

  // 객체가 아닌 경우 (기본 자료형인 경우)
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 순수 객체의 경우, null이 아닌 프로퍼티만 유지
  const cleanedObject = Object.entries(obj).reduce((acc, [key, value]) => {
    const cleanedValue = removeNulls(value);

    // 모든 요소가 null인 배열이거나 null인 경우 해당 프로퍼티 제거
    if (cleanedValue === null) {
      return acc;
    }

    // 유효한 값만 유지
    acc[key] = cleanedValue;
    return acc;
  }, {} as any);

  // 모든 프로퍼티가 제거된 경우 null 반환
  return (Object.keys(cleanedObject).length === 0 ? null : cleanedObject) as T;
};
