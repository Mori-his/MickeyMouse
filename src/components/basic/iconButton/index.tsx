import React from "react";
import styled, { css } from "styled-components";
import { IIcons, getIcon, IconWrapper, IconProps, SvgWrapperStyle } from "../svgs/icons";
import ToolTip from "@components/basic/toolTip";

type Margin = {
    left: number
    top: number
    right: number
    bottom: number
}

type IconButtonWrapperProps = {
    $size: number
    hoverBgColor?: string
    $margin: Margin
    $shape: TShape
    $angle: TAngleRect
}
const IconButtonWrapper = styled(SvgWrapperStyle)<IconButtonWrapperProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${ props => props.$size }px;
    height: ${ props => props.$size }px;
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
    &:hover {
        background: ${ props => props.hoverBgColor || props.theme.assist};
    }
`;

type TShape = 'circle' | 'round-angle';
type TAngleRect = {
    topLeft: number
    topRight: number
    bottomLeft: number
    bottomRight: number
}
type TAngle = number | Partial<TAngleRect>
export interface IconButtonProps extends IconProps {
    className?: string
    onClick?: Function
    icon: IIcons
    size?: number
    color?: string
    hoverBgColor?: string
    $title?: string
    margin?: Partial<Margin>
    shape?: TShape
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
    if (!props.icon) return <React.Fragment></React.Fragment>
    const {
        size = 32,
        active = false,
        shape = 'circle',
        angle = 8
    } = props;
    const margin = Object.assign({ left: 0, top: 0, right: 0, bottom: 0}, props.margin);
    // 获取当前Icon的Svg
    const CurrentIcon = getIcon(props.icon);
    const _angle = transitionAngle(angle);
    return (
        <ToolTip
            title={ props.$title }
            >
            <IconButtonWrapper
                { ...props }
                className={ props.className }
                onClick={e => props.onClick && props.onClick(e)}
                active={ active }
                $size={ size }
                $margin={ margin }
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
        </ToolTip>
    );
}

export default IconButton;


