
import { ChangeEvent, useRef } from 'react';
import { observer } from 'mobx-react';
import CreatableSelect from 'react-select/creatable';
import { GroupBase, mergeStyles, SingleValue, StylesConfig } from 'react-select';
import ownerCaretaker from '@models/owners';
import LightTippy from '@components/basic/toolTip/lightTippy';
import { Alignment, LabelViewWidget, TextFormat, TextOverflow } from '@widgets/label';
import Input from '@components/basic/form/input/input';
import Tippy from '@tippyjs/react';
import ColorPicker, { ColorPickerRef } from '@components/basic/colorPicker/colorPicker';
import { ColorBlock, ColorWrapper } from '@components/basic/colorBlock';
import Color from '@layout/utils/color';
import { IRGBA } from '@/types/color';
import { IconsContainer } from '../../../common/styleds/containerStyle';
import IconButton from '@components/basic/iconButton';
import { selectStyle } from '@styles/globals';
import { selectCustomTheme } from '@styles/layout.theme';

export interface TextInputProps {
    placeholder?: string
    $title?: string
}
export const TextInput = observer(function TextInput(props: TextInputProps) {
    const currWidget = ownerCaretaker.currOwner.currWidget! as LabelViewWidget;

    const {
        placeholder = '这里输入文本信息',
        $title = '文本内容'
    } = props;

    const handleTextChange = function(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        currWidget.setText(value);
    }
    return (
        <LightTippy
            content={ $title }
            >
            <Input
                placeholder={ placeholder }
                onChange={ (e) => handleTextChange(e) }
                value={ currWidget.text || '' }
                />
        </LightTippy>
    );
});


export interface FontSizeProps {
    placeholder?: string
    $title?: string
}
export const FontSize = observer(function FontSize(props: FontSizeProps) {
    const currWidget = ownerCaretaker.currOwner.currWidget! as LabelViewWidget;
    const {
        placeholder = '大小',
        $title = '文字大小'
    } = props;

    const handleFontSizeChange = function(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        currWidget.setFontSize(value);
    }
    return (
        <LightTippy
            content={ $title }
            >
            <Input
                type="number"
                width={ 72 }
                center
                select
                auto
                placeholder={ placeholder }
                onChange={ (e) => handleFontSizeChange(e) }
                value={ currWidget.fontSize }
                />
        </LightTippy>
    );
});

type SelectOption = {
    label: string
    value: string
}

const withSelectStyles: StylesConfig<any, false, GroupBase<any>> = mergeStyles(selectStyle, {
    container: (style) => ({
        ...style,
        width: '184px',
    }),
});

export const SelectFontFamily = observer(function SelectFontFamily() {
    const currWidget = ownerCaretaker.currOwner.currWidget! as LabelViewWidget;


    const options: SelectOption[] = [
        {value: 'DINCondensedC', label: 'DINCondensedC'},
        {value: 'RobotoCondensed-Bold', label: 'RobotoCondensed-Bold'},
        {value: 'Roboto-BlackItalic', label: ' Roboto-BlackItalic'},
        {value: 'Archive', label: ' Archive'},
    ]

    const handleChangeOption = function(option: SingleValue<SelectOption>) {
        currWidget.setFontFamily(option?.value);
    }
    
    return (
        <CreatableSelect
            options={ options }
            value={ options.find(option => option.value === currWidget.fontFamily) }
            styles={ withSelectStyles }
            theme={ selectCustomTheme }
            isClearable={ true }
            placeholder="请选择字体"
            onChange={ (option: SingleValue<SelectOption>) => handleChangeOption(option) }
            />
    )
});

