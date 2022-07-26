import { action, computed, makeObservable, observable, Reaction, reaction,  } from 'mobx';
import BasicNode, { ContainerNodeMixin, ContainerParentDataMixin, ParentData } from '@layout/core/object';
import { TreeWidget } from "@widgets/treeWidget";
import { LinkCaretaker, LinkMemoto } from '@layout/memoto/memoto';
import { assert } from '@layout/core/assert';
import { emitSpy } from './spy';
import { checkIfStateModificationsAreAllowed } from 'mobx/dist/internal';



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
export class OwnerCaretaker extends ContainerNodeMixin<BasicNode, OwnerParentData>(BasicNode) {

    selectIndex: number = 0;
    _currOwner!: Owner;
    targetWidget?: TreeWidget;
    waitAction?: IWaitActionProps;

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
     * @ovriride
     */
    add(child: Owner): void {
        emitSpy(child, this.lastChild, {type: 'add', target: this });
        super.add(child);
    }
    /**
     * @ovriride
     */
    addAll(children: Owner[]): void {
        emitSpy(children, this.firstChild, { type: 'add', target: this });
        super.addAll(children);
    }
    /**
     * @ovriride
     */
    insert(child: Owner, after?: Owner | undefined): void {
        emitSpy(child, this.firstChild, { type: 'insert', target: this });
        super.insert(child, after);
    }
    /**
     * @ovriride
     */
    protected _removeFromChildList(child: Owner): void {
        // 注销
        child.disposed();
        super._removeFromChildList(child);
    }

    /**
     * @ovriride
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

        let owner = previousSibling || nextSibling;
        if (this.childCount === 0) {
            this.initOnwer();
        }
        if (this.childCount && owner) {
            this.selectedOwner(owner, index)
        }
    }
    /**
     * 最好不要全都删除
     * @ovriride
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
            this.selectedOwner(this.lastChild as Owner, this.selectIndex);
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
            owners: this.map(owner => (owner as Owner).toJson())
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
 * @param target 需要产生记录的对象
 * @param tracks 需要产生记录的属性列表
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
    let timer: NodeJS.Timeout;

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
            // console.log(owner);
        }
    }

    const stopTrackingChanges = reaction(read, (newValue, prevValue, re) => {
        // 发送给注册监听变化
        emitSpy(newValue, prevValue, re as Reaction);
        if (stopTracking) {
            stopTracking = false;
            return;
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            const owner = target.root as Owner;
            createLinkMemoto(owner, { newValue, prevValue, write});
        }, delay);
    });
}


export class OwnerParentData extends ContainerParentDataMixin<TreeWidget>(ParentData) {

}

export class Owner extends ContainerNodeMixin<TreeWidget, OwnerParentData>(BasicNode) implements LinkCaretaker {
    static count: number = 0;

    // 是否开启拖拽
    isMove: boolean = false;

    isDisposed: boolean = false;

    private _memoto!: LinkMemoto<any>;
    private _memoto_head!: LinkMemoto<any>
    private _memoto_last!: LinkMemoto<any>
    isRedo: boolean = false;

    _currWidget?: TreeWidget;
    /**
     * 最大100步超出会从历史最悠久的开始移除
     */
    private _maxMemoto: number = 100;

    // 只用于设计界面是随机生成为空的image控件
    isAutoImage: boolean = false

    constructor(
        public name?: string,
        public description?: string
    ) {
        super();
        this.name ??= `未命名${++Owner.count}`;
        
        makeObservable(this, {
            name: observable,
            setName: action,
            add: action,
            addAll: action,
            insert: action,
            move: action,
            remove: action,
            removeAll: action,
            setChildCount: action,
            setParent: action,
            selectedWidget: action,
            setIsMove: action,
            childCount: observable,
            parent: observable,
            lastChild: observable,
            _currWidget: observable,
            isMove: observable,
            currWidget: computed,
            memoto: computed,
            memotoCount: computed,
        });
        makeObservable<Owner, any>(this, {
            isRedo: observable,
            _memoto: observable,
            _memoto_head: observable,
            _memoto_last: observable,
            restoreFormMemoto: action,
            addMemoto: action,
            undo: action,
            redo: action,
            memotoHead: computed,
            memotoLast: computed,
        });
    }
    
    /**
     * 获取当前最大可退回步数
     */
    get maxMemoto() { return this._maxMemoto; }
    /**
     * 设置当前最大可退回步数
     */
    set maxMemoto(max) {
        assert(max > 1, '[max]不能小于2')
        this._maxMemoto = max;
    }

