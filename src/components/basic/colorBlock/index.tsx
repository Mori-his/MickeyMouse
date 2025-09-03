import { IRGBA } from "@/types/color";
import { Direction, LinearGradientdirection } from "@layout/core/gradient";
import Color from "@layout/utils/color";
import React, { ForwardedRef, PropsWithChildren, forwardRef } from "react";
import styled, { CSSProperties } from "styled-components";

interface ColorWrapperProps {
    $width: number
    $height: number
}

export const ColorWrapper = styled.div<ColorWrapperProps>`
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

    background-position: 0 0, 8px 8px;
    background-size: 16px 16px;
    border-radius: 4px;
    overflow: hidden;
`;

export const ColorBox = styled.div`
    width: 100%;
    height: 100%;
    border: 1px solid ${props => props.theme.light};
    cursor: pointer;
    border-radius: 4px;
`;

interface ColorBlockProps {
    width?: number
    height?: number
    rgba: IRGBA
}
export const ColorBlock = forwardRef(function ColorBlock(props: PropsWithChildren<ColorBlockProps>, ref: ForwardedRef<HTMLDivElement>) {
    const { width = 16, height = 16, rgba} = props;
    return (
        <ColorWrapper
            ref={ ref }
            $width={ width }
            $height={ height }
            >
            <ColorBox
                style={{
                    backgroundColor: `rgba(
                        ${rgba.r},
                        ${rgba.g},
                        ${rgba.b},
                        ${rgba.a}
                    )`,
                }}
                >
                { props.children }
            </ColorBox>
        </ColorWrapper>
    );
})

interface BackgroundBlockProps {
    width?: number
    height?: number
    background: Color | LinearGradientdirection
}
export const BackgroundBlock = forwardRef(function BackgroundBolck(props: PropsWithChildren<BackgroundBlockProps>, ref: ForwardedRef<HTMLDivElement>) {
    const { width = 16, height = 16, background} = props;
    const style: CSSProperties = {}
    if (background instanceof Color) {
        const rgba = background.rgba;
        style['backgroundColor'] = `rgba(
            ${rgba.r},
            ${rgba.g},
            ${rgba.b},
            ${rgba.a}
        )`
    }
    if (background instanceof LinearGradientdirection) {
        const dir = background.direction;
        let gatherColors = ''
        background.colors.forEach((color, index) => {
            const {r, g, b, a} = color.rgba;
            gatherColors += `rgba(${r}, ${g}, ${b}, ${a})`
            if (index !== background.colors.length - 1) {
                gatherColors += ', '
            }
        })
        if (dir === Direction.toRight) {
            style['background'] = `
                linear-gradient(to right, ${gatherColors})
            `
        } else {
            style['background'] = `
                linear-gradient(to bottom, ${gatherColors})
            `
        }
    }


    return (
        <ColorWrapper
            ref={ ref }
            $width={ width }
            $height={ height }
            >
                <ColorBox
                    style={ style }
                    >
                    { props.children }
                </ColorBox>
        </ColorWrapper>
    );
})



