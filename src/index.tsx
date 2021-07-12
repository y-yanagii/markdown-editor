import * as React from 'react'
import { render } from 'react-dom'
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { Editor } from './pages/editor';

// styled.HTMLタグ名で生成したいHTMLタグを指定してその後続く``内にCSSを記述すると、そのコンポーネントにスタイルが適用される
// styled-componentsのcreateGlobalStyle使ってページ全体に適用できるスタイル
const GlobalStyle = createGlobalStyle`
  body * {
    box-sizing: border-box;
  }
`

const Main = (
  <>
    <GlobalStyle />
    <Editor />
  </>
)

render(Main, document.getElementById('app'));