import { IRGB, IRGBA, IHSBA } from "@/types/color";
import { ActionMap } from "@/types/redux.type";
import { assert } from "@layout/core/assert";
import { LinearGradientdirection } from "@layout/core/gradient";
import Color from "@layout/utils/color";
import React, {
    useEffect,
    useImperativeHandle,
    useReducer,
    useRef,
} from "react";
import styled from "styled-components";
import Select, { IOption } from "../form/select";
import ColorAdopePanel from "./colorAdopePanel";
import ColorFormatPanel from "./colorFormatPanel";
import { ColorGradientPanel } from "./colorGradientPanel";
import ColorHuePanel, { ColorHuePanelRef } from "./colorHuePanel";
import ColorOpacity, { ColorOpacityRef } from "./colorOpacity";
import ColorPanel, { ColorPanelRef, PositionProps } from "./colorPanel";
import { ColorPickerBox } from "./colorPickerPanelBox";

export const maxAngle = 359;
export const SAndH = 1;
export const maxOpacity = 100;

/**
 * 饱和度/明度转为二维坐标系
 * @param s 饱和度0-100
 * @param b 明度0-100
 * @param scopeWidth 所在空间宽度
 * @param scopeHeight 所在控件高度
 * @returns x,y坐标
 */
function hsbSBToPosition(
    s: number,
    b: number,
    scopeWidth: number,
    scopeHeight: number
) {
    const x = s / 100 * scopeWidth;
    const y = (1 - b / 100) * scopeHeight;
    return {
        x,
        y,
    };
}
/**
 * 色相转为为二维坐标系y
 * @param h 色相
 * @param scopeHeight 所在控件高度
 * @returns y
 */
function hsbHToY(h: number, scopeHeight: number) {
    return ((maxAngle - h) / maxAngle) * scopeHeight;
}

const ColorPickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 224px;
  padding: 0 8px 8px;
  background-color: #fff;
