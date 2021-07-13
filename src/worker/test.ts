// web workerを変数にセット（TypeScript特有の書き方）
// 通常の JavaScript であれば、self というグローバル変数でアクセスできます。しかし TypeScript だと型定義の兼ね合いで self にアクセスできないと判定されてビルドができません。
// self as anyのanyはなんでもOKという意味合いで、TypeScriptはチェックを行わなくなる
const worker: Worker = self as any

// メインスレッドからデータを渡された際に実行する関数を定義
worker.addEventListener('message', (event) => {
  console.log('Worker Received:', event.data)
  // メインスレッドへ処理結果を送信
  worker.postMessage({ result: event.data })
})