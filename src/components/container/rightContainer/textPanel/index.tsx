import React, { useState } from 'react';
import Tippy from '@tippyjs/react';
import ColorPicker from "@components/basic/colorPicker/colorPicker";
import Color from "@utils/color";
import Input from "@components/basic/form/input/input";
import Select from "@components/basic/form/select";
import styled, { isStyledComponent } from "styled-components";
import Title from "../widgets/title";
import { IRGBA } from '@/types/color';
import { IconsContainer } from '../widgets/containerStyle';
import IconButton from '@components/basic/iconButton';

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

const ColorBlock = styled.div`
    width: 100%;
    height: 100%;
    background-color: ${props => props.$color};
    cursor: pointer;
`;



export default function TextPanel() {
    const [rgba, setRgba] = useState<IRGBA>({
        r: 255,
        g: 255,
        b: 255,
        a: 1
    });

    const handleColorChange = function(rgba: IRGBA) {
        setRgba(rgba);
    }
    const handleTextColorBlur = function(event: React.ChangeEvent<HTMLInputElement>) {
        const rgb = Color.hexToRGB(event.target.value);
        if (typeof rgb !== 'string') {
            const hex = Color.rgbToHex(rgb.r, rgb.g, rgb.b);
            event.target.value = hex.toLocaleUpperCase();
            setRgba({
                ...rgb,
                a: rgba.a
            });
        } else {
            const hex = Color.rgbToHex(rgba.r, rgba.g, rgba.b);
            event.target.value = hex.toLocaleUpperCase();
        }
        
    }

    return (
        <TextPanelWrapper>
            <TextPanelItem>
                <Title
                    title="文本"
                    />
            </TextPanelItem>
            <TextPanelItem>
                <Input
                    placeholder="这里输入文本信息"
                    />
            </TextPanelItem>
            <TextPanelItem>
                <Input
                    width={ 72 }
                    center
                    placeholder="大小"
                    />
                <Select
                    theme="dark"
                    width={ 184 }
                    options={ [{id: 0, name: '微软雅黑'}, {id: 1, name: '方正'}] }
                    />
            </TextPanelItem>
            <TextPanelItem>
                <Input
                    width={ 96 }
                    center
                    after={
                        <Tippy
                            content={ 
                                <ColorPicker
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
                                <ColorBlock
                                    style={{backgroundColor: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`}}
                                    />
                            </ColorWrapper>
                        </Tippy>
                    }
                    placeholder="颜色"
                    defaultValue={ Color.rgbToHex(rgba.r, rgba.g, rgba.b).toLocaleUpperCase() }
                    onBlur={ handleTextColorBlur }
                    />
                <Input
                    width={ 72 }
                    center
                    placeholder="最大行数"
                    />
                <Input
                    width={ 72 }
                    center
                    placeholder="最大宽度"
                    />
            </TextPanelItem>
            <TextPanelItem>
                <IconsContainer>
                    <IconButton
                        icon="swiper"
                        color='transparent'
                        hoverBgColor='transparent'
                        />
                    <IconButton
                        icon="substr"
                        color='transparent'
                        hoverBgColor='transparent'
                        />
                </IconsContainer>
                <IconsContainer>
                    <IconButton
                        icon="alignLeftText"
                        color='transparent'
                        hoverBgColor='transparent'
                        />
                    <IconButton
                        icon="alignCenterText"
                        color='transparent'
                        hoverBgColor='transparent'
                        />
                    <IconButton
                        icon="alignRightText"
                        color='transparent'
                        hoverBgColor='transparent'
                        />
                </IconsContainer>
                <IconsContainer>
                    <IconButton
                        icon="number"
                        color='transparent'
                        hoverBgColor='transparent'
                        />
                    <IconButton
                        icon="format"
                        color='transparent'
                        hoverBgColor='transparent'
                        />
                </IconsContainer>
            </TextPanelItem>
        </TextPanelWrapper>
    );
}
