import { HTMLWithWidgetAttr } from "@/types/components/leftContainer/tree/tree";
import { PureIconButton } from "@components/basic/iconButton";
import { TreeWidget } from "@layout/core/layout";
import BasicNode, { ContainerParentDataMixin } from "@layout/core/object";
import ownerCaretaker, { OwnerCaretaker } from "@models/owners";
import Tippy from "@tippyjs/react";
import { getDragElement, widgetAttrName } from "@utils/styleTool";
import { observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import DragEventSignle from '@utils/tree.drag';


// 每一层的padding值
const depthPaddingNum = 8;
// 左右移动时触发移动节点的临界点
const moveDepthX = depthPaddingNum * 8;

const TreeWrapper = styled.div``;

// targetElement 要拖拽的元素
// dragTargetElement 拖拽至目标的元素

// 实现以下功能
// 1、单步左右跨级移动
// 2、跨级别上下移动
export default observer(function Tree() {
    const disableOver = useRef(false);
    const mousePosition = useRef({
        x: 0,
        y: 0
    });
    useEffect(() => {
        const dragEventSignle = DragEventSignle.getInstance();
        const handleDrop = function(event: Event){
            event.preventDefault();
            ownerCaretaker.targetWidget?.setLock(false);
            ownerCaretaker.setTargetWidget();
        }
        const handleDrag = function(e: Event) {
            e.preventDefault();
            const target = e.target as HTMLDivElement;
            if (!target || !target?.style) return;
            target.style.opacity = '0';
            if (ownerCaretaker.targetWidget) {
                handleDragStep(e as unknown as React.DragEvent, ownerCaretaker.targetWidget)
            }
        }
        const handleDragStep = function(event: React.DragEvent, widget: TreeWidget) {
            if (!widget) return;
            const differenceX = event.clientX - mousePosition.current.x;
            const parent = widget.parent as TreeWidget
            if (!parent) return;
            const parentStep = Math.floor(Math.abs(differenceX) / moveDepthX);
            const parentData = widget.parentData as ContainerParentDataMixin<TreeWidget>;
            const previousSibling = parentData.previousSibling;
            if (differenceX >= moveDepthX || differenceX <= -moveDepthX) {
                // 禁止over触发
                disableOver.current = true;
                if (differenceX > 0) {
                    // 子项方向触发
                    let previousSiblingStep = previousSibling;
                    for (let i = 0; i < parentStep - 1; i++) {
                        if (!previousSiblingStep?.lastChild) break;
                        previousSiblingStep = previousSiblingStep.lastChild as TreeWidget
                    }
                    if (!previousSiblingStep) return;

                    if (previousSiblingStep.shrink) {
                        previousSiblingStep.setShrink(false);
                    }
                    if (previousSiblingStep.strideMove)
                        previousSiblingStep.strideMove(widget, previousSiblingStep.lastChild as TreeWidget);
                } else {
                    // 父项方向触发
                    if (!parent) return;
                    let dragTargetParentWidget: TreeWidget = parent;
                    for (let i = 0; i < parentStep; i++) {
                        if (!dragTargetParentWidget.parent) break;
                        dragTargetParentWidget = dragTargetParentWidget.parent as TreeWidget
                    }
                    if (!dragTargetParentWidget) return;
                    if (dragTargetParentWidget.strideMove) {
                        dragTargetParentWidget.strideMove(
                            widget,
                            parent || dragTargetParentWidget.lastChild as TreeWidget
                        );
                    }
                }
            } else {
                // 开启over触发
                disableOver.current = false;
            }
        }
        const handleDragStart = function(e: Event) {
            const targetElement = e.target as HTMLWithWidgetAttr;
            const event = e as unknown as React.DragEvent<HTMLDivElement>;
            const widget = targetElement[widgetAttrName];
            if (!widget) return;
            mousePosition.current.x = event.clientX;
            mousePosition.current.y = event.clientY;
            
            // 锁定此节点以及子节点
            widget.setLock(true);

            ownerCaretaker.setTargetWidget(widget);
            ownerCaretaker.selectedWidget();
            
        }
        const handleDragEnd = function(event: Event) {
            const target = event.target as HTMLDivElement;
            if (!target || !target?.style) return;
            target.style.opacity = '';
            ownerCaretaker.targetWidget?.setLock(false);
            ownerCaretaker.setTargetWidget();
        }
        const handleDragOver = function(e: Event) {
            e.preventDefault();
            const target = e.target as HTMLWithWidgetAttr;
            const event = e as unknown as React.DragEvent<HTMLDivElement>;
            const dragTargetElement = getDragElement(target);
            if (!dragTargetElement) return;

            const widget = dragTargetElement[widgetAttrName];

            if (disableOver.current) return; // 如果被禁止直接返回不处理
            
            if (!widget) return;
            if (widget.forbidMove) return;
            if (ownerCaretaker?.targetWidget === widget) return;
            
            const targetRect = (dragTargetElement as unknown as HTMLDivElement).getBoundingClientRect();
            const { top, height } = targetRect;
            const targetHeightHalf = top + height / 2;
            // 平级上下插入节点
            const dragWidgetParent = widget.parent as TreeWidget;

            if (!ownerCaretaker?.targetWidget || !dragWidgetParent) return;
            
            const targetWidget = ownerCaretaker?.targetWidget;
            const targetParentData = targetWidget.parentData as ContainerParentDataMixin<TreeWidget>;
            // 如果是同级则用move
            // 如果不是同级则先remove然后在insert
            if (targetHeightHalf > event.clientY) {
                // 向上插入
                const parentData = widget.parentData as ContainerParentDataMixin<TreeWidget>;
                // 不能插入到当前位置
                if (parentData?.previousSibling === targetWidget) return;
                dragWidgetParent.strideMove(targetWidget, parentData.previousSibling);
            } else {// 向下插入
                // 不能插入到当前位置
                if (targetParentData?.previousSibling === widget) return;
                dragWidgetParent.strideMove(targetWidget, widget);
            }
        }

        dragEventSignle.on('drop', handleDrop);
        dragEventSignle.on('drag', handleDrag);
        dragEventSignle.on('dragStart', handleDragStart);
        dragEventSignle.on('dragEnd', handleDragEnd);
        dragEventSignle.on('dragOver', handleDragOver);
        return () => {
            dragEventSignle.removeListener('drop', handleDrop);
            dragEventSignle.removeListener('drag', handleDrag);
            dragEventSignle.removeListener('dragStart', handleDragStart);
            dragEventSignle.removeListener('dragEnd', handleDragEnd);
            dragEventSignle.removeListener('dragOver', handleDragOver);
        }
    }, [])
    return (
        <TreeWrapper>
            { CompositeItem(ownerCaretaker.currOwner) }
        </TreeWrapper>
    );
});




interface TreeItemPaddingProps {
    paddingLeft?: number
}
const TreeItemPadding = styled.div<TreeItemPaddingProps>`
    ${props => props.paddingLeft && `
        padding-left: ${props.paddingLeft}px;
    `};
`;

interface TreeItemGroupProps {
    paddingLeft?: number
    widget: TreeWidget
}
export const TreeItemGroup = observer(function (props: React.PropsWithChildren<TreeItemGroupProps>) {
    const { paddingLeft, widget } = props;
    return (
        <TreeItemPadding
            style={{height: widget.shrink ? 0 : 'auto', overflow: widget.shrink ? 'hidden' : 'visible'}}
            paddingLeft={ paddingLeft }
            >
            { props.children }
        </TreeItemPadding>
    );
})


/**
 * 组合节点
 * @param child 子节点
 * @param depth 深度
 * @description 组合节点的职责是只有深度递归组合节点，和组合结点综合处理
 * @returns 
 */
const CompositeItem = function(child: BasicNode | TreeWidget, depth: number = 0) {
    let items: Array<React.ReactChild> = [];
    const parentWidget = child as TreeWidget;
    // 此判断是为了让mobx得到最外层wedget更新
    if (!parentWidget.childCount) return [];
    child.visitChildren((visitChild: BasicNode) => {
        const currChild = visitChild as TreeWidget;
        currChild.__root_depth = depth;
        // 如果没有监听的就不需要[observer]
        const OBTreeItem = observer(() => {
            return (
                <TreeItem
                    widget={currChild}
                    onClick={() => {
                        if (ownerCaretaker.currWidget === currChild) {
                            ownerCaretaker.selectedWidget();
                        } else {
                            ownerCaretaker.selectedWidget(currChild);
                        }
                    }}
                    onShrink={(shrink: boolean) => currChild.setShrink(shrink)}
                    />
            );
        });
        items.push(currChild.childCount ? (
                <OBTreeItem key={currChild.id} />
            ) : (
                <TreeItemGroup
                    key={currChild.id}
                    widget={ currChild }
                    >
                    <OBTreeItem />
                </TreeItemGroup>
            )
        );
        // 递归循环子元素
        if (currChild.childCount) {
            const OBTreeItemWrapper = observer(() => {
                return (
                    <TreeItemGroup
                        paddingLeft={ 2 * depthPaddingNum }
                        widget={ currChild }
                        >
                        { CompositeItem(currChild, depth + 1) }
                    </TreeItemGroup>
                )
            });
            items = items.concat(<OBTreeItemWrapper key={`${depth + 1}-${currChild.id}`}/>);
        }
    });
    return items;
}


interface TreeItemWrapperProps {
    active?: boolean
    draging?: boolean
}

const TreeItemHoverCss = css`
    background-color: ${props => props.theme.assist};
    .tree-shrink .svg-fill {
        fill: #fff;
    }
    .tree-item-name {
        color: ${props => props.theme.lightText};
    }
`;

interface TreeItemBoxProps {
    isDrag: boolean
}
const TreeItemBox = styled.div<TreeItemBoxProps>`
    position: relative;
    box-sizing: border-box;
    min-width: 180px;
    ${props => props.isDrag && `
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            box-sizing: border-box;
            height: 32px;
            border: 1px dashed #fff;
            border-radius: 8px;
            background-color: ${props.theme.primary};
            opacity: 0.6;
        }
    `};
`;

