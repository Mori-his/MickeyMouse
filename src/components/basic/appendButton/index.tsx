import React from "react";
import styled from "styled-components";

const AppendButtonWrapper = styled.div`
    cursor: pointer;
    &:hover {
        .append-line {
            stroke: #fff;
        }
    }
`;

export interface AppendButtonProps {
    className?: string
    onClick?: Function
}

export default function AppendButton(props: React.PropsWithChildren<AppendButtonProps>) {
    return (
        <AppendButtonWrapper
            className={ props.className }
            onClick={e => props.onClick && props.onClick(e)}
            >
            <svg id="append-group" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                <rect id="rect_419" data-name="rect 419" width="32" height="32" rx="16" fill="#141719"/>
                <g id="append" transform="translate(4 4)">
                    <rect id="加号容器" width="24" height="24" fill="none"/>
                    <line
                        id="横线"
                        className="append-line"
                        x2="15"
                        transform="translate(4.5 12.5)"
                        fill="none"
                        stroke="#707070"
                        strokeLinecap="round"
                        strokeWidth="4"
                        />
                    <line
                        id="竖线"
                        className="append-line"
                        x2="15"
                        transform="translate(12 5) rotate(90)"
                        fill="none"
                        stroke="#707070"
                        strokeLinecap="round"
                        strokeWidth="4"
                    />
                </g>
            </svg>
        </AppendButtonWrapper>
    );
}
