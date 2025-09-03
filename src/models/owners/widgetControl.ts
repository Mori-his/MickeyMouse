import { TreeWidget } from "@widgets/treeWidget";
import { differenceWith, isEqual } from "lodash";
import { action, computed, makeObservable, observable } from "mobx";

type ForEachCallbackFn = (callbackfn: (value: TreeWidget, index: number, array: TreeWidget[]) => void, thisArg?: any) => void;
type MapCallbackFn<U> = (value: TreeWidget, index: number, array: TreeWidget[]) => U;


export interface WidgetControlInterface {
    isSingle: boolean,
    list: Array<TreeWidget>
    add(widget: TreeWidget): void
    addAll(widgets: Array<TreeWidget>): void
    remove(widget: TreeWidget): void
    removeAll(): void
    forEach: ForEachCallbackFn
    map<U>(callbackfn: MapCallbackFn<U>, thisArg?: any): U[]
    filter<S extends TreeWidget>(predicate: (value: TreeWidget, index: number, array: TreeWidget[]) => value is S, thisArg?: any): S[]
}

export interface WidgetManageInterface {
    callWidgetsMethod<T extends TreeWidget = TreeWidget, V = any, M = any>(methodName: keyof T, value: V): M
    getValue<T extends TreeWidget = any>(attrName: keyof T): any
    isCoincide<T = any>(value1: T, value2: T): boolean
}

export class WidgetControl implements WidgetControlInterface {
    list: TreeWidget[] = [];

    constructor() {
        makeObservable(this, {
            list: observable,
            isEmpty: computed,
            isSingle: computed,
            add: action,
            addAll: action,
            remove: action,
            removeAll: action
        });
    }

    forEach = this.list.forEach;
    map = this.list.map;
    filter = this.list.filter;

    add(widget: TreeWidget): void {
        if (this.list.indexOf(widget) > -1) {
            return this.remove(widget);
        }
        this.list.push(widget);
    }
    addAll(widgets: TreeWidget[]): void {
        widgets.forEach((widget) => {
            this.add(widget);
        });
    }
    remove(widget: TreeWidget): void {
        const index = this.list.indexOf(widget);
        if (index === -1) {
            return console.warn('没有找到可以取消选中的元素');
        }
        this.list.splice(index, 1);
    }
    removeAll(): void {
        this.list = [];
    }

    /**
     * 是否为空选中
     */
    get isEmpty() {
        return Boolean(this.list.length);
    }

    /**
     * 是否为单个选中
     */
    get isSingle() {
        return this.list.length === 1;
    }
}

export class WidgetManage implements WidgetManageInterface {
    widgetControl!: WidgetControlInterface;

    constructor(widgetControl: WidgetControlInterface) {
        this.widgetControl = widgetControl;
    }

    /**
     * 获取选中组件的值
     * @param attrName - 选中组件的属性名
     * @returns 如果选中组件的属性值相同则返回此值，如果不同则返回空
     */
    getValue<T extends TreeWidget = any>(attrName: keyof T) {
        let value;
        const list = this.widgetControl.list;
        for (let i = 0; i < list.length; i++) {
            const widget: T = list[i] as T;
            if (typeof widget[attrName] !== 'function') {
                const newValue = widget[attrName];
                if (!value)
                    value = newValue;
                else {
                    if (!this.isCoincide(value, newValue)) {
                        value = '';
                        break;
                    }
                }
            }
        }
        return value;
    }

    /**
     * 调用所有选中组件的方法
     * @param methodName - 方法名称
     * @param value - 传递给方法的数据
     */
    callWidgetsMethod<T extends TreeWidget = TreeWidget, V = any, M = any>(methodName: keyof T, value: V): M | any {
        this.widgetControl.forEach((item) => {
            const widget: T = item as T;
            if (typeof widget[methodName] === 'function') {
                (widget[methodName] as unknown as Function)(value);
            }
        });
    }
    /**
     * 比对两个值是否相等
     * @param value1 - 第一个数据
     * @param value2 - 要比对的数据
     * @returns 是否相等
     */
    isCoincide<T = any>(value1: T, value2: T): boolean {
        if (value1 instanceof Array && value2 instanceof Array) {
            return !Boolean(differenceWith(value1, value2, isEqual).length);
        }
        if (typeof value1 === 'object') {
            return Object.is(value1, value2);
        }
        return value1 === value2;
    }
    
}

export const widgetManage = new WidgetManage(new WidgetControl());
