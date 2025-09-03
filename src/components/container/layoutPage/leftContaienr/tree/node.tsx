import ownerCaretaker from "@models/owners";
import { TreeWidget } from "@widgets/treeWidget";
import { observer } from "mobx-react";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { TreeContainer } from "./container";
import { useTreeContext } from "./hooks/useTreeContext";
import { TreeItem } from "./item";
import Placeholder from "./placeholder";

export interface TreeNodeProps {
    widget: TreeWidget,
    depth: number
}

interface TreeItemPaddingProps {
    paddingLeft?: number
}


const TreeItemPadding = styled.div<TreeItemPaddingProps>`
    position: relative;
    overflow: hidden;
    ${props => props.paddingLeft && `
        padding-left: ${props.paddingLeft}px;
    `};
`;

const ShrinkContainer = styled.div`
    transition: height .3s;
`;


export const TreeNode = observer(function(props: TreeNodeProps) {
    const { widget, depth } = props;
    const { onItemClick = () => {} } = useTreeContext();

    const shrinkContainerRef = useRef<HTMLDivElement | null>(null);
    const shrinkSelfRef = useRef<HTMLDivElement | null>(null);
    const shrinkClearTime = useRef<NodeJS.Timeout | null>(null);

    const updateShrinkAnima = function() {
        if (shrinkSelfRef.current && shrinkContainerRef.current) {
            clearTimeout(shrinkClearTime.current!);
            const height = shrinkSelfRef.current.clientHeight;
            shrinkContainerRef.current.style.height = `${height}px`;
            setTimeout(() => {
                if (shrinkContainerRef.current && widget.shrink) {
                    shrinkContainerRef.current.style.overflow = 'hidden';
                    shrinkContainerRef.current.style.height = '0';
                }
            });
            if (!widget.shrink) {
                shrinkClearTime.current = setTimeout(() => {
                    if (shrinkContainerRef.current && !widget.shrink) {
                        // 如果展开结束了， timeout要和动画时长保持一致
                        shrinkContainerRef.current.style.overflow = 'visible';
                        shrinkContainerRef.current.style.height = 'auto';
                    }
                }, 300);
            }
        }
    };

    const initShrink = function() {
        if (widget.shrink) {
            if (shrinkContainerRef.current && widget.shrink) {
                shrinkContainerRef.current.style.overflow = 'hidden';
                shrinkContainerRef.current.style.height = '0';
            }
        } else if(shrinkContainerRef.current) {
            shrinkContainerRef.current.style.overflow = 'visible';
            shrinkContainerRef.current.style.height = 'auto';
        }
    }

    useEffect(() => {
        initShrink();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [widget.shrink]);

    useEffect(() => {
        initShrink();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <TreeItemPadding>
            <Placeholder
                widget={ widget }
                depth={ depth }
                />
            <TreeItem
                key={ widget.id }
                widget={widget}
                onClick={() => {
                    onItemClick({
                        parentNode: widget.parent as TreeWidget,
                        depth: depth,
                        node: widget
                    });
                    const { currWidget } = ownerCaretaker.currOwner;
                    if (currWidget === widget) {
                        ownerCaretaker.currOwner.selectedWidget();
                    } else {
                        ownerCaretaker.currOwner.selectedWidget(widget);
                    }
                }}
                onShrink={(shrink: boolean) => (widget.setShrink(shrink), updateShrinkAnima())}
                />
            <ShrinkContainer
                ref={ shrinkContainerRef }
                >
                <div ref={ shrinkSelfRef }>
                    <TreeContainer
                        widget={ widget }
                        depth={ depth + 1}
                        />
                </div>
            </ShrinkContainer>
        </TreeItemPadding>
    );
});
