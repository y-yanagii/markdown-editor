import * as React from 'react';
import {
  Link,
  useHistory,
} from 'react-router-dom';
import styled from 'styled-components';
import { Header } from '../components/header';
import {
  getMemoPageCount,
  getMemos,
  MemoRecord,
} from '../indexeddb/memos';

const { useState, useEffect } = React;

const HeaderArea = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  left: 0;
`

const Wrapper = styled.div`
  bottom: 3rem;
  left: 0;
  position: fixed;
  right: 0;
  top: 3rem;
  padding: 0 1rem;
  overflow-y: scroll;
`

const Memo = styled.button`
  display: block;
  background-color: white;
  border: 1px solid gray;
  width: 100%;
  padding: 1rem;
  margin: 1rem 0;
  text-align: left;
`

const MemoTitle = styled.div`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`

const MemoText = styled.div`
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Paging = styled.div`
  bottom: 0;
  height: 3rem;
  left: 0;
  line-height: 2rem;
  padding: 0.5rem;
  position: fixed;
  right: 0;
  text-align: center;
`

const PagingButton = styled.button`
  background: none;
  border: none;
  display: inline-block;
  height: 2rem;
  padding: 0.5rem 1rem;

  &:disabled {
    color: silver;
  }
`

interface Props {
  setText: (text: string) => void;
}

export const History: React.FC<Props> = (props) => {
  const { setText } = props;

  // const history = useHistory() // Reactのカスタムフックでhistoryはブラウザの履歴を扱うためのAPIを提供してくれる
  const [memos, setMemos] = useState<MemoRecord[]>([]);
  const [page, setPage] = useState(1); // 現在ページ
  const [maxPage, setMaxPage] = useState(1); // 最大ページ
  const history = useHistory();

  // mount時のみ実行
  useEffect(() => {
    // getMemos関数を実行し、非同期処理が終わったら取得したテキスト履歴をsetMemosに渡して更新しています
    // setMemosによって更新されると再描画が実行され、取得された内容が表示される
    getMemos(1).then(setMemos) // 初回１ページ目のみ取得
    getMemoPageCount().then(setMaxPage);
  }, []);

  const canNextPage: boolean = page < maxPage; // 次ページへ遷移できるかどうか
  const canPrevPage: boolean = page > 1; // 前ページへ遷移できるかどうか

  // 引数に遷移したいページ数を指定しページネーション処理
  const movePage = (targetPage: number) => {
    if (targetPage < 1 || maxPage < targetPage) {
      return
    }
    setPage(targetPage)
    getMemos(targetPage).then(setMemos);
  }

  return (
    <>
      <HeaderArea>
        <Header title="履歴">
          <Link to="/editor">
            エディタに戻る
          </Link>
        </Header>
      </HeaderArea>
      <Wrapper>
        {memos.map(memo => (
          <Memo
            key={memo.datetime}
            onClick={() => {
              setText(memo.text)
              history.push('/editor')
            }}
          >
            <MemoTitle>{memo.title}</MemoTitle>
            <MemoText>{memo.text}</MemoText>
          </Memo>
        ))}
      </Wrapper>
      {/* <h1>History</h1>
      <Button onClick={() => history.push('/editor')}>
        エディタへ戻る
      </Button> */}
      <Paging>
        <PagingButton
          onClick={() => movePage(page - 1)}
          disabled={!canPrevPage}
        >
          ＜
        </PagingButton>
        {page} / {maxPage}
        <PagingButton
          onClick={() => movePage(page + 1)}
          disabled={!canNextPage}
        >
          ＞
        </PagingButton>
      </Paging>
    </>
  )
}