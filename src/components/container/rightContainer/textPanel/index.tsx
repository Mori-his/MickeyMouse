import React, { useCallback, useReducer, useRef, useState } from 'react';
import Tippy from '@tippyjs/react';
import styled from "styled-components";

import ColorPicker, { ColorPickerRef } from "@components/basic/colorPicker/colorPicker";
import Color from "@utils/color";
import Input from "@components/basic/form/input/input";
import Select from "@components/basic/form/select";
import Title from "../widgets/title";
import { IRGBA } from '@/types/color';
import { IconsContainer } from '../widgets/containerStyle';
import IconButton from '@components/basic/iconButton';
import LightTippy from '@components/basic/toolTip/lightTippy';
import { ColorBlock } from '@components/basic/colorBlock';
import { ActionMap } from '@/types/redux.type';

const TextPanelWrapper = styled.div`
    color: #fff;
    font-size: 12px;
    margin-top: 8px;
    padding: 0 8px;
`;

const FlexJustifyBetween = styled.div`
    display: flex;
    justify-content: space-between;
`;

const TextPanelItem = styled(FlexJustifyBetween)`
    padding: 8px 0;
`;
interface ColorWrapperProps {
    $width: number
    $height: number
}
const ColorWrapper = styled.div<ColorWrapperProps>`
    flex-shrink: 0;
    margin-right: 8px;
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

export enum TextOverflow {
    swiper,
    clip,
}
export enum TextAlign {
    left,
    center,
    right,
}
export enum TextFormat {
    normal,
    convert
}
export enum TextPanelActions {
    SET_TEXT_COLOR,           // 设置文本颜色
    SET_TEXT,           // 设置文本内容
    SET_TEXT_SIZE,      // 设置文字大小
    SET_TEXT_FAMILY,    // 设置文字字体
    SET_TEXT_MAX_LINE,  // 设置最大行数
    SET_TEXT_MAX_WIDTH, // 设置最大宽度
    SET_TEXT_OVERFLOW,  // 设置裁剪方式
    SET_TEXT_ALIGN,     // 设置居中方式
    SET_TEXT_FORMAT,    // 设置文字格式化方式
}

export type TextPanelState = {
    [TextPanelActions.SET_TEXT_COLOR]: IRGBA
    [TextPanelActions.SET_TEXT]: string
    [TextPanelActions.SET_TEXT_SIZE]: number | string
    [TextPanelActions.SET_TEXT_FAMILY]: string
    [TextPanelActions.SET_TEXT_MAX_LINE]: number | string
    [TextPanelActions.SET_TEXT_MAX_WIDTH]: number | string
    [TextPanelActions.SET_TEXT_OVERFLOW]?: TextOverflow
    [TextPanelActions.SET_TEXT_ALIGN]?: TextAlign
    [TextPanelActions.SET_TEXT_FORMAT]: TextFormat
}
export type TextPanelAction = ActionMap<TextPanelState>[keyof ActionMap<TextPanelState>]

export function TextPanelReducer(state: TextPanelState, action: TextPanelAction) {
    if (action){
        return {
            ...state,
            [action.type]: action?.payload
        };
    }
    return state;
}

const textInitialState = {
    [TextPanelActions.SET_TEXT_COLOR]: {
        r: 255, g: 255, b: 255, a: 1
    },
    [TextPanelActions.SET_TEXT]: '',
    [TextPanelActions.SET_TEXT_SIZE]: '',
    [TextPanelActions.SET_TEXT_FAMILY]: '',
    [TextPanelActions.SET_TEXT_MAX_LINE]: '',
    [TextPanelActions.SET_TEXT_MAX_WIDTH]: '',
    [TextPanelActions.SET_TEXT_FORMAT]: TextFormat.normal
}


export default function TextPanel() {

    const [{
        [TextPanelActions.SET_TEXT_COLOR]: rgba,
        [TextPanelActions.SET_TEXT]: text,
        [TextPanelActions.SET_TEXT_SIZE]: textSize,
        [TextPanelActions.SET_TEXT_FAMILY]: textFamily,
        [TextPanelActions.SET_TEXT_MAX_LINE]: textMaxLine,
        [TextPanelActions.SET_TEXT_MAX_WIDTH]: textMaxWidth,
        [TextPanelActions.SET_TEXT_OVERFLOW]: textOverflow,
        [TextPanelActions.SET_TEXT_ALIGN]: textAlign,
        [TextPanelActions.SET_TEXT_FORMAT]: textFormat
    }, dispatch] = useReducer(TextPanelReducer, textInitialState);
    const colorPicker = useRef<ColorPickerRef<HTMLDivElement>>(null);
    const colorRef = useRef<HTMLInputElement>(null);

    const handleColorChange = useCallback((changeRgba: IRGBA) => {
        dispatch({
            type: TextPanelActions.SET_TEXT_COLOR,
            payload: changeRgba
        });
        const hex = Color.rgbToHex(changeRgba.r, changeRgba.g, changeRgba.b);
        if (colorRef.current?.value) {
            colorRef.current.value = hex.toLocaleUpperCase();
        }
    }, []);
    
    const handleTextColorBlur = function(event: React.ChangeEvent<HTMLInputElement>) {
        const rgb = Color.hexToRGB(event.target.value);
        if (typeof rgb !== 'string') {
            const hex = Color.rgbToHex(rgb.r, rgb.g, rgb.b);
            event.target.value = hex.toLocaleUpperCase();
            const toRgba = {
                ...rgb,
                a: rgba.a
            }
            if (JSON.stringify(toRgba) !== JSON.stringify(rgba)) {
                colorPicker.current?.setRGBA(toRgba);
            }
            dispatch({
                type: TextPanelActions.SET_TEXT_COLOR,
                payload: toRgba
            });
        } else {
            const hex = Color.rgbToHex(rgba.r, rgba.g, rgba.b);
            event.target.value = hex.toLocaleUpperCase();
        }
    }

    const handleAlign = useCallback((align: TextAlign) => {
        dispatch({
            type: TextPanelActions.SET_TEXT_ALIGN,
            payload: textAlign === align ? undefined : align
        })
    }, [textAlign]);
    const handleFormat = useCallback((format: TextFormat) => {
        dispatch({
            type: TextPanelActions.SET_TEXT_FORMAT,
            payload: format
        })
    }, []);
    const handleOverflow = useCallback((overflow: TextOverflow) => {
        dispatch({
            type: TextPanelActions.SET_TEXT_OVERFLOW,
            payload: textOverflow === overflow ? undefined : overflow
        })
    }, [textOverflow]);

    return (
        <TextPanelWrapper>
            <TextPanelItem>
                <Title
                    title="文本"
                    />
            </TextPanelItem>
            <TextPanelItem>
                <LightTippy
                    content="文本内容"
                    delay={[1000, null]}
                    >
                    <Input
                        placeholder="这里输入文本信息"
                        />
                </LightTippy>
            </TextPanelItem>
            <TextPanelItem>
                <LightTippy
                    content="文字大小"
                    delay={[1000, null]}
                    >
                    <Input
                        type="number"
                        width={ 72 }
                        center
                        placeholder="大小"
                        />
                </LightTippy>
                <Select
                    theme="dark"
                    width={ 184 }
                    options={ [{id: 0, name: '微软雅黑'}, {id: 1, name: '方正'}] }
                    />
            </TextPanelItem>
            <TextPanelItem>
                <Input
                    ref={ colorRef }
                    width={ 96 }
                    center
                    after={
                        <Tippy
                            content={ 
                                <ColorPicker
                                    ref={ colorPicker }
                                    rgba={ rgba }
                                    onColorChange={ handleColorChange }
                                    />
                            }
                            animation="shift-away"
                            trigger="click"
                            hideOnClick={ true }
                            arrow={ true }
                            interactive={ true }
                            placement="left"
                            theme="light"
                            >
                            <ColorWrapper
                                $width={ 16 }
                                $height={ 16 }
                                >
                                <LightTippy
                                    content="颜色选择器"
                                    >
                                    <ColorBlock
                                        rgba={rgba}
                                        />
                                </LightTippy>
                            </ColorWrapper>
                        </Tippy>
                    }
                    placeholder="颜色"
                    defaultValue={ Color.rgbToHex(rgba.r, rgba.g, rgba.b).toLocaleUpperCase() }
                    onBlur={ handleTextColorBlur }
                    />
                <Input
                    type="number"
                    width={ 72 }
                    center
                    placeholder="最大行数"
                    />
                <Input
                    type="number"
                    width={ 72 }
                    center
                    placeholder="最大宽度"
                    />
            </TextPanelItem>
            <TextPanelItem>
                <IconsContainer>
                    <IconButton
                        $title='走马灯'
                        icon="swiper"
                        color='transparent'
                        hoverBgColor='transparent'
                        active={ TextOverflow.swiper === textOverflow }
                        tippyProps={{
                            delay: [1000, null]
                        }}
                        onClick={ () => handleOverflow(TextOverflow.swiper)}
                        />
                    <IconButton
                        $title='裁剪文本,超出用...表示'
                        icon="substr"
                        color='transparent'
                        hoverBgColor='transparent'
                        active={ TextOverflow.clip === textOverflow }
                        tippyProps={{
                            delay: [1000, null]
                        }}
                        onClick={ () => handleOverflow(TextOverflow.clip)}
                        />
                </IconsContainer>
                <IconsContainer>
                    <IconButton
                        $title='文本左对齐'
                        icon="alignLeftText"
                        color='transparent'
                        hoverBgColor='transparent'
                        active={ TextAlign.left === textAlign}
                        tippyProps={{
                            delay: [1000, null]
                        }}
                        onClick={() => handleAlign(TextAlign.left)}
                        />
                    <IconButton
                        $title='文本居中'
                        icon="alignCenterText"
                        color='transparent'
                        hoverBgColor='transparent'
                        active={ TextAlign.center === textAlign}
                        tippyProps={{
                            delay: [1000, null]
                        }}
                        onClick={() => handleAlign(TextAlign.center)}
                        />
                    <IconButton
                        $title='文本右对齐'
                        icon="alignRightText"
                        color='transparent'
                        hoverBgColor='transparent'
                        active={ TextAlign.right === textAlign}
                        tippyProps={{
                            delay: [1000, null]
                        }}
                        onClick={() => handleAlign(TextAlign.right)}
                        />
                </IconsContainer>
                <IconsContainer>
                    <IconButton
                        $title='正常数字展示'
                        icon="number"
                        color='transparent'
                        hoverBgColor='transparent'
                        active={ textFormat === TextFormat.normal }
                        tippyProps={{
                            delay: [1000, null]
                        }}
                        onClick={() => handleFormat(TextFormat.normal)}
                        />
                    <IconButton
                        $title='格式化数字,用[万，千万]表示'
                        icon="format"
                        color='transparent'
                        hoverBgColor='transparent'
                        active={ textFormat === TextFormat.convert }
                        tippyProps={{
                            delay: [1000, null]
                        }}
                        onClick={() => handleFormat(TextFormat.convert)}
                        />
                </IconsContainer>
            </TextPanelItem>
        </TextPanelWrapper>
    );
}
