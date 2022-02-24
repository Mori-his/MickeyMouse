import Color from "@utils/color";
import React, { useEffect, useRef, useState } from "react";
import { IHSB, THSBSignle, TRGBSignle, IRGBA, IRGB } from '@/types/color';
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
    rgba: IRGBA
    colorChange?: (rgb: IRGBA) => any
}


interface IFormatData {
    name: FORMAT
    id: number
    serialize(rgba: IRGBA):  string | IRGBA | IHSB
}

const formatData: Array<IFormatData> = [
    {name: FORMAT.HEX, id: 0, serialize: (rgba: IRGBA) => { return Color.rgbToHex(rgba.r, rgba.g, rgba.b).toLocaleUpperCase() }},
    {name: FORMAT.RGB, id: 1, serialize: (rgba: IRGBA) => { return rgba }},
    {name: FORMAT.HSB, id: 2, serialize: (rgba: IRGBA) => { return Color.rgbToHsb(rgba.r, rgba.g, rgba.b) }}
];


export interface ColorFormatProps {
    format: IFormatData
    rgba: IRGBA
    changeColor?: Function
}

export function ColorFormat(props: ColorFormatProps) {
    const { format, rgba, changeColor = () => {} } = props;
    if (format.name === FORMAT.HEX) {
        const hex = format.serialize(rgba) as string;
        const handleHexChange = function(e: React.FocusEvent<HTMLInputElement>) {
            try {
                const RGB = Color.hexToRGB(e.target.value);
                if (typeof RGB !== 'string') {
                    changeColor(RGB);
                    const hex = format.serialize(rgba) as string;
                    e.target.value = hex.toLocaleUpperCase();
                    return;
                }
                e.target.value = hex;
            } catch(err) {
                e.target.value = hex;
            }
        }
        return (
            <React.Fragment>
                <ColorInputBox>
                    <ColorInput
                        key={ hex }
                        $width={80}
                        defaultValue={ hex }
                        onBlur={e => handleHexChange(e)}
                        />
                </ColorInputBox>
            </React.Fragment>
        );
    }
    if (format.name === FORMAT.RGB) {
        const handleRGBChange = function(e: React.FocusEvent<HTMLInputElement>, type: TRGBSignle) {
            const value = parseInt(e.target.value);
            let RGB = {r: rgba.r, g: rgba.g, b: rgba.b};
            if (value > 255) {
                e.target.value = rgba[type].toString();
                return;
            }
            RGB[type] = value;
            changeColor(RGB);
        }
        return (
            <React.Fragment>
                <ColorInputBox>
                    <ColorInput
                        key={ rgba.r }
                        $width={24}
                        defaultValue={ rgba.r }
                        onBlur={e => handleRGBChange(e, 'r')}
                        />
                </ColorInputBox>
                <ColorInputBox>
                    <ColorInput
                        key={ rgba.g }
                        $width={24}
                        defaultValue={ rgba.g }
                        onBlur={e => handleRGBChange(e, 'g')}
                        />
                </ColorInputBox>
                <ColorInputBox>
                    <ColorInput
                        key={ rgba.b }
                        $width={24}
                        defaultValue={ rgba.b }
                        onBlur={e => handleRGBChange(e, 'b')}
                        />
                </ColorInputBox>
            </React.Fragment>
        );
    }
    const HSB = format.serialize(rgba) as IHSB;
    const handleHSBChange = function(e: React.FocusEvent<HTMLInputElement>, type: THSBSignle) {
        let currHSB = {h: HSB.h, s: HSB.s, b: HSB.b};
        try {
            let value = parseInt(e.target.value)
            if (type === EHSB.S || type === EHSB.B) {
                value /= 100;
            }
            currHSB[type] = value;
            const RGB = Color.hsvToRgb(currHSB.h, currHSB.s, currHSB.b);
            if (typeof RGB !== 'string') {
                changeColor(RGB);
                return;
            }
            e.target.value = HSB[type].toString();
        } catch(err) {
            e.target.value = HSB[type].toString();
        }
    }
    return (
        <React.Fragment>
            <ColorInputBox>
                <ColorInput
                    key={ HSB.h }
                    $width={24}
                    defaultValue={ Math.round(HSB.h) }
                    onBlur={e => handleHSBChange(e, EHSB.H)}
                    />
            </ColorInputBox>
            <ColorInputBox>
                <ColorInput
                    key={ HSB.s }
                    $width={24}
                    defaultValue={ Math.round(HSB.s * 100) }
                    onBlur={e => handleHSBChange(e, EHSB.S)}
                    />
            </ColorInputBox>
            <ColorInputBox>
                <ColorInput
                    key={ HSB.b }
                    $width={24}
                    defaultValue={ Math.round(HSB.b * 100) }
                    onBlur={e => handleHSBChange(e, EHSB.B)}
                    />
            </ColorInputBox>
        </React.Fragment>

    );

    
}


export default function ColorFormatPanel(props: ColorFormatPanelProps) {
    const { rgba, colorChange = () => {} } = props;
    const [format, setFormat] = useState(formatData[0]);
    const opacity = useRef(rgba.a * maxOpacity)
    const handleColorChange = function(rgb: IRGB) {
        colorChange({
            ...rgb,
            a: opacity.current / maxOpacity
        });
    };
    const handleOpacityChange = function(e: React.FocusEvent<HTMLInputElement>) {
        const value = parseInt(e.target.value);
        if (!(value > -1)) {
            e.target.value = `${parseInt((rgba.a * maxOpacity).toString())}%`;
            return;
        }
        opacity.current = value > maxOpacity ? maxOpacity : value;
        handleColorChange({
            r: rgba.r,
            g: rgba.g,
            b: rgba.b
        });
        e.target.value = `${opacity.current}%`;
    };

    return (
        <ColorValuePanel>
                <Select
                    width={ 56 }
                    options={ formatData }
                    defaultOptionId={format.id}
                    onChangeOption={(e: Event, option: IFormatData) => setFormat(option)}
                    />
                <ColorFormat
                    format={ format }
                    rgba={ rgba }
                    changeColor={ handleColorChange }
                    />
                <ColorInputBox>
                    <ColorInput
                        key={ rgba.a }
                        $width={34}
                        defaultValue={ parseInt((rgba.a * maxOpacity).toString()) + '%' }
                        onBlur={ handleOpacityChange }
                        />
                </ColorInputBox>
            </ColorValuePanel>
    );
}
