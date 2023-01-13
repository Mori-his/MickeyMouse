import { useEffect, useRef } from "react";
import JSONEditor from "jsoneditor";
import styled from "styled-components";
import Button from "../button";
import IconButton from "../iconButton";

const ImportJsonWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 80vw;
    height: 70vh;
    background-color: ${props => props.theme.complementaryColor};
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 3px 6px rgba(0, 0, 0, .3);
`;

const ToolWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    padding: 8px 16px 4px;
    background-color: ${props => props.theme.contrast};
    border-radius: 16px 16px 0 0;
`;

const JSONEditorWrapper = styled.div`
    height: 70vh;
    .jsoneditor .ace-jsoneditor .ace_gutter {
        background-color: ${props => props.theme.contrast};
    }
`;

interface IImportJsonModalProps {
    onClose?: Function
    onImport?: Function
}

export const ImportJsonModal = function(props: IImportJsonModalProps) {
    const {
        onClose = () => null,
        onImport = () => null
    } = props;
    const editorElRef = useRef(null);
    const editor = useRef<JSONEditor | null>(null);
    const editorIsError = useRef(false);
    const importJson = useRef({});

    const initJSONEditor = async function() {
        if (editorElRef.current) {
            const { default: JSONEditor } = await import('jsoneditor');
            editor.current = new JSONEditor(editorElRef.current, {
                modes: ['code'],
                onChange() {
                    if (editor.current) {
                        try {
                            const jsonString = editor.current.getText();
                            if (jsonString) {
                                const json = JSON.parse(jsonString);
                                importJson.current = json;
                            }
                            editorIsError.current = false;
                        } catch (err) {
                            editorIsError.current = true;
                        }
                    }
                },
                onError() {
                    editorIsError.current = true;
                }
            });
        }
    }

    const handleImportClick = function() {
        if (!editorIsError.current) {
            // 只有为真的时候触发导入
            onImport(importJson.current)
        } else {
            console.log('请解决错误后点击导入');
        }
    }

    useEffect(() => {
        setTimeout(() => {
            initJSONEditor();
            // 这个毫秒数一定要大于弹框动画时长 要不会卡死
            // JSONEditor的问题
        }, 500);
        return () => {
            editor.current?.destroy();
        }
    }, []);
    

    return (
        <ImportJsonWrapper>
            <ToolWrapper>
                <Button
                    onClick={ () => handleImportClick() }
                    >导入</Button>
                <IconButton
                    icon="close"
                    size={ 24 }
                    padding={ 8 }
                    margin={{ left: 16 }}
                    onClick={ () => onClose()}
                    />
            </ToolWrapper>
            <JSONEditorWrapper
                ref={ editorElRef }
                />
        </ImportJsonWrapper>
    );
}
