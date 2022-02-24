import styled from "styled-components";
import { useRef, useState } from "react";
import { IRGBA } from "@/types/color";
import Color from "@utils/color";
import Tippy from '@tippyjs/react';
import ColorPicker from "@components/basic/colorPicker/colorPicker";
import BasicPanel from "./basicPanel";
import LayoutPanel from "./layoutPanel";
import SettingTab from "./settingTab";
import TextPanel from "./textPanel";
import ExteriorPanel from "./exteriorPanel";
import { CustomScrollbar } from "@styles/globals";
import EffectsPanel from "./effects";


const width = 288;

const RightWrapper = styled.div`
    position: absolute;
    right: 0;
    top: 88px;
    bottom: 0;
`;

const RightConfigPanel = styled.div`
    width: ${width}px;
    height: 100%;
    background-color: ${props => props.theme.contrast};
    box-shadow: -2px 0 8px 0 ${props => props.theme.main};
    overflow-x: hidden;
    overflow-y: overlay;
    ${ CustomScrollbar };
    padding-bottom: 16px;
`;

export default function RightContainer() {

    return (
        <RightWrapper>
            <RightConfigPanel>
                <BasicPanel />
                <SettingTab />
                <LayoutPanel />
                <TextPanel />
                <ExteriorPanel />
                <EffectsPanel />
            </RightConfigPanel>
        </RightWrapper>
    );
}
