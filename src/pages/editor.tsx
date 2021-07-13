import * as React from 'react';
import styled from 'styled-components';
import { useStateWithStorage } from '../hooks/use_state_with_storage';
// import * as ReactMarkdown from 'react-markdown';
import { putMemo } from '../indexeddb/memos';
import { Button } from '../components/button';
import { SaveModal } from '../components/save_modal';
import { Link } from 'react-router-dom';
import { Header } from '../components/header';
// import TestWorker from 'worker-loader!../worker/convert_markdown_worker.ts'; // worker-loader!でsrc/worker/test.tsの型定義と合わせて、読み込むファイルがWorkerであることを示す。
import ConvertMarkdownWorker from 'worker-loader!../worker/convert_markdown_worker.ts'

// useState関数をReactから取り出す
// const { useState } = React; // import { useState } from 'react'と同等
// const testWorker = new TestWorker(); // Workerインスタンスの生成
const convertMarkdownWorker = new ConvertMarkdownWorker();
const { useState, useEffect } = React;

const Wrapper = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 3rem;
`

const HeaderArea = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  left: 0;
`

const TextArea = styled.textarea`
  border-right: 1px solid silver;
  border-top: 1px solid silver;
  bottom: 0;
  font-size: 1rem;
  left: 0;
  padding: 0.5rem;
  position: absolute;
  top: 0;
  width: 50vw;
`

const Preview = styled.div`
  border-top: 1px solid silver;
  bottom: 0;
  overflow-y: scroll;
  padding: 1rem;
  position: absolute;
  right: 0;
  top: 0;
  width: 50vw;
`

interface Props {
  text: string
  setText: (text:string) => void
}

// .FCでFunction Component型であることを明示。（TypeScriptの書き方）
export const Editor: React.FC<Props> = (props) => {
  // 初期値localStorageから取得
  // const [text, setText] = useState<string>(localStorage.getItem(StorageKey) || ''); // <TypeScriptで型指定してる>
  const { text, setText } = props;

  // indexedDBの保存処理を呼び出す
  // const saveMemo = (): void => {
  //   putMemo('TITLE', text) // 引数にタイトルとエディターの中身を渡す
  // }
  const [showModal, setShowModal] = useState(false); // モーダルを表示非表示用
  const [html, setHtml] = useState('');

  // 初回のみWorkerから結果を受け取る
  useEffect(() => {
    // testWorker.onmessage = (event) => {
    //   console.log('Main thread Received:', event.data)
    // }
    convertMarkdownWorker.onmessage = (event) => {
      setHtml(event.data.html);
    }
  }, [])

  // テキスト変更時にWorkerでテキストデータを送信
  useEffect(() => {
    // testWorker.postMessage(text)
    convertMarkdownWorker.postMessage(text);
  }, [text])

  return (
    <>
      <HeaderArea>
        <Header title="Markdown Editor">
          {/* propsのchildrenに以下が入る */}
          <Button onClick={() => setShowModal(true)}>
            保存する
          </Button>
          <Link to="/history">
            履歴を見る
          </Link>
        </Header>
      </HeaderArea>
      <Wrapper>
        <TextArea
          onChange={(event) => setText(event.target.value)}
          value={text}
        />
        <Preview>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </Preview>
      </Wrapper>
      {showModal && (
        <SaveModal
          onSave={(title: string): void => {
            putMemo(title, text)
            setShowModal(false)
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  )
}