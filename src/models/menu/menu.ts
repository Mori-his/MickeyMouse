import { WidgetParentData } from "@layout/core/layout";
import BasicNode, { ContainerNodeMixin, ContainerParentDataMixin, IContainerNodeMixin } from "@layout/core/object";
import ownerCaretaker from "@models/owners";
import { ShortcutsObserver, ShortcutsObserverType } from "@utils/shortcuts/shortcutsObserver";
import { action, makeObservable, observable } from "mobx";



export interface IMenuItem<ChildType extends BasicNode = BasicNode > extends IContainerNodeMixin<ChildType> {
    disable: boolean
    text: string
    shortcutsTip?: string
    setDisable(newState: boolean): void
    type: string | Symbol
}
  
export interface IMenu<ChildType extends BasicNode = BasicNode> extends IContainerNodeMixin<ChildType> {
    onClick(item: MenuItem, index: number): void
    selectType?: string | Symbol
    setType(newState: string | Symbol): void
}


type TMenuItemOptions = Partial<{
    type: string | Symbol
    // 是否是禁止的
    disable: boolean
    onClick: Function
    onBeforeUpdate: Function
    onLoaded: Function
    shortcutsTip: string
    children: Array<MenuItem>
    shortcuts: ShortcutsObserverType
}>

const defaultMenuSymbol = Symbol('defaultMenuSymbol');

// 获取按键(观察/订阅)
const shortcuts: ShortcutsObserver = new ShortcutsObserver();
export class MenuItem extends ContainerNodeMixin<BasicNode, WidgetParentData>(BasicNode) implements IMenuItem<BasicNode> {
    text!: string;
    shortcutsTip?: string;
    disable: boolean = false;
    type!: string | Symbol;
    
    _options!: TMenuItemOptions;
    _shortcutsType?: ShortcutsObserverType;

    constructor(
        text: string,
        options?: TMenuItemOptions,
    ) {
        super();
        this.text = text;
        this._options = options || {};
        this.type = options?.type || defaultMenuSymbol;
        if (options?.shortcuts) {
            this._shortcutsType = options.shortcuts;
            this.bindShortcuts();

            // 如果绑定了按键，才会触发是否显示快捷键的提示文本
            if (options?.shortcutsTip) {
                this.shortcutsTip =  options.shortcutsTip;
            } else {
                // 如果没有指定提示文给个指定提示文本
                this.shortcutsTip = ShortcutsObserver.shortcuts[options.shortcuts]
            }
        }
        makeObservable(this, {
            disable: observable,
            text: observable,
            type: observable,
            shortcutsTip: observable,
            setDisable: action,
            setText: action,
        });
    }

    private bindShortcuts() {
        if (this._shortcutsType)
            // 如果存在当前绑定按键，则注册订阅
            // 按键类型是[ShortcutsObserver]类去实现的
            shortcuts.on(this._shortcutsType, () => {
                if (!ownerCaretaker.currOwner) return;
                const { currWidget } = ownerCaretaker.currOwner;
                if (
                    currWidget &&
                    currWidget?.root === ownerCaretaker.currOwner
                )
                    // 必须当前选中的owner和选中的widget是同一个
                    // 必须选中了一个元素
                    this.onClick(this);
            });
    }

    setDisable(newState: boolean): void {
        this.disable = newState;
    }

    setText(newText: string) {
        this.text = newText;
    }

    onBeforeUpdate(...args: Array<any>) {
        if (this._options.onBeforeUpdate) {
            this._options.onBeforeUpdate.call(this, ...args)
        }
    }

    onClick(...args: Array<any>) {
        console.log(
            '触发了',
            this._shortcutsType,
            ownerCaretaker.currOwner.currWidget,
        );
        console.log(`disable: ${this.disable}`);
        if (this._options.onClick && !this.disable) {
            this._options.onClick.call(this, ...args)
        }
    }
    destroyed() {
        shortcuts.removeAllListeners();
    }
}

type MenuOptions = {
    type?: string | Symbol
    scope?: HTMLElement
}
export class Menu extends ContainerNodeMixin<MenuItem, ContainerParentDataMixin<MenuItem>>(BasicNode) implements IMenu<BasicNode> {
    selectType?: string | Symbol;

    constructor(options?: MenuOptions) {
        super();
        this.selectType = options?.type || defaultMenuSymbol;
        if (options?.scope) {
            shortcuts.setScope(options.scope);
        }
        makeObservable(this, {
            setType: action,
            selectType: observable
        });
    }

    onBeforeUpdate(...args: Array<any>) {
        this.visitChildren((item) => {
            item.onBeforeUpdate(...args);
        });
    }

    onClick(item: MenuItem, index: number) {

    }

    setType(newState: string | Symbol): void {
        this.selectType = newState;
    }

    setScope(scope: HTMLElement) {
        shortcuts.setScope(scope);
    }
    destroyed() {
        this.visitChildren((item) => {
            const menuItem = item as MenuItem;
            menuItem.destroyed();
        });
        shortcuts.destroyed();
    }
}

