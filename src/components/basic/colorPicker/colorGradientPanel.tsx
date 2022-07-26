import Color from "@layout/utils/color";
import Tippy from "@tippyjs/react";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import { ColorGradientPoint, ColorGradientPointInner, ColorGradientWrapper } from "./colorPickerPanelBox";
import ColorPointer from "./colorPointer";

interface ColorGradientPointsProps {
    colors: Color[]
    defaultIndex?: number
    onClick?: (index: number, color: Color) => void
    onRemove?: (index: number) => void
}
export function ColorGradientPoints(props: ColorGradientPointsProps) {
    const { defaultIndex = 0, colors, onClick = () => {}, onRemove = () => {} } = props;

    const moveRef = useRef({
        currY: 0,
        threshold: 12
    });

    const handlePointClick = function(index: number, color: Color) {
        onClick(index, color);
    }

    const handleDragChange = function(x: number, y: number) {
        moveRef.current.currY += y;
        if (
            moveRef.current.currY >= moveRef.current.threshold ||
            moveRef.current.currY <= -moveRef.current.threshold
        ) {
            document.body.style.cursor = 'url(https://p5.ssl.qhimg.com/t0186f0933553d593b7.png) 12 12, auto';
        } else {
            document.body.style.cursor = 'auto';
        }
    }
    const handleMoveUp = function(index: number) {
        if (
            moveRef.current.currY >= moveRef.current.threshold ||
            moveRef.current.currY <= -moveRef.current.threshold
        ) {
            onRemove(index);
        }
        moveRef.current.currY = 0;
        document.body.style.cursor = 'auto';
    }
    return (
        <>
            {
                colors.map((color, index) => {
                    return (
                        <ColorPointer
                            key={ index }
                            isActive={ defaultIndex === index }
                            onClick={ () => handlePointClick(index, color) }
                            onDragChange={ (x, y) => handleDragChange(x, y) }
                            onMoveUp={ () => handleMoveUp(index)}
                            />
                    );
                })
            }
        </>
    );
}


const ColorGradientBackground = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 18px;
    border-radius: 4px;
`;

interface ColorGradientProps {
    selectIndex?: number
    colors: Color[]
    onIndexChange(index: number, color: Color): void
    onAdd?: (color: Color, index: number) => void
    onRemove?: (index: number) => void
}
export function ColorGradientPanel(props: ColorGradientProps) {
    const {
        selectIndex = 0,
        colors,
        onAdd = () => {},
        onRemove = () => {},
        onIndexChange = () => {},
    } = props;

    let gradient = 'linear-gradient(to right, ';
    // 转换至为rgba供Element使用
    colors.forEach((color, index) => {
        const {r, g, b, a} = color.rgba;
        gradient += `rgba(${r}, ${g}, ${b}, ${a})`;
        if (index !== colors.length - 1) {
            gradient += ','
        }
    });
    gradient += ')';
    // 圆点被点击
    const handlePointClick = function(index: number, color: Color) {
        onIndexChange(index, color);
    }

    // 背景块被双击
    const handleDoubleClick = function(event: React.MouseEvent<HTMLDivElement>) {
        onAdd(new Color(0, 0, 100, 1), 1);
    }


    return (
        <ColorGradientWrapper>
            <ColorGradientBackground
                style={{
                    background: gradient
                }}
                onDoubleClick={ (event: React.MouseEvent<HTMLDivElement>) => handleDoubleClick(event) }
            >
                <ColorGradientPoints
                    defaultIndex={ selectIndex }
                    colors={ colors }
                    onClick={ (index, color) => handlePointClick(index, color)}
                    onRemove={ onRemove }
                    />
            </ColorGradientBackground>
        </ColorGradientWrapper>
    );
}


