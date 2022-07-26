import { AdaptiveSize, IAdaptiveSizeProps, Size } from "@layout/core/sizeBox";
import { mobxTrackStates } from "@models/owners";
import { TreeWidget } from "@widgets/treeWidget";
import { action, makeObservable, observable } from "mobx";


export class ObserveSize extends Size {
    constructor(width?: string | number, height?: string | number) {
        super(width, height);

        makeObservable(this, {
            width: observable,
            height: observable,
            setWidth: action,
            setHeight: action
        });
    }

    registerTracks(widget: TreeWidget) {
        // 注册undo/redo
        mobxTrackStates(widget, [
            { read: () => this.width, write: (width: number | string) => this.setWidth(width) },
            { read: () => this.height, write: (height: number | string) => this.setHeight(height) },
        ]);
    }
}

export class ObserveAdaptiveSize extends AdaptiveSize {
    constructor(options: IAdaptiveSizeProps) {
        super(options);

        makeObservable(this, {
            width: observable,
            height: observable,
            widthAdaptive: observable,
            heightAdaptive: observable,
            setWidth: action,
            setHeight: action,
            setWidthAdaptive: action,
            setHeightAdaptive: action,
        });
    }

    registerTracks(widget: TreeWidget) {
        // 注册undo/redo
        mobxTrackStates(widget, [
            { read: () => this.width, write: (width: number | string) => this.setWidth(width) },
            { read: () => this.height, write: (height: number | string) => this.setHeight(height) },
            { read: () => this.widthAdaptive, write: (widthAdaptive: boolean) => this.setWidthAdaptive(widthAdaptive) },
            { read: () => this.heightAdaptive, write: (heightAdaptive: boolean) => this.setHeightAdaptive(heightAdaptive) },
        ]);
    }
}