    /**
     * 添加记录
     * @param memoto 要记入的数据
     */
    addMemoto<State>(memoto: LinkMemoto<State>): void {
        if (!this._memoto) {
            // 如果是第一次记录
            this._memoto = memoto;
            this._memoto_head = memoto;
            this._memoto_last = memoto;
        } else {
            // 非第一次记录
            if (this.memotoCount >= this._maxMemoto && this._memoto_head.firstChild) {
                // 超出最大记录  遗忘第一条记录
                // 脱离链条
                this._memoto_head = this._memoto_head.firstChild! as LinkMemoto<State>;
                // 重置链头
                this._memoto_head.removeAll();
            }
            this._memoto.removeAll();
            this._memoto.add(memoto);
            this._memoto = memoto;
            this._memoto_last = memoto;
        }
        // 新的memoto进入，前进的历史记录被覆盖了
        this.isRedo = false;
    }
    /**
     * 回退至某一个记录
     * @param memoto 记录对象
     * @returns 
     */
    restoreFormMemoto<State>(memoto: LinkMemoto<State>): void {
        assert(memoto, 'memoto properties in required');
        let toMemoto: LinkMemoto<State> = memoto;
        // 如果当前Memoto存在
        // 一直循环它的子节点 直到子节点完全循环完
        while(toMemoto) {
            toMemoto.undo();
            toMemoto = toMemoto.firstChild as LinkMemoto<State>;
        }
        // 挪动当前指针为父节点
        toMemoto = memoto.parent as LinkMemoto<State>
        this._memoto = toMemoto;
        this.isRedo = true;
    }
    /**
     * 回退至某一步
     * @param step 步数
     */
    undo<State>(step: number = 1) {
        if (!this._memoto && !this._memoto_last) return;
        let toMemoto = this._memoto || this._memoto_last;
        // 在步数范围呢(step > 0) 并且 当前的节点有父节点
        while(step-- && toMemoto) {
            toMemoto.undo();
            toMemoto = toMemoto.parent as LinkMemoto<State>;
        }
        
        this._memoto = toMemoto;
        this.isRedo = true;
    }
    redo<State>(step: number = 1) {
        if (!this._memoto && !this._memoto_head) return;
        let toMemoto = this._memoto || this._memoto_head;
        while(step-- && toMemoto) {
            toMemoto.redo();
            toMemoto = toMemoto.firstChild as LinkMemoto<State>;
        }
        // 如果到达了末尾，则赋值为last节点
        this._memoto = toMemoto || this._memoto_last;
        this.isRedo = !Boolean(toMemoto);
        console.log(this.memoto, this, toMemoto);
    }


    setName(name: string) {
        this.name = name;
    }

    setIsMove(newState: boolean) {
        this.isMove = newState;
    }

    selectedWidget(widget?: TreeWidget) {
        this._currWidget = widget;
    }

    add(child: TreeWidget): void {
        super.add(child);
        emitSpy(child, {}, {type: 'add', target: this});
    }
    addAll(children: TreeWidget[]): void {
        super.addAll(children);
        emitSpy(children, {}, {type: 'addAll', target: this});
    }
    remove(child: TreeWidget): void {
        super.remove(child);
        emitSpy(child, {}, {type: 'remove', target: this});
    }
    removeAll(): void {
        super.removeAll();
        emitSpy(null, this.firstChild, {type: 'removeAll', target: this});
    }

    /**
     * @override
     */
    toJson() {
        return {
            name: this.name,
            root: this.map(widget => (widget as TreeWidget).toJson())
        }
    }

    get currWidget() {
        return this._currWidget;
    }

    get rollTree(): {[key: string | number]: TreeWidget} {
        const result: {[key: string | number]: TreeWidget} = {};
        const queues: TreeWidget[] = [];

        if (this.firstChild) {
            queues.push(this.firstChild)
        }

        while(queues.length) {
            const widget = queues.shift()!;
            result[widget.id] = widget;
            widget.visitChildren((child) => {
                queues.push(child as TreeWidget);
            });
        }
        return result;
    }

    get memoto() {
        return this._memoto;
    }

    get memotoHead() {
        return this._memoto_head;
    }
    get memotoLast() {
        return this._memoto_last;
    }

    get memotoCount() {
        let count = 0;
        if (!this._memoto) return count;
        let memoto = this._memoto.parent;
        while (memoto) {
            count++;
            memoto = memoto.parent;
        }
        return count;
    }

    disposed() {
        this.isDisposed = true;
    }
}


