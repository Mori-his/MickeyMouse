import styled, { ThemeContext } from "styled-components";

import { TitleCollapse } from "../../../common/title";
import IconButton from "@components/basic/iconButton";
import React, { useContext } from "react";
import ownerCaretaker from "@models/owners";
import { SizeRailLine, PositionRailLine } from "./railLine/sizeRailLine";
import { observer } from "mobx-react";

// 布局面板最外层容器
const LayoutPanelWarpper = styled.div`
    padding: 8px 0 0;
`;
const LayoutPadding = styled.div`
    padding: 8px 8px;
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
            <TitleCollapse
                title="布局配置"
                actions={
                    <LayoutTitleRightIcons />
                }
                >
                <LayoutPadding>

                    {/* 居中方式快捷栏 ICON */}
                    <LayoutPanelAlignWrapper>
                        <LayoutAlignCenter />
                        <LayoutAlignAuto />
                        <LayoutAlignDirection />
                    </LayoutPanelAlignWrapper>
                    {/* 宽度和定位栏 */}
                    <LayoutConfig />
                </LayoutPadding>
            </TitleCollapse>
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

export enum EAlignment {
    LEFT = 'left',
    TOP = 'top',
    RIGHT = 'right',
    BOTTOM = 'bottom'
}

export const LayoutAlignDirection = observer(function LayoutAlignDirection(props: React.PropsWithChildren<LayoutAlignProps>) {
    const currWidget = ownerCaretaker.currOwner.currWidget!;

    const theme = useContext(ThemeContext);

    const handleChangeAlignment = function(alignment: EAlignment) {
        const position = currWidget.position;
        switch(alignment) {
            case EAlignment.LEFT:
                position.setLeft(
                    position.left?.toString() !== '0' ? 0 : ''
                );
                break;
            case EAlignment.TOP:
                position.setTop(
                    position.top?.toString() !== '0' ? 0 : ''
                );
                break;
            case EAlignment.RIGHT:
                position.setRight(
                    position.right?.toString() !== '0' ? 0 : ''
                );
                break;
            case EAlignment.BOTTOM:
                position.setBottom(
                    position.bottom?.toString() !== '0' ? 0 : ''
                );
                break;
        }
    }

    return (
        <AlignCenterWrapper>
            <IconButton
                $title="左对齐"
                icon="alignLeft"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ currWidget.position.left?.toString() === '0' }
                onClick={ () => handleChangeAlignment(EAlignment.LEFT) }
                />
            <IconButton
                $title="顶对齐"
                icon="alignTop"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ currWidget.position.top?.toString() === '0' }
                onClick={ () => handleChangeAlignment(EAlignment.TOP) }
                />
            <IconButton
                $title="右对齐"
                icon="alignRight"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ currWidget.position.right?.toString() === '0' }
                onClick={ () => handleChangeAlignment(EAlignment.RIGHT) }
                />
            <IconButton
                $title="底对齐"
                icon="alignBottom"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ currWidget.position.bottom?.toString() === '0' }
                onClick={ () => handleChangeAlignment(EAlignment.BOTTOM) }
                />

        </AlignCenterWrapper>
    );
});

export const LayoutAlignCenter = observer(function LayoutAlignCenter(_props: React.PropsWithChildren<LayoutAlignProps>) {
    const currWidget = ownerCaretaker.currOwner.currWidget!;
    const theme = useContext(ThemeContext);

    return (
        <AlignCenterWrapper>
            <IconButton
                $title="垂直居中"
                icon="vertical"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ currWidget.position.vertical }
                onClick={ () => currWidget.position.setVertical(!currWidget.position.vertical) }
                />
            <IconButton
                $title="水平居中"
                icon="horizontal"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ currWidget.position.horizontal }
                onClick={ () => currWidget.position.setHorizontal(!currWidget.position.horizontal) }
                />

        </AlignCenterWrapper>
    );
});

export const LayoutAlignAuto = observer(function LayoutAlignAuto(props: React.PropsWithChildren<LayoutAlignProps>) {
    const currWidget = ownerCaretaker.currOwner.currWidget!;
    const theme = useContext(ThemeContext);


    return (
        <AlignCenterWrapper>
            <IconButton
                $title="自适应宽度"
                icon="widthAuto"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ currWidget.size.widthAdaptive }
                onClick={ () => currWidget.size.setWidthAdaptive(!currWidget.size.widthAdaptive) }
                />
            <IconButton
                $title="自适应高度"
                icon="heightAuto"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ currWidget.size.heightAdaptive }
                onClick={ () => currWidget.size.setHeightAdaptive(!currWidget.size.heightAdaptive) }
                />

        </AlignCenterWrapper>
    );
});



const LayoutIcons = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;
/**
 * 布局配置项title右侧快捷按钮
 */
export const LayoutTitleRightIcons = observer(function LayoutTitleRightIcons() {
    const currWidget = ownerCaretaker.currOwner.currWidget!;

    return (
        <LayoutIcons>
            <IconButton
                $title={ currWidget.attachOnClick ? '此控件可被点击' : '此控件不可被点击'}
                icon={ currWidget.attachOnClick ? 'mouseActive' : 'mouse'}
                color="transparent"
                hoverBgColor="transparent"
                onClick={ (event: React.MouseEvent) => (event.stopPropagation(), currWidget.setAttachOnClick(!currWidget.attachOnClick)) }
                />
            <IconButton
                $title={ currWidget.visible ? '控件可见' : '控件不可见'}
                icon={ currWidget.visible ? 'eye' : 'eyeClose' }
                color="transparent"
                hoverBgColor="transparent"
                onClick={ (event: React.MouseEvent) => (event.stopPropagation(), currWidget.setVisible(!currWidget.visible)) }
                />
        </LayoutIcons>
    );
});