`;


export type ColorPickerRef<T extends HTMLElement = HTMLElement> = {
    setColor(color: Color): void
    setLinear(linear: LinearGradientdirection): void
    colorPickerEl: React.RefObject<T>
};

// 面板的宽度减去滑动点宽度的一半
const colorPanelWidth = 160;
const colorPanelHeight = 160;
const colorHueAndAlphaWidth = 16;

const colorHueAndAlphaHeight = colorPanelHeight;
const colorPointerSize = 12;

export enum ColorType {
    PURE,
    LINEAR,
}

export enum ColorPickerActions {
    SET_HUE_COLOR = "hue",
    SET_HUE_Y = "hueY",
    SET_ALPHA_Y = "alphaY",
    SET_DEFAULT_RGBA = "defaultColor",
    SET_PANEL_POSITION = "panelPosition",
    SET_COLOR_TYPE = 'colorType',
    SET_COLORS = 'colors',
    SET_IS_GRADIENT = 'isGradient',
    SET_GRADIENT_INDEX = 'gradientIndex'
}


export const ColorPickerGradientOptions: IOption<string, ColorType> [] = [
    { name: "纯色", id: ColorType.PURE },
    { name: "线性", id: ColorType.LINEAR },
];

interface Point {
    x: number;
    y: number;
}

interface ColorPickerState {
    [ColorPickerActions.SET_HUE_COLOR]: IRGB;
    [ColorPickerActions.SET_HUE_Y]: number;
    [ColorPickerActions.SET_ALPHA_Y]: number;
    [ColorPickerActions.SET_DEFAULT_RGBA]: Color;
    [ColorPickerActions.SET_PANEL_POSITION]: Point;
    [ColorPickerActions.SET_COLOR_TYPE]: ColorType;
    [ColorPickerActions.SET_COLORS]: Color[];
    [ColorPickerActions.SET_IS_GRADIENT]: boolean;
    [ColorPickerActions.SET_GRADIENT_INDEX]: number;
}

type ColorPickerAction =
    ActionMap<ColorPickerState>[keyof ActionMap<ColorPickerState>];

export function ColorPickerReducer(
    state: ColorPickerState,
    action: ColorPickerAction
) {
    return {
        ...state,
        [action.type]: action.payload,
    };
}


interface ColorPickerProps {
    linear?: LinearGradientdirection;
    opacity?: number;
    onColorChange(color: IRGBA | Color[]): any;
    rgba?: IRGBA
    isGradient?: boolean
}

function ColorPicker(
    props: ColorPickerProps,
    ref: React.ForwardedRef<ColorPickerRef<HTMLDivElement>>
) {

    // opacity取值范围0-100
    const { rgba, linear, isGradient = true, onColorChange = () => {} } = props;
    assert(rgba === undefined || linear === undefined, 'rgba or color只能传递一个')
    const [state, dispatch] = useReducer(ColorPickerReducer, {
        hue: { r: 255, g: 0, b: 0 }, // 用于色相值
        hueY: 0, // 用于色相定位
        alphaY: 0, // 用于透明定位
        defaultColor: new Color(100, 0, 0, 1), // 用于设置RGBA值
        panelPosition: { x: 0, y: 0 }, // 用于设置明度饱和度面板的定位
        colorType: linear?.colors ? ColorType.LINEAR : ColorType.PURE, // 颜色类型: 0-纯色, 1-线性渐变
        colors: linear?.colors || [], // 线性渐变队列
        isGradient: isGradient, // 是否支持渐变
        gradientIndex: 0, // 当前选中的渐变色
    });
    // 用于设置HSBA(色相，饱和度,明度，透明度)值
    const HSBRef = useRef<IHSBA>({ h: 0, s: 0, b: 0, a: 1 });
    const colorHuePanelRef = useRef<ColorHuePanelRef<HTMLDivElement>>(null);
    const colorPanelRef = useRef<ColorPanelRef<HTMLDivElement>>(null);
    const colorOpacityRef = useRef<ColorOpacityRef<HTMLDivElement>>(null);
    const colorPickerElRef = useRef(null);
    const gradientColorChange = useRef<Color | null>(null);

    // TODO:
    // [handleColorPanelChange]、[handleColorHuePanelChange] and
    // [handleColorOpacityPanelChange] 的计算转换公式应当抽离出去
    const handleColorPanelChange = function(position: PositionProps) {
        // 明度 和 饱和度 被选择   值范围为0-1
        // 明度是y轴  饱和度是x轴
        const {x, y} = position;
        let saturation = x / colorPanelWidth * SAndH;
        let brightness = SAndH - (y / colorPanelHeight) * SAndH;

        saturation = Math.max(0, Math.min(saturation, SAndH));
        brightness = Math.max(0, Math.min(brightness, SAndH));

        // console.log('明度:', saturation);
        // console.log('饱和度:', brightness);

        HSBRef.current.s = saturation * 100;
        HSBRef.current.b = brightness * 100;
        setRgbaState();
    };
    const handleColorHuePanelChange = function(hue: number, hueColor: IRGB) {
        // 色相被选择 值范围0 - 359°
        // 转成度数值
        const angle = maxAngle - maxAngle / colorHueAndAlphaHeight * hue;
        // console.log('色相度数', angle);
        HSBRef.current.h = parseInt(angle.toString());
        dispatch({
            type: ColorPickerActions.SET_HUE_COLOR,
            payload: hueColor,
        });
        setRgbaState();
    };
    const handleColorOpacityPanelChange = function(alpha: number) {
        // 透明度

        HSBRef.current.a = (100 - (alpha / colorHueAndAlphaHeight) * 100) / 100;
        setRgbaState();

    };

    const handleColorChange = function(color: Color) {
        const hueY = hsbHToY(color.h, colorHueAndAlphaHeight);
        const panelPosition = hsbSBToPosition(
            color.s,
            color.b,
            colorPanelWidth,
            colorPanelHeight
        );
        const halfPointer = colorPointerSize / 2
        const currAlphaY = colorHueAndAlphaHeight - color.a * colorHueAndAlphaHeight;
        colorPanelRef.current?.setPosition(panelPosition.x - halfPointer, panelPosition.y - halfPointer);
        colorHuePanelRef.current?.setHueY(hueY - halfPointer);
        colorOpacityRef.current?.setOpacityY(currAlphaY - halfPointer);
    };

    // 设置RGBA
    const setRgbaState = function() {
        requestAnimationFrame(() => {
            const color = new Color(
                HSBRef.current.h,
                HSBRef.current.s,
                +HSBRef.current.b,
                HSBRef.current.a
            );
            dispatch({
                type: ColorPickerActions.SET_DEFAULT_RGBA,
                payload: color,
            });

            if (state[ColorPickerActions.SET_COLOR_TYPE] === ColorType.LINEAR) {
                const colors = state[ColorPickerActions.SET_COLORS];
                const currIndex = state[ColorPickerActions.SET_GRADIENT_INDEX];
                colors[currIndex] = color;
                // 如果是渐变
                dispatch({
                    type: ColorPickerActions.SET_COLORS,
                    payload: colors
                });
                onColorChange(colors);
            } else {
                // 通知引用层颜色变化了
                onColorChange(color.rgba);
            }

        });
    };
    // 渐变颜色添加事件被触发
    const handleAddColor = function(color: Color, index: number) {
        const colors = state[ColorPickerActions.SET_COLORS];
        const backwardColor = colors[index];
        colors.splice(index, 1, color, backwardColor);
        // 更改当前渐变颜色列表
        dispatch({
            type: ColorPickerActions.SET_COLORS,
            payload: colors
        });
        // 改变当前索引为刚插入的颜色
        dispatch({
            type: ColorPickerActions.SET_GRADIENT_INDEX,
            payload: index
        });
        // 通知调用者颜色变更
        onColorChange(colors);
    }
    // 删除渐变中某个颜色
    // 如果渐变小于2则不删除
    const handleRemoveColor = function(index: number) {
        const colors = state[ColorPickerActions.SET_COLORS];
        if (colors.length <= 2) return;
        colors.splice(index, 1);
        dispatch({
            type: ColorPickerActions.SET_COLORS,
            payload: colors
        });
        const currIndex = state[ColorPickerActions.SET_GRADIENT_INDEX];
        if (currIndex === index) {
            // 如果当前删除的索引是选中的所以
            // 则重置索引为0
            dispatch({
                type: ColorPickerActions.SET_GRADIENT_INDEX,
                payload: 0,
            });
        }
    }
    // 渐变颜色默认索引被改变
    const handleIndexChange = function(index: number, color: Color) {
        dispatch({
            type: ColorPickerActions.SET_GRADIENT_INDEX,
            payload: index,
        });
        gradientColorChange.current = color;
    }

    // 渐变类型被改变
    const handleGradientOptionChange = function(option: IOption<{}, ColorType>) {
        let colors = state[ColorPickerActions.SET_COLORS];

        if (option.id === ColorType.LINEAR && colors.length < 2) {
            colors = [
                new Color(HSBRef.current.h, HSBRef.current.s, HSBRef.current.b, HSBRef.current.a),
                new Color(0, 0, 100, 1)
            ]
            dispatch({
                type: ColorPickerActions.SET_COLORS,
                payload: colors
            });
        }
        // 貌似这个状态用处不大 后面优化掉
        dispatch({
            type: ColorPickerActions.SET_IS_GRADIENT,
            // 如果不等于纯色那就是渐变色
            payload: option.id !== ColorType.PURE
        });
        dispatch({
            type: ColorPickerActions.SET_COLOR_TYPE,
            payload: option.id!
        });
    }
    // 监听当前渐变索引被改变
    useEffect(() => {
        if (gradientColorChange.current) {
            handleColorChange(gradientColorChange.current);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state[ColorPickerActions.SET_GRADIENT_INDEX]]);


    useImperativeHandle(ref, () => ({
        setColor(color: Color) {
            // 只有和[state[ColorPickerActions.SET_DEFAULT_RGBA]]不相同时才更新
            const isEqual = Color.is(color, state[ColorPickerActions.SET_DEFAULT_RGBA]);
            !isEqual && handleColorChange(color);
        },
        setLinear(linear: LinearGradientdirection) {
            const colors = linear.colors;
            if (colors.length < 2) return;
            dispatch({
                type: ColorPickerActions.SET_COLORS,
                payload: colors
            });
            dispatch({
                type: ColorPickerActions.SET_COLOR_TYPE,
                payload: ColorType.LINEAR
            });
            // 刷新调色板
            handleColorChange(colors[0]);
        },
        colorPickerEl: colorPickerElRef,
    }));

    return (
        <ColorPickerWrapper ref={colorPickerElRef}>
            {
                // 只有传入参数是渐变的参数才可以显示选择渐变
                isGradient && (
                <>
                    <Select
                        width={ 80 }
                        options={ ColorPickerGradientOptions }
                        defaultOptionId={ state[ColorPickerActions.SET_COLOR_TYPE] }
                        onChangeOption={ (_e, option) => handleGradientOptionChange(option) }
                    />
                    {
                        state[ColorPickerActions.SET_COLOR_TYPE] === ColorType.LINEAR &&
                        <ColorGradientPanel
                            colors={ state[ColorPickerActions.SET_COLORS] }
                            selectIndex={ state[ColorPickerActions.SET_GRADIENT_INDEX] }
                            onAdd={ (color, index) => handleAddColor(color, index) }
                            onRemove={ index => handleRemoveColor(index) }
                            onIndexChange={ (index, color) => handleIndexChange(index, color) }
                            />
                    }
                </>
                )
            }
            <ColorPickerBox>
                {/* 明度饱和度面板 */}
                <ColorPanel
                    ref={ colorPanelRef }
                    width={colorPanelWidth}
                    height={colorPanelHeight}
                    pointerSize={colorPointerSize}
                    onDragChange={handleColorPanelChange}
                    hue={state[ColorPickerActions.SET_HUE_COLOR]}
                    {...state[ColorPickerActions.SET_PANEL_POSITION]}
                    color={ state[ColorPickerActions.SET_DEFAULT_RGBA] }
                />
                {/* 色相面板 */}
                <ColorHuePanel
                    ref={ colorHuePanelRef }
                    width={colorHueAndAlphaWidth}
                    height={colorHueAndAlphaHeight}
                    pointerSize={colorPointerSize}
                    onDragChange={handleColorHuePanelChange}
                    y={state[ColorPickerActions.SET_HUE_Y]}
                    color={ state[ColorPickerActions.SET_DEFAULT_RGBA] }
                />
                {/* 透明度面板 */}
                <ColorOpacity
                    ref= { colorOpacityRef }
                    width={colorHueAndAlphaWidth}
                    height={colorHueAndAlphaHeight}
                    pointerSize={colorPointerSize}
                    onDragChange={handleColorOpacityPanelChange}
                    y={state[ColorPickerActions.SET_ALPHA_Y]}
                    color={ state[ColorPickerActions.SET_DEFAULT_RGBA] }
                />
            </ColorPickerBox>
            <ColorFormatPanel
                color={state[ColorPickerActions.SET_DEFAULT_RGBA]}
                colorChange={handleColorChange}
            />
            <ColorAdopePanel
                color={state[ColorPickerActions.SET_DEFAULT_RGBA]}
                onColorClick={handleColorChange}
            />
        </ColorPickerWrapper>
    );
}

export default React.forwardRef(ColorPicker);
