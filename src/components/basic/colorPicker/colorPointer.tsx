import React from "react";
import styled from "styled-components";

interface ColorPointerWrapperProps {
    $size: number
    isActive: boolean
}
const ColorPointerOuter = styled.div`
    border-radius: 50%;
    border: #707070 solid 1px;
    cursor: pointer;
`;
const ColorPointerWrapper = styled.div<ColorPointerWrapperProps>`
    width: ${props => props.$size}px;
	height: ${props => props.$size}px;
	border: solid 2px #fff;
    ${ props => props.isActive ? `
        background: #fff;
    ` : `
        background-color: transparent;
    `
    };
    border-radius: 50%;
    box-sizing: border-box;
`;


type ColorPointerProps<P = {}> = P & {
    size?: number
    isActive?: boolean
    // 当鼠标移动时 改变的移动值
    onDragChange?: (x: number, y: number) => any
    // 当鼠标弹起时
    onMoveUp?: (x: number, y: number) => any
}

export default class ColorPointer extends React.Component<ColorPointerProps<React.ComponentProps<'div'>>> {
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
        if (!this.isPointerMoveLeave) {
            const { onMoveUp = () => {} } = this.props;
            this.isPointerMoveLeave = true
            onMoveUp(this.downX, this.downY);
        }
    }
    handleDocumentMouseMove(event: MouseEvent) {
        const { onDragChange = () => {} } = this.props;
        if (!this.isPointerMoveLeave) {
            const currentMoveX = event.clientX - this.downX;
            const currentMoveY = event.clientY - this.downY;
            onDragChange(currentMoveX, currentMoveY);
            this.downX = event.clientX;
            this.downY = event.clientY;
        }
    }
    render() {
        const {
            ref,
            size = 12,
            isActive = false,
            onDragChange = () => {},
            onMoveUp = () => {},
            ...remains
        } = this.props;
        return (
            <ColorPointerOuter
                { ...remains }
                >
                <ColorPointerWrapper
                    $size={ size }
                    isActive={ isActive }
                    onMouseDown={e => this.handleMouseDown(e)}
                    />
            </ColorPointerOuter>
        );
    }
}

