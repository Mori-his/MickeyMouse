import Tippy from "@tippyjs/react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface FlexibleWrapperProps {
    isMoving: boolean
}
const FlexibleWrapper = styled.div<FlexibleWrapperProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.isMoving ? props.theme.assist : props.theme.contrast};
    padding: 5px 2px;
    box-shadow: 4px 0 8px ${props => props.theme.main};
	border-radius: 0px 4px 4px 0px;
    cursor: col-resize;
    height: 100%;
    &:hover {
        background-color: ${props => props.theme.assist};
    }
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


export default function Flexible(props: React.PropsWithChildren<FlexibleProps>) {
    const [isMoving, setisMoving] = useState(false)

    const handleMouseDown = function(event: React.MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
        // 按下此元素
        isMoveLeave = false;
        downX = event.clientX;
        setisMoving(true);
    }
    const handleMouseLeave = function() {
        // 移出此元素
        isMoveLeave = true;
        downX = 0;
        setisMoving(false);
    }

    useEffect(() => {
        const handleDocumentMouseUp = function() {
            if (!isMoveLeave) isMoveLeave = true
            setisMoving(false);
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
        <FlexibleWrapper
            onMouseDown={e => handleMouseDown(e)}
            isMoving={ isMoving }
            >
            {/* <StripSmall />
            <StripMiddle />
            <StripLarge /> */}
        </FlexibleWrapper>
    );
}
