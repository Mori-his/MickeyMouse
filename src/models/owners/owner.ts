import { assert } from "@layout/core/assert";
import BasicNode, { ContainerNodeMixin, ContainerParentDataMixin, ParentData } from "@layout/core/object";
import { LinkCaretaker, LinkMemoto } from "@layout/memoto/memoto";
import { TreeWidget } from "@widgets/treeWidget";
import { action, computed, makeObservable, observable } from "mobx";
import { emitSpy } from "./spy";

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
     * @param memoto - 要记入的数据
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
     * @param memoto - 记录对象
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
     * @param step - 步数
     */
    undo<State>(step = 1) {
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
            toMemoto?.redo();
            toMemoto = toMemoto.firstChild as LinkMemoto<State>;
        }
        // 如果到达了末尾，则赋值为last节点
        this._memoto = toMemoto || this._memoto_last;
        this.isRedo = Boolean(toMemoto);

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