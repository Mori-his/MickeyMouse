import React, { ChangeEvent, FormEvent, useCallback } from "react";
import styled from "styled-components";


const InputWrapper = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    width: ${props => props.$width && `${props.$width}px`};
`;

const InputBackground = styled.div<{
    backgroundColor?: string
}>`
    flex: 1;
    display: flex;
    align-items: center;
    background-color: ${props => props.backgroundColor || props.theme.primary};
    border-radius: 8px;
`;
type InputSelfProps = {
    center: Boolean;
}
const InputSelf = styled.input<InputSelfProps>`
    width: 100%;
    ${props => `
        height: ${props.$height}px;
        line-height: ${props.$height}px;
        color: ${props.theme.lightText};
        ${props.center && `text-align: center;`};
    `};
    background-color: transparent;
    padding: 8px;
    box-sizing: border-box;
    border: none;
    outline: none;
    &:focus,
    &:active,
    &:hover {
        border: none;
        outline: none;
    }
`;

export const InputLabel = styled.span`
    min-width: 80px;
    text-align: right;
    margin-right: 8px;
    color: ${props => props.theme.white30};
`;

type PropsInputWith<P = {}> = P & {
    label?: string
    name?: string
    width?: number
    height?: number
    center?: boolean
    backgroundColor?: string
    after?: React.ReactChild
    before?: React.ReactChild
};

const Input = React.forwardRef(function Input(props: PropsInputWith<React.ComponentProps<'input'>>, InputRef: React.ForwardedRef<HTMLInputElement>) {
    const {
        label,
        width,
        height = 32,
        name,
        center = false,
        before,
        after,
        onInput = () => {},
        type = 'text',
        backgroundColor,
        ...propsAll
    } = props;


    const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if (type === 'number') {
            // 替换非0-9的字符
            event.target.value = event.target.value.replace(/[^0-9]/, '');
        }
        onInput(event);
    }, [onInput, type]);

    return (
        <InputWrapper
            $width={ width }
            >
            { label && (<InputLabel>{ label }</InputLabel>) }
            <InputBackground
                backgroundColor={ backgroundColor }
                >
                { before }
                <InputSelf
                    { ...propsAll }
                    type={type === 'number' ? 'text' : type}
                    onInput={ (e: ChangeEvent<HTMLInputElement>) => handleInput(e) }
                    name={ name }
                    $height={ height }
                    center={ center }
                    ref={ InputRef }
                    />
                { after }
            </InputBackground>
        </InputWrapper>
    );
});

export default Input;
