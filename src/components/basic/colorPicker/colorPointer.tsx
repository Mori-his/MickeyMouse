import { useEffect } from "react";
import styled from "styled-components";

interface ColorPointerWrapperProps {
    $size: number
}
const ColorPointerWrapper = styled.div<ColorPointerWrapperProps>`
    width: ${props => props.$size}px;
	height: ${props => props.$size}px;
	border: solid 1px #707070;
    border-radius: 50%;
`;


let downX: number = 0;
let downY: number = 0;
let isMoveLeave = true;

const handleMouseDown = function(event: React.MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    // 按下此元素
    isMoveLeave = false;
    downX = event.clientX;
    downY = event.clientY;
}
const handleMouseLeave = function() {
    // 移出此元素
    isMoveLeave = true;
    downX = 0;
    downY = 0;
}

interface ColorPointerProps {
    size?: number
    onDragChange?: (x: number, y: number) => any
}

export default function ColorPointer(props: ColorPointerProps) {

    useEffect(() => {
        const handleDocumentMouseUp = function() {
            if (!isMoveLeave) isMoveLeave = true
        }
        const handleDocumentMouseMove = function(event: MouseEvent) {
            if (!isMoveLeave) {
                const currentMoveX = event.clientX - downX;
                const currentMoveY = event.clientY - downY;
                props.onDragChange && props.onDragChange(currentMoveX, currentMoveY);
                downX = event.clientX;
                downY = event.clientY;
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

    const { size = 12 } = props;
    return (
        <ColorPointerWrapper
            $size={ size }
            onMouseDown={e => handleMouseDown(e)}
            />
    );
}

