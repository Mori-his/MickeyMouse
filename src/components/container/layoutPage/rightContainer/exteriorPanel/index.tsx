import IconButton from "@components/basic/iconButton";
import React, { useContext, useRef } from "react";
import styled, { ThemeContext } from "styled-components";
import { TitleCollapse } from "../../../common/title";
import Input from '@components/basic/form/input/input';
import Tippy from "@tippyjs/react";
import ColorPicker, { ColorPickerRef } from "@components/basic/colorPicker/colorPicker";
import { IRGBA } from "@/types/color";
import { BackgroundBlock, ColorBlock } from "@components/basic/colorBlock";
import { ExteriorBorder } from "./widgets";
import ownerCaretaker from "@models/owners";
import { Exterior } from "@widgets/interface/widgetInterface";
import { Direction, LinearGradientdirection } from "@layout/core/gradient";
import Color from "@layout/utils/color";
import { BorderSide } from "@layout/core/boxBorder";
import { observer } from "mobx-react";
import LightTippy from "@components/basic/toolTip/lightTippy";

const ExteriorPanelWrapper = styled.div`
`;

const ExteriorPadding = styled.div`
    padding: 16px 8px;
`;

const IconGroupWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.primary};
    padding: 4px 8px;
    border-radius: 12px;
`;

const BorderWrapper = styled.div`
    display: flex;
    justify-content: space-around;
`;
const ColorWrapper = styled.div`
    display: flex;
    align-items: center;
    font-size: 12px;
    margin-top: 8px;
`;
const ColorItem = styled.div`
    display: flex;
    align-items: center;
    margin: 0 4px;
`;
const ColorText = styled.span`
    color: ${props => props.theme.lesser};
`;

// 外设透明图样式， 暂注释
// const ColorAlphaWrapper = styled.div`
//     flex: 1;
//     display: flex;
//     align-items: center;
// `;
// const ColorAlphaOuter = styled.div`
//     position: relative;
//     width: 100%;
//     height: 4px;
//     border-radius: 2px;
//     background: ${props => props.theme.lesser};
// `;
// const ColorAlphaPoint = styled.div`
//     position: absolute;
//     top: 50%;
//     left: 0;
//     transform: translateY(-50%);
//     width: 16px;
//     height: 16px;
//     border-radius: 50%;
//     cursor: pointer;
//     ${props => `
//         background: ${props.theme.primary};
//         box-shadow: 0 1px 4px ${props.theme.primary};
//     `};
// `;



export enum ColorSelectType {
    BACKGROUND,
    BORDER,
}

