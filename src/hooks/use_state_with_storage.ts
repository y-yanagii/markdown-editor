import { useState } from 'react';

// 自前のカスタムフックを作成しローカルストレージに保持する処理を共通化
// カスタムフックはuseから始める慣例があります
// init: stringは初期値でuseStateの引数と同じ
// key: stringはlocalStorageに保存する際のキー
// [string, (s: string) => void]はカスタムフックの戻り値でuseStateの戻り値と同じ型になる
export const useStateWithStorage = (init: string, key: string): [string, (s: string) => void] => {
  // そもそもlocalStorageはJavaScript自体のやつ
  const [value, setValue] = useState<string>(localStorage.getItem(key) || init)

  const setValueWithStorage = (nextValue: string): void => {
    setValue(nextValue) // stateに値をセット
    localStorage.setItem(key, nextValue); // ローカルストレージに最新のstateをセット
  }

  return [value, setValueWithStorage]
}