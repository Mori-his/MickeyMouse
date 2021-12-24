import { action, computed, makeObservable, observable,  } from 'mobx';
import BasicNode, { ContainerNodeMixin, ContainerParentDataMixin, ParentData } from '@layout/core/object';
import RootWidget from '@models/widgets/root';
import { TreeWidget } from '@layout/core/layout';


export class OwnerParentData extends ContainerParentDataMixin<BasicNode>(ParentData) {

}

export class Owner extends ContainerNodeMixin<BasicNode, OwnerParentData>(BasicNode) {
    static count: number = 0;
    constructor(public name?: string) {
        super();
        this.name ??= `未命名${++Owner.count}`
        makeObservable(this, {
            name: observable,
            setName: action
        });
        this.init();
    }

    init() {
        const root: RootWidget = new RootWidget({
            id: 0,
            name: '根节点'
        });

        this.add(root);
        const rootChild1 = new RootWidget({
            id: 1,
            name: '第一级子节点1'
        })
        root.addAll([
            rootChild1,
            new RootWidget({
                id: 2,
                name: '第一级子节点2'
            }),
            new RootWidget({
                id: 3,
                name: '第一级子节点3'
            })
        ]);
        rootChild1.add(new RootWidget({id : '1-1', name: '第二级子节点1'}))
        rootChild1.add(new RootWidget({id : '1-2', name: '第二级子节点2'}))
    }

    setName(name: string) {
        this.name = name;
    }

}



export class OwnerCaretaker extends ContainerNodeMixin<BasicNode, OwnerParentData>(BasicNode) {

    selectIndex: number = 0;
    _currOwner!: Owner
    _currWidget?: TreeWidget

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
            childCount: observable,
            selectIndex: observable,
            _currOwner: observable,
            _currWidget: observable,
            updateSelectedIndex: action,
            selectedOwner: action,
            selectedWidget: action,
            currOwner: computed,
            currWidget: computed,
        }, {
            deep: true
        });
    }

    updateSelectedIndex(index: number) {
        if (index > this.childCount) index = this.childCount;
        this.selectIndex = index;
    }

    remove(child: Owner) {
        super.remove(child);
        if (this.selectIndex >= this.childCount) {
            this.selectIndex = this.childCount - 1;
        }
        if(this.childCount === 0) {
            this.initOnwer();
        }
    }

    removeAll() {
        super.removeAll();
        this.initOnwer();
    }

    selectedOwner(owner: Owner, index: number) {
        this._currOwner = owner;
        this.updateSelectedIndex(index);
    }
    selectedWidget(widget?: TreeWidget) {
        this._currWidget = widget;
    }

    initOnwer() {
        if (this.childCount === 0) {
            const owner = new Owner();
            this.add(owner);
            owner.attach(this);
            this.selectIndex = 0;
            this.selectedOwner(owner, this.selectIndex);
        } else if (this.lastChild) {
            this.selectedOwner(this.lastChild as Owner, this.selectIndex);
        }
    }

    get currOwner() {
        return this._currOwner;
    }

    get currWidget() {
        return this._currWidget;
    }
}

export default new OwnerCaretaker();

