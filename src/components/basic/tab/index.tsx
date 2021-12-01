import React from "react";
import styled from "styled-components";
import { CloseButton } from "../closeButton";


const PageButtonWrapper = styled.div<{$active: boolean}>`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 112px;
    height: 40px;
    flex-shrink: 0;
    color: ${props => props.$active ? '#fff' : '#666'};
    background-color: ${props => props.$active ? '#2a313c' : '#222831'};
    cursor: pointer;
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
    padding: 0 15px;
`;




export interface TabProps {
    closeOnClick?: Function
    onClick?: Function
    active: boolean
    children: React.ReactNode
}

export default function Tab(props: TabProps) {
    return (
        <PageButtonWrapper
            $active={props.active}
            onClick={e => props.onClick && props.onClick(e)}
            >
            <PageButton title={props.children?.toString()}>{ props.children }</PageButton>
            <CloseButton
                className="close-button"
                onClick={props.closeOnClick}
                />
        </PageButtonWrapper>
    );
}




