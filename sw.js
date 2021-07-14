const CacheName = 'Cache:v1' // キャッシュの名前を定義

// selfはサービスワーカー自身を指す
// addEventListenerで各イベントにコールバックを登録
// install, activateはライフサイクルの各イベントを指す
self.addEventListener('install', (event) => {
  console.log('ServiceWorker install:', event);
})

self.addEventListener('activate', (event) => {
  console.log('ServiceWorker activate:', event)
})

const networkFallingBackToCache = async (request) => {
  const cache = await caches.open(CacheName) // 定義した名前でキャッシュを開きます
  try {
    const response = await fetch(request);
    await cache.put(request, response.clone()) // response内容をキャッシュに保存. response.clone()でレスポンスの内容をコピーしてから保存しないとダメ
    return response
  } catch (err) {
    console.error(err);
    return cache.match(request)
  }
}

// fetchイベント時に実行する処理を登録
// fetchとはネットワークなどを経由してリソースを取得するためのAPI
// ここにサービスワーカーは介入できるので、リソース取得に対してさまざまな処理を挟める
self.addEventListener('fetch', (event) => {
  // console.log('Fetch to:', event.request.url)
  // // responsdWithは簡潔にいうと非同期処理をの実行終了まで待機してくれる
  // event.respondWith(fetch(event.request))

  event.respondWith(networkFallingBackToCache(event.request));
})