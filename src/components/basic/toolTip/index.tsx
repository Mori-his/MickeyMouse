import React, { useRef, useState } from "react";
import ToolTipAttach, { Placement, ToolTipSize } from "./toolTipBox";

export interface ToolTipProps {
    title?: string
    size?: ToolTipSize,
    placement?: Placement
    children: React.ReactElement
    nodeRef?: React.Ref<HTMLElement>
    display?: boolean
}

function ToolTip(props: ToolTipProps) {
    const {
        size = 'middle',
        placement = 'top',
        title = '',
        display = false
    } = props;
    const toolRef = useRef<HTMLDivElement>(null);
    const [hasToolTip, setHasToolTip] = useState(false);

    const handleMouseEnter = function(event: React.MouseEvent) {
        setHasToolTip(true);
    }
    const handleMouseLeave = function(event: React.MouseEvent) {
        setHasToolTip(false);
    }

    const toolEl: HTMLDivElement = toolRef.current!;
    return title ? (
        <React.Fragment
            >
            { React.cloneElement(props.children, {
                ref: toolRef,
                onMouseEnter: (e: React.MouseEvent) => handleMouseEnter(e),
                onMouseLeave: (e: React.MouseEvent) => handleMouseLeave(e)
            }) }
            <ToolTipAttach
                { ...props }
                toolTipEl={ toolEl }
                isAttach={ hasToolTip }
                size={ size }
                placement={ placement }
                title={ title }
                />
        </React.Fragment>
    ) : props.children;
}

export default ToolTip;

