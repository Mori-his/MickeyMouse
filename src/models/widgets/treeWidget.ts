import { NodeSync } from "@/types/types";
import { Widget, WidgetOptions } from "@layout/core/layout";
import { ContainerParentDataMixin } from "@layout/core/object";
import ownerCaretaker, { CDAction, mobxTrackStates, registerCDMemoto } from "@models/owners";
import { cloneDeep } from "lodash";

export interface TreeWidgetOptions extends WidgetOptions{
    syncs?: NodeSync[]
}
export abstract class TreeWidget extends Widget {
    // 伸缩状态
    _shrink: boolean = false;
    // 锁定状态
    _lock: boolean = false;
    // 禁止移动
    __forbidMove: boolean = false;

    _isDragEnter: boolean = false;
    // 当前节点绑定的元素
    __el?: HTMLElement;
    // 根节点深度
    __root_depth: number = 0;
    // 产生兄弟节点
    allowSibling: boolean = true;
    // Sync为通用数据，可以暂存这里或者在创建一个TreeWidget的派生类来实现
    syncs: NodeSync[] = [];
    // 用于回退时不记录
    private __stopTracking: boolean = false;

    constructor({
        syncs,
        size,
        position,
        ...otherProps
    }: TreeWidgetOptions) {
        super({
            size,
            position,
            ...otherProps
        });
        this.syncs = syncs || [];
        
    }

    registerTracks() {
        // 注册undo/redo
        mobxTrackStates(this, [
            { read: () => this.syncs, write: (syncs: NodeSync[]) => this.setSyncs(syncs) },
            // { read: () => this._lock, write: (lock: boolean) => this.setLock(lock) },
            { read: () => this.visible, write: (visible: boolean) => this.setVisible(visible) },
            { read: () => this.id, write: (id: string) => this.setId(id) },
            { read: () => this.name, write: (name: string) => this.setName(name) },
            { read: () => this.attachOnClick, write: (attachOnClick: boolean) => this.setAttachOnClick(attachOnClick) }
        ]);
        this.size.registerTracks && this.size.registerTracks(this);
        this.position.registerTracks && this.position.registerTracks(this);
    }

    strideMove(widget: TreeWidget, after?: TreeWidget) {
        // 是否不能产生兄弟节点？
        if (after && !after.allowSibling) return;
        // 当前节点的父节点
        const parent = widget.parent as TreeWidget;
        // 如果没有父节点
        if (!parent) return;
        if (!this.__stopTracking) {
            // 生成上一次的快照
            const widgetPrev = (widget.parentData as ContainerParentDataMixin<TreeWidget>).previousSibling;
            registerCDMemoto({
                target: this,
                nextState: widget,
                after,
                type: CDAction.INSERT,
                undo: () => {
                    this.__stopTracking = true;
                    this.remove(widget);
                    parent.stopTracking().insert(widget, widgetPrev);
                    this.__stopTracking = false;
                },
                redo: () => {
                    this.__stopTracking = true;
                    // 父节点移除当前节点
                    parent.stopTracking().remove(widget);
                    // 当前节点插入到目标节点后面
                    this.insert(widget, after);
                    this.__stopTracking = false;
                }
            });
        }

        this.__stopTracking = true;
        // 父节点移除当前节点
        parent.stopTracking().remove(widget);
        // 当前节点插入到目标节点后面
        super.insert(widget, after);
        this.__stopTracking = false;
    }

    
    setLock(newState: boolean) {
        this._lock = newState;
        this.visitChildren(child => {
            const currChild = child as TreeWidget;
            currChild.setLock(newState);
        });
        this.__stopTracking = false;
    }

    stopTracking() {
        this.__stopTracking = true;
        return this;
    }

    setShrink(newState: boolean) {
        this._shrink = newState
    }

    setVisible(newState: boolean) {
        this.visible = newState;
    }

    setIsDragEnter(newState: boolean) {
        this._isDragEnter = newState;
    }

    setSyncs(syncs: NodeSync[]) {
        this.syncs = syncs;
    }