export default observer(function ExteriorPanel() {

    const currWidget = ownerCaretaker.currOwner.currWidget as Exterior;
    const colorPickerBackgroundRef = useRef<ColorPickerRef<HTMLDivElement>>(null)
    const colorPickerBorderRef = useRef<ColorPickerRef<HTMLDivElement>>(null)

    const handleColorPickerShow = function(type: ColorSelectType) {
        if (type === ColorSelectType.BACKGROUND) {
            const background = currWidget.background;
            if (background instanceof LinearGradientdirection) {
                colorPickerBackgroundRef.current?.setLinear(background)
            } else {
                colorPickerBackgroundRef.current?.setColor(background);
            }
        } else {
            colorPickerBorderRef.current?.setColor(currWidget.border.bottom.color);
        }
    }

    const handleBorderWidthChange = function(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        currWidget.setBorder(new BorderSide({
            width: value,
            color: currWidget.border.bottom?.color,
        }));
    }

    return (
        <ExteriorPanelWrapper>
            <TitleCollapse title="外观">
                <ExteriorPadding>        
                    <BorderWrapper>
                        <ExteriorBorder />
                        <LightTippy
                            content="边框粗细"
                            >
                            <Input
                                type="number"
                                width={ 86 }
                                center
                                placeholder="边框粗细"
                                onChange={ (event: React.ChangeEvent<HTMLInputElement>) => handleBorderWidthChange(event) }
                                value={ currWidget.border.bottom.width }
                                />
                        </LightTippy>
                    </BorderWrapper>
                    { currWidget.setBackground && 
                        <ColorWrapper>
                            <ColorItem>
                                <IconButton
                                    $title={ currWidget.activeBackground ? '已激活背景色' : '未激活背景色' }
                                    icon={ currWidget.activeBackground ? 'checked' : 'checkout' }
                                    color="transparent"
                                    hoverBgColor="transparent"
                                    onClick={ () => currWidget.setActiveBackground(!currWidget.activeBackground)}
                                    active={ currWidget.activeBackground }
                                    />
                            </ColorItem>
                            <ColorItem>
                                <Tippy
                                    content={ 
                                        <ColorPicker
                                            ref={ colorPickerBackgroundRef }
                                            isGradient={ true }
                                            onColorChange={ (color: IRGBA | Color[]) => {
                                                if (color instanceof Array) {
                                                    currWidget.setBackground(
                                                        new LinearGradientdirection(
                                                            Direction.toRight,
                                                            color,
                                                        ),
                                                    );
                                                    return;
                                                }
                                                const hsb = Color.rgbToHsb(color.r, color.g, color.b);
                                                currWidget.setBackground(new Color(hsb.h, hsb.s, hsb.b, color.a))
                                            }}
                                            />
                                    }
                                    onShow={ () => handleColorPickerShow(ColorSelectType.BACKGROUND) }
                                    animation="shift-away"
                                    trigger="click"
                                    hideOnClick={ true }
                                    arrow={ true }
                                    interactive={ true }
                                    placement="left"
                                    theme="light"
                                    >
                                    <BackgroundBlock
                                        width={40}
                                        height={ 16 }
                                        background={ currWidget.background }
                                        />
                                </Tippy>
                            </ColorItem>
                            <ColorItem>
                                <ColorText>背景</ColorText>
                            </ColorItem>
                            
                        </ColorWrapper>
                    }
                    <ColorWrapper>
                        <ColorItem>
                            <IconButton
                                $title={ currWidget.activeBorder ? '已激活边框颜色' : '未激活边框颜色' }
                                icon={ currWidget.activeBorder ? 'checked' : 'checkout' }
                                color="transparent"
                                hoverBgColor="transparent"
                                onClick={ () => currWidget.setActiveBorder(!currWidget.activeBorder)}
                                active={ currWidget.activeBorder }
                                />
                        </ColorItem>
                        <ColorItem>
                        <>
                            <Tippy
                                content={ 
                                    <ColorPicker
                                        ref={ colorPickerBorderRef }
                                        isGradient={ false }
                                        onColorChange={ (rgba: IRGBA) => {
                                            const hsb = Color.rgbToHsb(rgba.r, rgba.g, rgba.b);
                                            currWidget.setBorder(new BorderSide({
                                                color: new Color(hsb.h, hsb.s, hsb.b, rgba.a),
                                                width: currWidget.border.bottom?.width,
                                                style: currWidget.border.bottom?.style
                                            }))
                                        } }
                                        />
                                }
                                onShow={ () => handleColorPickerShow(ColorSelectType.BORDER) }
                                animation="shift-away"
                                trigger="click"
                                hideOnClick={ true }
                                arrow={ true }
                                interactive={ true }
                                placement="left"
                                theme="light"
                                >
                                <ColorBlock
                                    width={40}
                                    height={ 16 }
                                    rgba={ currWidget.border.bottom.color.rgba }
                                    />
                            </Tippy>
                        
                        </>
                        </ColorItem>
                        <ColorItem>
                            <ColorText>边框</ColorText>
                        </ColorItem>
                    </ColorWrapper>
                </ExteriorPadding>
            </TitleCollapse>
        </ExteriorPanelWrapper>
    );

});
