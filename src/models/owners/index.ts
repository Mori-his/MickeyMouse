import { action, computed, flow, makeAutoObservable, makeObservable, observable,  } from 'mobx';
import BasicNode, { ContainerNodeMixin, ContainerParentDataMixin, ParentData } from '@layout/core/object';


export class OwnerParentData extends ContainerParentDataMixin<BasicNode>(ParentData) {

}

export class Owner extends ContainerNodeMixin<BasicNode, OwnerParentData>(BasicNode) {
    static count: number = 1;
    constructor(public name?: string) {
        super();
        this.name ??= `未命名${Owner.count}`
        Owner.count++;
        makeObservable(this, {
            name: observable,
            setName: action
        });
    }

    setName(name: string) {
        this.name = name;
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
        this.#initOnwer();
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

    remove(child: Owner) {
        super.remove(child);
        if (this.selectIndex >= this.childCount) {
            this.selectIndex = this.childCount - 1;
        }
        if(this.childCount === 0) {
            this.#initOnwer();
        }
    }

    removeAll() {
        super.removeAll();
        this.#initOnwer();
    }

    #initOnwer() {
        if (this.childCount === 0) {
            this.add(new Owner());
            this.selectIndex = 0;
        }
    }
}

