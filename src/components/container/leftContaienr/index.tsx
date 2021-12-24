import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Flexible from "./flexible";
import Tree from "./tree";


let width: number = 296;

const LeftFlexibleWrapper = styled.div`
    position: absolute;
    z-index: 1;
    left: 0;
    top: 88px;
    bottom: 0;
    color: ${props => props.theme.lightText};
`;
const FlexWrapper = styled.div`
    position: absolute;
    z-index: 1;
    left: ${width}px;
    top: calc((100vh - 88px) / 2);
`;
const TreeWrapper = styled.div`
    width: ${width}px;
    height: 100%;
    background-color: ${props => props.theme.contrast};
    box-shadow: 2px 0 8px 0 ${props => props.theme.main};
    padding: 16px 8px;
`;


const minWidth = 200;
export default function LeftContainer(props: React.PropsWithChildren<{}>) {
    const [totalWidth, setTotalWidth] = useState(width);
    const handleFlexibleDrag = function(x: number) {
        setTotalWidth((prevWidth: number) => {
            // 三分之一的最大宽度
            const oneThirdsWidth = window.innerWidth / 3;
            if (prevWidth >= oneThirdsWidth && x >= 0) return prevWidth;
            if (prevWidth <= minWidth && x <= 0) return prevWidth;
            return prevWidth + x
        });
    }
    return (
        <LeftFlexibleWrapper>
            <TreeWrapper
                style={{
                    width: totalWidth
                }}
                >
                <Tree />
            </TreeWrapper>
            <FlexWrapper
                className="flexible"
                style={{
                    left: totalWidth
                }}
                >
                <Flexible onDragChange={ handleFlexibleDrag } />
            </FlexWrapper>
        </LeftFlexibleWrapper>
    );
}
