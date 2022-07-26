import BasicNode, { ContainerNodeMixin, ContainerParentDataMixin } from "@layout/core/object";

export interface IMemoto<State> {
    undo(): void
    state: State
}

export type IUndo<State> = (currentState: State) => void;

export interface Originator<State> {
    createMemoto(memoto: Memoto<State>): void
    restoreMemoto(): void
}

export class Memoto<State> implements IMemoto<State> {
    constructor(private _state: State, private _undo: IUndo<State>) {}
    undo() {
        this._undo(this._state);
    }
    get state() {
        return this._state;
    }
}

export abstract class Caretaker {

    abstract get maxMemoto(): number
    abstract set maxMemoto(max: number);
    abstract addMemoto<State>(memoto: IMemoto<State>): void
    abstract restoreFormMemoto<State>(memoto?: IMemoto<State>): void
    abstract restoreFormMemotoAt<State>(step: number): void
}


/**
 * 链表形式的备忘录模式
 * 如果有好的推导写法请说明
 */
export class LinkMemoto<State> extends ContainerNodeMixin<BasicNode, ContainerParentDataMixin<BasicNode>>(BasicNode) implements IMemoto<State> {

    constructor(
        private _state:  State,
        private _prevState: State,
        private _undo: IUndo<State>,
        private _redo: IUndo<State>
        ) {
        super();
    }
    undo() {
        this._undo(this._prevState);
    }
    redo() {
        this._redo(this._state);
    }
    get state() {
        return this._state;
    }
}

export abstract class LinkCaretaker {
    abstract get maxMemoto(): number
    abstract set maxMemoto(max: number);
    abstract addMemoto<State>(memoto: LinkMemoto<State>): void
    abstract restoreFormMemoto<State>(memoto?: LinkMemoto<State>): void
    abstract redo(step: number): void
    abstract undo(step: number): void
}


// export abstract class Caretaker {

//     private _memotos: any[] = [];
//     private _memotoCount: number = 0;
//     private _nextMemotos: any[] = [];

//     private _maxMemoto: number = 100;
//     get maxMemoto() { return this._maxMemoto; }
//     set maxMemoto(max) { this._maxMemoto = max; }

//     addMemoto<State>(memoto: Memoto<State>) {
//         if (this._memotoCount >= this._maxMemoto) {
//             // 超过最大存储量先进先出
//             this._memotos.shift();
//         }
//         this._memotos.push(memoto);
//         this._memotoCount += 1;
//         this._nextMemotos = [];
//     }

//     restoreFormMemoto<State>(memoto?: Memoto<State>) {
//         const memotoIndex: number = this._memotos.findIndex((memoto: Memoto<State>) => memoto === memoto);
//         if (memotoIndex === -1) return;
//         memoto?.undo();
//         this._memotoCount -= this._memotoCount - memotoIndex;
//         const nextMemotos = this._memotos.splice(memotoIndex);
//         this._nextMemotos.push(...nextMemotos);
        
//     }

//     restoreFormMemotoAt<State>(step: number = 1) {
//         let restoreIndex: number;
//         if (this._memotoCount < step) {
//             restoreIndex = 0;
//         } else {
//             restoreIndex = this._memotoCount - step;
//         }
//         const currentMemoto = this._memotos[restoreIndex] as Memoto<State>;
//         currentMemoto.undo();
//         this._memotoCount -= step;
//         const nextMemotos = this._memotos.splice(step);
//         this._nextMemotos.push(...nextMemotos);
//     }

// }
