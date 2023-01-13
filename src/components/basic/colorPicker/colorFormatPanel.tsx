import Color from "@layout/utils/color";
import React, { useRef, useState } from "react";
import { THSBSignle, TRGBSignle } from '@/types/color';
import { ColorInput, ColorInputBox, ColorValuePanel, maxOpacity } from ".";
import Select from "../form/select";

enum FORMAT {
    HEX = 'Hex',
    RGB = 'RGB',
    HSB = 'HSB'
}

enum EHSB {
    H = 'h',
    S = 's',
    B = 'b'
}

export interface ColorFormatPanelProps {
    color: Color
    colorChange?: (color: Color) => any
}


interface IFormatData {
    name: FORMAT
    id: number
}

const formatData: Array<IFormatData> = [
    {name: FORMAT.HEX, id: 0 },
    {name: FORMAT.RGB, id: 1},
    {name: FORMAT.HSB, id: 2 }
];


export interface ColorFormatProps {
    format: IFormatData
    color: Color
    changeColor?: (color: Color) => void
}

export function ColorFormat(props: ColorFormatProps) {
    const { format, color, changeColor = () => {} } = props;
    if (format.name === FORMAT.HEX) {
        const hex = color.hex as string;
        const handleHexChange = function(e: React.FocusEvent<HTMLInputElement>) {
            try {
                const RGB = Color.hexToRGB(e.target.value);
                if (typeof RGB !== 'string') {
                    const hsb = Color.rgbToHsb(RGB.r, RGB.g, RGB.b);
                    changeColor(new Color(hsb.h, hsb.s, hsb.b, color.a));
                    e.target.value = e.target.value.toLocaleUpperCase();
                    return;
                }
                e.target.value = hex.toLocaleUpperCase();
            } catch(err) {
                e.target.value = hex.toLocaleUpperCase();
            }
        }
        return (
            <React.Fragment>
                <ColorInputBox>
                    <ColorInput
                        key={ hex }
                        $width={80}
                        defaultValue={ hex.toLocaleUpperCase() }
                        onBlur={e => handleHexChange(e)}
                        />
                </ColorInputBox>
            </React.Fragment>
        );
    }
    if (format.name === FORMAT.RGB) {
        const handleRGBChange = function(e: React.FocusEvent<HTMLInputElement>, type: TRGBSignle) {
            const rgba = color.rgba;
            const value = parseInt(e.target.value);
            if (value > 255) {
                e.target.value = rgba[type].toString();
                return;
            }
            rgba[type] = value;
            const hsb = Color.rgbToHsb(rgba.r, rgba.g, rgba.b);
            changeColor(new Color(hsb.h, hsb.s, hsb.b, rgba.a));
        }
        return (
            <React.Fragment>
                <ColorInputBox>
                    <ColorInput
                        key={ color.rgba.r }
                        $width={24}
                        defaultValue={ color.rgba.r  }
                        onBlur={e => handleRGBChange(e, 'r')}
                        />
                </ColorInputBox>
                <ColorInputBox>
                    <ColorInput
                        key={ color.rgba.g }
                        $width={24}
                        defaultValue={ color.rgba.g }
                        onBlur={e => handleRGBChange(e, 'g')}
                        />
                </ColorInputBox>
                <ColorInputBox>
                    <ColorInput
                        key={ color.rgba.b }
                        $width={24}
                        defaultValue={ color.rgba.b }
                        onBlur={e => handleRGBChange(e, 'b')}
                        />
                </ColorInputBox>
            </React.Fragment>
        );
    }

    const handleHSBChange = function(e: React.FocusEvent<HTMLInputElement>, type: THSBSignle) {
        const currHSB = {h: color.h, s: color.s, b: color.b};
        try {
            const value = +parseFloat(e.target.value).toFixed(2);
            currHSB[type] = value;
            changeColor(new Color(currHSB.h, currHSB.s, currHSB.b, color.a));
            e.target.value = currHSB[type].toString();
        } catch(err) {
            e.target.value = currHSB[type].toString();
        }
    }
    return (
        <React.Fragment>
            <ColorInputBox>
                <ColorInput
                    key={ color.h }
                    $width={24}
                    defaultValue={ color.h }
                    onBlur={e => handleHSBChange(e, EHSB.H)}
                    />
            </ColorInputBox>
            <ColorInputBox>
                <ColorInput
                    key={ color.s }
                    $width={24}
                    defaultValue={ color.s }
                    onBlur={e => handleHSBChange(e, EHSB.S)}
                    />
            </ColorInputBox>
            <ColorInputBox>
                <ColorInput
                    key={ color.b }
                    $width={24}
                    defaultValue={ color.b }
                    onBlur={e => handleHSBChange(e, EHSB.B)}
                    />
            </ColorInputBox>
        </React.Fragment>
    );
}


export default function ColorFormatPanel(props: ColorFormatPanelProps) {
    const { color, colorChange = () => {} } = props;
    const [format, setFormat] = useState(formatData[0]);
    const opacity = useRef(color.a * maxOpacity)
    const handleColorChange = function(color: Color) {
        // console.log(rgb, opacity.current, maxOpacity);
        // colorChange({
        //     ...rgb,
        //     a: opacity.current / maxOpacity
        // });
        colorChange(color);
    };
    const handleOpacityChange = function(e: React.FocusEvent<HTMLInputElement>) {
        const value = parseInt(e.target.value);
        if (!(value > -1)) {
            e.target.value = `${parseInt((color.a * maxOpacity).toString())}%`;
            return;
        }
        opacity.current = value > maxOpacity ? maxOpacity : value;
        handleColorChange(new Color(color.h, color.s, color.b, opacity.current / maxOpacity))
        e.target.value = `${opacity.current}%`;
    };
    return (
        <ColorValuePanel>
                <Select
                    width={ 56 }
                    options={ formatData }
                    defaultOptionId={format.id}
                    onChangeOption={(e: Event, option: any) => setFormat(option)}
                    />
                <ColorFormat
                    format={ format }
                    color={ color }
                    changeColor={ handleColorChange }
                    />
                <ColorInputBox>
                    <ColorInput
                        key={ color.a }
                        $width={34}
                        defaultValue={ parseInt((color.a * maxOpacity).toString()) + '%' }
                        onBlur={ handleOpacityChange }
                        />
                </ColorInputBox>
            </ColorValuePanel>
    );
}
