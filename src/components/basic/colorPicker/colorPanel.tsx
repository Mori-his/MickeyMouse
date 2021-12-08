import { getOffsetLeft, getOffsetTop } from "@utils/styleTool";
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import ColorPointer from "./colorPointer";

const ColorPanelWrapper = styled.div`
    position: relative;
    width: ${props => props.$width}px;
    height: ${props => props.$height}px;
    border-radius: 4px;
    border: 1px solid #707070;
    overflow: hidden;
`;

const ColorPosition = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
`;

// 明亮
const ColorBright = styled(ColorPosition)`
    background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
`;
// 饱和
const ColorSaturation = styled(ColorPosition)`
    background-image: linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
`;

// 色相
interface ColorHueProps {
    hue: string
}
const ColorHue = styled(ColorPosition)<ColorHueProps>`
    background-color: ${props => props.hue};
`;


const ColorPointerBox = styled.div`
    position: absolute;
    cursor: pointer;
`;

interface ColorPannerProps {
    hue?: string
    width?: number
    height?: number
    onDragChange?: (position: PositionProps) => any
}

interface PositionProps {
    left: number
    top: number
}

// HSB   H色相  S饱和度 B明度
export default function ColorPanel(props: ColorPannerProps) {
    const { hue = '#ff0000', width = 160, height = 160 } = props;
    const pointerSize = 12;
    const halfPointer = pointerSize / 3;
    const [position, setPosition] = useState<PositionProps>({
        left: -halfPointer,
        top: -halfPointer
    });
    const pointerRef = useRef<HTMLDivElement>(null);

    const handlePanelMouseDown = function(event: React.MouseEvent) {
        const targetEl: HTMLDivElement = event.currentTarget as HTMLDivElement;
        const targetLeft = getOffsetLeft(targetEl);
        const targetTop = getOffsetTop(targetEl);
        const currentLeft = event.clientX;
        const currentTop = event.clientY;
        const offset = pointerSize * 0.7;
        setPosition({
            left: currentLeft - targetLeft - offset,
            top: currentTop - targetTop - offset
        });
    }

    const handleColorPointerChange = function(x: number, y: number) {
        setPosition((prevPosition) => {
            if (prevPosition.left >= width - pointerSize && x >= 0) return prevPosition;
            if (prevPosition.left <= -halfPointer && x <= 0) return prevPosition;
            if (prevPosition.top >= height - pointerSize  && y >= 0) return prevPosition;
            if (prevPosition.top <= -halfPointer && y <= 0) return prevPosition;
            return {left: prevPosition.left + x, top: prevPosition.top + y};
        });
    }

    useEffect(() => {
        props.onDragChange && props.onDragChange(position);
    }, [position, props])

    return (
        <ColorPanelWrapper
            $height={ height }
            $width={ width }
            onMouseDown={ e => handlePanelMouseDown(e)}
            >
            <ColorHue
                hue={ hue }
                />
            <ColorSaturation />
            <ColorBright />
            <ColorPointerBox
                ref={ pointerRef }
                style={ position }
                >
                <ColorPointer
                    onDragChange={ handleColorPointerChange }
                    size={ pointerSize }
                    />
            </ColorPointerBox>
        </ColorPanelWrapper>
    );
}
