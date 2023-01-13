import { ConfirmControl } from "@components/basic/common/confirm/confirm";
import { ContainerParentDataMixin } from "@layout/core/object";
import { MenuItem } from "@models/menu";
import { ShortcutsObserver, ShortcutsObserverType } from "@utils/shortcuts/shortcutsObserver";
import { TreeWidget } from "@widgets/treeWidget";
import ownerCaretaker, { ESpeedyActionType } from "@models/owners";
import { MessageControl } from "@components/basic/common";
import { widgetTypeManage } from "@models/factory/widgetTypeClassManage";
import { initializeWidgetParams, widgetBuildBFS } from "@models/factory/widgetBuild.factory";
import { modalControl } from "../../../hoc/modals";
import { CreateAction } from ".";
import { ViewJSONModal } from "../../../hoc/modals/viewJSON";
import { nanoid } from "nanoid";
import { Node } from "@models/factory/types";
import { CreateNode, CreateNodeActions, CreateNodeState } from "@components/hoc/modals/createNode/createNode";
import { assert } from "@layout/core/assert";
import { isDelete, isInsertNextNode, isInsertPrevNode, isMoveDown, isMoveUp } from "@utils/tree.tool";

/**
 * 创建节点
 * @param action - [插入子级，向上插入, 向下插入]
 * @param data - 包含新建的节点类型、ID、名称
 * @returns 
 */
export const createNode = function(action: CreateAction, data: CreateNodeState) {
    const { currWidget } = ownerCaretaker.currOwner;
    if (!currWidget) {
        MessageControl.open({
            content: '请先选中一个节点',
        });
        return;
    }
    if (data[CreateNodeActions.SET_NODE] === null) {
        MessageControl.open({
            content: '请选节点类型',
        });
        return;
    }
    const WidgetName = data[CreateNodeActions.SET_NODE]!.value;
    const widgetType = widgetTypeManage.get(WidgetName);
    assert(widgetType, '没找到对应的组件');
    const { value: Widget } = widgetType!;
    const node = new Widget(initializeWidgetParams({
        desc: data[CreateNodeActions.SET_NAME],
        id: data[CreateNodeActions.SET_ID].toString()
    }));
    switch(action) {
        case CreateAction.CREATE_CHILD: // 插入到子元素
            currWidget.add(node)
            break;
        case CreateAction.CREATE_UP: // 向上插入
            if (!currWidget.parent) return;
            const parentData = currWidget.parentData as ContainerParentDataMixin<TreeWidget>;
            (currWidget.parent as TreeWidget).insert(node, parentData.previousSibling);
            break;
        case CreateAction.CREATE_DOWN: // 向下插入
            (currWidget.parent as TreeWidget).insert(node, currWidget);
            break;
    }
}

