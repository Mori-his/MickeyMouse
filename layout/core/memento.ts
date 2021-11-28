
export interface IMemento<State> {

}

export type IUndo<State> = (currentState: State) => void;

export interface Originator<State> {
    createMemento(memento: Memento<State>): void
    restoreMemento(): void
}

/**
 * TODO
 * 
 * 1、
 * 
 * 
 */

class Memento<State> implements IMemento<State> {

    constructor(private _state: State, private _undo: IUndo<State>) {

    }

    undo() {
        this._undo(this._state);
    }

    get state() {
        return this._state;
    }

}


class Caretaker {
    static instance: Caretaker = new Caretaker();

    static getInstance() {
        return this.instance;
    }

    private _mementos: any[] = [];
    private _mementoCount: number = 0;
    private _nextMementos: any[] = [];

    addMemento<State>(memento: Memento<State>) {
        this._mementos.push(memento);
        this._mementoCount += 1;
        this._nextMementos = [];
    }

    restoreFormMemento<State>(memento?: Memento<State>) {
        const mementoIndex: number = this._mementos.findIndex((memento: Memento<State>) => memento === memento);
        if (mementoIndex === -1) return;
        memento?.undo();
        this._mementoCount -= this._mementoCount - mementoIndex;
        const nextMementos = this._mementos.splice(mementoIndex);
        this._nextMementos.push(...nextMementos);
        
    }

    restoreFormMementoAt<State>(step: number) {
        let restoreIndex: number;
        if (this._mementoCount < step) {
            restoreIndex = 0;
        } else {
            restoreIndex = this._mementoCount - step;
        }
        const currentMemento = this._mementos[restoreIndex] as Memento<State>;
        currentMemento.undo();
        this._mementoCount -= step;
        const nextMementos = this._mementos.splice(step);
        this._nextMementos.push(...nextMementos);
    }

}
