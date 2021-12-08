import { useEffect, useState } from "react";
import styled from "styled-components";
import ColorPointer from "./colorPointer";


const HueWrapper = styled.div`
    position: relative;
    ${props => `
       width: ${props.$width}px;
       height: ${props.hidden}px; 
    `};
    overflow: hidden;
`;

const HueBox = styled.div`
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
    left: 50%;
    transform: translateX(-50%);
`


interface ColorHuePanelProps {
    width?: number
    height?: number
    onDragChange?: (y: number) => any
}
export default function ColorHuePanel(props: ColorHuePanelProps) {
    const { width = 16, height = 160 } = props;
    const [y, setY] = useState(0);
    const pointerSize = 12;
    const halfPointer = pointerSize / 3
    const handlePointerDragChange = function(x: number, y: number) {
        setY(prevY => {
            if (prevY >= height - pointerSize  && y >= 0) return prevY;
            if (prevY <= -halfPointer && y <= 0) return prevY;
            return prevY + y;
        });
    }

    useEffect(() => {
        props.onDragChange && props.onDragChange(y)
    }, [props, y]);

    return (
        <HueWrapper
            $width={ width }
            $height={ height }
            >
            <HueBox />
            <PointerBox style={{top: y}}>
                <ColorPointer
                    size={ pointerSize }
                    onDragChange={ handlePointerDragChange}
                    />
            </PointerBox>
        </HueWrapper>
    );
}
