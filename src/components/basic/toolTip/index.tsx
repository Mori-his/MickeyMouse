import React, { createContext, useRef, useState } from "react";
import ToolTipAttach, { ToolTipSize } from "./toolTipBox";
import { Placement } from "./toolTipComputed";

export interface ToolTipProps {
    title?: string
    size?: ToolTipSize,
    placement?: Placement
    children: React.ReactElement
    nodeRef?: React.RefObject<HTMLElement>
}

const ToolTipContext = createContext(null);

function ToolTip(props: ToolTipProps) {
    const {
        size = 'middle',
        placement = 'top',
        title = '',
        nodeRef
    } = props;
    // const toolRef = useRef<HTMLDivElement>(null);
    const [hasToolTip, setHasToolTip] = useState(false);

    const handleMouseEnter = function(event: React.MouseEvent) {
        setHasToolTip(true);
    }
    const handleMouseLeave = function(event: React.MouseEvent) {
        setHasToolTip(false);
    }
 
    const toolRef = useRef(nodeRef?.current);

    return title ? (
        <ToolTipContext.Provider value={null}>
            { React.cloneElement(React.Children.only(props.children), {
                ref: toolRef,
                onMouseEnter: (e: React.MouseEvent) => handleMouseEnter(e),
                onMouseLeave: (e: React.MouseEvent) => handleMouseLeave(e)
            }) }
            <ToolTipAttach
                { ...props }
                toolTipEl={ toolRef?.current || null }
                isAttach={ hasToolTip }
                size={ size }
                placement={ placement }
                title={ title }
                />
        </ToolTipContext.Provider>
    ) : props.children;
}

export default ToolTip;

