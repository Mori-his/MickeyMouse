import { createGlobalStyle, css } from 'styled-components';


export const GlobalStyle = createGlobalStyle`
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure, 
    footer, header, hgroup, menu, nav, section {
        display: block;
    }
    body {
        line-height: 1;
    }
    ol, ul {
        list-style: none;
    }
    blockquote, q {
        quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }
`;

export const HiddenScrollbar = css`
    &::-webkit-scrollbar {
        display: none;
    }
`

export const CustomScrollbar = css`
    &::-webkit-scrollbar {
        display: none;
        position: absolute;
        top: 0;
        height: 4px;
    }
    &::-webkit-scrollbar-thumb {
        // 滚动滑块
        background-color: red;
    }
    &::-webkit-scrollbar-track {
        // 外层轨道
        background-color: transparent;
        
    }
    &::-webkit-scrollbar-track-piece {
        // 内层轨道
        background-color: transparent;
    }
    &::-webkit-scrollbar-corner {
        // 边角
        background-color: transparent;
    }
    &::-webkit-scrollbar-button {
        width: 0;
        // 两端按钮
        background-color: transparent;
    }
    &:hover {
        &::-webkit-scrollbar {
            display: block;
        }
    }
`;