export interface FontColorProps {

}
export const FontColor = observer(function FontColor() {
    const currWidget = ownerCaretaker.currOwner.currWidget! as LabelViewWidget;
    
    const colorPicker = useRef<ColorPickerRef<HTMLDivElement>>(null);
    const colorRef = useRef<HTMLInputElement>(null);

    const handleColorPickerShow = function() {
        colorPicker.current?.setColor(currWidget.fontColor);
    }
    // Color被改变
    const handleColorChange = function(color: IRGBA) {
        const hex = Color.rgbToHex(color.r, color.g, color.b);
        const hsb = Color.rgbToHsb(color.r, color.g, color.b);
        if (colorRef.current?.value) {
            colorRef.current.value = hex.toLocaleUpperCase();
        }
        currWidget.setFontColor(new Color(hsb.h, hsb.s, hsb.b, color.a));
    }
    // Color文本框失去焦点
    const handleTextColorBlur = function(event: ChangeEvent<HTMLInputElement>) {
        const rgb = Color.hexToRGB(event.target.value);
        if (typeof rgb !== 'string') {
            event.target.value = event.target.value.toLocaleUpperCase();
            const hsb = Color.rgbToHsb(rgb.r, rgb.g, rgb.b);
            const color = new Color(hsb.h, hsb.s, hsb.b, currWidget.fontColor.a);
            if (!Color.is(color, currWidget.fontColor)) {
                colorPicker.current?.setColor(color);
                currWidget.setFontColor(color);
            }
        } else {
            event.target.value = currWidget.fontColor.hex.toLocaleUpperCase();
        }
    }

    return (
        <Input
            ref={ colorRef }
            width={ 96 }
            center
            after={
                <Tippy
                    content={ 
                        <ColorPicker
                            isGradient={ false }
                            ref={ colorPicker }
                            // rgba={ currWidget.fontColor.rgba }
                            onColorChange={ handleColorChange }
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
                                rgba={currWidget.fontColor.rgba}
                                />
                        </LightTippy>
                    </ColorWrapper>
                </Tippy>
            }
            placeholder="颜色"
            defaultValue={ currWidget.fontColor.hex.toLocaleUpperCase() }
            onBlur={ handleTextColorBlur }
            />
    );
});


export const FontMaxLine = observer(function FontMaxLine() {
    const currWidget = ownerCaretaker.currOwner.currWidget! as LabelViewWidget;

    const handleMaxLineChange = function(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        currWidget.setMaxLine(value);
    }

    return (
        <LightTippy
            content="最大行数"
            >
            <Input
                type="number"
                width={ 72 }
                center
                select
                auto
                placeholder="最大行数"
                onChange={ (e) => handleMaxLineChange(e) }
                value={ currWidget.maxLine }
                />
        </LightTippy>
    );
});

export const FontMaxWidth = observer(function FontMaxWidth() {
    const currWidget = ownerCaretaker.currOwner.currWidget! as LabelViewWidget;

    const handleMaxWidthChange = function(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        currWidget.setMaxWidth(value);
    }

    return (
        <LightTippy
            content="最大宽度"
            >
            <Input
                type="number"
                width={ 72 }
                center
                select
                auto
                placeholder="最大宽度"
                onChange={ (e) => handleMaxWidthChange(e) }
                value={ currWidget.maxWidth }
                />
        </LightTippy>
    );
});


export const FontTextOverflow = observer(function FontTextOverflow() {
    const currWidget = ownerCaretaker.currOwner.currWidget! as LabelViewWidget;

    const handleTextOverflowChange = function(textOverflow: TextOverflow) {
        currWidget.setTextOverflow(
            currWidget.textOverflow === textOverflow ? undefined : textOverflow
        );
    }

    return (
        <IconsContainer>
            <IconButton
                $title='走马灯'
                icon="swiper"
                color='transparent'
                hoverBgColor='transparent'
                active={ TextOverflow.swiper === currWidget.textOverflow }
                tippyProps={{
                    delay: [200, null]
                }}
                onClick={ () => handleTextOverflowChange(TextOverflow.swiper)}
                />
            <IconButton
                $title='裁剪文本,超出用...表示'
                icon="substr"
                color='transparent'
                hoverBgColor='transparent'
                active={ TextOverflow.clip === currWidget.textOverflow }
                tippyProps={{
                    delay: [200, null]
                }}
                onClick={ () => handleTextOverflowChange(TextOverflow.clip)}
                />
        </IconsContainer>
    );
});



export const FontAlignment = observer(function FontAlignment() {
    const currWidget = ownerCaretaker.currOwner.currWidget! as LabelViewWidget;

    const handleAlignmentChange = function(alignment: Alignment) {
        currWidget.setAlignment(
            currWidget.alignment === alignment ? undefined : alignment
        );
    }

    return (
        <IconsContainer>
            <IconButton
                $title='文本左对齐'
                icon="alignLeftText"
                color='transparent'
                hoverBgColor='transparent'
                active={ Alignment.left === currWidget.alignment}
                tippyProps={{
                    delay: [200, null]
                }}
                onClick={() => handleAlignmentChange(Alignment.left)}
                />
            <IconButton
                $title='文本居中'
                icon="alignCenterText"
                color='transparent'
                hoverBgColor='transparent'
                active={ Alignment.center === currWidget.alignment}
                tippyProps={{
                    delay: [200, null]
                }}
                onClick={() => handleAlignmentChange(Alignment.center)}
                />
            <IconButton
                $title='文本右对齐'
                icon="alignRightText"
                color='transparent'
                hoverBgColor='transparent'
                active={ Alignment.right === currWidget.alignment}
                tippyProps={{
                    delay: [200, null]
                }}
                onClick={() => handleAlignmentChange(Alignment.right)}
                />
        </IconsContainer>
    );
});


export const FontFormat = observer(function FontFormat() {
    const currWidget = ownerCaretaker.currOwner.currWidget! as LabelViewWidget;

    const handleFormatChange = function(textFormat: TextFormat) {
        currWidget.setTextFormat(textFormat);
    }

    return (
        <IconsContainer>
            <IconButton
                $title='正常数字展示'
                icon="number"
                color='transparent'
                hoverBgColor='transparent'
                active={ currWidget.textFormat === TextFormat.normal }
                tippyProps={{
                    delay: [200, null]
                }}
                onClick={() => handleFormatChange(TextFormat.normal)}
                />
            <IconButton
                $title='格式化数字,用[万，千万]表示'
                icon="format"
                color='transparent'
                hoverBgColor='transparent'
                active={ currWidget.textFormat === TextFormat.convert }
                tippyProps={{
                    delay: [200, null]
                }}
                onClick={() => handleFormatChange(TextFormat.convert)}
                />
        </IconsContainer>
    );
});
