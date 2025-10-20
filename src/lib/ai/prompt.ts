/**
 * 日記生成用のプロンプトテンプレート関数
 */

/**
 * ユーザー入力と日付から日記生成プロンプトを生成
 * @param userInput ユーザーの簡潔な入力（その日の出来事や感情）
 * @param date 日記の日付
 * @returns LLM API用のプロンプト文字列
 */
export function generateDiaryPrompt(userInput: string, date: Date): string {
  const formattedDate = date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return `あなたは優秀な日記ライターです。以下のユーザーの簡潔なメモから、自然で読みやすい日記を生成してください。

【日付】
${formattedDate}

【ユーザーのメモ】
${userInput}

【生成条件】
- 500文字から800文字の範囲で生成してください
- ユーザーのメモの内容を基に、具体的で詳細な日記に膨らませてください
- 自然な日本語の文章で、過度に形式的にならないようにしてください
- 一人称視点で書いてください
- ユーザーのメモにない情報を創作しないでください。メモに基づいた範囲で描写を豊かにしてください
- 段落分けを適切に行い、読みやすい文章にしてください
- 絵文字や顔文字は使用しないでください

生成した日記のみを出力してください。説明や前置きは不要です。`;
}
