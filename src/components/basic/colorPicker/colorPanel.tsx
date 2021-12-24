import { IRGB } from "@/types/color";
import Color from "@utils/color";
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
const ColorHue = styled(ColorPosition)``;


const ColorPointerBox = styled.div`
    position: absolute;
    cursor: pointer;
`;

interface ColorPannerProps extends Partial<PositionProps> {
    width?: number
    height?: number
    pointerSize?: number
    hue: IRGB
    onDragChange?: (position: PositionProps) => any
}

export interface PositionProps {
    x: number
    y: number
}

// HSB   H色相  S饱和度 B明度
export default function ColorPanel(props: ColorPannerProps) {
    const { 
        width = 160,
        height = 160,
        pointerSize = 12,
        hue
    } = props;
    const pointerOffset = pointerSize * 0.7;
    const pointerDIF = pointerSize - pointerOffset
    const x = props.x ? props.x - pointerOffset : -pointerDIF;
    const y = props.y ? props.y - pointerOffset : -pointerDIF;

    const _hue = Color.rgbToHex(hue.r, hue.g, hue.b);
    const [position, setPosition] = useState<PositionProps>({
        x,
        y
    });
    const pointerRef = useRef<HTMLDivElement>(null);

    // 面板被按下，移动当前指示标位置
    const handlePanelMouseDown = function(event: React.MouseEvent) {
        const targetEl: HTMLDivElement = event.currentTarget as HTMLDivElement;
        const clinetRect = targetEl.getBoundingClientRect();
        const targetLeft = clinetRect.x;
        const targetTop = clinetRect.y;
        const currentLeft = event.clientX;
        const currentTop = event.clientY;
        const offset = pointerOffset;
        const valueLeft = currentLeft - targetLeft - offset;
        const valueTop = currentTop - targetTop - offset;
        setPosition({
            x: valueLeft,
            y: valueTop
        });
    }

    // 如果色相选择指示标被拖动则向上传递指示标位置
    // 传递位置是为了调用者计算公式不同
    const handleColorPointerChange = function(x: number, y: number) {
        setPosition((prevPosition) => {
            let currentLeft = prevPosition.x;
            let currentTop = prevPosition.y;
            const minLeftTop = -pointerDIF;
            if (prevPosition.x >= width - pointerOffset && x >= 0)
                currentLeft = width - pointerOffset;
            if (prevPosition.x <= minLeftTop && x <= 0)
                currentLeft = minLeftTop;
            if (prevPosition.y >= height - pointerOffset  && y >= 0)
                currentTop = height - pointerOffset;
            if (prevPosition.y <= minLeftTop && y <= 0)
                currentTop = minLeftTop;
            currentLeft = currentLeft + x;
            currentTop = currentTop + y;
            return {
                x: currentLeft,
                y: currentTop
            };
        });
    }
    useEffect(() => {
        if (props.onDragChange) {
            let x = position.x;
            let y = position.y;
            if (x < 0) x = 0;
            if (x > 0) x += pointerOffset;
            if (y < 0) y = 0;
            if (y > 0) y += pointerOffset
            // 当前移动的位置向上传递
            props.onDragChange({
                x,
                y
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position]);

    useEffect(() => {
        // 如果props x y变化了则设置下定位
        setPosition({
            x,
            y
        });
    }, [props.x, props.y, x, y]);

    return (
        <ColorPanelWrapper
            $height={ height }
            $width={ width }
            onMouseDown={ e => handlePanelMouseDown(e)}
            >
            <ColorHue
                style={{backgroundColor: _hue }}
                />
            <ColorSaturation />
            <ColorBright />
            <ColorPointerBox
                ref={ pointerRef }
                style={{left: position.x, top: position.y}}
                >
                <ColorPointer
                    onDragChange={ handleColorPointerChange }
                    size={ pointerSize }
                    />
            </ColorPointerBox>
        </ColorPanelWrapper>
    );
}
