import { IRGB } from "@/types/color";
import Color from "@layout/utils/color";
import React, { useState, useRef, useImperativeHandle } from "react";
import styled from "styled-components";
import ColorPointer from "./colorPointer";

const ColorPanelWrapper = styled.div`
    position: relative;
    width: ${props => props.$width}px;
    height: ${props => props.$height}px;
    border-radius: 4px;
    /* border: 1px solid #707070; */
    overflow: hidden;
    box-sizing: border-box;
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
    color: Color
    onDragChange?: (position: PositionProps) => any
}

export type ColorPanelRef<T extends HTMLElement = HTMLElement> = {
    setPosition(x: number, y: number): void;
    colorPanelEl: React.RefObject<T>;
};


export interface PositionProps {
    x: number
    y: number
}

// HSB   H色相  S饱和度 B明度
function ColorPanel(
    props: ColorPannerProps,
    ref: React.ForwardedRef<ColorPanelRef<HTMLDivElement>>
    ) {
    const { 
        width = 160,
        height = 160,
        pointerSize = 12,
        hue,
        onDragChange = () => ({}),
    } = props;
    
    const pointerDIF = pointerSize / 2
    const x = props.x ? props.x - pointerDIF : -pointerDIF;
    const y = props.y ? props.y - pointerDIF : -pointerDIF;

    const _hue = Color.rgbToHex(hue.r, hue.g, hue.b);


    const [position, setPosition] = useState<PositionProps>({
        x,
        y
    });
    const pointerRef = useRef<HTMLDivElement>(null);
    const colorPanelEl = useRef(null);

    // 面板被按下，移动当前指示标位置
    const handlePanelMouseDown = function(event: React.MouseEvent) {
        const targetEl: HTMLDivElement = event.currentTarget as HTMLDivElement;
        const clinetRect = targetEl.getBoundingClientRect();
        const targetLeft = clinetRect.x;
        const targetTop = clinetRect.y;
        const currentLeft = event.clientX;
        const currentTop = event.clientY;
        const offset = pointerDIF;
        const valueLeft = currentLeft - targetLeft - offset;
        const valueTop = currentTop - targetTop - offset;

        handleChangeColor(valueLeft, valueTop);
        setPosition({
            x: +(valueLeft.toFixed(1)),
            y: +(valueTop.toFixed(1))
        });
    }

    // 如果色相选择指示标被拖动则向上传递指示标位置
    // 传递位置是为了调用者计算公式不同
    const handleColorPointerChange = function(x: number, y: number) {
        setPosition(prevPosition => {
            let currentLeft = prevPosition.x + x;
            let currentTop = prevPosition.y + y;
            currentLeft = Math.max(Math.min(currentLeft, width - pointerDIF), -pointerDIF);
            currentTop = Math.max(Math.min(currentTop, height - pointerDIF), -pointerDIF);
            
            handleChangeColor(currentLeft + pointerDIF, currentTop + pointerDIF);
            return {
                x: +(currentLeft.toFixed(1)),
                y: +(currentTop.toFixed(1))
            };
        });
    }
    const handleChangeColor = function(x: number, y: number) {
        requestAnimationFrame(() => {
            onDragChange({x, y});
        })
    }
    
    useImperativeHandle(ref, () => ({
        setPosition(x: number, y: number) {
            x = +x.toFixed(2);
            y = +y.toFixed(2);
            setPosition({
                x,
                y
            });
            handleChangeColor(x + pointerDIF, y + pointerDIF)
        },
        colorPanelEl,
    }));

    return (
        <ColorPanelWrapper
            ref={ colorPanelEl }
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

export default React.forwardRef(ColorPanel);
