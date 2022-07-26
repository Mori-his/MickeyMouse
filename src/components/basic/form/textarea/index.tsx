import { CustomScrollbar } from "@styles/globals";
import React, { ChangeEvent, ReactNode, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import styled from "styled-components";

const TextareaWrapper = styled.div`
    display: flex;
    flex-direction: column;
    color: ${props => props.theme.lightText};
    font-size: 14px;
`;

const TextareaSelf = styled.textarea`
    width: 100%;
    height: ${props => props.$height}px;
    background: ${props => props.theme.primary};
    color: ${props => props.theme.lightText};
    padding: 8px;
    border-radius: 8px;
    border: none;
    outline: none;
    resize: none;
    ${ CustomScrollbar };
`;

const TextareaLabel = styled.span`
    margin: 4px 0 4px 4px;
    color: ${props => props.theme.lesser};
`;

export type TextareaRef<T extends HTMLElement = HTMLElement> = {
    textareaEl: T | null
};

export type PropsTextareaWith<T = {}> = T & {
    label?: ReactNode
    width?: number
    height?: number
    backgroundColor?: string
}

export const Textarea = React.forwardRef(function Input(
    props: PropsTextareaWith<React.ComponentProps<'textarea'>>,
    textareaRef: React.ForwardedRef<TextareaRef<HTMLTextAreaElement>>
) {
    const {
        width,
        height = 35,
        backgroundColor,
        onChange = () => {},
        label,
        ...textareaProps
    } = props;
    const currRef = useRef<HTMLTextAreaElement | null>(null);

    useImperativeHandle(
        textareaRef,
        () => ({
            textareaEl: currRef.current,
        })
    )
    const updateHeight = useCallback(function() {
        currRef.current!.style.height = `${height}px`;
        currRef.current!.style.height = `${currRef.current?.scrollHeight}px`;
    }, [height])

    const handleTextareaChange = function(event: ChangeEvent<HTMLTextAreaElement>) {
        updateHeight();
        onChange(event);
    }

    useEffect(() => {
        updateHeight();
    }, [updateHeight, textareaProps.value]);



    return (
        <TextareaWrapper>
            { label && <TextareaLabel>{ label }</TextareaLabel> }
            <TextareaSelf
                { ...textareaProps }
                ref={ currRef }
                $height={ height }
                onChange={ (event) => handleTextareaChange(event) }
                >
            </TextareaSelf>
        </TextareaWrapper>
    );
});
