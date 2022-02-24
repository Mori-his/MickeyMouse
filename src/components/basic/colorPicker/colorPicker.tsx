import { IRGB, IRGBA, IHSBA} from "@/types/color";
import { ActionMap } from "@/types/redux.type";
import Color from "@utils/color";
import React, { useEffect, useImperativeHandle, useReducer, useRef, useState } from "react";
import styled from "styled-components";
import Select from "../form/select";
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
}

export type ColorPickerRef<T = {}> = {
    setRGBA(rgba: IRGBA): void
    colorPickerEl: React.RefObject<T>
}


const colorPanelWidth = 160;
const colorPanelHeight = 160;
const colorHueAndAlphaWidth = 16;
const colorHueAndAlphaHeight = colorPanelHeight;
const colorPointerSize = 12;

export enum ColorPickerActions {
    SET_HUE_COLOR = 'hue',
    SET_HUE_Y = 'hueY',
    SET_ALPHA_Y = 'alphaY',
    SET_DEFAULT_RGBA = 'defaultRgba',
    SET_PANEL_POSITION = 'panelPosition'
}

interface Point {
    x: number
    y: number
}

interface ColorPickerState {
    [ColorPickerActions.SET_HUE_COLOR]: IRGB
    [ColorPickerActions.SET_HUE_Y]: number
    [ColorPickerActions.SET_ALPHA_Y]: number
    [ColorPickerActions.SET_DEFAULT_RGBA]: IRGBA
    [ColorPickerActions.SET_PANEL_POSITION]: Point
}

type ColorPickerAction = ActionMap<ColorPickerState>[keyof ActionMap<ColorPickerState>]


export function ColorPickerReducer(state: ColorPickerState, action: ColorPickerAction) {
    switch(action.type) {
        case ColorPickerActions.SET_ALPHA_Y:
            return {
                ...state,
                [ColorPickerActions.SET_ALPHA_Y]: action.payload
            };
        case ColorPickerActions.SET_HUE_Y:
            return {
                ...state,
                [ColorPickerActions.SET_HUE_Y]: action.payload
            };
        case ColorPickerActions.SET_HUE_COLOR:
            return {
                ...state,
                [ColorPickerActions.SET_HUE_COLOR]: action.payload
            };
        case ColorPickerActions.SET_DEFAULT_RGBA:
            return {
                ...state,
                [ColorPickerActions.SET_DEFAULT_RGBA]: action.payload
            };
        case ColorPickerActions.SET_PANEL_POSITION:
            return {
                ...state,
                [ColorPickerActions.SET_PANEL_POSITION]: action.payload
            };
    }
}

function ColorPicker(props: ColorPickerProps, ref: React.ForwardedRef<ColorPickerRef<HTMLDivElement>>) {

    const [state, dispatch] = useReducer(ColorPickerReducer, {
        // 用于色相值
        hue: {r: 255, g: 0, b: 0 },
        // 用于色相定位
        hueY: 0,
        // 用于透明定位
        alphaY: 0,
        // 用于设置RGBA值
        defaultRgba: {r: 255, g: 255, b: 255, a: 1 },
        // 用于设置明度饱和度面板的定位
        panelPosition: {x: 0, y: 0}
    });
    // opacity取值范围0-100
    const { rgba } = props;
    // 用于设置HSBA(色相，饱和度,明度，透明度)值
    const HSBRef = useRef<IHSBA>({h: 0, s: 0, b: 0, a: 1 });
    const colorPickerElRef = useRef(null);

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
        dispatch({
            type: ColorPickerActions.SET_HUE_COLOR,
            payload: color
        });
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
        dispatch({
            type: ColorPickerActions.SET_PANEL_POSITION,
            payload: {
                x: panelPosition.x,
                y: panelPosition.y
            }
        });
        dispatch({
            type: ColorPickerActions.SET_HUE_Y,
            payload: hueY
        });
        const currAlphaY = colorHueAndAlphaHeight - rgba.a * colorHueAndAlphaHeight;
        dispatch({
            type: ColorPickerActions.SET_ALPHA_Y,
            payload: currAlphaY
        });
    }

    // 设置RGBA
    const setRgbaState = function() {
        const rgba = Color.hsbToRgba(
            HSBRef.current.h,
            HSBRef.current.s,
            HSBRef.current.b,
            HSBRef.current.a
        );
        dispatch({
            type: ColorPickerActions.SET_DEFAULT_RGBA,
            payload: {
                r: rgba.r || 0,
                g: rgba.g || 0,
                b: rgba.b || 0,
                a: rgba.a
            }
        });
    }

    useImperativeHandle(
      ref,
      () => ({
        setRGBA(rgba: IRGBA) {
            handleColorChange(rgba);
        },
        colorPickerEl: colorPickerElRef
      })
    );
    

    useEffect(() => {
        if (props.onColorChange) {
            props.onColorChange(state[ColorPickerActions.SET_DEFAULT_RGBA]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    useEffect(() => {
        if (rgba) {
            const rgbColor = rgba;
            const hsbColor = Color.rgbToHsb(rgbColor.r, rgbColor.g, rgbColor.b);
            const hueY = hsbHToY(hsbColor.h, colorHueAndAlphaHeight);
            const panelPosition = hsbSBToPosition(hsbColor.s, hsbColor.b, colorPanelWidth, colorPanelHeight);
            dispatch({
                type: ColorPickerActions.SET_PANEL_POSITION,
                payload: {
                    x: panelPosition.x,
                    y: panelPosition.y
                }
            });
            dispatch({
                type: ColorPickerActions.SET_HUE_Y,
                payload: hueY
            });
            const currAlpha = rgba.a === maxOpacity ? 0 : rgba.a;
            const currAlphaY = colorHueAndAlphaHeight - currAlpha * colorHueAndAlphaHeight;
            dispatch({
                type: ColorPickerActions.SET_ALPHA_Y,
                payload: currAlphaY
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <ColorPickerWrapper ref={ colorPickerElRef }>
            <Select
                width={ 80 }
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
                    hue={ state[ColorPickerActions.SET_HUE_COLOR] }
                    {...state[ColorPickerActions.SET_PANEL_POSITION]}
                    />
                {/* 色相面板 */}
                <ColorHuePanel
                    width={ colorHueAndAlphaWidth }
                    height={ colorHueAndAlphaHeight }
                    pointerSize= { colorPointerSize }
                    onDragChange={ handleColorHuePanelChange }
                    y={ state[ColorPickerActions.SET_HUE_Y] }
                    />
                {/* 透明度面板 */}
                <ColorOpacity
                    width={ colorHueAndAlphaWidth }
                    height={ colorHueAndAlphaHeight }
                    pointerSize= { colorPointerSize }
                    onDragChange={ handleColorOpacityPanelChange }
                    y={ state[ColorPickerActions.SET_ALPHA_Y] }
                    color={
                        Color.rgbToHex(
                            state[ColorPickerActions.SET_DEFAULT_RGBA].r,
                            state[ColorPickerActions.SET_DEFAULT_RGBA].g,
                            state[ColorPickerActions.SET_DEFAULT_RGBA].b
                        )
                    }
                    />
            </ColorPickerBox>
            <ColorFormatPanel
                rgba={ state[ColorPickerActions.SET_DEFAULT_RGBA] }
                colorChange={ handleColorChange }
                />
            <ColorAdopePanel
                rgba={ state[ColorPickerActions.SET_DEFAULT_RGBA] }
                onColorClick={ handleColorChange }
                />
        </ColorPickerWrapper>
    );
}

export default React.forwardRef(ColorPicker);
