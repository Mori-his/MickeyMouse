import styled from "styled-components";
import ColorPicker from "@components/basic/colorPicker/colorPicker";
import { useState } from "react";
import { IRGB } from "@/types/color";
import Color from "@utils/color";

const width = 280;

const RightWrapper = styled.div`
    position: absolute;
    right: 0;
    top: 88px;
    bottom: 0;
`;

const RightConfigPanel = styled.div`
    width: ${width}px;
    height: 100%;
    background-color: ${props => props.theme.contrast};
    box-shadow: -2px 0 8px 0 ${props => props.theme.main};
`;


export default function RightContainer() {
    const [color, setColor] = useState('#69C70C');
    const handleColorChange = function(rgba: IRGB) {
        const currColor = Color.rgbToHex(rgba.r, rgba.g, rgba.b);
        // console.log(currColor);
        setColor(currColor);
    }
    return (
        <RightWrapper>
            <RightConfigPanel>
                <ColorPicker
                    color={ color }
                    onColorChange={ handleColorChange }
                    />
            </RightConfigPanel>
        </RightWrapper>
    );
}
