import styled from "styled-components";
import IconButton from "../iconButton";
import { forwardRef, ReactNode, useEffect, useImperativeHandle, useRef, useState } from "react";
import JSONEditor from "jsoneditor";
import 'jsoneditor/dist/jsoneditor.css';
import { CustomScrollbar } from "@styles/globals";

// const wrapperWidth = 776;
// const wrapperHeight = 544;
const wrapperBorderRadius = 16;

const TreeJsonWrapper = styled.div`
    position: relative;
    display: flex;
    width: 80vw;
    height: 80vh;
    background-color: #2A313C;
    border-radius: ${wrapperBorderRadius}px;
    overflow: hidden;
    box-shadow: 0 3px 6px rgba(0, 0, 0, .3);
`;


const treeContainerWidth = 312;
const TreeContainer = styled.div`
    flex-shrink: 0;
    width: ${treeContainerWidth}px;
    height: 80vh;
    border-top-left-radius: ${wrapperBorderRadius}px;
    border-bottom-left-radius: ${wrapperBorderRadius}px;
    background-color: #393E46;
    overflow: overlay;
    padding: 0 8px;
    ${ CustomScrollbar }
`;

const JsonContainer = styled.div`
    flex: 1;

    .jsoneditor-search {
        right: 104px;
    }
`;

const TreeJsonActions = styled.div`
    position: absolute;
    right: 8px;
    top: 4px;
    display: flex;
    align-items: center;
`;

export type TreeJsonModalRef<T extends HTMLElement = HTMLElement> = {
    treeJsonWrapperEl: React.RefObject<T>
    editor: JSONEditor | null
}
export interface TreeJsonModalProps {
    onClose?: Function
    onLoaded?: (editor: JSONEditor) => void
    placeholder?: Object
    actions?: ReactNode
    tree: ReactNode
}

export default forwardRef(function TreeJsonModal(
    props: TreeJsonModalProps,
    modalRef: React.ForwardedRef<TreeJsonModalRef<HTMLDivElement>>
) {
    const {
        onClose = () => {},
        onLoaded = () => {},
        actions,
        tree,
    } = props;

    const [editor, setEditor] = useState<JSONEditor | null>(null);

    const jsonContainerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<JSONEditor | null>(null);
    const treeJsonWrapperRef = useRef(null);

    const initJSONEditor = async function() {

        if (jsonContainerRef.current) {
            const {default: JSONEditor} = await import("jsoneditor");
            editorRef.current = new JSONEditor(jsonContainerRef.current, {
                modes: ['code', 'view'],
                language: 'zh-CN',
                onEditable() {
                    return false;
                }
            });
            setEditor(editorRef.current);
            onLoaded(editorRef.current!);
        }
    }

    useImperativeHandle(modalRef, () => ({
        treeJsonWrapperEl: treeJsonWrapperRef,
        editor: editor
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [editor]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        setTimeout(() => {
            initJSONEditor();
            // 这个毫秒数一定要大于弹框动画时长 要不会卡死
            // JSONEditor的问题
        }, 500);
        return () => {
            if (editorRef.current) {
                editorRef.current.destroy();
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    


    return (
        <TreeJsonWrapper
            ref={ treeJsonWrapperRef }
            >
            <TreeContainer>
                { tree }
            </TreeContainer>
            <JsonContainer ref={ jsonContainerRef } />
            <TreeJsonActions>
                { actions }
                <IconButton
                    icon="close"
                    padding={ 8 }
                    size={ 16 }
                    $title='关闭'
                    onClick={ () => onClose() }
                    />
            </TreeJsonActions>
        </TreeJsonWrapper>
    );
});
