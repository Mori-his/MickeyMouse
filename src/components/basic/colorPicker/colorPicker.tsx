import { IRGB, IRGBA, IHSBA} from "@/types/color";
import Color from "@utils/color";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Select from "../select";
import ColorAdopePanel from "./colorAdopePanel";
import ColorFormatPanel from "./colorFormatPanel";
import ColorHuePanel from "./colorHuePanel";
import ColorOpacity from "./colorOpacity";
import ColorPanel, { PositionProps } from "./colorPanel";
import { ColorPickerBox } from "./colorPickerPanelBox";


export const maxAngle = 360;
export const SAndH = 1;
export const maxOpacity = 100;

/**
 * 饱和度/明度转为二维坐标系
 * @param s 饱和度
 * @param b 明度
 * @param scopeWidth 所在空间宽度
 * @param scopeHeight 所在控件高度
 * @returns x,y坐标
 */
function hsbSBToPosition(s: number, b: number, scopeWidth: number, scopeHeight: number) {
    const x = s * scopeWidth;
    const y = (1 - b) * scopeHeight;
    return {
        x,
        y
    };
}
/**
 * 色相转为为二维坐标系y
 * @param h 色相
 * @param scopeHeight 所在控件高度
 * @returns y
 */
function hsbHToY(h: number, scopeHeight: number) {
    return (maxAngle - h) / maxAngle * scopeHeight;
}


const ColorPickerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 224px;
    padding: 0 8px 8px;
    background-color: #fff;
`;

interface ColorPickerProps {
    color?: string
    opacity?: number
    onColorChange?: (rgba: IRGBA) => any
    rgba?: IRGBA
    forwardedRef?: React.ForwardedRef<HTMLDivElement>
}


const colorPanelWidth = 160;
const colorPanelHeight = 160;
const colorHueAndAlphaWidth = 16;
const colorHueAndAlphaHeight = colorPanelHeight;
const colorPointerSize = 12;

export default function ColorPicker(props: ColorPickerProps) {
    // opacity取值范围0-100
    const { rgba, forwardedRef } = props;
    // 用于色相值
    const [hueColor, setHueColor] = useState<IRGB>({r: 255, g: 0, b: 0 });
    // 用于色相定位
    const [hueToY, setHueToY] = useState(0);
    // 用于透明定位
    const [alphaY, setAlphaY] = useState(0);
    // 用于设置HSBA(色相，饱和度,明度，透明度)值
    const HSBRef = useRef<IHSBA>({h: 0, s: 0, b: 0, a: 1 });
    // 用于设置RGBA值
    const [defaultRgba, setDefaultRgba] = useState({r: 255, g: 255, b: 255, a: 1 });
    // 用于设置明度饱和度面板的定位
    const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });

    // TODO:
    // [handleColorPanelChange]、[handleColorHuePanelChange] and
    // [handleColorOpacityPanelChange] 的计算转换公式应当抽离出去
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

        HSBRef.current.a = (100 - alpha / colorHueAndAlphaHeight * 100) / 100;
        // console.log(HSBRef.current.a);
        setRgbaState();
    }

    const handleColorChange = function(rgba: IRGBA) {
        const hsbColor = Color.rgbToHsb(rgba.r, rgba.g, rgba.b);
        const hueY = hsbHToY(hsbColor.h, colorHueAndAlphaHeight);
        const panelPosition = hsbSBToPosition(hsbColor.s, hsbColor.b, colorPanelWidth, colorPanelHeight);
        setPanelPosition({
            x: panelPosition.x,
            y: panelPosition.y
        });
        setHueToY(hueY);
        const currOpacity = colorHueAndAlphaHeight - rgba.a * colorHueAndAlphaHeight;
        setAlphaY(currOpacity);
    }

    // 设置RGBA
    const setRgbaState = function() {
        const rgba = Color.hsbToRgba(
            HSBRef.current.h,
            HSBRef.current.s,
            HSBRef.current.b,
            HSBRef.current.a
        );
        setDefaultRgba({
            r: rgba.r || 0,
            g: rgba.g || 0,
            b: rgba.b || 0,
            a: rgba.a
        });
    }

    useEffect(() => {
        if (props.onColorChange) {
            props.onColorChange(defaultRgba);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultRgba]);

    useEffect(() => {
        if (rgba) {
            const rgbColor = rgba;
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
            const currOpacity = rgba.a === maxOpacity ? 0 : rgba.a;
            const currOpacityY = colorHueAndAlphaHeight - currOpacity * colorHueAndAlphaHeight
            setAlphaY(currOpacityY)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <ColorPickerWrapper ref={ forwardedRef }>
            <Select
                $width={ 56 }
                options={[{name: '纯色', id: 0}, {name: '线性', id: 1}]}
                defaultOptionId={0}
                onChangeOption={(e: Event, option: any) => console.log(option)}
                />
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
                    color={ Color.rgbToHex(defaultRgba.r, defaultRgba.g, defaultRgba.b) }
                    />
            </ColorPickerBox>
            <ColorFormatPanel
                rgba={ defaultRgba }
                colorChange={ handleColorChange }
                />
            <ColorAdopePanel
                rgba={ defaultRgba }
                onColorClick={ handleColorChange }
                />
        </ColorPickerWrapper>
    );
}

// export const ColorPickerRef = React.forwardRef(
//     function ColorPickerForwardRef(props: ColorPickerProps, ref: React.ForwardedRef<HTMLDivElement>) {
//         return (<ColorPicker { ...props } forwardedRef={ ref } />);
//     }
// );


// const ColorPickerFloatWrapper = styled.div`
//     position: absolute;
//     top: 0;
//     z-index: 4;
//     `;
// export type ColorPickerPropsWithFloat<P = {}> = P & {
//     isShow?: boolean
//     targetRef: React.RefObject<HTMLElement>
// }

// export function ColorPickerFloat(props: ColorPickerPropsWithFloat<ColorPickerProps>) {
//     const { isShow = false, targetRef, ...ColorPickerProps } = props;
//     const colorPickerRef = useRef(null);

//     useEffect(() => {
//         console.log(colorPickerRef);
//     }, [isShow]);
//     return isShow ? createPortal(
//         (
//             <ColorPickerFloatWrapper>
//                 <ColorPickerRef
//                     { ...ColorPickerProps }
//                     ref={ colorPickerRef }
//                     />
//             </ColorPickerFloatWrapper>
//         ),
//         document.body
//     ) : null
// }
