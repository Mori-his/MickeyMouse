import { isNumber } from "lodash";
import { nanoid } from "nanoid";
import React, { ChangeEvent, CSSProperties, KeyboardEvent, ReactNode, StyleHTMLAttributes, useCallback, useRef, useState } from "react";
import styled from "styled-components";


const InputWrapper = styled.div`
    display: flex;
    align-items: center;
    width: ${props => props.$width ? `${props.$width}px` : '100%'};
    font-size: 14px;
`;

const InputGroup = styled.div`
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
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
        ${props.center ? `text-align: center;` : ''};
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

interface InputLabelProps {
    animation: boolean
    isValue: boolean
    isFocus: boolean
}
export const InputLabel = styled.label<InputLabelProps>`
    min-width: 80px;
    text-align: right;
    margin-right: 8px;
    color: ${props => props.theme.white30};
    ${props => props.animation ? `
        position: absolute;
        top: 8px;
        text-align: center;
        z-index: 3;
        margin-right: 0;
        transition: transform 150ms ease-out, font-size 150ms ease-out, color 150ms ease-out;
        cursor: text;
        width: 100%;
        min-width: 0;
        ${props.isValue ? `
            transform: translateY(-180%);
            font-size: 11px;
        ` : `
            color: ${props.theme.white30};
        `}
        ${props.isFocus ? `
            color: ${props.theme.assist};
        ` : ''}
    ` : ''};
`;

type PropsInputWith<P = {}> = P & {
    label?: ReactNode
    labelAnimation?: boolean
    name?: string
    width?: number
    height?: number
    center?: boolean
    backgroundColor?: string
    after?: ReactNode
    before?: ReactNode
    wrapperStyle?: CSSProperties
    select?: boolean
    // 上下键自动加减值，只有在type = number的时候生效
    auto?: boolean
    onArrowDown?: Function
    onArrowUp?: Function
    minimum?: number
    maximun?: number
};

const Input = React.forwardRef(function Input(
    props: PropsInputWith<React.ComponentProps<'input'>>,
    inputRef: React.ForwardedRef<HTMLInputElement>
) {

    const inputId = nanoid(6);
    const {
        id = `layout_Input_${inputId}`,
        label,
        labelAnimation = false,
        value,
        defaultValue,
        width,
        height = 32,
        name,
        center = false,
        select = false,
        auto = false,
        before,
        after,
        type = 'text',
        backgroundColor,
        onInput = () => {},
        onFocus = () => {},
        onBlur = () => {},
        onArrowDown = () => {},
        onArrowUp = () => {},
        onKeyDown = () => {},
        onChange = () => {},
        placeholder,
        wrapperStyle,
        minimum,
        maximun,
        ...propsAll
    } = props;

    const ref = useRef<HTMLInputElement | null>(null);
    const [focusState, setFocusState] = useState(false);

    const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if (type === 'number') {
            const value = event.target.value;
            const firstChar = value.charAt(0);
            let targetValue = value;
            if (firstChar === '-') {
                const subValue = value.substring(1);
                const newValue = subValue.replace(/[^0-9\.]/, '');
                targetValue = `${firstChar}${newValue}`;
            } else {
                // 替换非0-9的字符
                targetValue = event.target.value.replace(/[^0-9\.]/, '');
            }

            event.target.value = targetValue;
        }
        onInput(event);
    }, [onInput, type]);

    const handleFocus = function(event: React.FocusEvent<HTMLInputElement>) {
        select && ref.current?.select();
        setFocusState(true);
        onFocus(event);
    }

    const handleBlur = function(event: React.FocusEvent<HTMLInputElement>) {
        setFocusState(false);
        const value = event.target.value;
        if (isNumber(minimum) && +value < minimum) {
            event.target.value = minimum.toString();
        }
        if (isNumber(maximun) && +value > maximun) {
            event.target.value = maximun.toString();
        }
        onBlur(event);
    }

    const handleRef = function(el: HTMLInputElement) {
        if (typeof inputRef === 'function') {
            inputRef(el);
        } else {
            inputRef && (inputRef.current = el);
        }
        ref.current = el;
    }

    const handleInputKeyDown = function(event: KeyboardEvent<HTMLInputElement> & ChangeEvent<HTMLInputElement>) {
        if (type === 'number') {
            if (event.key === 'ArrowDown') {
                // 向下按键
                onArrowDown(event);
                if (auto) {
                    event.target.value = (+event.target.value - 1).toString();
                    onChange(event);
                }
            }
            if (event.key === 'ArrowUp') {
                // 向上按键
                onArrowUp(event);
                if (auto) {
                    event.target.value = (+event.target.value + 1).toString();
                    onChange(event);
                }
            }
        }
        onKeyDown(event);
    }

    return (
        <InputWrapper
            $width={ width }
            style={ wrapperStyle }
            >
            { before }
            <InputBackground
                backgroundColor={ backgroundColor }
                >
                <InputGroup>
                    { label && (<InputLabel
                        animation={ labelAnimation }
                        isValue={ Boolean(value?.toString()) || Boolean(defaultValue?.toString()) || focusState }
                        isFocus={ focusState }
                        htmlFor={ id }
                        >{ label }</InputLabel>) }
                            <InputSelf
                                { ...propsAll }
                                ref={ handleRef }
                                id={ id }
                                value={ value }
                                defaultValue={ defaultValue }
                                type={type === 'number' ? 'text' : type}
                                name={ name }
                                $height={ height }
                                center={ center }
                                placeholder={ labelAnimation ? '' : placeholder }
                                onInput={ handleInput }
                                onFocus={ handleFocus }
                                onBlur={ handleBlur }
                                onKeyDown={ handleInputKeyDown }
                                onChange={ onChange }
                                />
                </InputGroup>
                { after }
            </InputBackground>
        </InputWrapper>
    );
});

export default Input;
