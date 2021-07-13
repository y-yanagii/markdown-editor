import * as React from 'react'
import { render } from 'react-dom'
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Editor } from './pages/editor';
import { History } from './pages/history';
import { useStateWithStorage } from './hooks/use_state_with_storage';

// styled.HTMLタグ名で生成したいHTMLタグを指定してその後続く``内にCSSを記述すると、そのコンポーネントにスタイルが適用される
// styled-componentsのcreateGlobalStyle使ってページ全体に適用できるスタイル
const GlobalStyle = createGlobalStyle`
  body * {
    box-sizing: border-box;
  }
`

// localStorageでデータの参照・保存に使うキー名を決定（ファイルパス：値の名前）
const StorageKey = '/editor:text'

const Main: React.FC = () => {
  // 初期値localStorageから取得
  const [text, setText] = useStateWithStorage('', StorageKey)

  return (
    <>
      <GlobalStyle />
      <Router>
        <Switch>
          <Route exact path="/editor">
            <Editor
              text={text}
              setText={setText}
            />
          </Route>
          <Route exact path="/history">
            <History
              setText={setText}
            />
          </Route>
          <Redirect to="/editor" path="*" />
        </Switch>
      </Router>
    </>
  )
}

render(<Main />, document.getElementById('app'));