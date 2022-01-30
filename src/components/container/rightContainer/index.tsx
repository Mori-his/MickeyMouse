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
`;


export default function RightContainer() {
    const [rgba, setRgba] = useState<IRGBA>({
        r: 255,
        g: 255,
        b: 255,
        a: 1
    });
    const [isShowColorPicker, setIsShowColorPicker] = useState(false);
    const selectElRef = useRef(null);
    const handleColorChange = function(rgba: IRGBA) {
        setRgba(rgba);
    }
    return (
        <RightWrapper>
            <RightConfigPanel>
                <BasicPanel />
                <SettingTab />
                <LayoutPanel />
                <TextPanel />
                <ExteriorPanel />
                <Tippy
                    content={ 
                        <ColorPicker
                            rgba={ rgba }
                            onColorChange={ handleColorChange }
                            />
                    }
                    animation="shift-away"
                    trigger="click"
                    hideOnClick={ true }
                    arrow={ true }
                    interactive={ true }
                    placement="left"
                    theme="light"
                    >
                    <div
                        ref={ selectElRef }
                        style={{paddingTop: 20, color: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`}}
                        onClick={() => setIsShowColorPicker(!isShowColorPicker)}
                        >
                        选择颜色{Color.rgbToHex(rgba.r, rgba.g, rgba.b)}透明度为: {rgba.a}
                    </div>
                </Tippy>
            </RightConfigPanel>
        </RightWrapper>
    );
}
