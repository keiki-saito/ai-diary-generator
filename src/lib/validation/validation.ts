/**
 * バリデーション結果の型
 */
export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * ユーザー入力のバリデーション
 * @param userInput ユーザー入力文字列
 * @returns バリデーション結果
 */
export function validateUserInput(userInput: unknown): ValidationResult {
  // 型チェック
  if (typeof userInput !== 'string') {
    return {
      isValid: false,
      error: '入力内容は文字列である必要があります',
    };
  }

  // 1文字以上チェック
  if (userInput.trim().length < 1) {
    return {
      isValid: false,
      error: '入力内容は1文字以上である必要があります',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * 日付のバリデーション（YYYY-MM-DD形式）
 * @param date 日付文字列
 * @returns バリデーション結果
 */
export function validateDate(date: unknown): ValidationResult {
  // 存在チェック
  if (!date || typeof date !== 'string') {
    return {
      isValid: false,
      error: '日付は必須です',
    };
  }

  // 形式チェック（YYYY-MM-DD）
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return {
      isValid: false,
      error: '日付はYYYY-MM-DD形式である必要があります',
    };
  }

  // 有効な日付かチェック
  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);

  // 日付が正しく解釈されたかチェック（2025-02-30のような無効な日付を検出）
  if (
    isNaN(dateObj.getTime()) ||
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getDate() !== day
  ) {
    return {
      isValid: false,
      error: '有効な日付を指定してください',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * 日記内容のバリデーション
 * @param content 日記内容
 * @returns バリデーション結果
 */
export function validateDiaryContent(content: unknown): ValidationResult {
  // 型チェック
  if (typeof content !== 'string') {
    return {
      isValid: false,
      error: '日記内容は文字列である必要があります',
    };
  }

  // 1文字以上チェック
  if (content.trim().length < 1) {
    return {
      isValid: false,
      error: '日記内容は1文字以上である必要があります',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}
