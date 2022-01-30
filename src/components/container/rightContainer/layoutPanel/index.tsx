import styled, { ThemeContext } from "styled-components";

import Title from "../widgets/title";
import IconButton from "@components/basic/iconButton";
import React, { useContext, useState } from "react";
import ownerCaretaker from "@models/owners";
import SizeRailLine, { PositionRailLine } from "./railLine/sizeRailLine";

// 布局面板最外层容器
const LayoutPanelWarpper = styled.div`
    padding: 8px 8px 0;
`;
// 布局面板title容器
const LayoutPanelTitleWrapper = styled.div`
    display: flex;
    align-items: center;
`;
// 布局面板对齐功能容器
const LayoutPanelAlignWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
`;

export default function LayoutPanel() {
    return (
        <LayoutPanelWarpper>
            <LayoutPanelTitleWrapper>
                <Title
                    title="布局配置"
                    />
                <LayoutTitleRightIcons />
            </LayoutPanelTitleWrapper>
            <LayoutPanelAlignWrapper>
                <LayoutAlignCenter />
                <LayoutAlignAuto />
                <LayoutAlignDirection />
            </LayoutPanelAlignWrapper>
            <LayoutConfig />
        </LayoutPanelWarpper>
    );
}

const AlignCenterWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.primary};
    padding: 4px 8px;
    border-radius: 12px;
`;

const LayoutConfigWrapper = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 8px;
`;
const LayoutConfigHalvingLine = styled.div`
    height: 32px;
    border: 1px solid ${props => props.theme.white30};
    border-radius: 2px;
`;

export function LayoutConfig() {
    return (
        <LayoutConfigWrapper>
            <SizeRailLine />
            <LayoutConfigHalvingLine />
            <PositionRailLine />
        </LayoutConfigWrapper>
    );
}






interface LayoutAlignProps {

}
export function LayoutAlignDirection(props: React.PropsWithChildren<LayoutAlignProps>) {
    const [isVertical, setVertical] = useState(false);
    const [isHorizontal, setIsHorizontal] = useState(false);
    const theme = useContext(ThemeContext);

    const handleVerticalClick = function() {
        const nextValue = !isVertical;
        setVertical(nextValue);
    }
    const handleHorizontalClick = function() {
        const nextValue = !isHorizontal;
        setIsHorizontal(nextValue);
    }

    return (
        <AlignCenterWrapper>
            <IconButton
                icon="alignLeft"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ isVertical }
                onClick={ handleVerticalClick }
                />
            <IconButton
                icon="alignTop"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ isHorizontal }
                onClick={ handleHorizontalClick }
                />
            <IconButton
                icon="alignRight"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ isHorizontal }
                onClick={ handleHorizontalClick }
                />
            <IconButton
                icon="alignBottom"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ isHorizontal }
                onClick={ handleHorizontalClick }
                />

        </AlignCenterWrapper>
    );
}

export function LayoutAlignCenter(props: React.PropsWithChildren<LayoutAlignProps>) {
    const [isVertical, setVertical] = useState(false);
    const [isHorizontal, setIsHorizontal] = useState(false);
    const theme = useContext(ThemeContext);

    const handleVerticalClick = function() {
        const nextValue = !isVertical;
        setVertical(nextValue);
    }
    const handleHorizontalClick = function() {
        const nextValue = !isHorizontal;
        setIsHorizontal(nextValue);
    }

    return (
        <AlignCenterWrapper>
            <IconButton
                icon="vertical"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ isVertical }
                onClick={ handleVerticalClick }
                />
            <IconButton
                icon="horizontal"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ isHorizontal }
                onClick={ handleHorizontalClick }
                />

        </AlignCenterWrapper>
    );
}

export function LayoutAlignAuto(props: React.PropsWithChildren<LayoutAlignProps>) {
    const [isWidthAuto, setWidthAuto] = useState(false);
    const [isHeightAuto, setIsHeightAuto] = useState(false);
    const theme = useContext(ThemeContext);

    const handleWidthAutoClick = function() {
        const nextValue = !isWidthAuto;
        setWidthAuto(nextValue);
    }
    const handleHeightAutoClick = function() {
        const nextValue = !isHeightAuto;
        setIsHeightAuto(nextValue);
    }

    return (
        <AlignCenterWrapper>
            <IconButton
                icon="widthAuto"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ isWidthAuto }
                onClick={ handleWidthAutoClick }
                />
            <IconButton
                icon="heightAuto"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ isHeightAuto }
                onClick={ handleHeightAutoClick }
                />

        </AlignCenterWrapper>
    );
}



const LayoutIcons = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;
export function LayoutTitleRightIcons() {
    const [isClick, setIsClick] = useState(false);
    const [isEye, setIsEye] = useState(true);

    const handleMouseClick = function() {
        const nextValue = !isClick;
        setIsClick(nextValue);
        ownerCaretaker.currWidget?.setAttachOnClick(nextValue);
    }
    const handleEyeClick = function() {
        const nextValue = !isEye;
        setIsEye(nextValue);
        ownerCaretaker.currWidget?.setVisible(nextValue);
    }

    return (
        <LayoutIcons>
            <IconButton
                icon={ isClick ? 'mouseActive' : 'mouse'}
                color="transparent"
                hoverBgColor="transparent"
                onClick={ handleMouseClick }
                />
            <IconButton
                icon={ isEye ? 'eye' : 'eyeClose' }
                color="transparent"
                hoverBgColor="transparent"
                onClick={ handleEyeClick }
                />
        </LayoutIcons>
    );
}

