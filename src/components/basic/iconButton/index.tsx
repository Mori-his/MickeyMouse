import React from "react";
import styled from "styled-components";
import { IIcons, getIcon, IconWrapper, IconProps, SvgWrapperStyle } from "../svgs/icons";
import ToolTip from "@components/basic/toolTip";

type Margin = {
    left: number
    top: number
    right: number
    bottom: number
}

type IconButtonWrapperProps = {
    size: number
    hoverBgColor?: string
    margin: Margin
}
const IconButtonWrapper = styled(SvgWrapperStyle)<IconButtonWrapperProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${ props => props.size }px;
    height: ${ props => props.size }px;
    background: ${ propos => propos.color || '#141719'};
    border-radius: 50%;
    margin: ${props => props.margin.top}px ${props => props.margin.right}px ${props => props.margin.bottom}px ${props => props.margin.left}px;
    cursor: pointer;
    &:hover {
        background: ${ propos => propos.hoverBgColor || '#469adb'};
    }
`;

export interface IconButtonProps extends IconProps {
    className?: string
    onClick?: Function
    icon: IIcons
    size?: number
    color?: string
    hoverBgColor?: string
    $title?: string
    margin?: Partial<Margin>
}

/**
 * TODO
 * 1、多形态按钮
 * - 圆形icon按钮
 * - 圆角icon按钮
 * 2、多组合按钮
 * - 按钮组合形态
 */

function IconButton(props: React.PropsWithChildren<IconButtonProps>) {
    if (!props.icon) return <React.Fragment></React.Fragment>
    const { size = 32, active = false } = props;
    const margin = Object.assign({ left: 0, top: 0, right: 0, bottom: 0}, props.margin);
    // 获取当前Icon的Svg
    const CurrentIcon = getIcon(props.icon);
    return (
        <ToolTip
            title={ props.$title }
            >
            <IconButtonWrapper
                { ...props }
                className={ props.className }
                onClick={e => props.onClick && props.onClick(e)}
                active={ active }
                size={ size }
                margin={ margin }
                >
                <IconWrapper
                    {...props}
                    size={ size }
                    >
                    <CurrentIcon />
                </IconWrapper>
                { props.children }
            </IconButtonWrapper>
        </ToolTip>
    );
}



export default IconButton;


