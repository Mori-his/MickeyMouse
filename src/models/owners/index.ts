import { action, computed, makeObservable, observable, Reaction, reaction,  } from 'mobx';
import BasicNode, { ContainerNodeMixin, ContainerParentDataMixin } from '@layout/core/object';
import { TreeWidget } from "@widgets/treeWidget";
import { LinkMemoto } from '@layout/memoto/memoto';
import { assert } from '@layout/core/assert';
import { emitSpy } from './spy';
import { Owner, OwnerParentData } from './owner';
import { widgetManage, WidgetManage } from './widgetControl';



export enum ESpeedyActionType{
    COPY, // 拷贝
    PASTE, // 粘贴
    CUT, // 剪切
}

export interface IWaitActionProps {
    widget: TreeWidget
    action: ESpeedyActionType
}

/**
 * 所有者管理类
 * ### 此类是个单例
 * 1、每个选项卡都由此类管理
 * 2、此类是一个基础链表，不包含widget属性
 * 3、操作全局动作的时候可以用此类
 */
export class OwnerCaretaker extends ContainerNodeMixin<Owner, ContainerParentDataMixin<Owner>>(BasicNode) {

    selectIndex: number = 0;
    _currOwner!: Owner;
    targetWidget?: TreeWidget;
    waitAction?: IWaitActionProps;
    widgetManage: WidgetManage = widgetManage;

    constructor() {
        super();
        this.initOnwer();
        makeObservable(this, {
            add: action,
            addAll: action,
            insert: action,
            move: action,
            remove: action,
            removeAll: action,
            setTargetWidget: action,
            updateSelectedIndex: action,
            selectedOwner: action,
            setWaitAction: action,
            childCount: observable,
            selectIndex: observable,
            _currOwner: observable,
            targetWidget: observable,
            waitAction: observable,
            currOwner: computed,
        }, {
            deep: true
        });
        this.attach(this);
    }

    updateSelectedIndex(index: number) {
        if (index > this.childCount) index = this.childCount;
        this.selectIndex = index;
    }

    /**
     * @override
     */
    add(child: Owner): void {
        emitSpy(child, this.lastChild, {type: 'add', target: this });
        super.add(child);
    }
    /**
     * @override
     */
    addAll(children: Owner[]): void {
        emitSpy(children, this.firstChild, { type: 'add', target: this });
        super.addAll(children);
    }
    /**
     * @override
     */
    insert(child: Owner, after?: Owner | undefined): void {
        emitSpy(child, this.firstChild, { type: 'insert', target: this });
        super.insert(child, after);
    }
    /**
     * @override
     */
    protected _removeFromChildList(child: Owner): void {
        // 注销
        child.disposed();
        super._removeFromChildList(child);
    }

    /**
     * @override
     */
    remove(child: Owner) {
        // 如果就剩下最后一个了不能删除
        if (this.childCount === 1) return;
        const childParentData = child.parentData as ContainerParentDataMixin<Owner>;
        const previousSibling = childParentData.previousSibling;
        const nextSibling = childParentData.nextSibling;
        super.remove(child);
        emitSpy(null, child, {type: 'remove', target: this});
        let index = this.childCount - 1;
        if (!previousSibling && nextSibling) {
            index = 0
        }

        const owner = previousSibling || nextSibling;
        if (this.childCount === 0) {
            this.initOnwer();
        }
        if (this.childCount && owner) {
            this.selectedOwner(owner, index)
        }
    }
    /**
     * 最好不要全都删除
     * @override
     */
    removeAll() {
        const firstChild = this.firstChild;
        super.removeAll();
        emitSpy(null, firstChild, {type: 'removeAll', target: this});
        this.initOnwer();
    }

    selectedOwner(owner: Owner, index: number) {
        this._currOwner = owner;
        emitSpy(index, this.selectIndex, { type: 'changeOwner', target: this})
        this.updateSelectedIndex(index);
    }

    initOnwer() {
        if (this.childCount === 0) {
            // const owner = new Owner();
            // this.add(owner);
            // this.selectIndex = 0;
            // this.selectedOwner(owner, this.selectIndex);
        } else if (this.lastChild) {
            this.selectedOwner(this.lastChild, this.selectIndex);
        }
    }

    setTargetWidget(widget?: TreeWidget) {
        this.targetWidget = widget;
    }

    setWaitAction(newAction?: IWaitActionProps) {
        this.waitAction = newAction;
    }

    get currOwner() {
        return this._currOwner;
    }

    toJson() {
        return {
            selectIndex: this.selectIndex,
            owners: this.map(owner => owner.toJson())
        }
    }
}
const ownerCaretaker = new OwnerCaretaker();
export default ownerCaretaker;



export type MobxTrackStateProps = {
    read: () => any
    write: (state: any) => void
}


/**
 * 注册监听列表并记录
 * @param target - 需要产生记录的对象
 * @param tracks - 需要产生记录的属性列表
 */
export function mobxTrackStates(target: TreeWidget, tracks: Array<MobxTrackStateProps>) {
    assert(tracks.length);
    tracks.forEach(track => {
        mobxTrackState(target, track);
    });
}

type WriteType<T> = (state: T) => void;


/**
 * 注册添加删除记录
 * C: Create D: Delete
 */
export enum CDAction {
    ADD,
    ADDALL,
    INSERT,
    REMOVE,
    REMOVEALL,
}
export type RegisterCDMemotoProps = {
    target: TreeWidget
    nextState: TreeWidget
    after?: TreeWidget
    type: CDAction
    undo: Function
    redo: Function
}
export function registerCDMemoto(props: RegisterCDMemotoProps) {
    const owner = props.target.root as Owner;
    if (!(owner instanceof Owner)) return;
    const memoto = new LinkMemoto(
        props.nextState,
        props.nextState,
        () => props.undo(),
        () => props.redo()
    );
    // 记录
    owner.addMemoto(memoto);
}
/**
 * 注册监听某个属性并记录
 * - 每产生一条记录都会发送给当前监听对象的所有者[Owner]
 * - 当触发[undo/redo]时会给一个停止监听的状态预防回退操作被记录
 */
const delay: number = 1000;
export function mobxTrackState(target: TreeWidget, { read, write }: MobxTrackStateProps) {
    let stopTracking = false;

    function createLinkMemoto<T>(
        owner: Owner, 
        props: {
            newValue: T,
            prevValue: T,
            write: WriteType<T>
        }
    ) {
        const { newValue, prevValue, write } = props;
        if (owner instanceof Owner) {
            if (owner.isDisposed) {
                stopTrackingChanges();
                throw new Error('Undo already disposed');
            }
            // console.log(newValue, prevValue);
            const memoto = new LinkMemoto(
                newValue,
                prevValue,
                (prevValue) => {
                    stopTracking = true;
                    write(prevValue);
                },
                (nextValue) => {
                    stopTracking = true;
                    write(nextValue);
                }
            );
            // 记录
            owner.addMemoto(memoto);
            // console.log(owner.memoto);
        }
    }

    const stopTrackingChanges = reaction(read, (newValue, prevValue, re) => {
        // 发送给注册监听变化
        emitSpy(newValue, prevValue, re as Reaction);
        if (stopTracking) {
            stopTracking = false;
            return;
        }
        const owner = target.root as Owner;
        createLinkMemoto(owner, { newValue, prevValue, write});
    }, {
        delay: delay
    });
}




