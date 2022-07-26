import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Flexible from "./flexible";
import Tree from "./tree/tree";
import { CustomScrollbar } from '@styles/globals';
import Tippy, { tippy} from "@tippyjs/react";
import { Instance } from "tippy.js";
import RightKeyMenu from "@components/basic/menu/rightKeyMenu";
import { getDragElement, widgetAttrName } from "@utils/styleTool";
import { HTMLWithWidgetAttr } from "@/types/components/leftContainer/tree/tree";
import { createPortal } from "react-dom";
import { observer } from "mobx-react";
import { Menu, MenuItem } from "@models/menu";
import ownerCaretaker from "@models/owners";
import { withModels } from "../../../hoc/modals";
import { menuItems } from "./menu";
import { ViewJSONModal } from "../../../hoc/modals/viewJSON";
import { CreateNode } from "@components/hoc/modals/createNode/createNode";
import { ManageTree } from "./manageTree";


let width: number = 296;

const LeftFlexibleWrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 1;
    left: 0;
    top: 88px;
    bottom: 0;
    color: ${props => props.theme.lightText};
    background-color: ${props => props.theme.contrast};
    box-shadow: 2px 0 8px 0 ${props => props.theme.main};
`;

const FlexWrapper = styled.div`
    position: absolute;
    z-index: 1;
    left: ${width - 2}px;
    top: 0;
    bottom: 0;
    /* top: calc((100vh - 88px) / 2); */
    
`;
const TreeWrapper = styled.div`
    width: ${width}px;
    height: 100%;
    padding: 0 8px 16px;
    overflow: overlay;
    ${ CustomScrollbar }
`;




const minWidth = 200;

const menu = new Menu();

export enum CreateAction {
    CREATE_CHILD,
    CREATE_UP,
    CREATE_DOWN,
}


function LeftContainer() {

    const [totalWidth, setTotalWidth] = useState(width);

    const [mounted, setMounted] = useState(false);
    const treeTippyInstance = useRef<HTMLDivElement>(null);
    const tippyInstanceRef = useRef<Instance | null>(null);
    const tippyBox = useRef<HTMLDivElement | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleFlexibleDrag = function(x: number) {
        setTotalWidth((prevWidth: number) => {
            // 三分之一的最大宽度
            const oneThirdsWidth = window.innerWidth / 3;
            if (prevWidth >= oneThirdsWidth && x >= 0) return prevWidth;
            if (prevWidth <= minWidth && x <= 0) return prevWidth;
            return prevWidth + x;
        });
    }

    
    
    useEffect(() => {
        menu.removeAll();
        menu.addAll(menuItems);
        if (treeTippyInstance.current) {
            menu.setScope(treeTippyInstance.current);
        }
        return () => {
            menu.destroyed();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    

    useEffect(() => {
        // 创建空盒子
        tippyBox.current = document.createElement('div');
        // 拿到当前tippy实例
        tippyInstanceRef.current = tippy(treeTippyInstance.current!, {
            appendTo: document.body,
            placement: 'right',
            trigger: 'manual',
            arrow: false,
            animation: 'shift-away',
            theme: "transparent",
            interactive: true,
            // offset: [24, 10],
            content: tippyBox.current,
        });
        // 挂载完成，为了让实际menu组件被挂载到tippyBox上
        setMounted(true);
        return () => {
            tippyInstanceRef.current?.destroy();
        }
    }, [tippyBox]);

    // 菜单按钮被点击
    const handleMenuItemClick = useCallback((menuItem: MenuItem) => {
        if (!menuItem.disable) {
            tippyInstanceRef.current?.hide();
        }
    }, []);
    

    // 树形结构项右键被点击
    const handleTreeContextMenu = function(event: React.MouseEvent<HTMLDivElement>) {
        event.preventDefault();
        const widget = getDragElement(event.target as HTMLWithWidgetAttr);
        if (widget) {
            ownerCaretaker.currOwner.selectedWidget(widget[widgetAttrName]);
            const instance = tippyInstanceRef.current;
            let hidePromise = Promise.resolve();
            if (instance?.state.isMounted) {
                // 如果被挂载说明被点击过,并且正在触发隐藏的生命周期
                // 先给当前tippy设置下属性,然后再将其补刀个隐藏
                hidePromise = new Promise((resolve) => {
                    instance?.setProps({
                        onAfterUpdate() {
                            instance.hide();
                        },
                        onHidden() {
                            resolve();
                        }
                    });
                })
            }
            hidePromise.then(() => {
                // 如果触发了隐藏则会等待隐藏执行完成才会触发本次显示
                // 如果没有触发隐藏，本次显示会执行微任务开始时触发
                instance?.setProps({
                    onHidden() {
                        // 先暂时不取消选中
                        // ownerCaretaker.currOwner.selectedWidget();
                    },
                    getReferenceClientRect: function () {
                        const menuHeight = menuRef.current?.getBoundingClientRect().height || 0;
                        return ({
                            width: 0,
                            height: menuHeight,
                            x: event.clientX,
                            y: event.clientY,
                            top: event.clientY,
                            bottom: event.clientY,
                            left: event.clientX - 14,
                            right: event.clientX,
                            toJSON() {
                                return this;
                            }
                        });
                    },
                    onAfterUpdate(instance) {
                        menu.onBeforeUpdate();
                        instance.show();
                    },
                });
            })
        }
    }

    return (
        <LeftFlexibleWrapper>
            <ManageTree />
            <TreeWrapper
                ref={ treeTippyInstance }
                style={{
                    width: totalWidth
                }}
                onContextMenuCapture={handleTreeContextMenu}
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
            {
                // 挂载到tippy上
                mounted && tippyBox.current && createPortal(
                    (<RightKeyMenu
                        ref={ menuRef }
                        menus={ menu }
                        itemClick={ handleMenuItemClick}
                    />),
                    tippyBox.current
                )
            }
        </LeftFlexibleWrapper>
    );
}

export default observer(withModels(CreateNode, ViewJSONModal)(LeftContainer));