    clone() {
        const cloneThis: TreeWidget = cloneDeep(this);
        cloneThis.parent = null;
        cloneThis.parentData = null;
        cloneThis.detach();
        return cloneThis;
    }

    render() {}

    /**
     * @override
     */
    insert(child: TreeWidget, after?: TreeWidget): void {
        if (!this.__stopTracking) {
            const self = this;
            // 生成上一次的快照
            registerCDMemoto({
                target: this,
                nextState: child,
                after,
                type: CDAction.INSERT,
                undo() {
                    self.__stopTracking = true;
                    self.remove(child);
                    self.__stopTracking = false;
                },
                redo() {
                    self.__stopTracking = true;
                    self.insert(child, after);
                    self.__stopTracking = false;
                }
            });
        }
        super.insert(child, after);
        this.__stopTracking = false;
    }

    /**
     * @override
     */
    add(child: TreeWidget): void {
        if (!this.__stopTracking) {
            const self = this;
            // 生成上一次的快照
            registerCDMemoto({
                target: this,
                nextState: child,
                type: CDAction.ADD,
                undo() {
                    self.__stopTracking = true;
                    self.remove(child);
                    self.__stopTracking = false;
                },
                redo() {
                    self.__stopTracking = true;
                    self.add(child);
                    self.__stopTracking = false;
                }
            });
        }
        // 因为add会触发insert方法
        this.__stopTracking = true;
        super.add(child);
        this.__stopTracking = false;
    }

    /**
     * @override
     */
    addAll(children: TreeWidget[]): void {
        if (!this.__stopTracking && children.length) {
            const self = this;
            registerCDMemoto({
                target: this,
                nextState: children[0],
                type: CDAction.ADDALL,
                undo() {
                    self.__stopTracking = true;
                    children.forEach(item => {
                        self.remove(item as TreeWidget);
                    });
                    self.__stopTracking = false;
                },
                redo() {
                    self.__stopTracking = true;
                    self.addAll(children);
                    self.__stopTracking = false;
                }
            });
        }
        this.__stopTracking = true;
        // 因为addAll会依次触发add方法
        super.addAll(children);
        this.__stopTracking = false;
    }

    /**
     * @override
     */
    remove(child: TreeWidget): void {
        if (!this.__stopTracking) {
            const self = this;
            registerCDMemoto({
                target: this,
                nextState: child,
                type: CDAction.REMOVE,
                undo() {
                    self.__stopTracking = true;
                    self.add(child);
                    self.__stopTracking = false;
                },
                redo() {
                    self.__stopTracking = true;
                    self.remove(child);
                    self.__stopTracking = false;
                }
            });
        }
        super.remove(child);
        this.__stopTracking = false;
    }

    /**
     * @override
     */
    removeAll(): void {
        const firstChild = this.firstChild as TreeWidget;
        if (!this.__stopTracking && firstChild) {
            // 在正常删除中执行，而不是undo/redo
            const children = this.map(child => child);
            const self = this;
            registerCDMemoto({
                target: this,
                nextState: firstChild,
                type: CDAction.REMOVEALL,
                undo() {
                    self.__stopTracking = true;
                    self.addAll(children as TreeWidget[]);
                    self.__stopTracking = false;
                },
                redo() {
                    self.__stopTracking = true;
                    self.removeAll();
                    self.__stopTracking = false;
                }
            });
        }
        super.removeAll();
        this.__stopTracking = false;
    }

    /**
     * 删除子元素
     * @override
     * @param child 要删除的子节点
     */
    protected _removeFromChildList(child: TreeWidget): void {
        // 这里实现删除后统一的操作
        if(ownerCaretaker.currOwner.currWidget === child) {
            ownerCaretaker.currOwner.selectedWidget();
        }
        super._removeFromChildList(child);
    }
    get forbidMove() {
        return this._lock || this.__forbidMove;
    }

    get lock() {
        return this._lock;
    }

    get shrink() {
        return this._shrink;
    }
}
