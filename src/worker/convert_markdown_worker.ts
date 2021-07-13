import * as marked from 'marked'; // webpackで処理するため、通常のソース同様のインポート文が使用できます。
import * as sanitizeHtml from 'sanitize-html'; // XSSなどの攻撃から守るようサニタイズ無害化

// web workerを変数にセット（TypeScript特有の書き方）
// 通常の JavaScript であれば、self というグローバル変数でアクセスできます。しかし TypeScript だと型定義の兼ね合いで self にアクセスできないと判定されてビルドができません。
// self as anyのanyはなんでもOKという意味合いで、TypeScriptはチェックを行わなくなる
const worker: Worker = self as any

// メインスレッドからデータを渡された際に実行する関数を定義
worker.addEventListener('message', (event) => {
  const text = event.data;
  
  // サニタイズされたHTMLが返る
  const html = sanitizeHtml(marked(text), { allowedTags: [...sanitizeHtml.defaults.allowedTags, 'h1', 'h2'] }); // メインスレッドからのテキストデータ（マークダウン）をmarkedでHTML変換し、メインスレッドに結果のHTMLを返却
  // メインスレッドへ処理結果を送信
  worker.postMessage({ html })
})