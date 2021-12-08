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
        <ToolTip
            title="添加一个配置项"
            >
            <AppendButtonWrapper
                className={ props.className }
                onClick={e => props.onClick && props.onClick(e)}
                >
                <IconButton icon="add" />
            </AppendButtonWrapper>
        </ToolTip>
    );
}
