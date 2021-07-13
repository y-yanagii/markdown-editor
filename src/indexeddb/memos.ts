import Dexie from 'dexie';

/* indexedDBを使用したテーブル定義 */

// indexedDBに保存するデータの型を定義（TypeScriptの型定義であってindexedDBに対する設定ではないことに注意）
export interface MemoRecord {
  datetime: string
  title: string
  text: string
};

// テーブル定義
// Dexieのインスタンス生成new Dexie(データベース名)
const database = new Dexie('markdown-editor');
// .version(1)はDBのバージョンテーブル構成を変更する際あげると移行する処理を呼び出せる
// .stores()で使用するテーブルとインデックスとなるデータ名を指定
database.version(1).stores({ memos: '&datetime' });
// Dexie.Table<MemoRecord, string>はTSの総称型で型を定義している
// MemoRecordはデータの型で2つ目のstringはキーとなるデータ（今回はdatetimeの型）
const memos: Dexie.Table<MemoRecord, string> = database.table('memos');

// メモを保存するため、タイトルとテキストを引数として受け取る関数を定義
export const putMemo = async(title: string, text: string): Promise<void> => {
  const datetime = new Date().toISOString(); // 保存する直前で日時取得
  await memos.put({ datetime, title, text }); // DBへ保存処理
}

// テキスト履歴をリストで取得する関数を定義（戻り値がMemoRecordの配列なのでMemoRecord[]）
export const getMemos = (): Promise<MemoRecord[]> => {
  // memosテーブルからデータ取得
  // datetimeの昇順で取得しreverseで並び順を逆にする。（新しい順に並べ替え）最後にtoArrayで配列に変換
  return memos.orderBy('datetime').reverse().toArray();
}