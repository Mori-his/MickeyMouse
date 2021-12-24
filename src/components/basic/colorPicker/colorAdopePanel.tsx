import { IRGBA } from "@/types/color";
import Tippy from "@tippyjs/react";
import React, { useEffect, useRef, useState } from "react";
import { ColorCollect, ColorCollectItem, ColorCollectItemWrapper } from '.';
import IconButton from "../iconButton";

const storaName = 'adopeColors';
let maxAdope = 5;

function getAdopeColors() {
    const colors = window.localStorage.getItem(storaName);
    try {
        return JSON.parse(colors || '') || [];
    } catch(err) {
        return []
    }
}

function adopeColor(rgba: IRGBA) {
    const colors = getAdopeColors() || [];
    if (maxAdope <= colors.length) {
        colors.shift();
    }
    colors.push(rgba);
    window.localStorage.setItem(storaName, JSON.stringify(colors));
}

function rgbaParseInt(rgba: IRGBA) {
    return {
        r: Math.floor(rgba.r),
        g: Math.floor(rgba.g),
        b: Math.floor(rgba.b),
        a: +rgba.a.toFixed(2),
    }
}

export type ColorAdopePropsWithEvent<P> = P & {
    onColorClick?: (rgba: IRGBA) => any
    onDragChange?: (x: number, y: number) => any
}

interface ColorAdopePanelProps {
    rgba: IRGBA
    max?: number
}
export default function ColorAdopePanel(props: ColorAdopePropsWithEvent<ColorAdopePanelProps>) {
    const { rgba, max = maxAdope, onColorClick = () => {}, onDragChange = () => {} } = props;
    maxAdope = max;
    const [colors, setColors] = useState([]);
    const handleAdopeColor = function() {
        adopeColor(rgba);
        setColors(getAdopeColors());
    }
    useEffect(() => {
        setColors(getAdopeColors());
    }, [])

    return (
        <ColorCollect>
            <IconButton
                icon="add"
                color="transparent"
                hoverBgColor="transparent"
                hoverColor="#000"
                $title="收藏此颜色"
                onClick={handleAdopeColor}
                />
            {
                colors.map((rgba: IRGBA, index) => (
                    <ColorCollectPanel
                        key={ index }
                        rgba={ rgba }
                        onColorClick={ onColorClick }
                        onDragChange={ onDragChange }
                        />
                ))
            }
        </ColorCollect>
    );
}


interface ColorCollectPanelProps {
    rgba: IRGBA
}
export function ColorCollectPanel(props: ColorAdopePropsWithEvent<ColorCollectPanelProps>) {
    const { rgba, onColorClick = () => {} } = props;
    const tooltipRef = useRef(null);
    const mouseRef = useRef({
        downX: 0,
        downY: 0,
        isMouseLeave: true
    });
    const intRgba = rgbaParseInt(rgba);

    const handleColorClick = function(rgba: IRGBA) {
        onColorClick(rgba);
    }

    const handleMouseDown = function(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        // 按下此元素
        mouseRef.current.isMouseLeave = false;
        mouseRef.current.downX= e.clientX;
        mouseRef.current.downY = e.clientY;
    }

    useEffect(() => {
        const handleMouseLeave = function() {
            // 移出此元素
            mouseRef.current.isMouseLeave = true;
            mouseRef.current.downX = 0;
            mouseRef.current.downY = 0;
        }
        const handleDocumentMouseUp = function() {
            if (!mouseRef.current.isMouseLeave) mouseRef.current.isMouseLeave = true
        }
        const handleDocumentMouseMove = function(event: MouseEvent) {
            if (!mouseRef.current.isMouseLeave) {
                const currentMoveX = event.clientX - mouseRef.current.downX;
                const currentMoveY = event.clientY - mouseRef.current.downY;
                props.onDragChange && props.onDragChange(currentMoveX, currentMoveY);
                mouseRef.current.downX = event.clientX;
                mouseRef.current.downY = event.clientY;
            }
        }
        document.addEventListener('mouseup', handleDocumentMouseUp);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mousemove', handleDocumentMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleDocumentMouseMove);
            document.removeEventListener('mouseup', handleDocumentMouseUp);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Tippy
            content={`rgba(${intRgba.r}, ${intRgba.g}, ${intRgba.b}, ${intRgba.a})`}
            placement="bottom"
            >
                <ColorCollectItemWrapper
                    onMouseDown={e => handleMouseDown(e)}
                    >
                    <ColorCollectItem
                        style={{backgroundColor: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`}}
                        onClick={e => handleColorClick(rgba) }
                        />
                </ColorCollectItemWrapper>
        </Tippy>
    )
}
