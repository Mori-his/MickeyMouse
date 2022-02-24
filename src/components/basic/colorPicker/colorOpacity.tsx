import Color from "@utils/color";
import { useEffect, useState } from "react";
import styled from "styled-components";
import ColorPointer from "./colorPointer";

interface ColorOpacityWrapperProps {
    $width: number
    $height: number
}
const ColorOpacityWrapper = styled.div<ColorOpacityWrapperProps>`
    position: relative;
    ${props => `
        width: ${props.$width}px;
        height: ${props.$height}px;
    `};
    background-color: #a5a4a6;
    background-image:
        linear-gradient(45deg, #d6d6d6 25%, transparent 0, transparent 75%, #d6d6d6 0),
		linear-gradient(45deg, #d6d6d6 25%, transparent 0, transparent 75%, #d6d6d6 0);
    ${props => `
        background-position: 0 0, ${props.$width / 2}px ${props.$width / 2}px;
        background-size: ${props.$width}px ${props.$width}px;
    `};
    border-radius: 4px;
    overflow: hidden;
`;


const ColorOpacityBox = styled.div`
    ${props => `
        width: ${props.$width}px;
        height: ${props.$height}px;
    `};
`;

const PointerBox = styled.div`
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
`

interface ColorOpacityProps {
    color?: string
    width?: number
    height?: number
    pointerSize?: number
    onDragChange?: (y: number) => any
    y?: number
}

export default function ColorOpacity(props: ColorOpacityProps) {
    const { color = '#ff0000', width = 16, height = 160, pointerSize = 12} = props;
    const halfPointer = pointerSize / 2;
    const [y, setY] = useState(-halfPointer);
    const toY = props.y ? props.y - halfPointer : -halfPointer;
    const colorRgbaStart = Color.hexToRGBA(color, 0);
    const colorRgba = Color.hexToRGBA(color, 1);

    const handlePanelMouseDown = function(event: React.MouseEvent) {
        const targetEl: HTMLDivElement = event.currentTarget as HTMLDivElement;
        const targetTop = targetEl.getBoundingClientRect().y;
        const currentTop = event.clientY;
        const offset = pointerSize * 0.7;
        const value = currentTop - targetTop - offset;
        setY(value);
    }

    const handlePointerDragChange = function(x: number, y: number) {
        setY(prevY => {
            if (prevY >= height - halfPointer  && y >= 0) return height - halfPointer;
            if (prevY <= -halfPointer && y <= 0) return -halfPointer;
            const value = prevY + y;
            return value;
        });
    }

    useEffect(() => {
        setY(toY);
    }, [props.y, toY]);

    useEffect(() => {
        props.onDragChange && props.onDragChange(y + halfPointer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [y]);

    return (
        <ColorOpacityWrapper
            $width={ width }
            $height={ height }
            onMouseDown={ e => handlePanelMouseDown(e)}
            >
            <ColorOpacityBox
                style={{
                    backgroundImage: `linear-gradient(0deg, 
                            ${colorRgbaStart} 0%, 
                            ${colorRgba} 100%)`
                    }}
                $width={ width }
                $height={ height }
                />
            <PointerBox
                style={{top: y}}
                >
                <ColorPointer
                    size={ pointerSize }
                    onDragChange={ handlePointerDragChange}
                    />
            </PointerBox>
        </ColorOpacityWrapper>
    );
}
