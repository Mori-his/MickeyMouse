import React from "react";
import styled from "styled-components";
import { IIcons, getIcon, IconWrapper, IconProps, SvgWrapperStyle } from "../svgs/icons";
import Tippy from '@tippyjs/react';


type TAngleRect = {
    topLeft: number
    topRight: number
    bottomLeft: number
    bottomRight: number
}

type Edge = {
    left: number
    top: number
    right: number
    bottom: number
}

type IconButtonWrapperProps = {
    $size: number
    hoverBgColor?: string
    $margin: Edge
    $padding: number
    $shape: TShape
    $angle: TAngleRect
}
const IconButtonWrapper = styled(SvgWrapperStyle)<IconButtonWrapperProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${ props => props.$size + props.$padding }px;
    height: ${ props => props.$size + props.$padding}px;
    background: ${ props => props.color || props.theme.primary};
    margin: ${props => props.$margin.top}px ${props => props.$margin.right}px ${props => props.$margin.bottom}px ${props => props.$margin.left}px;
    cursor: pointer;
    ${props => props.$shape === 'circle' ? `
        border-radius: 50%;
    ` : `
        border-top-left-radius: ${props.$angle.topLeft}px;
        border-top-right-radius: ${props.$angle.topRight}px;
        border-bottom-left-radius: ${props.$angle.bottomLeft}px;
        border-bottom-right-radius: ${props.$angle.bottomRight}px;
    `};

    /* position: relative;
    box-sizing: border-box;
    text-transform: uppercase;
    background-color: transparent;
    font-weight: 500;
    overflow: hidden;
    outline: none;

    &::-moz-focus-inner {
        border: none;
    }
    &::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: ${ props => props.hoverBgColor || props.theme.assist};
        opacity: 0;
        transition: opacity 2s;
    }
    &::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        border-radius: 50%;
        padding: 50%;
        width: 32px;
        height: 32px;
        background-color: ${ props => props.hoverBgColor || props.theme.assist};
        opacity: 0;
        transform: translate(-50%, -50%) scale(1);
        transition: opacity 1s, transform 0.5s;
    }
    &:hover::before {
        opacity: 0.04;
    }
    &:focus::before {
        opacity: 0.12;
    }
    &:hover:focus::before {
        opacity: 0.16;
    }
    &:active::after {
        opacity: 0.16;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0s;
    }
    &:disabled {
        background-color: transparent;
        cursor: initial;
    }
    &::before {
        opacity: 0;
    }
    &:disabled::after {
        opacity: 0;
    } */

    &:hover {
        background: ${ props => props.hoverBgColor || props.theme.assist};
    }
`;

type TShape = 'circle' | 'round-angle';
type TAngle = number | Partial<TAngleRect>

export interface IconButtonProps extends IconProps {
    className?: string
    onClick?: Function
    icon: IIcons
    size?: number
    color?: string
    hoverBgColor?: string
    $title?: string
    margin?: Partial<Edge>
    padding?: number
    /**
     * 设置盒子形状
     * @param 'circle' | 'round-angle'
     */
    shape?: TShape
    /**
     * border-radius的四个角  
     * 如果设置了`shape: circle`则此属性无效
     * @param topLeft
     * @param topRight
     * @param bottomLeft
     * @param bottomRight
     */
    angle?: TAngle
}

function transitionAngle(angle: TAngle): TAngleRect {
    if (typeof angle === 'number') {
        return {
            topLeft: angle,
            topRight: angle,
            bottomLeft: angle,
            bottomRight: angle
        }
    }
    return {
        topLeft: angle.topLeft || 0,
        topRight: angle.topRight || 0,
        bottomLeft: angle.bottomLeft || 0,
        bottomRight: angle.bottomRight || 0
    }
}

function IconButton(props: IconButtonProps) {
    if (!props.icon) return null;
    const {
        size = 24,
        active = false,
        shape = 'circle',
        angle = 8,
        padding = 0
    } = props;
    const margin = Object.assign({ left: 0, top: 0, right: 0, bottom: 0}, props.margin);
    // 获取当前Icon的Svg
    const CurrentIcon = getIcon(props.icon);
    const _angle = transitionAngle(angle);

    return (
        <Tippy
            content={ props.$title }
            placement="top"
            animation="scale"
            theme="light"
            disabled={ !props.$title }
            >
            <IconButtonWrapper
                { ...props }
                className={ props.className }
                onClick={e => props.onClick && props.onClick(e)}
                active={ active }
                $size={ size }
                $margin={ margin }
                $padding={ padding }
                $shape={ shape }
                $angle={ _angle }
                >
                <IconWrapper
                    {...props}
                    $size={ size }
                    >
                    <CurrentIcon />
                </IconWrapper>
            </IconButtonWrapper>
        </Tippy>
    );
}

export default IconButton;


export function PureIconButton(props: IconButtonProps) {
    return (
        <IconButton
            color='transparent'
            hoverBgColor='transparent'
            {...props}
        />
    );
}

