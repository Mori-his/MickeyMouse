import { GroupBase, StylesConfig } from 'react-select';
import { createGlobalStyle, css } from 'styled-components';
import theme from './layout.theme';


export const CustomScrollbar = css`
    &::-webkit-scrollbar {
        /* display: none; */
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 4px;
    }
    &::-webkit-scrollbar-thumb {
        // 滚动滑块
        background-color: #f7f7f7;
        border-radius: 2x;
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
        height: 0;
    }
    &::-webkit-scrollbar-button {
        width: 0;
        height: 0;
        // 两端按钮
        background-color: transparent;
    }
    &:hover {
        &::-webkit-scrollbar {
            display: block;
        }
    }
`;

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
    html {
        font-size: 37.5px;
    }
    body {
        line-height: 1;
        font-size: 14px;
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
    body {
        background-color: #222831;
        overflow: overlay;
        ${ CustomScrollbar };
    }
    input[type=number] {
        -moz-appearance:textfield;
    }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .fade-enter {
        opacity: 0;
    }
    .fade-enter-active {
        opacity: 1;
        transition: opacity .3s;
    }
    .fade-exit {
        opacity: 1;
        transform: scale(1);
    }
    .fade-exit-active {
        opacity: 0;
        transform: scale(0);
        transition: opacity .3s, scale .3s;
    }
    .tooltip-transition {
        z-index: 10;
    }
    /* Tippy主题部分 */
    .tippy-box[data-theme~='transparent'] {
        background-color: transparent;
    }


    /* JSONEditor */
    .jsoneditor {
        border: none;
        .jsoneditor-menu {
            background-color: #393E46;
            button {
                color: #fff;
            }
            button:hover {
                color: #393E46;
            }
        }
        tr.jsoneditor-highlight,
        tr.jsoneditor-selected {
            background-color: #2A313C;
        }
        div.jsoneditor-tree {
            background-color: #2A313C;
        }
        .jsoneditor-navigation-bar {
            background-color: #393E46;
            border: 1px solid #2A313C;
        }
        div.jsoneditor-field,
        div.jsoneditor-value,
        div.jsoneditor td,
        div.jsoneditor th,
        div.jsoneditor textarea,
        pre.jsoneditor-preview,
        .jsoneditor-schema-error,
        .jsoneditor-popover {
            color: #fff;
        }
        div.jsoneditor-field[contenteditable=true]:focus,
        div.jsoneditor-field[contenteditable=true]:hover,
        div.jsoneditor-value[contenteditable=true]:focus,
        div.jsoneditor-value[contenteditable=true]:hover,
        div.jsoneditor-field.jsoneditor-highlight,
        div.jsoneditor-value.jsoneditor-highlight {
            background-color: #393E46;
            border: 1px solid #393E46;
        }
        .ace-jsoneditor .ace_scroller {
            background-color: #2A313C;
        }
        .ace-jsoneditor .ace_marker-layer .ace_active-line {
            background-color: #393E46;
        }
        .ace-jsoneditor .ace_gutter {
            background-color: #2A313C;
            color: #666;
        }
        .jsoneditor-statusbar {
            background-color: #393E46;
        }
        .jsoneditor-menu a.jsoneditor-poweredBy {
            display: none;
        }
        .ace-jsoneditor .ace_cursor {
            border-left: 2px solid #fff;
        }
        .ace-jsoneditor .ace_variable {
            color: #d28f8f;
        }
        .ace-jsoneditor.ace_editor {
            background-color: transparent;
        }
        .jsoneditor-frame {
            background-color: #2A313C;
            input {
                color: #fff;
                background-color: transparent;
            }
        }
        textarea.jsoneditor-text {
            background-color: transparent;
            color: #fff;
        }
        textarea {
            ${CustomScrollbar};
        }
    }
    .padding16 {
        padding: 16px;
    }
`;

export const HiddenScrollbar = css`
    &::-webkit-scrollbar {
        display: none;
    }
`

export const selectStyle: StylesConfig<any, false, GroupBase<any>> = {
    control: (style) => ({
        ...style,
        background: theme.primary,
        border: 'none',
        width: '100%',
        borderRadius: 8,
        ":hover": {
            border: 'none',
            boxShadow: 'none',
        }
    }),
    container: (style) => ({
        ...style,
        width: 232,
        ...(CustomScrollbar as any),
    }),
    singleValue: (style) => ({
        ...style,
        color: theme.lightText,
        display: 'flex',
        alignItems: 'center',
        height: '100%',
    }),
    placeholder: (style) => ({
        ...style,
        fontSize: 13
    }),
    menu: (style) => ({
        ...style,
        backgroundColor: theme.main,
    }),
    option: (style) => ({
        ...style,
        fontSize: 14,
        ":hover": {
            backgroundColor: theme.assist,
        }
    }),
    input: (style) => ({
        ...style,
        color: theme.lightText,
    }),
    menuList: (style) => ({
        ...style,
    })
};

type ModalTransitionProps = {
    duration: number
}
export const modalTransition = (props: ModalTransitionProps) => css`
    &.modal-transition-enter {
        opacity: 0;
        & .modal-content {
            opacity: 0;
            transform: scale(0);
        }
    }
    &.modal-transition-enter-active {
        transition: opacity ${props.duration}ms;
        opacity: 1;
        & .modal-content {
            transition: opacity ${props.duration}ms, transform ${props.duration}ms;
            opacity: 1;
            transform: scale(1);
        }
    }
    &.modal-transition-exit {
        opacity: 1;
        & .modal-content {
            opacity: 1;
            transform: scale(1);
        }
    }
    &.modal-transition-exit-active {
        transition: opacity ${props.duration}ms;
        opacity: 0;
        & .modal-content {
            transition: opacity ${props.duration}ms, transform ${props.duration}ms;
            opacity: 0;
            transform: scale(0);
        }
    }
`

type MessageTransitionProps = {
    duration: number
}
export const messageTransition = (props: MessageTransitionProps) => css`
    &.message-transition-enter {
        opacity: 0;
        transform: scale(0);
    }
    &.message-transition-enter-active {
        transition: opacity ${props.duration}ms, transform ${props.duration}ms;
        opacity: 1;
        transform: scale(1);
    }
    &.message-transition-exit {
        opacity: 1;
        transform: scale(1);
    }
    &.message-transition-exit-active {
        transition: opacity ${props.duration}ms, transform ${props.duration}ms;
        transform: scale(0);
        opacity: 0;
    }
`

type OpacityTransitionProps = {
    duration: number
    fn?: string
}
export const opacityTransition = ({
    duration,
    fn = 'ease-in'
}: OpacityTransitionProps) => css`
    &.opacity-transition-enter {
        opacity: 0;
    }
    &.opacity-transition-enter-active {
        transition: opacity ${duration}ms ${fn};
        opacity: 1;
    }
    &.opacity-transition-exit {
        opacity: 1;
        transform: scale(1);
    }
    &.opacity-transition-exit-active {
        transition: opacity ${duration}ms ${fn};
        opacity: 0;
    }
`


