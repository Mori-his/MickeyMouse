import { action, computed, flow, makeObservable, observable,  } from 'mobx';
import BasicNode, { ContainerNodeMixin, ContainerParentDataMixin, ParentData } from '../../../layout/core/object';


export class OwnerParentData extends ContainerParentDataMixin<BasicNode>(ParentData) {

}

export class Owner extends ContainerNodeMixin<BasicNode, OwnerParentData>(BasicNode) {
    static count: number = 1;
    constructor(private _name?: string) {
        super();
        this._name ??= `未命名${Owner.count}`
        Owner.count++;
    }

    get name() {
        return this._name;
    }

}



export class OwnerCaretaker extends ContainerNodeMixin<BasicNode, OwnerParentData>(BasicNode) {

    static #instance: OwnerCaretaker;
    static getInstance() { 
        return this.#instance ??= new OwnerCaretaker();
    }

    selectIndex: number = 0;

    constructor() {
        super();
        if (this.childCount === 0) {
            this.add(new Owner());
        }
        makeObservable(this, {
            add: action,
            addAll: action,
            insert: action,
            move: action,
            remove: action,
            removeAll: action,
            updateSelectedIndex: action,
            childCount: observable,
            firstChild: observable,
            lastChild: observable,
            selectIndex: observable,
            visitChildren: true,
        }, {
            deep: true
        });
    }

    updateSelectedIndex(index: number) {
        if (index > this.childCount) index = this.childCount;
        this.selectIndex = index;
    }
}

