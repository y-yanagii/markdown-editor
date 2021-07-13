import * as React from 'react';
import styled from 'styled-components';
import { useStateWithStorage } from '../hooks/use_state_with_storage';
import * as ReactMarkdown from 'react-markdown';
import { putMemo } from '../indexeddb/memos';
import { Button } from '../components/button';

// useState関数をReactから取り出す
// const { useState } = React; // import { useState } from 'react'と同等

const Header = styled.header`
  align-content: center;
  display: flex;
  font-size: 1.5rem;
  height: 2rem;
  justify-content: space-between;
  left: 0;
  line-height: 2rem;
  padding: 0.5rem 1rem;
  position: fixed;
  right: 0;
  top: 0;
`

const HeaderControl = styled.div`
  height: 2rem;
  display: flex;
  align-content: center;
`

const Wrapper = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 3rem;
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

// localStorageでデータの参照・保存に使うキー名を決定（ファイルパス：値の名前）
const StorageKey = 'pages/editor:text';

// .FCでFunction Component型であることを明示。（TypeScriptの書き方）
export const Editor: React.FC = () => {
  // 初期値localStorageから取得
  // const [text, setText] = useState<string>(localStorage.getItem(StorageKey) || ''); // <TypeScriptで型指定してる>
  const [text, setText] = useStateWithStorage('', StorageKey); // useStateの代わりに独自のカスタムフック

  // indexedDBの保存処理を呼び出す
  const saveMemo = (): void => {
    putMemo('TITLE', text) // 引数にタイトルとエディターの中身を渡す
  }

  return (
    <>
      <Header>
        Markdown Editor
        <HeaderControl>
          <Button onClick={saveMemo}>
            保存する
          </Button>
        </HeaderControl>
      </Header>
      <Wrapper>
        <TextArea
          onChange={(event) => setText(event.target.value)}
          value={text}
        />
        <Preview>
          <ReactMarkdown>
            {text}
          </ReactMarkdown>
        </Preview>
      </Wrapper>
    </>
  )
}