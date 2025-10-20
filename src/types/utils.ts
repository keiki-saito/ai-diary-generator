// ユーティリティ型定義

/**
 * Result型：成功または失敗を表現する型
 * Rustの Result<T, E> に似た型定義
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Server Actionの戻り値の型
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Supabaseのクエリ結果の型
 */
export type SupabaseResult<T> = {
  data: T | null;
  error: Error | null;
};

/**
 * ページネーション情報の型
 */
export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/**
 * ページネーション付きレスポンスの型
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}
