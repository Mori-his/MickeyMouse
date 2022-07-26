import Color from "@layout/utils/color";
import React, { useImperativeHandle, useRef } from "react";
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

export type ColorOpacityRef<T extends HTMLElement = HTMLElement> = {
    setOpacityY(y: number): void;
    colorOpacityEl: React.RefObject<T>;
};

interface ColorOpacityProps {
    color?: Color
    width?: number
    height?: number
    pointerSize?: number
    onDragChange?: (y: number) => any
    y?: number
}

function ColorOpacity(
    props: ColorOpacityProps,
    ref: React.ForwardedRef<ColorOpacityRef<HTMLDivElement>>
) {
    const {
        color = new Color(100, 0, 0, 1),
        width = 16,
        height = 160,
        pointerSize = 12,
        onDragChange = () => {},
        y: opacityY = 0
    } = props;
    const halfPointer = pointerSize / 2;
    const [y, setY] = useState(-halfPointer + opacityY);
    const colorOpacityEl = useRef(null);
    const colorRgbaStart = Color.hexToRGBA(color.hex, 0);
    const colorRgba = Color.hexToRGBA(color.hex, 1);

    const handlePanelMouseDown = function(event: React.MouseEvent) {
        const targetEl: HTMLDivElement = event.currentTarget as HTMLDivElement;
        const targetTop = targetEl.getBoundingClientRect().y;
        const currentTop = event.clientY;
        const offset = pointerSize * 0.7;
        const value = currentTop - targetTop - offset;
        handleValueChange(value);
        setY(+(value.toFixed(1)));
    }

    const handlePointerDragChange = function(x: number, y: number) {
        setY(prevY => {
            if (prevY >= height - halfPointer  && y >= 0) return height - halfPointer;
            if (prevY <= -halfPointer && y <= 0) return -halfPointer;
            let value = prevY + y;
            if (value < -halfPointer) value = -halfPointer;
            if (value > height - halfPointer) value = height - halfPointer;
            const a = value + halfPointer;
            handleValueChange(a);
            return +(value.toFixed(1));
        });
    }

    /**
     * 更新透明度值
     * @param value 通明度Y轴的值是加上指示器高度一半的值
     */
    const handleValueChange = function(value: number) {
        requestAnimationFrame(() => {
            onDragChange(value);
        });
    }

    useImperativeHandle(ref, () => ({
        /**
         * 设置透明度位置
         * @param y 传入进来的是减去指示器高度的一半的值
         */
        setOpacityY(y) {
            y = +y.toFixed(1);
            setY(y);
            handleValueChange(y + halfPointer);
        },
        colorOpacityEl,
    }));

    return (
        <ColorOpacityWrapper
            ref={ colorOpacityEl }
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


export default React.forwardRef(ColorOpacity)