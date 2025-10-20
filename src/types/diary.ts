// 日記関連の型定義

/**
 * データベースのdiariesテーブルに対応する完全な型定義
 */
export interface Diary {
  id: string;
  user_id: string;
  date: Date;
  user_input: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * 新規日記作成時の入力型
 * id、user_id、タイムスタンプは自動生成されるため含まない
 */
export interface DiaryCreateInput {
  date: Date;
  user_input: string;
  content: string;
}

/**
 * 日記更新時の入力型
 * user_inputはオプション（編集時に元の入力も更新可能）
 */
export interface DiaryUpdateInput {
  content: string;
  user_input?: string;
}

/**
 * 日記一覧表示用の最適化された型
 * 全文を取得せず、冒頭50文字のみを含む
 */
export interface DiaryListItem {
  id: string;
  date: Date;
  contentPreview: string; // 冒頭50文字
  created_at: Date;
}