const TreeItemWrapper = styled.div<TreeItemWrapperProps>`
    position: relative;
    display: flex;
    align-items: center;
    height: 32px;
    transition: background .3s;
    border-radius: 8px;
    margin: 4px 0;
    ${props => props.active && TreeItemHoverCss};
    &:hover {
        ${props => !props.draging && TreeItemHoverCss};
    }
`;

interface TreeItemState {
    isSetting?: boolean
}

const TreeItemName = styled.span<TreeItemState>`
    color: ${props => props.theme.lesser};
    font-size: 12px;
    ${props => props.isSetting && `
        margin-right: 96px;
    `};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

const TreeItemSettings = styled.div`
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
`;
const TreeItemShrinkBox = styled.div`
    width: 32px;
    heihgt: 32px;
`;

interface TreeItemProps {
    widget: TreeWidget
    paddingLeft?: number
    onClick?: Function
    onShrink?: (shrink: boolean) => any
}

/**
 * 树状结构单节点
 * 节点只管理当前节点的状态显示，不处理节点增删改查操作
 */
export const TreeItem = observer(function(props: TreeItemProps) {
    const {
        widget,
        paddingLeft,
        onClick = () => {},
        onShrink = () => {}
    } = props;
    const currWidget = ownerCaretaker.currWidget;
    const [showSetting, setShowSetting] = useState(false);
    const enterTarget = useRef(false);
    // 当前Treeitem最外层元素
    const treeItemRef = useRef(null);
    const owner = widget.owner as OwnerCaretaker;
    // 鼠标移入目标元素显示设置按钮
    const handleMouseEnter = function(event: React.MouseEvent) {
        setShowSetting(true);
        enterTarget.current = true;
    }
    // 鼠标移出当前节点
    const handleMouseLeave = function(event: React.MouseEvent) {
        // 如果是选中元素 移除后不隐藏设置按钮
        enterTarget.current = false;
        if (currWidget === widget) return;
        setShowSetting(false);
    }

    // 展开/收起按钮被点击
    const handleShrinkClick = function() {
        onShrink(!widget.shrink);
    }
    const handleDragStart = function(event: React.DragEvent<HTMLDivElement>) {
        event.dataTransfer.setData('text/plain', '');
        event.dataTransfer.dropEffect = 'move';
    }

    useEffect(() => {
        if (!enterTarget.current) {
            setShowSetting(currWidget === widget);
        }
    }, [currWidget, widget]);

    useEffect(() => {
        if (treeItemRef.current) {
            // 把当前widget和元素做一次绑定
            // 主要用于拖拽时方便获取到指定widget
            ;(treeItemRef.current as HTMLWithWidgetAttr)[widgetAttrName] = widget;
            widget.__el = treeItemRef.current;
        }
    }, [widget])
    return (
        <TreeItemBox
            isDrag={ owner?.targetWidget === widget }
            >
            <div></div>
            <TreeItemWrapper
                ref={ treeItemRef }
                onDragStart={ handleDragStart }
                draggable={ !widget.forbidMove }
                onMouseEnter={ handleMouseEnter }
                onMouseLeave={ handleMouseLeave }
                style={{ paddingLeft }}
                active={ currWidget === widget}
                onClick={e => onClick()}
                draging={ Boolean(owner?.targetWidget) }
                >
                {
                    // 当前节点有子元素的时候才会展示展开收起按钮
                    widget.childCount ? <PureIconButton
                        icon={!widget.shrink ? "minus" : "plus" }
                        className="tree-shrink"
                        onClick={ handleShrinkClick }
                        />
                    : <TreeItemShrinkBox />
                }
                <Tippy
                    content={`[${widget.type}]${ widget.name || '无说明'}`}
                    delay={ [500, 0] }
                    arrow={ false }
                    animation="scale"
                    theme="light"
                    trigger={ ownerCaretaker.targetWidget ? 'click' : 'mouseenter focus' }
                    >
                    <TreeItemName
                        className="tree-item-name"
                        isSetting={ showSetting }
                        >
                        [{widget.type}]{ widget.name || '无说明'}
                    </TreeItemName>
                </Tippy>
                {/* 
                // 只有鼠标移入此节点或者选中此节点时才显示此设置项
                // 设置下包含 锁定/解锁、删除、隐藏
                */}
                <TreeItemSettings>
                    {
                        // TODO
                        // 删除按钮待定放到右键上去
                        showSetting &&
                            <PureIconButton
                                icon="delete"
                                defaultColor="#fff"
                                hoverColor="#ff0000"
                                size={ 24 }
                                $title="删除此节点"
                                onClick={(event: Event) => {
                                    event.stopPropagation();
                                    (widget.parent as TreeWidget).remove(widget);
                                }}
                                />
                    }
                    {
                        (showSetting || widget.lock) &&
                            <PureIconButton
                                icon={ widget.lock ? 'lock' : 'unlock'}
                                defaultColor="#fff"
                                size={ 24 }
                                $title={ widget.lock ? '解锁' : '锁定' }
                                onClick={(event: Event) => {
                                    event.stopPropagation();
                                    widget.setLock(!widget.lock);
                                }}
                                />
                    }
                    {
                        (showSetting || !widget.visible) &&
                            <PureIconButton
                                icon={widget.visible ? 'eye' : 'eyeClose'}
                                defaultColor="#fff"
                                size={ 24 }
                                $title={widget.visible ? '隐藏' : '显示'}
                                onClick={(event: Event) => {
                                    event.stopPropagation();
                                    widget.setVisible(!widget.visible);
                                }}
                                />
                    }
                </TreeItemSettings>
            </TreeItemWrapper>
        </TreeItemBox>
    );
});
