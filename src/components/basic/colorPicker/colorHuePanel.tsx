import { IRGB } from "@/types/color";
import Color from "@layout/utils/color";
import React, { useImperativeHandle } from "react";
import { useRef, useState } from "react";
import styled from "styled-components";
import ColorPointer from "./colorPointer";


const HueWrapper = styled.div`
    position: relative;
    ${props => `
       width: ${props.$width}px;
       height: ${props.$height}px; 
    `};
    overflow: hidden;
    border-radius: 4px;
`;

const HueBox = styled.div`
    width: 100%;
    height: 100%;
    background-image: linear-gradient(0deg, 
		#ff0000 0%, 
		#ffff00 20%, 
		#00ffff 40%, 
		#0000ff 60%, 
		#ff00ff 80%, 
		#ff0000 100%);
`;

const PointerBox = styled.div`
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
`
export type ColorHuePanelRef<T extends HTMLElement = HTMLElement> = {
    setHueY(y: number): void;
    colorHuePanelEl: React.RefObject<T>;
};
interface ColorHuePanelProps {
    width?: number
    height?: number
    pointerSize?: number
    y?: number
    color?: Color
    onDragChange?: (y: number, hueColor: IRGB) => any
}
function ColorHuePanel(
    props: ColorHuePanelProps,
    ref: React.ForwardedRef<ColorHuePanelRef<HTMLDivElement>>
) {
    const {
        width = 16,
        height = 160,
        pointerSize = 12,
        y: propY = 0,
        onDragChange = () => {}
    } = props;
    const colorHuePanelEl = useRef(null);
    const halfPointer = pointerSize / 2;
    const [y, setY] = useState(-halfPointer + propY);
    const hsb = useRef({
        h: 359,
        s: 100,
        b: 100
    });


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
            const value = prevY + y;
            const h = value + halfPointer;
            handleValueChange(h < 0 ? 0 : h);
            return +(value.toFixed(1));
        });
    }

    const handleValueChange = function(value: number) {
        requestAnimationFrame(() => {
            hsb.current.h = 359 - 359 / (height - halfPointer) * value;
            const color: IRGB | undefined = Color.hsvToRgb(
                hsb.current.h,
                hsb.current.s,
                hsb.current.b
            );
            onDragChange(value, color);
        })
    }

    useImperativeHandle(ref, () => ({
        setHueY(y: number) {
            y = +y.toFixed(1);
            setY(y);
            handleValueChange(y + halfPointer)
        },
        colorHuePanelEl: colorHuePanelEl,
    }));

    return (
        <HueWrapper
            ref={ colorHuePanelEl }
            $width={ width }
            $height={ height }
            onMouseDown={ e => handlePanelMouseDown(e)}
            >
            <HueBox />
            <PointerBox
                style={{top: y}}
                >
                <ColorPointer
                    size={ pointerSize }
                    onDragChange={ handlePointerDragChange }
                    />
            </PointerBox>
        </HueWrapper>
    );
}

export default React.forwardRef(ColorHuePanel);