import IconTab from "@components/basic/tab/iconTab";
import React from "react";
import styled from "styled-components";

const SettingTabWrapper = styled.div`
    display: flex;
    align-items: center;
`;

export enum TABTYPE {
    CONFIG,
    SYNC
}

interface SettingTabProps {
    onClick?: (type: TABTYPE) => any
    tabType: TABTYPE
}
export default function SettingTab(props: SettingTabProps) {
    const {
        tabType,
        onClick = () => {}
    } = props;


    const handleIconTabClick = function(type: TABTYPE) {
        onClick(type);
    }

    return (
        <SettingTabWrapper>
            <IconTab
                title="组件配置"
                icon="config"
                active={ tabType === TABTYPE.CONFIG }
                onClick={ () => handleIconTabClick(TABTYPE.CONFIG) }
                />
            <IconTab
                title="Sync数据配置"
                icon="settings"
                active={ tabType === TABTYPE.SYNC }
                onClick={ () => handleIconTabClick(TABTYPE.SYNC) }
                />
        </SettingTabWrapper>
    );
}
