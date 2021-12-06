import React from "react";
import styled from "styled-components";
import IconButton from "../iconButton";


export const CloseWrapper = styled.div<{
    $size: number
}>`
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: ${ props => props.$size}px;
    height: ${ props => props.$size}px;
    cursor: pointer;
`;


export const CloseIcon = styled.div``;

export interface CloseButtonProps {
    onClick?: Function
    className?: string
    size?: number
}

export function CloseButton(props: React.PropsWithChildren<CloseButtonProps>) {
    const { size = 32 } = props;
    return (
        <CloseWrapper
            className={ props.className }
            onClick={(e) => props.onClick && props.onClick(e)}
            $size={ size }
            >
            <IconButton
                active={ false }
                icon="close"
                size={ size }
                hoverColor="#ff0000"
                hoverBgColor="#fff"
                />
        </CloseWrapper>
    );
}

