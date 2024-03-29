import React from "react";
import styled from "styled-components";
import IconButton from "@components/basic/iconButton";


export const CloseWrapper = styled.div<{
    $size: number
}>`
    position: absolute;
    right: 8px;
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
    const { size = 24 } = props;
    return (
        <CloseWrapper
            className={ props.className }
            onClick={(e) => props.onClick && props.onClick(e)}
            $size={ size }
            >
            <IconButton
                icon="close"
                size={ size }
                padding={ 4 }
                hoverColor="#ff0000"
                hoverBgColor="#fff"
                />
        </CloseWrapper>
    );
}

