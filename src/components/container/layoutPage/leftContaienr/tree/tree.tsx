import React, { useCallback, useEffect, useRef } from "react";
import { observer } from "mobx-react";
import { ContainerParentDataMixin } from "@layout/core/object";
import { HTMLWithWidgetAttr } from "@/types/components/leftContainer/tree/tree";
import ownerCaretaker from "@models/owners";
import { getDragElement, widgetAttrName } from "@utils/styleTool";
import DragEventSignle from '@utils/tree.drag';
import { TreeWidget } from "@widgets/treeWidget";
import { TreeProps } from "./types";
import { TreeProvide } from "./providers/TreeProvide";
import { PlaceholderProvide } from "./providers/PlaceholderProvide";
import { usePlaceholderContext } from "./hooks/usePlaceholderContext";
import { TreeContainer } from "./container";


// 每一层的padding值
const depthPaddingNum = 16;
// 左右移动时触发移动节点的临界点
const moveDepthX = depthPaddingNum * 8;



// targetElement 要拖拽的元素
// dragTargetElement 拖拽至目标的元素

export default React.memo(function Tree(props: TreeProps) {

    return (
        <TreeProvide { ...props }>
            <PlaceholderProvide { ...props }>
                <TreeBox { ...props } />
            </PlaceholderProvide>
        </TreeProvide>
    );
});


export const TreeBox = React.memo(observer(function TreeBox(props: TreeProps) {
    const { mode = 'edit' } = props
    const {
        dropWidget,
        isTail,
        showPlaceholder,
        hidePlaceholder
    } = usePlaceholderContext();
    const disableOver = useRef(false);
    const mousePosition = useRef({
        x: 0,
        y: 0
    });
    // 拖拽被释放
    const handleDrop = useCallback((event: Event) => {
        event.preventDefault();
        if (dropWidget && ownerCaretaker.targetWidget) {
            const parent = dropWidget.parent as TreeWidget;
            if (isTail) {
                
            }
            const parentData = dropWidget.parentData as ContainerParentDataMixin<TreeWidget>;
            if (parent && parentData.previousSibling !== ownerCaretaker.targetWidget) {
                parent.strideMove(ownerCaretaker.targetWidget, parentData.previousSibling);
            }
        }
        ownerCaretaker.targetWidget?.setLock(false);
        ownerCaretaker.setTargetWidget();
        hidePlaceholder();
    }, [dropWidget, hidePlaceholder, isTail]);
    // 元素被拖拽(持续触发)
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
    // 元素开始拖拽
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
        ownerCaretaker.currOwner.selectedWidget();
        
    }
    // 元素拖拽被释放或者安县esc
    const handleDragEnd = function(event: Event) {
        const target = event.target as HTMLDivElement;
        if (!target || !target?.style) return;
        target.style.opacity = '';
        ownerCaretaker.targetWidget?.setLock(false);
        ownerCaretaker.setTargetWidget();
    }
    // 当拖拽元素停留在此元素上 isOver
    const handleDragOver = function(e: Event) {
        e.preventDefault();
        const target = e.target as HTMLWithWidgetAttr;
        const event = e as unknown as React.DragEvent<HTMLDivElement>;
        const dragTargetElement = getDragElement(target);
        if (!dragTargetElement) return;
        const widget = dragTargetElement[widgetAttrName];
        if (ownerCaretaker?.targetWidget === widget) return hidePlaceholder();
        if (disableOver.current) return; // 如果被禁止直接返回不处理
        if (!widget || widget.forbidMove) return;
        
        const targetRect = (dragTargetElement as unknown as HTMLDivElement).getBoundingClientRect();
        const { top, height } = targetRect;
        const targetHeightHalf = top + height / 2;
        // 平级上下插入节点
        const dragWidgetParent = widget.parent as TreeWidget;

        if (
            // 没有拖拽目标
            !ownerCaretaker?.targetWidget
            // drop元素没有父元素
            || !dragWidgetParent
        ) return;

        const targetWidget = ownerCaretaker?.targetWidget;
        const targetParentData = targetWidget.parentData as ContainerParentDataMixin<TreeWidget>;



        // 如果是同级则用move
        if (targetHeightHalf > event.clientY) {
            // 向上插入
            const parentData = widget.parentData as ContainerParentDataMixin<TreeWidget>;
            // 不能插入到当前位置
            if (parentData?.previousSibling === targetWidget) return;
            showPlaceholder(widget)
            // dragWidgetParent.strideMove(targetWidget, parentData.previousSibling);
        } else {// 向下插入
            // 不能插入到当前位置
            if (targetParentData?.previousSibling === widget || !widget.parent) return;
            showPlaceholder(widget, true);
            // dragWidgetParent.strideMove(targetWidget, widget);
        }
    }
    useEffect(() => {

        if (mode === 'view') return;
        const dragEventSignle = DragEventSignle.getInstance();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dropWidget])
    return (
        <TreeContainer
            widget={ownerCaretaker.currOwner as unknown as TreeWidget}
            depth={ 0 }
            />
    );
}));
















