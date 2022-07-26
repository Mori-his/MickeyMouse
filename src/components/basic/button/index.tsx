import React, { ReactNode } from "react";
import styled, { css } from "styled-components";


export type ButtonType = 'primary' | 'secondary' | 'warning' | 'success' | 'danger' | 'info' | 'light' | 'dark';
interface ButtonStyleProps {
    outline?: boolean
    disabled?: boolean
    variant: ButtonType
}


const ButtonWrapper = styled.div<ButtonStyleProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 64px;
    height: 32px;
    padding: 8px;
    border-radius: 8px;
    color: ${props => props.theme.light};
    font-size: 14px;
    background-color: ${props => props.theme.primary};
    cursor: pointer;
    ${({theme, variant}) => theme.buttons && variant && theme.buttons[variant]};
    ${ props => props.disabled ? `
        opacity: 0.65;
        cursor: auto;
    ` : ''};
    &:hover {
        background-color: ${props => props.theme.assist};
    }
`;

/**
 * TODO 
 * 1、禁止按钮
 */

type ButtonProps<P> = P & {
    children: ReactNode
    variant?: ButtonType
    disabled?: boolean
}
const Button = React.forwardRef(function Button(
    props: ButtonProps<React.ComponentProps<'div'>>,
    btnRef: React.ForwardedRef<HTMLDivElement>
) {
    const {
        ref,
        children,
        variant = 'primary',
        ...divProps
    } = props

    const handleButtonClick = function(event: any) {
        if (divProps.disabled) return;
        props.onClick && props.onClick(event);
    }

    return (
        <ButtonWrapper
            ref={ btnRef }
            onClick={ handleButtonClick }
            variant={ variant }
            { ...divProps }
            >
            { children }
        </ButtonWrapper>
    );
})

export default Button;
