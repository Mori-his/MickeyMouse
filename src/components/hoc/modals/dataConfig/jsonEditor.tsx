import ownerCaretaker from "@models/owners";
import { RootWidget } from "@widgets/root";
import JSONEditor from "jsoneditor";
import { useEffect, useRef } from "react";
import styled from "styled-components";


const DataConfigModalWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 80vw;
    height: 70vh;
    background-color: ${props => props.theme.complementaryColor};
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 3px 6px rgba(0, 0, 0, .3);
`;

const JSONEditorWrapper = styled.div`
    height: 70vh;
    .jsoneditor .ace-jsoneditor .ace_gutter {
        background-color: ${props => props.theme.contrast};
    }
`;


export const JSONEditorBox = function() {
    const JSONEditorRef = useRef<HTMLDivElement>(null);
    const editor = useRef<JSONEditor | null>(null);
    const editorIsError = useRef(false);

    const initJSONEditor = async function() {
        if (JSONEditorRef.current) {
            const { default: JSONEditor } = await import('jsoneditor');
            const root = ownerCaretaker.currOwner.firstChild as RootWidget;
            editor.current = new JSONEditor(JSONEditorRef.current, {
                modes: ['tree', 'code'],
                onChange() {
                    if (editor.current) {
                        try {
                            const jsonString = editor.current.getText();
                            if (jsonString) {
                                const json = JSON.parse(jsonString);
                                root.setH5Data(json);
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
            if (root.h5Data) {
                editor.current?.set(root.h5Data);
            }
        }
    }


    useEffect(() => {
        initJSONEditor();
        return () => {
            editor.current?.destroy();
        }
    }, []);
    return (
        <DataConfigModalWrapper>
            <JSONEditorWrapper
                ref={ JSONEditorRef }
                />
        </DataConfigModalWrapper>
    );
}