// interface TreeItemGroupProps {
//     paddingLeft?: number
//     widget: TreeWidget
// }
// export const TreeItemGroup = observer(function (props: React.PropsWithChildren<TreeItemGroupProps>) {
//     const { paddingLeft, widget } = props;
//     return (
//         <TreeItemPadding
//             style={{
//                 height: widget.shrink ? 0 : 'auto',
//                 overflow: widget.shrink ? 'hidden' : 'visible'
//             }}
//             paddingLeft={ paddingLeft }
//             >
//             { props.children }
//         </TreeItemPadding>
//     );
// })
// export interface CompositeItemProps {
//     child: BasicNode | TreeWidget
//     onItemClick?: Function
// }



// /**
//  * 组合节点
//  * @param child 子节点
//  * @param depth 深度
//  * @description 组合节点的职责是只有深度递归组合节点，和组合结点综合处理
//  * @returns 
//  */
// const CompositeItem = function(props: CompositeItemProps, depth: number = 0) {
//     const treeContext = useContext(TreeContext);
//     const { child, onItemClick = () => {} } = props;
//     let items: Array<React.ReactChild> = [];
//     const parentWidget = child as TreeWidget;
//     // 此判断是为了让mobx得到最外层wedget更新
    
//     if (!parentWidget || !parentWidget.childCount) return [];
//     child.visitChildren((visitChild: BasicNode) => {
//         const currChild = visitChild as TreeWidget;
//         currChild.__root_depth = depth;
//         // 如果没有监听的就不需要[observer]
//         const OBTreeItem = observer(() => {
//             return (
//                 <TreeItem
//                     widget={currChild}
//                     onClick={() => {
//                         onItemClick({
//                             parentWidget,
//                             depth,
//                             node: currChild
//                         });
//                         if (ownerCaretaker.currOwner.currWidget === currChild) {
//                             ownerCaretaker.currOwner.selectedWidget();
//                         } else {
//                             ownerCaretaker.currOwner.selectedWidget(currChild);
//                         }
//                     }}
//                     onShrink={(shrink: boolean) => currChild.setShrink(shrink)}
//                     />
//             );
//         });
//         items.push(currChild.childCount ? (
//                 <OBTreeItem key={currChild.id} />
//             ) : (
//                 <TreeItemGroup
//                     key={currChild.id}
//                     widget={ currChild }
//                     >
//                     <OBTreeItem />
//                 </TreeItemGroup>
//             )
//         );
//         // 递归循环子元素
//         if (currChild.childCount) {
//             const OBTreeItemWrapper = observer(() => {
//                 return (
//                     <TreeItemGroup
//                         paddingLeft={ 2 * depthPaddingNum }
//                         widget={ currChild }
//                         >
//                         {
//                             CompositeItem(
//                                 {
//                                     child: currChild,
//                                     onItemClick,
//                                 },
//                                 depth + 1
//                             )
//                         }
//                     </TreeItemGroup>
//                 )
//             });
//             items = items.concat(<OBTreeItemWrapper key={`${depth + 1}-${currChild.id}`}/>);
//         }
//     });

//     return <>
//         { items }
//     </>
// }