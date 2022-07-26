import { ConfirmControl } from "@components/basic/common/confirm/confirm";
import { ContainerParentDataMixin } from "@layout/core/object";
import { TreeWidget } from "@widgets/treeWidget"

/**
 * 是否可以向下移动
 * @param widget 欲判断的节点
 * @returns 是否可以向下移动
 */
export const isMoveDown = function(widget: TreeWidget): boolean {
    if (widget?.type === 'root') {
        return false;
    }
    if (widget && (widget.parent as TreeWidget)?.lastChild === widget) {
        return false;
    }
    return true;
}

/**
 * 是否可以被删除
 * @param widget 欲判断的节点
 * @returns 是否可以被删除
 */
export const isDelete = function(widget: TreeWidget): boolean {
    return widget?.type !== 'root';
}

/**
 * 是否可以向上移动
 * @param widget 欲判断的节点
 * @returns 是否可以向上移动
 */
export const isMoveUp = function(widget: TreeWidget): boolean {
    return isDelete(widget);
}

/**
 * 是否可以向下插入节点
 * @param widget 欲判断的节点
 * @returns 是否可以向下插入节点
 */
export const isInsertNextNode = function(widget: TreeWidget) {
    return isDelete(widget);
}

/**
 * 是否可以向上插入节点
 * @param widget 欲判断的节点
 * @returns 是否可以向上插入节点
 */
 export const isInsertPrevNode = function(widget: TreeWidget) {
    return isDelete(widget);
}

/**
 * 向上移动
 * @param widget 欲移动的节点
 */
export const moveUp = function(widget: TreeWidget) {
    if (widget?.parent) {
        const parentData = widget.parentData as ContainerParentDataMixin<TreeWidget>;
        const prevWidget = parentData.previousSibling;
        if (prevWidget) {
            // 上个节点往下移  就达到了这层节点往上移
            (widget.parent as TreeWidget).move(prevWidget, widget);
        }
    }
}

/**
 * 向下移动
 * @param widget 欲移动的节点
 */
export const moveDown = function(widget: TreeWidget) {
    if (widget?.parent) {
        const parentData = widget.parentData as ContainerParentDataMixin<TreeWidget>;
        const nextWidget = parentData.nextSibling;
        if (nextWidget) {
            (widget.parent as TreeWidget).move(widget, nextWidget);
        }
    }
}


export const deleteWidget = function(widget: TreeWidget) {
    ConfirmControl.open({
        content: '确认要删除吗？'
    }).then((confirm) => {
        confirm.onClose();
        if (widget && widget.parent) {
            (widget.parent as TreeWidget).remove(widget);
        }
    });
}


