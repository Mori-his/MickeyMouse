import BasicNode from "@layout/core/object";
import ownerCaretaker from "@models/owners";
import { TreeWidget } from "@widgets/treeWidget";
import { observer } from "mobx-react";
import React from "react";
import styled, { CSSProperties } from "styled-components";
import { TreeNode } from "./node";
import Placeholder from "./placeholder";

const depthPaddingNum = 16;


interface TreeWrapperProps {
    isSelectAsParent: boolean
    isRoot: boolean
}

 const TreeWrapper = styled.div<TreeWrapperProps>`
    position: relative;
    ${props => !props.isRoot && `
        &::before {
            content: '';
            position: absolute;
            left: 1px;
            top: 0;
            bottom: 0;
            width: 1px;
            background-color: ${props.isSelectAsParent ? props.theme.assist : props.theme.white30};
            opacity: ${props.isSelectAsParent ? 1 : 0.4};
            transition: all .6s;
        }
    `};
`;




export interface TreeContainerProps {
    widget: TreeWidget
    depth: number
    style?: CSSProperties
}
export const TreeContainer = observer(function(props: TreeContainerProps) {
    const { widget, depth, style = {} } = props;
    const parentWidget = widget as TreeWidget;
    
    if (!parentWidget || !parentWidget.childCount) return null;
    const selectCurrWidget = ownerCaretaker.currOwner?.currWidget
    const isSelectAsParent = selectCurrWidget && selectCurrWidget.parent === parentWidget;
    return (
        <TreeWrapper
            style={{
                ...style,
                paddingLeft: parentWidget.type && depthPaddingNum
            }}
            isRoot={ !parentWidget.type }
            isSelectAsParent={ Boolean(isSelectAsParent) }
            >
            {
                widget.map((visitWidget: BasicNode) => {
                    const currWidget = visitWidget as TreeWidget;
                    return (
                        <React.Fragment key={ currWidget.id }>
                            <TreeNode
                                widget={ currWidget }
                                depth={ depth }
                                />
                        </React.Fragment>
                    );
                })
            }
            <Placeholder
                widget={ widget }
                depth={ depth }
                childCount={ widget.childCount }
                />
        </TreeWrapper>
    );
});
