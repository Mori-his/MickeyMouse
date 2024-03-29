import React from "react";
import styled from "styled-components";
import IconButton from "@components/basic/iconButton";
import ToolTip from "../toolTip";

const AppendButtonWrapper = styled.div`
    cursor: pointer;
`;

export interface AppendButtonProps {
    className?: string
    onClick?: Function
}

export default function AppendButton(props: React.PropsWithChildren<AppendButtonProps>) {
    return (
        <AppendButtonWrapper
            className={ props.className }
            onClick={e => props.onClick && props.onClick(e)}
            >
            <IconButton
                icon="add"
                $title="增加配置项"
                padding={ 8 }
                />
        </AppendButtonWrapper>
    );
}
