import { isMacOS } from "@utils/util";
import EventEmitter,{ captureRejectionSymbol } from "events";

// 如果增加监听按键需要在此声明一个
export enum ShortcutsObserverType {
    CTRL_C = 'ctrl+c',
    CTRL_X = 'ctrl+x',
    CTRL_V = 'ctrl+v',
    DELETE = 'delete',
    ARROWDOWN = 'down',
    ARROWUP = 'up'
}

export type IShortcuts = {
    [key in ShortcutsObserverType]: string
}

export class ShortcutsEvent extends EventEmitter {

    constructor() {
        // 异步捕获错误
        // http://nodejs.cn/api/events/capture_rejections_of_promises.html
        super({ captureRejections: true });
    }

    once(eventName: ShortcutsObserverType, listener: (...args: any[]) => void): this {
        super.once(eventName.toString(), listener);
        return this;
    }

    emit(eventName: ShortcutsObserverType, ...args: any[]): boolean {
        return super.emit(eventName.toString(), ...args);
    }

    on(eventName: ShortcutsObserverType, listener: (...args: any[]) => void): this {
        super.on(eventName.toString(), listener);
        return this;
    }

    listenerCount(eventName: ShortcutsObserverType): number {
        return super.listenerCount(eventName.toString());
    }

    listeners(eventName: ShortcutsObserverType): Function[] {
        return super.listeners(eventName.toString());
    }

    rawListeners(eventName: ShortcutsObserverType): Function[] {
        return super.rawListeners(eventName.toString());
    }
    prependListener(eventName: ShortcutsObserverType, listener: (...args: any[]) => void): this {
        super.on(eventName.toString(), listener);
        return this;
    }
    prependOnceListener(eventName: ShortcutsObserverType, listener: (...args: any[]) => void): this {
        super.on(eventName.toString(), listener);
        return this;
    }
    [captureRejectionSymbol](err: any, eventName: ShortcutsObserverType, ...args: any[]){
        // EventEmitter 异步listener时错误捕获
        console.log('rejection happened for', eventName, 'with', err, ...args);
    }

    removeListener(eventName: ShortcutsObserverType, listener: (...args: any[]) => void): this {
        super.removeListener(eventName?.toString(), listener);
        return this;
    }

    removeAllListeners(eventName?: ShortcutsObserverType): this {
        super.removeAllListeners(eventName?.toString());
        return this;
    }

    off(eventName: ShortcutsObserverType, listener: (...args: any[]) => void): this {
        super.off(eventName.toString(), listener);
        return this;
    }

}

export interface ShortcutsObserverProps {
    scope?: HTMLElement
}
export class ShortcutsObserver extends ShortcutsEvent {

    static instance: ShortcutsObserver;
    static getInstance() {
        if (!this.instance) {
            this.instance = new ShortcutsObserver();
        }
        return this.instance;
    }

    static shortcuts: IShortcuts = (() => {
        if (isMacOS()) {
            return {
                [ShortcutsObserverType.CTRL_C]: '⌘C',
                [ShortcutsObserverType.CTRL_X]: '⌘X',
                [ShortcutsObserverType.CTRL_V]: '⌘V',
                [ShortcutsObserverType.DELETE]: '⌫',
                [ShortcutsObserverType.ARROWDOWN]: '⌄',
                [ShortcutsObserverType.ARROWUP]: '⌃'
            }
        }
        return {
            [ShortcutsObserverType.CTRL_C]: 'Ctrl+C',
            [ShortcutsObserverType.CTRL_X]: 'Ctrl+X',
            [ShortcutsObserverType.CTRL_V]: 'Ctrl+V',
            [ShortcutsObserverType.DELETE]: 'delete',
            [ShortcutsObserverType.ARROWDOWN]: '⌄',
            [ShortcutsObserverType.ARROWUP]: '⌃'
        }
    })()

    targetEl!: Document | HTMLElement;
    isMacOS!: boolean;
    // 是否激活Ctrl键
    private _activeCtrl: boolean = false;
    private _macOSKey = 'meta';
    private _otherKey = 'control';
    // 需要和Ctrl组合的键，小写即可
    private _shortcutsKeys = [
        { key: 'c', type: ShortcutsObserverType.CTRL_C},
        { key: 'x', type: ShortcutsObserverType.CTRL_X},
        { key: 'v', type: ShortcutsObserverType.CTRL_V},
    ];
    // 不需要组合的按键
    private _shortcuts = [
        { key: 'delete', type: ShortcutsObserverType.DELETE},
        { key: 'ArrowDown', type: ShortcutsObserverType.ARROWDOWN},
        { key: 'ArrowUp', type: ShortcutsObserverType.ARROWUP},
    ];

    private onKeyDown!: (event: Event) => void
    private onKeyUp!: (event: Event) => void
    private onMouseOver!: (event: Event) => void
    private onMouseOut!: (event: Event) => void
    private scope!: HTMLElement
    private hitScope: boolean = true;

    constructor(props?: ShortcutsObserverProps) {
        super();
        if (typeof window === 'undefined') return this;
        this.targetEl = document;
        this.isMacOS = isMacOS();
        if (props?.scope) {
            this.setScope(props.scope);
        }
        this.docEventBind();
    }

    docEventBind() {
        this.onKeyDown = this.keyDown.bind(this);
        this.onKeyUp = this.keyUp.bind(this);
        this.targetEl.addEventListener('keydown', this.onKeyDown);
        this.targetEl.addEventListener('keyup', this.onKeyUp);
    }

    private setActiveCtrl(key: string, state: boolean) {
        if (this.isMacOS && key === this._macOSKey) {
            // MacOs 系统
            this._activeCtrl = state;
        } else if (key === this._otherKey) {
            this._activeCtrl = state;
        }
    }

    keyDown(event: any) {
        const key = (event.key as string)?.toLocaleLowerCase();
        // 设置Ctrl是否被激活
        this.setActiveCtrl(key, true);
        if (this._activeCtrl) {
            // 组合快捷键
            this._shortcutsKeys.forEach(shortcutKey => {
                if (shortcutKey.key === key && this.hitScope) {
                    this.emit(shortcutKey.type, event);
                }
            });
            
        }
        // 非组合按快捷键
        this._shortcuts.forEach(item => {
            if (item.key === key && this.hitScope) {
                this.emit(item.type, event);
            }
        });
    }
    keyUp(event: any) {
        const key = event.key;
        this.setActiveCtrl(key, false);
    }

    mouseOver() {
        this.hitScope = true;
    }
    mouseOut() {
        this.hitScope = false;
    }

    setScope(newScope: HTMLElement) {
        this.hitScope = false;
        // 先移除之前得监听
        this.scope?.removeEventListener('mouseover', this.onMouseOver);
        this.scope?.removeEventListener('mouseout', this.onMouseOut);
        // 赋值给新值
        this.scope = newScope;
        this.onMouseOver = this.mouseOver.bind(this);
        this.onMouseOut = this.mouseOut.bind(this);
        // 重新绑定
        this.scope.addEventListener('mouseover', this.onMouseOver);
        this.scope.addEventListener('mouseout', this.onMouseOut);
    }
    /**
     * 销毁
     */
    destroyed() {
        this.targetEl.removeEventListener('keydown', this.onKeyDown);
        this.targetEl.removeEventListener('keyup', this.onKeyUp);
        this.scope?.removeEventListener('mouseover', this.onMouseOver);
        this.scope?.removeEventListener('mouseout', this.onMouseOut);
    }
}
