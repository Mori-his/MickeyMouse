import Tippy from "@tippyjs/react";
import React, { useEffect } from "react";
import styled from "styled-components";

const FlexibleWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.contrast};
    padding: 5px 2px;
    box-shadow: 4px 0 8px ${props => props.theme.main};
	border-radius: 0px 4px 4px 0px;
    cursor: col-resize;
`;

const Strip = styled.div`
    width: 4px;
    background-color: ${props => props.theme.lesser};
	border-radius: 2px;
    margin: 0 1px;
`;

const StripSmall = styled(Strip)`
    height: 8px;
`;
const StripMiddle = styled(Strip)`
    height: 12px;
`;
const StripLarge = styled(Strip)`
    height: 18px;
`;


export interface FlexibleProps {
    onDragChange?: (x: number) => void
}

let downX: number = 0;
let isMoveLeave = true;

const handleMouseDown = function(event: React.MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    // 按下此元素
    isMoveLeave = false;
    downX = event.clientX;
}
const handleMouseLeave = function() {
    // 移出此元素
    isMoveLeave = true;
    downX = 0;
}

export default function Flexible(props: React.PropsWithChildren<FlexibleProps>) {
    useEffect(() => {
        const handleDocumentMouseUp = function() {
            if (!isMoveLeave) isMoveLeave = true
        }
        const handleDocumentMouseMove = function(event: MouseEvent) {
            if (!isMoveLeave) {
                const currentMoveX = event.clientX - downX;
                props.onDragChange && props.onDragChange(currentMoveX);
                downX = event.clientX;
            }
        }
        document.addEventListener('mouseup', handleDocumentMouseUp);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mousemove', handleDocumentMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleDocumentMouseMove);
            document.removeEventListener('mouseup', handleDocumentMouseUp);
            document.removeEventListener('mouseleave', handleMouseLeave);
        }
    }, [props]);

    return (
        <Tippy
            content="左右拖拽试试!"
            animation="scale"
            >
            <FlexibleWrapper
                onMouseDown={e => handleMouseDown(e)}
                >
                <StripSmall />
                <StripMiddle />
                <StripLarge />
            </FlexibleWrapper>
        </Tippy>
    );
}
