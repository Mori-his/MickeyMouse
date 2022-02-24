import styled, { ThemeContext } from "styled-components";

import Title from "../widgets/title";
import IconButton from "@components/basic/iconButton";
import React, { createContext, Dispatch, useContext, useReducer, useState } from "react";
import ownerCaretaker from "@models/owners";
import SizeRailLine, { PositionRailLine } from "./railLine/sizeRailLine";
import { ActionMap } from "@/types/redux.type";

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

export enum LayoutActions {
    SET_ALIGN_TOP,
    SET_ALIGN_RIGHT,
    SET_ALIGN_BOTTOM,
    SET_ALIGN_LEFT,
    SET_VERTICAL,
    SET_HORIZONTAL,
    SET_AUTO_WIDTH,
    SET_AUTO_HEIGHT,
}

export type LayoutState = Record<LayoutActions, boolean>;
export type LayoutAction = ActionMap<LayoutState>[keyof ActionMap<LayoutState>];

export type LayoutContextState = {
    state: LayoutState,
    dispatch: Dispatch<LayoutAction>
}

const layoutInitialState = {
    [LayoutActions.SET_ALIGN_TOP]: false,
    [LayoutActions.SET_ALIGN_RIGHT]: false,
    [LayoutActions.SET_ALIGN_BOTTOM]: false,
    [LayoutActions.SET_ALIGN_LEFT]: false,
    [LayoutActions.SET_VERTICAL]: false,
    [LayoutActions.SET_HORIZONTAL]: false,
    [LayoutActions.SET_AUTO_WIDTH]: false,
    [LayoutActions.SET_AUTO_HEIGHT]: false,
}

export const LayoutContext = createContext<LayoutContextState>({
    state: layoutInitialState,
    dispatch: () => null
});

export function LayoutReducer(state: LayoutState, action: LayoutAction) {
    return {
        ...state,
        [action.type]: action.payload
    }
}

export default function LayoutPanel() {
    const [state, dispatch] = useReducer(LayoutReducer, layoutInitialState);

    return (
        <LayoutContext.Provider value={{state, dispatch}}>
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
        </LayoutContext.Provider>
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
    const {state: {
        [LayoutActions.SET_ALIGN_LEFT]: isAlignLeft,
        [LayoutActions.SET_ALIGN_TOP]: isAlignTop,
        [LayoutActions.SET_ALIGN_RIGHT]: isAlignRight,
        [LayoutActions.SET_ALIGN_BOTTOM]: isAlignBottom
    }, dispatch} = useContext(LayoutContext);

    const theme = useContext(ThemeContext);

    return (
        <AlignCenterWrapper>
            <IconButton
                $title="左对齐"
                icon="alignLeft"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ isAlignLeft }
                onClick={ () => dispatch({
                    type: LayoutActions.SET_ALIGN_LEFT,
                    payload: !isAlignLeft
                })}
                />
            <IconButton
                $title="顶对齐"
                icon="alignTop"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ isAlignTop }
                onClick={ () => dispatch({
                    type: LayoutActions.SET_ALIGN_TOP,
                    payload: !isAlignTop
                })}
                />
            <IconButton
                $title="右对齐"
                icon="alignRight"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ isAlignRight }
                onClick={ () => dispatch({
                    type: LayoutActions.SET_ALIGN_RIGHT,
                    payload: !isAlignRight
                })}
                />
            <IconButton
                $title="底对齐"
                icon="alignBottom"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ isAlignBottom }
                onClick={ () => dispatch({
                    type: LayoutActions.SET_ALIGN_BOTTOM,
                    payload: !isAlignBottom
                })}
                />

        </AlignCenterWrapper>
    );
}

export function LayoutAlignCenter(props: React.PropsWithChildren<LayoutAlignProps>) {useContext(ThemeContext);
    const {state: {
        [LayoutActions.SET_VERTICAL]: isVertical,
        [LayoutActions.SET_HORIZONTAL]: isHorizontal,
    }, dispatch} = useContext(LayoutContext);
    const theme = useContext(ThemeContext);
    return (
        <AlignCenterWrapper>
            <IconButton
                $title="垂直居中"
                icon="vertical"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ isVertical }
                onClick={ () => dispatch({
                    type: LayoutActions.SET_VERTICAL,
                    payload: !isVertical
                })}
                />
            <IconButton
                $title="水平居中"
                icon="horizontal"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ isHorizontal }
                onClick={ () => dispatch({
                    type: LayoutActions.SET_HORIZONTAL,
                    payload: !isHorizontal
                })}
                />

        </AlignCenterWrapper>
    );
}

export function LayoutAlignAuto(props: React.PropsWithChildren<LayoutAlignProps>) {
    const theme = useContext(ThemeContext);
    const {state: {
        [LayoutActions.SET_AUTO_WIDTH]: isWidthAuto,
        [LayoutActions.SET_AUTO_HEIGHT]: isHeightAuto,
    },dispatch} = useContext(LayoutContext);

    return (
        <AlignCenterWrapper>
            <IconButton
                $title="自适应宽度"
                icon="widthAuto"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ isWidthAuto }
                onClick={ () => dispatch({
                    type: LayoutActions.SET_AUTO_WIDTH,
                    payload: !isWidthAuto
                })}
                />
            <IconButton
                $title="自适应高度"
                icon="heightAuto"
                color="transparent"
                hoverBgColor="transparent"
                activeColor={ theme.assist }
                active={ isHeightAuto }
                onClick={ () => dispatch({
                    type: LayoutActions.SET_AUTO_HEIGHT,
                    payload: !isHeightAuto
                })}
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
                $title={ isClick ? '此控件可被点击' : '此控件不可被点击'}
                icon={ isClick ? 'mouseActive' : 'mouse'}
                color="transparent"
                hoverBgColor="transparent"
                onClick={ handleMouseClick }
                />
            <IconButton
                $title={ isEye ? '控件可见' : '控件不可见'}
                icon={ isEye ? 'eye' : 'eyeClose' }
                color="transparent"
                hoverBgColor="transparent"
                onClick={ handleEyeClick }
                />
        </LayoutIcons>
    );
}

