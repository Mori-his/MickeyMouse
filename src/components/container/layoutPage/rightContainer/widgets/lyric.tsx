import { IRGBA } from "@/types/color";
import { ColorBlock, ColorWrapper } from "@components/basic/colorBlock";
import ColorPicker, { ColorPickerRef } from "@components/basic/colorPicker/colorPicker";
import FormItem from "@components/basic/form/formItem/formItem";
import Input from "@components/basic/form/input/input";
import { Textarea } from "@components/basic/form/textarea";
import LightTippy from "@components/basic/toolTip/lightTippy";
import { TextPanelItem } from "@components/container/common/styleds/containerStyle";
import { TitleCollapse } from "@components/container/common/title";
import Color from "@layout/utils/color";
import ownerCaretaker from "@models/owners";
import Tippy from "@tippyjs/react";
import { LyricWidget } from "@widgets/lyric";
import { observer } from "mobx-react";
import { ChangeEvent, useRef } from "react";
import styled, { ThemeConsumer } from "styled-components";


const InputBeforeSpan = styled.span`
    flex-shrink: 0;
    color: ${props => props.theme.lesserText};
    margin: 0 8px;
`;

type LyricAttrColor = 'highlightTextColor' | 'normalTextColor'
type LyricSetAttrColor = 'setHighlightTextColor' | 'setNormalTextColor'

export const LyricRender = observer(function() {
    const currWidget = ownerCaretaker.currOwner.currWidget as LyricWidget;
    const colorPicker = useRef<ColorPickerRef<HTMLDivElement>>(null);
    const colorRef = useRef<HTMLInputElement>(null);

    const handleColorPickerShow = function() {
        colorPicker.current?.setColor(currWidget.highlightTextColor);
    }
    // Color被改变
    const handleColorChange = function(color: IRGBA, setAttr: LyricSetAttrColor) {
        const hex = Color.rgbToHex(color.r, color.g, color.b);
        const hsb = Color.rgbToHsb(color.r, color.g, color.b);
        if (colorRef.current?.value) {
            colorRef.current.value = hex.toLocaleUpperCase();
        }
        currWidget[setAttr](new Color(hsb.h, hsb.s, hsb.b, color.a));
    }
    // Color文本框失去焦点
    const handleTextColorBlur = function(
        event: ChangeEvent<HTMLInputElement>,
        attr: LyricAttrColor,
        setAttr: LyricSetAttrColor
    ) {
        const rgb = Color.hexToRGB(event.target.value);
        if (typeof rgb !== 'string') {
            event.target.value = event.target.value.toLocaleUpperCase();
            const hsb = Color.rgbToHsb(rgb.r, rgb.g, rgb.b);
            const color = new Color(hsb.h, hsb.s, hsb.b, currWidget[attr].a);
            if (!Color.is(color, currWidget[attr])) {
                colorPicker.current?.setColor(color);
                currWidget[setAttr](color);
            }
        } else {
            event.target.value = currWidget[attr].hex.toLocaleUpperCase();
        }
    }

    const handleHighlghtTextSizeChange = function(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        currWidget.setHighlghtTextSize(value);
    }
    const handleNormalTextSizeChange = function(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        currWidget.setNormalTextSize(value);
    }
    const handleNumberOfRowsChange = function(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        currWidget.setNumberOfRows(value);
    }

    return (
        <TitleCollapse
            title="歌词属性配置"
            >
            <div className="padding16">
                <FormItem>
                    <Input
                        ref={ colorRef }
                        width={ 260 }
                        center
                        before={
                            <InputBeforeSpan>高亮歌词颜色</InputBeforeSpan>
                        }
                        after={
                            <Tippy
                                content={ 
                                    <ColorPicker
                                        isGradient={ false }
                                        ref={ colorPicker }
                                        // rgba={ currWidget.fontColor.rgba }
                                        onColorChange={ (color: IRGBA) => handleColorChange(color, 'setHighlightTextColor') }
                                        />
                                }
                                onShow={ () => handleColorPickerShow() }
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
                                            rgba={currWidget.highlightTextColor.rgba}
                                            />
                                    </LightTippy>
                                </ColorWrapper>
                            </Tippy>
                        }
                        placeholder="颜色"
                        defaultValue={ currWidget.highlightTextColor.hex.toLocaleUpperCase() }
                        onBlur={ (event) => handleTextColorBlur(event, 'highlightTextColor', 'setHighlightTextColor') }
                        />
                </FormItem>
                <FormItem>
                    <Input
                        ref={ colorRef }
                        width={ 260 }
                        center
                        before={
                            <InputBeforeSpan>普通歌词颜色</InputBeforeSpan>
                        }
                        after={
                            <Tippy
                                content={ 
                                    <ColorPicker
                                        isGradient={ false }
                                        ref={ colorPicker }
                                        // rgba={ currWidget.fontColor.rgba }
                                        onColorChange={ (color: IRGBA) => handleColorChange(color, 'setHighlightTextColor') }
                                        />
                                }
                                onShow={ () => handleColorPickerShow() }
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
                                            rgba={currWidget.highlightTextColor.rgba}
                                            />
                                    </LightTippy>
                                </ColorWrapper>
                            </Tippy>
                        }
                        placeholder="颜色"
                        defaultValue={ currWidget.highlightTextColor.hex.toLocaleUpperCase() }
                        onBlur={ (event) => handleTextColorBlur(event, 'highlightTextColor', 'setHighlightTextColor') }
                        />
                </FormItem>
                    <TextPanelItem>
                        <Input
                            label="高亮字体大小"
                            labelAnimation
                            type="number"
                            width={ 70 }
                            center
                            select
                            auto
                            placeholder="高亮字体大小"
                            onChange={ e => handleHighlghtTextSizeChange(e) }
                            value={ currWidget.highlghtTextSize || '' }
                            />
                        <Input
                            label="普通字体大小"
                            labelAnimation
                            type="number"
                            width={ 70 }
                            center
                            select
                            auto
                            placeholder="普通字体大小"
                            onChange={ e => handleNormalTextSizeChange(e) }
                            value={ currWidget.normalTextSize || '' }
                            />
                        <Input
                            label="歌词行数"
                            labelAnimation
                            type="number"
                            width={ 70 }
                            center
                            select
                            auto
                            placeholder="歌词行数"
                            onChange={ e => handleNumberOfRowsChange(e) }
                            value={ currWidget.numberOfRows || '' }
                            />
                    </TextPanelItem>
            </div>
        </TitleCollapse>
    );
});
