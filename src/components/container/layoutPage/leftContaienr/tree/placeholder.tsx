import { ContainerParentDataMixin } from "@layout/core/object";
import ownerCaretaker from "@models/owners";
import { TreeWidget } from "@widgets/treeWidget";
import React, { useContext } from "react";
import styled from "styled-components";
import { PlaceholderContext } from "./providers/PlaceholderProvide";
import { PlaceholderProvideState } from "./types";

const PlaceholderWrapper = styled.div`
    width: 100%;
    height: 32px;
    border: 1px dashed #fff;
    border-radius: 8px;
    background-color: ${props => props.theme.primary};
`;

interface PlaceholderProps {
    widget: TreeWidget
    depth: number
    childCount?: number
}
export default function Placeholder(props: PlaceholderProps) {
    const { widget, childCount } = props;
    const { dropWidget, isTail } = useContext<PlaceholderProvideState>(PlaceholderContext as unknown as React.Context<PlaceholderProvideState>);

    if (!dropWidget) return null;
    const parentData = dropWidget.parentData as ContainerParentDataMixin<TreeWidget>;

    const visble = 
        (
            isTail &&
            typeof childCount !== 'undefined' &&
            widget.lastChild === dropWidget
        ) ||
        (
            !isTail &&
            typeof childCount === 'undefined' &&
            widget === dropWidget &&
            parentData.previousSibling !== ownerCaretaker.targetWidget
        );
        
    if (!visble) return null;
    return (
        <PlaceholderWrapper />
    );
}
