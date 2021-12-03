import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ToolTipAttach, { Placement, ToolTipSize } from "./toolTipBox";





const ToolTipWrapper = styled.div``


export interface ToolTipProps {
    title: string
    size?: ToolTipSize,
    placement?: Placement
}

function ToolTip(props: React.PropsWithChildren<ToolTipProps>) {

    const { size = 'middle', placement = 'bottom' } = props;
    const toolRef = useRef<HTMLDivElement>(null);
    const [hasToolTip, setHasToolTip] = useState(false);

    const handleMouseEnter = function(event: React.MouseEvent) {
        setHasToolTip(true);
    }
    const handleMouseLeave = function(event: React.MouseEvent) {
        setHasToolTip(false);
    }
    const toolEl: HTMLDivElement = toolRef.current!;

    return (
        <ToolTipWrapper
            ref={toolRef}
            onMouseEnter={e => handleMouseEnter(e)}
            onMouseLeave={e => handleMouseLeave(e)}
            >
            { props.children }
            <ToolTipAttach
                { ...props }
                toolTipEl={ toolEl }
                isAttach={ hasToolTip }
                size={ size }
                placement={ placement }
                />
        </ToolTipWrapper>
    );
}

export default ToolTip;

