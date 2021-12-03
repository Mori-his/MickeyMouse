import React from "react";
import styled from "styled-components";
import { IIcons, getIcon, IconWrapper, IconProps, SvgWrapperStyle } from "../svgs/icons";


const IconButtonWrapper = styled(SvgWrapperStyle)<{
    size: number
    hoverBgColor?: string
}>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${ props => props.size }px;
    height: ${ props => props.size }px;
    background: ${ propos => propos.color || '#141719'};
    border-radius: 50%;
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
    title?: string
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
    const { size = 32 } = props;
    // 获取当前Icon的Svg
    const CurrentIcon = getIcon(props.icon);

    return (
        <IconButtonWrapper
            { ...props }
            className={ props.className }
            onClick={e => props.onClick && props.onClick(e)}
            size={ size }
            title={ props.title }
            >
            <IconWrapper
                {...props}
                size={ size }
                >
                <CurrentIcon />
            </IconWrapper>
            { props.children }
        </IconButtonWrapper>
    );
}



export default IconButton;