export const menuItems =  [
    new MenuItem('添加子元素', {
        onClick() {
            modalControl.find(CreateNode)?.open({
                onConfirm(data: CreateNodeState) {
                    createNode(CreateAction.CREATE_CHILD, data)
                    modalControl.find(CreateNode)?.close();
                }
            });
        }
    }),
    new MenuItem('向上插入', {
        onBeforeUpdate(this: MenuItem) {
            const { currWidget } = ownerCaretaker.currOwner;
            this.setDisable(!isInsertPrevNode(currWidget!));
        },
        onClick() {
            modalControl.find(CreateNode)?.open({
                onConfirm(data: CreateNodeState) {
                    createNode(CreateAction.CREATE_UP, data)
                    modalControl.find(CreateNode)?.close();
                }
            });
        }
    }),
    new MenuItem('向下插入', {
        onBeforeUpdate(this: MenuItem) {
            const { currWidget } = ownerCaretaker.currOwner;
            this.setDisable(!isInsertNextNode(currWidget!));
        },
        onClick() {
            modalControl.find(CreateNode)?.open({
                onConfirm(data: CreateNodeState) {
                    createNode(CreateAction.CREATE_DOWN, data)
                    modalControl.find(CreateNode)?.close();
                }
            });
        }
    }),
    new MenuItem('剪切', {
        shortcuts: ShortcutsObserverType.CTRL_X,
        shortcutsTip: ShortcutsObserver.shortcuts[ShortcutsObserverType.CTRL_X],
        onClick() {
            const { currWidget } = ownerCaretaker.currOwner;
            if (!currWidget) {
                MessageControl.open({
                    content: '请选中一个节点后再剪切'
                });
                return;
            }
            ownerCaretaker.setWaitAction({
                widget: currWidget,
                action: ESpeedyActionType.CUT
            });
            MessageControl.open({
                content: (
                    <>
                        剪切<span style={{color: 'red',}}>{currWidget?.name || currWidget?.id}</span>节点成功
                    </>
                )
            });
        },
    }),
    /**
     * 粘贴节点   -    前提是必须[复制/剪切]过节点
     * 粘贴节点可以跨配置项
     * 注意事项粘贴节点目前是不可逆操作，撤销操作待实现
     * 逻辑如下：
     * 当[复制/剪切]过后触发粘贴会经历以下步骤：
     * if (选中了节点)
     *      if (选中节点为根节点[root])
     *          会粘贴到根节点的子节点
     *      else     
     *          会粘贴到当前选中节点的下一个兄弟接地那
     * 
     * else if (未选中节点 并且 [复制/剪切]的节点是根节点[root])
     *      覆盖当前配置项!!!!!
     * else
     *      错误提示
     */
    new MenuItem('粘贴', {
        shortcuts: ShortcutsObserverType.CTRL_V,
        shortcutsTip: ShortcutsObserver.shortcuts[ShortcutsObserverType.CTRL_V],
        onBeforeUpdate(this: MenuItem) {
            const { waitAction } = ownerCaretaker;
            this.setDisable(!Boolean(waitAction));
        },
        onClick() {
            if (!ownerCaretaker.waitAction?.widget) {
                MessageControl.open({
                    content: '请先复制或剪切一个节点'
                });
                return;
            }
            const { waitAction } = ownerCaretaker;

            const { currWidget } = ownerCaretaker.currOwner;
            switch(waitAction.action) {
                case ESpeedyActionType.COPY: // 拷贝被粘贴
                    const currWidgetJson = waitAction.widget.toJson() as Node;
                    const newWidget = widgetBuildBFS(currWidgetJson);
                    if (currWidget) { // 选中了一个元素
                        // TODO
                        // 1、副本后重复问题
                        if (Object.is(ownerCaretaker.currOwner, waitAction.widget.root)) {
                            newWidget.id = `${waitAction.widget.id}_copy_${nanoid(4)}`;
                        }
                        const parent: TreeWidget =  currWidget.parent as TreeWidget;
                        if (currWidget.type !== 'root') { // 选中节点不是根节点的时候
                            parent.insert(newWidget, currWidget);
                        } else { // 选中节点是根节点的时候
                            currWidget.insert(newWidget);
                        }
                    } else if (waitAction.widget.type === 'root') { // 没有选中节点并且[复制/剪切]必须是根节点
                        ConfirmControl.open({
                            content: '确认要全部覆盖当前节点吗？此操作无法撤回!!!!'
                        }).then(() => {
                            ownerCaretaker.currOwner.removeAll();
                            ownerCaretaker.currOwner.add(newWidget);
                        });
                    } else {
                        MessageControl.open({
                            content: '必须是根节点才能覆盖整个配置项!'
                        });
                    }
                    break;
                case ESpeedyActionType.CUT: // 剪切被粘贴
                    // 剪切的父节点
                    const waitActionParent: TreeWidget = waitAction.widget.parent as TreeWidget;
                    if (currWidget) { // 选中了一个元素
                        const parent: TreeWidget =  currWidget.parent as TreeWidget;
                        if (Object.is(ownerCaretaker.currOwner, waitAction.widget.root)) {
                            waitAction.widget.id = `${waitAction.widget.id}_copy_${nanoid(4)}`;
                        }
                        waitActionParent.remove(waitAction.widget); // 从当前链条脱离
                        if (currWidget.type !== 'root') { // 选中节点非[root]节点
                            parent.insert(waitAction.widget, currWidget);
                        } else {
                            currWidget.insert(waitAction.widget);
                        }
                    } else if (waitAction.widget.type === 'root') { // 为选中节点并且剪切的必须是根节点
                        ConfirmControl.open({
                            content: '确认要全部覆盖当前节点吗？此操作无法撤回!!!!'
                        }).then(() => {
                            ownerCaretaker.currOwner.removeAll();
                            ownerCaretaker.currOwner.add(waitAction.widget);
                        });
                    } else {
                        MessageControl.open({
                            content: '必须是根节点才能覆盖整个配置项!'
                        });
                    }
                    break;
            }
        }
    }),
    new MenuItem('复制', {
        shortcuts: ShortcutsObserverType.CTRL_C,
        shortcutsTip: ShortcutsObserver.shortcuts[ShortcutsObserverType.CTRL_C],
        onClick() {
            const { currWidget } = ownerCaretaker.currOwner;
            if (!currWidget) {
                MessageControl.open({
                    content: '请选中一个节点后再复制'
                });
                return;
            }
            ownerCaretaker.setWaitAction({
                widget: currWidget,
                action: ESpeedyActionType.COPY
            });
            MessageControl.open({
                content: (
                    <>
                        复制<span style={{color: 'red',}}>{currWidget?.name || currWidget?.id}</span>节点成功
                    </>
                )
            });
        }
    }),
    new MenuItem('删除', {
        onBeforeUpdate(this: MenuItem) {
            const { currWidget } = ownerCaretaker.currOwner;
            this.setDisable(!isDelete(currWidget!));
        },
        onClick() {
            ConfirmControl.open({
                content: '确认要删除吗？'
            }).then((confirm) => {
                confirm.onClose();
                const { currWidget } = ownerCaretaker.currOwner;
                if (currWidget && currWidget.parent) {
                    (currWidget.parent as TreeWidget).remove(currWidget);
                }
            });
        }
    }),
    new MenuItem('隐藏', {
        onBeforeUpdate(this: MenuItem) {
            const newText = ownerCaretaker.currOwner.currWidget?.visible ? '隐藏' : '显示';
            if (this.text !== newText) {
                this.setText(newText);
            }
        },
        onClick(this: MenuItem) {
            const { currWidget } = ownerCaretaker.currOwner;
            currWidget?.setVisible(!currWidget.visible);
        }
    }),
    new MenuItem('锁定', {
        onBeforeUpdate(this: MenuItem) {
            const newText = ownerCaretaker.currOwner.currWidget?.lock ? '解锁' : '锁定';
            if (this.text !== newText) {
                this.setText(newText);
            }
        },
        onClick() {
            const { currWidget } = ownerCaretaker.currOwner;
            currWidget?.setLock(!currWidget.lock);
        }
    }),
    new MenuItem('上移一层', {
        onBeforeUpdate(this: MenuItem) {
            const { currWidget } = ownerCaretaker.currOwner;
            this.setDisable(!isMoveUp(currWidget!));
        },
        onClick() {
            const { currWidget } = ownerCaretaker.currOwner;
            if (currWidget?.parent) {
                const parentData = currWidget.parentData as ContainerParentDataMixin<TreeWidget>;
                const prevWidget = parentData.previousSibling;
                if (prevWidget) {
                    // 上个节点往下移  就达到了这层节点往上移
                    (currWidget.parent as TreeWidget).move(prevWidget, currWidget);
                }
            }
        }
    }),
    new MenuItem('下移一层', {
        onBeforeUpdate(this: MenuItem) {
            const { currWidget } = ownerCaretaker.currOwner;
                this.setDisable(!isMoveDown(currWidget!));

        },
        onClick() {
            const { currWidget } = ownerCaretaker.currOwner;
            if (currWidget?.parent) {
                const parentData = currWidget.parentData as ContainerParentDataMixin<TreeWidget>;
                const nextWidget = parentData.nextSibling;
                if (nextWidget) {
                    (currWidget.parent as TreeWidget).move(currWidget, nextWidget);
                }
            }
        }
    }),
    // new MenuItem('属性同步'),
    // new MenuItem('属性同步到...'),
    new MenuItem('查看JSON', {
        onClick() {
            modalControl.find(ViewJSONModal)?.open();
        }
    }),
];
