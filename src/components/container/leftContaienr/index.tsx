import { useEffect, useState } from "react";
import styled from "styled-components";
import Flexible from "./flexible";


let width: number = 296;

const LeftFlexibleWrapper = styled.div`
    color: #fff;
    /* .flexible {
        display: none;
    }
    &:hover {
        .flexible {
            display: block;
        }
    } */
`;
const FlexWrapper = styled.div`
    position: absolute;
    z-index: 1;
    left: ${width}px;
    top: calc((100vh - 88px) / 2);
`;
const TreeWrapper = styled.div`
    position: absolute;
    z-index: 1;
    left: 0;
    top: 88px;
    bottom: 0;
    width: ${width}px;
    background-color: #393e46;
    box-shadow: 2px 0 8px 0 #222831;
`;


const minWidth = 200;
export default function LeftContainer() {
    const [totalWidth, setTotalWidth] = useState(width);
    const handleFlexibleDrag = function(x: number) {
        setTotalWidth((prevWidth: number) => {
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
                ></TreeWrapper>
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
