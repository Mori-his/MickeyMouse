import React, { useEffect, useRef } from "react";
import styled from "styled-components";

interface ColorPointerWrapperProps {
    $size: number
}
const ColorPointerWrapper = styled.div<ColorPointerWrapperProps>`
    width: ${props => props.$size}px;
	height: ${props => props.$size}px;
	border: solid 2px #fff;
    outline: #707070 solid 1px;
    border-radius: 50%;
    background-color: transparent;
    cursor: pointer;
`;


interface ColorPointerProps {
    size?: number
    onDragChange?: (x: number, y: number) => any
}

export default class ColorPointer extends React.Component<ColorPointerProps> {
    isPointerMoveLeave: boolean = true
    downX: number = 0
    downY: number = 0
    componentDidMount() {
        this.handleDocumentMouseUp = this.handleDocumentMouseUp.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleDocumentMouseMove = this.handleDocumentMouseMove.bind(this);
        document.addEventListener('mouseup', this.handleDocumentMouseUp);
        document.addEventListener('mouseleave', this.handleMouseLeave);
        document.addEventListener('mousemove', this.handleDocumentMouseMove);
    }
    componentWillUnmount() {
        document.removeEventListener('mousemove', this.handleDocumentMouseMove);
        document.removeEventListener('mouseup', this.handleDocumentMouseUp);
        document.removeEventListener('mouseleave', this.handleMouseLeave);
    }

    handleMouseDown(event: React.MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
        // 按下此元素
        this.isPointerMoveLeave = false;
        this.downX= event.clientX;
        this.downY = event.clientY;
    }
    handleMouseLeave() {
        // 移出此元素
        this.isPointerMoveLeave = true;
        this.downX = 0;
        this.downY = 0;
    }
    handleDocumentMouseUp() {
        if (!this.isPointerMoveLeave) this.isPointerMoveLeave = true
    }
    handleDocumentMouseMove(event: MouseEvent) {
        if (!this.isPointerMoveLeave) {
            const currentMoveX = event.clientX - this.downX;
            const currentMoveY = event.clientY - this.downY;
            this.props.onDragChange && this.props.onDragChange(currentMoveX, currentMoveY);
            this.downX = event.clientX;
            this.downY = event.clientY;
        }
    }
    render() {
        const { size = 12 } = this.props;
        return (
            <ColorPointerWrapper
                $size={ size }
                onMouseDown={e => this.handleMouseDown(e)}
                />
        );
    }
}

