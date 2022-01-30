import Tippy from "@tippyjs/react";
import React from "react";
import styled from "styled-components";
import { getIcon, IconWrapper, IIcons, SvgWrapperStyle } from "../svgs/icons";


interface IconTabWrapperProps {
    active?: boolean
    activeBgColor?: string
    bgColor?: string
}
const IconTabWrapper = styled(SvgWrapperStyle)<IconTabWrapperProps>`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 40px;
    background-color: ${
        props => props.active ? (
            props.activeBgColor || props.theme.contrast
        ) : (
            props.bgColor || props.theme.primary
        )
    };
`;

interface IconTabBarProps {
    barColor?: string
}
const IconTabBar = styled.div<IconTabBarProps>`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background-color: ${props => props.barColor || '#FDBA9A'};
`;

type IconTabPropsWithStyle<P = {}> = P  & {
    color?: string
    activeColor?: string
    hoverColor?: string
}

interface IconTabProps extends IconTabWrapperProps, IconTabPropsWithStyle, IconTabBarProps {
    icon: IIcons
    onClick?: Function
    title?: string | React.ReactNode
}
export default function IconTab(props: React.PropsWithChildren<IconTabProps>) {
    const { icon, active = false, barColor, onClick = () => {} } = props;
    const CurrIcon = getIcon(icon);
    return (
        <Tippy
            content={ props.title }
            disabled={ !props.title }
            >
            <IconTabWrapper
                bgColor={ props.bgColor }
                activeBgColor={ props.activeBgColor }
                activeColor={ props.activeColor || '#fff' }
                hoverColor={ props.hoverColor || '#fff' }
                defaultColor={ props.color || '#707070' }
                active={ active }
                $size={ 32 }
                onClick={ () => onClick() }
                >
                {
                    active && <IconTabBar barColor={ barColor } />
                }
                <IconWrapper
                    $size={ 32 }
                    >
                    <CurrIcon />
                </IconWrapper>
            </IconTabWrapper>
        </Tippy>
    );
}
