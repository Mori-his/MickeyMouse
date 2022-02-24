import { IRGB } from "@/types/color";
import Color from "@utils/color";
import { getOffsetTop } from "@utils/styleTool";
import { useEffect, useRef, useState } from "react";
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

interface ColorHuePanelProps {
    width?: number
    height?: number
    pointerSize?: number
    y?: number
    onDragChange?: (y: number, color: IRGB) => any
}
export default function ColorHuePanel(props: ColorHuePanelProps) {
    const { width = 16, height = 160, pointerSize = 12 } = props;
    const halfPointer = pointerSize / 2;
    const [y, setY] = useState(-halfPointer);
    const toY = props.y ? props.y - halfPointer : -halfPointer;
    const hsb = useRef({
        h: 359,
        s: 1,
        b: 1
    });

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
        const value = y + halfPointer;
        hsb.current.h = 359 - 359 / height * value;
        const color: IRGB | undefined = Color.hsvToRgb(
            hsb.current.h,
            hsb.current.s,
            hsb.current.b
        );
        if (color) {
            props.onDragChange && props.onDragChange(value, color);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [y])

    return (
        <HueWrapper
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
                    onDragChange={ handlePointerDragChange}
                    />
            </PointerBox>
        </HueWrapper>
    );
}
