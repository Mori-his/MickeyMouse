import styled from "styled-components";
import { CustomScrollbar } from "@styles/globals";
import ownerCaretaker from "@models/owners";
import BasicPanel from "./basicPanel";
import LayoutPanel from "./layoutPanel";
import SettingTab, { TABTYPE } from "./settingTab";
import TextPanel from "./textPanel";
import ExteriorPanel from "./exteriorPanel";
import EffectsPanel from "./effects";
import { observer } from "mobx-react";
import { useState } from "react";
import { SyncPanel } from "./syncPanel";

// 右侧栏宽度
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

export default observer(function RightContainer() {
    const [settingType, setSettingType] = useState<TABTYPE>(TABTYPE.CONFIG);
    const currWidget = ownerCaretaker.currOwner?.currWidget;


    const handleTabChange = function(type: TABTYPE) {
        setSettingType(type);
    }

    return currWidget ? 
            (<RightWrapper>
                <RightConfigPanel>
                    <BasicPanel />
                    <SettingTab
                        onClick={ handleTabChange }
                        />
                    {
                        settingType === TABTYPE.CONFIG ?
                        // 设置面板
                        <>
                            <LayoutPanel />
                            {
                                currWidget.type === 'label' && <TextPanel />
                            }
                            {
                                'border' in currWidget && <ExteriorPanel />
                            }
                            {
                                'fit' in currWidget && <EffectsPanel />
                            }
                            { currWidget.render() }
                        </>
                        // sync面板
                        : <SyncPanel />
                    }
                    
                </RightConfigPanel>
            </RightWrapper>)
        : null;
});
