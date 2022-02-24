import { action, computed, makeObservable, observable,  } from 'mobx';
import BasicNode, { ContainerNodeMixin, ContainerParentDataMixin, ParentData } from '@layout/core/object';
import RootWidget from '@models/widgets/root';
import { TreeWidget } from '@layout/core/layout';
import ViewWidget from '@widgets/view';


export class OwnerParentData extends ContainerParentDataMixin<TreeWidget>(ParentData) {

}

export class Owner extends ContainerNodeMixin<TreeWidget, OwnerParentData>(BasicNode) {
    static count: number = 0;

    constructor(public name?: string) {
        super();
        this.name ??= `未命名${++Owner.count}`
        makeObservable(this, {
            name: observable,
            setName: action,
        });
        this.init();
    }

    init() {
        const root: RootWidget = new RootWidget({
            id: 0,
            name: '根节点'
        });

        this.add(root);
        const ViewChild1 = new ViewWidget({
            id: 1,
            name: '第一级子节点1'
        })
        root.addAll([
            ViewChild1,
            new ViewWidget({
                id: 2,
                name: '第一级子节点2'
            }),
            new ViewWidget({
                id: 3,
                name: '第一级子节点3'
            })
        ]);
        ViewChild1.add(new ViewWidget({id : '1-1', name: '第二级子节点1'}))
        ViewChild1.add(new ViewWidget({id : '1-2', name: '第二级子节点2'}))
    }
    strideMove() {}
    setName(name: string) {
        this.name = name;
    }


}



export class OwnerCaretaker extends ContainerNodeMixin<BasicNode, OwnerParentData>(BasicNode) {

    selectIndex: number = 0;
    _currOwner!: Owner
    _currWidget?: TreeWidget
    targetWidget?: TreeWidget

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
            selectedWidget: action,
            childCount: observable,
            selectIndex: observable,
            _currOwner: observable,
            _currWidget: observable,
            targetWidget: observable,
            currOwner: computed,
            currWidget: computed,
        }, {
            deep: true
        });
        this.attach(this);
    }

    updateSelectedIndex(index: number) {
        if (index > this.childCount) index = this.childCount;
        this.selectIndex = index;
    }

    remove(child: Owner) {
        const childParentData = child.parentData as ContainerParentDataMixin<Owner>;
        const previousSibling = childParentData.previousSibling;
        const nextSibling = childParentData.nextSibling;
        let index = this.childCount - 1;
        if (!previousSibling && nextSibling) {
            index = 0
        }
        let owner = previousSibling || nextSibling;
        super.remove(child);
        if(this.childCount === 0) {
            this.initOnwer();
        }
        if (this.childCount && owner) {
            this.selectedOwner(owner, index)
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
            this.selectIndex = 0;
            this.selectedOwner(owner, this.selectIndex);
        } else if (this.lastChild) {
            this.selectedOwner(this.lastChild as Owner, this.selectIndex);
        }
    }

    strideMove() {}

    setTargetWidget(widget?: TreeWidget) {
        this.targetWidget = widget;
    }

    get currOwner() {
        return this._currOwner;
    }

    get currWidget() {
        return this._currWidget;
    }
}

export default new OwnerCaretaker();

