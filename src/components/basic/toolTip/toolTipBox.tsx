import React, { useRef, useEffect, useState } from "react";
import { CSSTransition } from 'react-transition-group';
import { createPortal } from 'react-dom';
import styled, { keyframes } from "styled-components";
import { getOffsetLeft, getOffsetTop, getStyleAttr } from "../../../utils/styleTool";

const transitionName = 'tooltip';
const transitionTime = 300;
const arrowSize = 8;



export type ToolTipSize = 'small' | 'middle' | 'large';
const sizeData: {[P in ToolTipSize]: number} = {
    small: 300,
    middle: 500,
    large: 700
}

const ToolTipArrow = styled.div`
    position: absolute;
    top: -16px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border: ${arrowSize}px solid transparent;
    border-color: transparent transparent #e2e2e2  transparent;
`

const ToolTipBox = styled.div<{
    isAttach: boolean
    sizeValue: number
    top: number
    left: number
}>`
    position: absolute;
    left: ${props => props.left }px;
    top: ${props => props.top + 8 }px;
    max-width: ${ props => props.sizeValue }px;
    color: #5b5b5b;
    background-color: #e2e2e2;
	box-shadow: 0px 2px 8px 0px #222831;
    padding: 10px;
    border-radius: 4px;
    font-size: 12px;
    &.${transitionName}-enter {
        opacity: 0;
    }
    &.${transitionName}-enter-active {
        opacity: 1;
        transition: opacity ${ transitionTime }ms;
    }
    &.${transitionName}-exit {
        opacity: 1;
    }
    &.${transitionName}-exit-active {
        opacity: 0;
        transition: opacity ${ transitionTime }ms;
    }
`

export type Placement = 'top' | 'top-start' | 'top-end' |
                 'bottom' | 'bottom-start' | 'bottom-end' |
                 'right' | 'right-start' | 'right-end' |
                 'left' | 'left-start' | 'left-end';


export interface ToolTipAttachProps {
    title: string
    toolTipEl: HTMLDivElement
    isAttach: boolean
    size: ToolTipSize
    placement: Placement
}

class TooltipComputed {

    targetElStyles!: CSSStyleDeclaration
    toolTipElStyles!: CSSStyleDeclaration
    targetWidth!: number
    targetHeight!: number
    targetOffsetTop!: number
    targetOffsetLeft!: number
    toolTipWidth!: number
    toolTipHeight!: number

    constructor(public targetEl: HTMLElement, public toolTipEl: HTMLElement, public placement: Placement) {
        this.init();
    }

    init() {
        this.targetElStyles = getStyleAttr(this.targetEl) as CSSStyleDeclaration;
        this.toolTipElStyles = getStyleAttr(this.toolTipEl) as CSSStyleDeclaration;

        this.targetWidth = parseFloat(this.targetElStyles.width);
        this.targetHeight = parseFloat(this.targetElStyles.height);

        this.targetOffsetTop = getOffsetTop(this.targetEl);
        this.targetOffsetLeft = getOffsetLeft(this.targetEl);

        this.toolTipWidth = parseFloat(this.toolTipElStyles.width);
        this.toolTipHeight = parseFloat(this.toolTipElStyles.height);
    }

    /**
     * 是否超出边界
     * @param left 当前Left值
     * @param top  当前top值
     */
    isExceedEdges(left: number, top: number) {
        if (left > 0) return true;
        const { innerHeight, innerWidth } = window;
        if (left + this.toolTipWidth > innerWidth) return true;
        if (top + this.toolTipHeight > innerHeight) return true;
    }

    getOffsetTop() {
        let top = this.targetOffsetTop + this.targetHeight;
    }
    getOffsetLeft() {
        let left = (this.targetWidth - this.toolTipWidth) / 2 + this.targetOffsetLeft;
        if (left > 0) {
            left = 0;
        }
        return left;
    }
    getArrowLeft() {

    }
}


function ToolTipAttach(props: React.PropsWithChildren<ToolTipAttachProps>) {
    const { toolTipEl, size, placement } = props;
    const sizeValue: number = sizeData[size];
    const [toolTipTop, setToolTipTop] = useState(0);
    const [toolTipLeft, setToolTipLeft] = useState(0);
    const [toolTipArrowOffset, setToolTipArrowOffset] = useState({
        left: 0,
        top: 0
    });
    const nodeRef = React.useRef(null);

    const handleToolTipBox = function(toolTipBoxEl: HTMLDivElement) {
        if (toolTipBoxEl) {
            const targetElStyles = getStyleAttr(toolTipEl) as CSSStyleDeclaration;
            const toolTipElStyles = getStyleAttr(toolTipBoxEl) as CSSStyleDeclaration;

            const targetWidth = parseFloat(targetElStyles.width);
            const targetHeight = parseFloat(targetElStyles.height);

            const targetOffsetTop = getOffsetTop(toolTipEl);
            const targetOffsetLeft = getOffsetLeft(toolTipEl);

            const toolTipWidth = parseFloat(toolTipElStyles.width);

            setToolTipTop(targetOffsetTop + targetHeight);
            // left =  (当前元素  - 提示盒子宽度) / 2  + 目标元素的OffsetLeft
            setToolTipLeft((targetWidth - toolTipWidth) / 2 + targetOffsetLeft);
        }
    }

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
                    ref={ handleToolTipBox }
                    isAttach={ props.isAttach }
                    sizeValue={ sizeValue }
                    top={ toolTipTop}
                    left={ toolTipLeft }
                    >
                    { props.title }
                    <ToolTipArrow />
                </ToolTipBox>
            </div>
        </CSSTransition>
        , document.body
    ) : null;
}


export default ToolTipAttach;