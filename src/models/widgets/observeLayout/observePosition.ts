import { AdaptivePosition, AdaptivePositionOptions, AllProps, Position } from "@layout/core/position";
import { mobxTrackStates } from "@models/owners";
import { TreeWidget } from "@widgets/treeWidget";
import { action, makeObservable, observable } from "mobx";


export class ObservePosition extends Position {
    constructor(allProps: AllProps) {
        super(allProps);
        makeObservable(this, {
            top: observable,
            right: observable,
            bottom: observable,
            left: observable,
            setTop: action,
            setRight: action,
            setBottom: action,
            setLeft: action,
        });
    }

    registerTracks(widget: TreeWidget) {
        // 注册undo/redo
        mobxTrackStates(widget, [
            { read: () => this.top, write: (top: number | string) => this.setTop(top) },
            { read: () => this.right, write: (right: number | string) => this.setRight(right) },
            { read: () => this.bottom, write: (bottom: number | string) => this.setBottom(bottom) },
            { read: () => this.left, write: (left: number | string) => this.setLeft(left) },
        ]);
    }
}

export class ObserveAdaptivePosition extends AdaptivePosition {

    constructor(superProps: AdaptivePositionOptions) {
        super(superProps);
        makeObservable(this, {
            horizontal: observable,
            vertical: observable,
            top: observable,
            right: observable,
            bottom: observable,
            left: observable,
            setTop: action,
            setRight: action,
            setBottom: action,
            setLeft: action,
            setHorizontal: action,
            setVertical: action,
        });
    }

    registerTracks(widget: TreeWidget) {
        // 注册undo/redo
        mobxTrackStates(widget, [
            { read: () => this.top, write: (top: number | string) => this.setTop(top) },
            { read: () => this.right, write: (right: number | string) => this.setRight(right) },
            { read: () => this.bottom, write: (bottom: number | string) => this.setBottom(bottom) },
            { read: () => this.left, write: (left: number | string) => this.setLeft(left) },
            { read: () => this.horizontal, write: (horizontal: boolean) =>  this.setHorizontal(horizontal) },
            { read: () => this.vertical, write: (vertical: boolean) => this.setVertical(vertical) },
        ]);
    }


    setAlignmentTop(alignmentTop?: boolean) {
        alignmentTop && this.setTop(0);
    }
    setAlignmentRight(alignmentRight?: boolean) {
        alignmentRight && this.setRight(0);
    }
    setAlignmentBottom(alignmentBottom?: boolean) {
        alignmentBottom && this.setBottom(0);
    }
    setAlignmentLeft(alignmentLeft?: boolean) {
        alignmentLeft && this.setLeft(0);
    }

}