import IconTab from "@components/basic/tab/iconTab";
import React, { useState } from "react";
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
}
export default function SettingTab(props: SettingTabProps) {
    const { onClick = () => {}} = props;

    const [tabType, setTabType] = useState(TABTYPE.CONFIG)

    const handleIconTabClick = function(type: TABTYPE) {
        setTabType(type);
        onClick(type);
    }

    return (
        <SettingTabWrapper>
            <IconTab
                icon="config"
                active={ tabType === TABTYPE.CONFIG }
                onClick={ () => handleIconTabClick(TABTYPE.CONFIG) }
                />
            <IconTab
                icon="settings"
                active={ tabType === TABTYPE.SYNC }
                onClick={ () => handleIconTabClick(TABTYPE.SYNC) }
                />
        </SettingTabWrapper>
    );
}
