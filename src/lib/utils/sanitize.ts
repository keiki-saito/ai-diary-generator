import DOMPurify from 'dompurify';

/**
 * HTMLコンテンツをサニタイズしてXSS攻撃を防止
 * @param html サニタイズするHTML文字列
 * @returns サニタイズされたHTML文字列
 */
export function sanitizeHtml(html: string): string {
  // ブラウザ環境でのみ実行
  if (typeof window === 'undefined') {
    return html;
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  });
}

/**
 * テキストをHTMLエスケープ
 * @param text エスケープするテキスト
 * @returns エスケープされたテキスト
 */
export function escapeHtml(text: string): string {
  const element = document.createElement('div');
  element.textContent = text;
  return element.innerHTML;
}
