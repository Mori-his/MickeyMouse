import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { CloseButton } from "@components/basic/closeButton";
import Tippy from "@tippyjs/react";


const PageButtonWrapper = styled.div<{$active: boolean}>`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 112px;
    height: 40px;
    flex-shrink: 0;
    color: ${props => props.$active ? props.theme.lightText : props.theme.lesserText};
    background-color: ${props => props.$active ? props.theme.complementaryColor : props.theme.main};
    cursor: pointer;
    border-right: 1px solid ${props => props.theme.primary};
    border-width: ${props => props.$active ? 0 : 1}px;
    font-size: 14px;
    box-sizing: border-box;
    .close-button {
        display: ${props => props.$active ? 'block' : 'none'};
    }
    &:hover {
        .close-button {
            display: block;
        }
    }
`;

const PageButton = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 32px 0 8px;
`;

const TabInput = styled.input`
    width: 112px;
    height: 40px;
    box-sizing: border-box;
    border: none;
    outline: none;
    background-color: transparent;
    padding: 0 32px 0 8px;
    color: ${props => props.theme.lightText};
    font-size: 14px;
    &:active,
    &:focus {
        border: none;
        outline: none;
    }
`



export interface TabProps {
    onClose?: Function
    onClick?: Function
    onNameChange?: Function
    active: boolean
    children: React.ReactNode
    isRename?: boolean
    $title?: string
}

export default function Tab(props: TabProps) {
    const [isDoubleClick, setIsDoubleClick] = useState(false);
    const handleDoubleClick = function(event: React.MouseEvent) {
        setIsDoubleClick(true);
    }
    const handleInputKeyUp = function(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.code === 'Enter') {
            setIsDoubleClick(false)
            props.onNameChange && props.onNameChange(event.currentTarget.value);
        }
    }
    const handleInputBlur = function(event: React.FocusEvent<HTMLInputElement>) {
        setIsDoubleClick(false)
        props.onNameChange && props.onNameChange(event.currentTarget.value);
    }

    const handleInputFocus = function(tabInput: HTMLInputElement | null) {
        tabInput?.focus();
        tabInput?.select();
    }

    return (
        <Tippy
            content={props.$title}
            animation="scale"
            theme="light"
            disabled={ !props.$title }
            >
            <PageButtonWrapper
                $active={props.active}
                onClick={e => props.onClick && props.onClick(e)}
                >
                {
                    // 如果按钮被双击则修改当前项的Name
                    isDoubleClick ? (
                        <TabInput
                            onKeyUp={e => handleInputKeyUp(e)}
                            onBlur={e => handleInputBlur(e)}
                            ref={handleInputFocus}
                            defaultValue={ props.children?.toString() }
                            />
                    ) : (
                        <PageButton
                            onDoubleClick={e => handleDoubleClick(e)}
                            >{ props.children }</PageButton>
                    )
                }
                <CloseButton
                    className="close-button"
                    onClick={ props.onClose }
                    size={ 16 }
                    />
            </PageButtonWrapper>
        </Tippy>
    );
}




