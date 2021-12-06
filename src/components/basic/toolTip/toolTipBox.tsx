import React, { useRef, useEffect, useState } from "react";
import { CSSTransition } from 'react-transition-group';
import { createPortal } from 'react-dom';
import styled, { css } from "styled-components";
import TooltipComputed from "./toolTopComputed";

const transitionName = 'fade';
const transitionTime = 30000000;
const arrowSize = 8;

export type Placement = 'top' | 'bottom';
// 'top' | 'top-start' | 'top-end' |
// 'bottom' | 'bottom-start' | 'bottom-end' |
// 'right' | 'right-start' | 'right-end' |
// 'left' | 'left-start' | 'left-end';

export type ToolTipSize = 'small' | 'middle' | 'large';
const sizeData: {[P in ToolTipSize]: number} = {
    small: 150,
    middle: 300,
    large: 450
}

export type LeftState = {
    isLeft: boolean,
    value: number
}

export type ToolTipArrowProps = {
    left: number
    top: number
}

const ArrowBox = styled.div<ToolTipArrowProps>`
    position: absolute;
    width: 8px;
    height: 8px;
    z-index: 10;
    top: ${props => props.top}px;
    left: ${props => props.left}px;
    border: ${arrowSize}px solid transparent;
`;

const ToolTipArrowTop = styled(ArrowBox)`
    /* transform: rotate(-45deg); */
    border-color: #e2e2e2 transparent transparent  transparent;
    `
const ToolTipArrowBottom = styled(ArrowBox)`
    /* transform: rotate(45deg); */
    border-color: transparent transparent #e2e2e2  transparent;
`

type ToolTipBoxProps = {
    isAttach: boolean
    sizeValue: number
    top: number
    left: LeftState
}

/* left: ${props => props.left }px; */
const ToolTipBox = styled.div<ToolTipBoxProps>`
    position: absolute;
    top: ${props => props.top + 8 }px;
    max-width: ${ props => props.sizeValue }px;
    color: #5b5b5b;
    background-color: #e2e2e2;
    box-shadow: 0px 2px 8px 0px #222831;
    padding: 10px;
    border-radius: 4px;
    font-size: 12px;
    ${props => props.left.isLeft ? css`
        left: ${props.left.value}px;
    ` : css`
        right: ${props.left.value}px;
    `}
`



export interface ToolTipAttachProps {
    title: string
    toolTipEl: HTMLDivElement
    isAttach: boolean
    size: ToolTipSize
    placement: Placement
}

function ToolTipAttach(props: React.PropsWithChildren<ToolTipAttachProps>) {
    const { toolTipEl, size, placement } = props;
    const sizeValue: number = sizeData[size];
    const [toolTipTop, setToolTipTop] = useState(0);
    const [toolTipLeft, setToolTipLeft] = useState<{isLeft: boolean, value: number}>({
        isLeft: true,
        value: 0
    });
    const [toolTipArrowOffset, setToolTipArrowOffset] = useState({
        left: 0,
        top: 0
    });
    const [statePlacement, setStatePlacement] = useState(placement);
    const nodeRef = useRef(null);
    const toolTipBoxRef = useRef(null);

    useEffect(() => {
        if (props.isAttach && toolTipBoxRef.current) {
            const tooltipComputed = new TooltipComputed(toolTipEl, toolTipBoxRef.current, placement);
            setToolTipTop(tooltipComputed.top);
            setToolTipLeft(typeof tooltipComputed.left === 'number' ? {
                isLeft: true,
                value: tooltipComputed.left
            } : {
                isLeft: false,
                value: tooltipComputed.left.value
            });
            setToolTipArrowOffset({
                left: tooltipComputed.arrowLeft,
                top: tooltipComputed.arrowTop
            });
            setStatePlacement(tooltipComputed.placement);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isAttach]);

    return process.browser ? createPortal(
        <CSSTransition
            nodeRef={ nodeRef }
            in={ props.isAttach }
            classNames={ transitionName }
            timeout={ transitionTime }
            unmountOnExit
            >
            <div ref={ nodeRef }>
                <ToolTipBox
                    ref={ toolTipBoxRef }
                    isAttach={ props.isAttach }
                    sizeValue={ sizeValue }
                    top={ toolTipTop}
                    left={ toolTipLeft }
                    >
                    { props.title }
                    {
                        statePlacement === 'top' ?
                        <ToolTipArrowTop
                            left={toolTipArrowOffset.left}
                            top={toolTipArrowOffset.top}
                            />  :
                        <ToolTipArrowBottom
                            left={toolTipArrowOffset.left}
                            top={toolTipArrowOffset.top}
                            />
                    }
                </ToolTipBox>
            </div>
        </CSSTransition>
        , document.body
    ) : null;
}


export default ToolTipAttach;