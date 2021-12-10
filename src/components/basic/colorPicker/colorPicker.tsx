import { IRGB } from "@/types/color";
import Color from "@utils/color";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ColorHuePanel from "./colorHuePanel";
import ColorOpacity from "./colorOpacity";
import ColorPanel, { PositionProps } from "./colorPanel";
import { ColorPickerBox } from "./colorPickerPanelBox";


const maxAngle = 360;
const SAndH = 1;
interface IHSBA {
    h: number
    s: number
    b: number
    a: number
}

function hsbSBToPosition(s: number, b: number, scopeWidth: number, scopeHeight: number) {
    const x = s * scopeWidth;
    const y = (1 - b) * scopeHeight;
    return {
        x,
        y
    };
}
function hsbHToY(h: number, scopeHeight: number) {
    return (maxAngle - h) / maxAngle * scopeHeight;
}


const ColorPickerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 224px;
    height: 248px;
    padding: 8px;
    background-color: #fff;
`;

interface ColorPickerProps {
    color?: string
    opacity?: number
    onColorChange?: (color: IRGB) => any
}


const colorPanelWidth = 160;
const colorPanelHeight = 160;
const colorHueAndAlphaWidth = 16;
const colorHueAndAlphaHeight = colorPanelHeight;
const colorPointerSize = 12;

export default function ColorPicker(props: ColorPickerProps) {
    const { color, opacity } = props;
    const [hueColor, setHueColor] = useState<IRGB>({r: 255, g: 0, b: 0 });
    const [hueToY, setHueToY] = useState(0);
    const [alphaY, setAlphaY] = useState(0);
    // 用于设置HSBA(色相，饱和度,明度，透明度)值
    const HSBRef = useRef<IHSBA>({h: 0, s: 0, b: 0, a: 1 });
    // 用于设置RGBA值
    const [rgba, setRgba] = useState({r: 255, g: 255, b: 255, a: 1 });
    // 用于设置明度饱和度面板的定位
    const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });

    const handleColorPanelChange = function(position: PositionProps) {
        // 明度 和 饱和度 被选择   值范围为0-1
        // 明度是y轴  饱和度是x轴
        const x = position.x;
        const y = position.y;

        let saturation = x / colorPanelWidth * SAndH;
        let brightness = SAndH - y / colorPanelHeight * SAndH;

        
        saturation = saturation > SAndH ? SAndH : saturation;
        saturation = saturation < 0 ? 0 : saturation;
        brightness = brightness > SAndH ? SAndH : brightness;
        brightness = brightness < 0 ? 0 : brightness;

        // console.log('明度:', saturation);
        // console.log('饱和度:', brightness);
        
        HSBRef.current.s = saturation;
        HSBRef.current.b = brightness;
        setRgbaState();
    }
    const handleColorHuePanelChange = function(hue: number, color: IRGB) {
        // 色相被选择 值范围0 - 360°
        // 转成度数值
        const angle = maxAngle - maxAngle / colorHueAndAlphaHeight * hue
        // console.log('色相度数', angle);
        HSBRef.current.h = parseInt(angle.toString());
        setHueColor(color);
        setRgbaState();
    }
    const handleColorOpacityPanelChange = function(alpha: number) {
        // 透明度
        HSBRef.current.a = 1 - alpha / colorHueAndAlphaHeight;
        setRgbaState();
    }

    // 设置RGBA
    const setRgbaState = function() {
        const rgba = Color.hsbToRgba(
            HSBRef.current.h,
            HSBRef.current.s,
            HSBRef.current.b,
            HSBRef.current.a
        );
        setRgba({
            r: rgba.r || 0,
            g: rgba.g || 0,
            b: rgba.b || 0,
            a: rgba.a
        });
    }

    useEffect(() => {
        if (props.onColorChange) {
            props.onColorChange(rgba);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rgba]);

    useEffect(() => {
        if (color) {
            const rgbColor = Color.hexToRGB(color);
            if (typeof rgbColor !== 'string') {
                const hsbColor = Color.rgbToHsb(rgbColor.r, rgbColor.g, rgbColor.b);
                const hueY = hsbHToY(hsbColor.h, colorHueAndAlphaHeight);
                const panelPosition = hsbSBToPosition(hsbColor.s, hsbColor.b, colorPanelWidth, colorPanelHeight);
                setPanelPosition({
                    x: panelPosition.x,
                    y: panelPosition.y
                });
                setHueToY(hueY);
            }
        }
        if (opacity) {
            console.log(opacity * colorHueAndAlphaHeight);
            setAlphaY(opacity * colorHueAndAlphaHeight)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <ColorPickerWrapper>
            <ColorPickerBox>
                {/* 明度饱和度面板 */}
                <ColorPanel
                    width={ colorPanelWidth }
                    height={ colorPanelHeight }
                    pointerSize= { colorPointerSize }
                    onDragChange={ handleColorPanelChange }
                    hue={ hueColor }
                    {...panelPosition}
                    />
                {/* 色相面板 */}
                <ColorHuePanel
                    width={ colorHueAndAlphaWidth }
                    height={ colorHueAndAlphaHeight }
                    pointerSize= { colorPointerSize }
                    onDragChange={ handleColorHuePanelChange }
                    y={ hueToY }
                    />
                {/* 透明度面板 */}
                <ColorOpacity
                    width={ colorHueAndAlphaWidth }
                    height={ colorHueAndAlphaHeight }
                    pointerSize= { colorPointerSize }
                    onDragChange={ handleColorOpacityPanelChange }
                    y={ alphaY }
                    color={ color }
                    />
            </ColorPickerBox>
            <div style={{width: 32, height: 32, backgroundColor: Color.rgbToHex(rgba.r, rgba.g, rgba.b)}}></div>
        </ColorPickerWrapper>
    );
}
