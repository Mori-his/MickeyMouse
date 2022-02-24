import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Flexible from "./flexible";
import Tree from "./tree/tree";
import { CustomScrollbar } from '@styles/globals';
import Tippy, { tippy} from "@tippyjs/react";
import { Instance } from "tippy.js";
import RightKeyMenu from "@components/basic/menu/rightKeyMenu";
import { getDragElement } from "@utils/styleTool";
import { HTMLWithWidgetAttr } from "@/types/components/leftContainer/tree/tree";
import { createPortal } from "react-dom";


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
    overflow: auto;
    ${ CustomScrollbar }
`;




const minWidth = 200;
export default function LeftContainer(props: React.PropsWithChildren<{}>) {
    const [totalWidth, setTotalWidth] = useState(width);
    const [menus, setMenus] = useState([
        {
            text: '添加子元素'
        },
        {
            text: '向上插入'
        },
        {
            text: '向下插入'
        },
    ]);
    const [mounted, setMounted] = useState(false);
    const treeTippyInstance = useRef<HTMLDivElement>(null);
    const tippyInstanceRef = useRef<Instance | null>(null);
    const tippyBox = useRef<HTMLDivElement | null>(null);

    const handleFlexibleDrag = function(x: number) {
        setTotalWidth((prevWidth: number) => {
            // 三分之一的最大宽度
            const oneThirdsWidth = window.innerWidth / 3;
            if (prevWidth >= oneThirdsWidth && x >= 0) return prevWidth;
            if (prevWidth <= minWidth && x <= 0) return prevWidth;
            return prevWidth + x
        });
    }
    
    useEffect(() => {
        // 创建空盒子
        tippyBox.current = document.createElement('div');
        // 拿到当前tippy实例
        tippyInstanceRef.current = tippy(treeTippyInstance.current!, {
            placement: 'right',
            trigger: 'manual',
            arrow: false,
            animation: 'shift-away',
            theme: "transparent",
            interactive: true,
            offset: [35, 10],
            content: tippyBox.current,
        });
        // 挂载完成，为了让实际menu组件被挂载到tippyBox上
        setMounted(true);
        return () => {
            tippyInstanceRef.current?.destroy();
        }
    }, [tippyBox]);

    const handleMenuItemClick = useCallback(() => {
        tippyInstanceRef.current?.hide();
    }, []);
    


    const handleTreeContextMenu = function(event: React.MouseEvent<HTMLDivElement>) {
        event.preventDefault();
        const widget = getDragElement(event.target as HTMLWithWidgetAttr);
        if (widget) {
            console.log(tippyInstanceRef.current, widget)
            const instance = tippyInstanceRef.current;
            instance?.setProps({
                getReferenceClientRect: function () {
                    return ({
                        width: 0,
                        height: 0,
                        x: event.clientX,
                        y: event.clientY,
                        top: event.clientY,
                        bottom: event.clientY,
                        left: event.clientX,
                        right: event.clientX,
                        toJSON() {
                            return this;
                        }
                    });
                }
            });
            instance?.show();
        }
    }

    return (
        <LeftFlexibleWrapper>
            <Tippy
                content={
                    <RightKeyMenu
                        menus={menus}
                        />
                }
                placement='right'
                trigger="manual"
                interactive={ true }
                arrow={ false }
                offset={ [0, 0] }
                >
                <TreeWrapper
                    ref={ treeTippyInstance}
                    style={{
                        width: totalWidth
                    }}
                    onContextMenuCapture={handleTreeContextMenu}
                    >
                    <Tree />
                </TreeWrapper>
            </Tippy>
            <FlexWrapper
                className="flexible"
                style={{
                    left: totalWidth
                }}
                >
                <Flexible onDragChange={ handleFlexibleDrag } />
            </FlexWrapper>
            {
                // 挂载到tippy上
                mounted && tippyBox.current && createPortal(
                    (<RightKeyMenu
                        menus={ menus }
                        itemClick={ handleMenuItemClick}
                    />),
                    tippyBox.current
                )
            }
        </LeftFlexibleWrapper>
    );
}
