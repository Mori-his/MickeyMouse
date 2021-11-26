
import BasicNode, { ContainerNodeMixin, ContainerParentDataMixin, ParentData } from "./object";

export class Size {
    constructor(public width: number | null, public height: number | null) {}

    static zero() {
        return new Size(0, 0);
    }
}

export class AdaptiveSize extends Size {
    constructor(
        rect: Size,
        public widthAdaptive?: boolean,
        public heightAdaptive?: boolean
    ) {
        super(rect.width, rect.height);
        if (typeof rect.width === 'number') {
            this.widthAdaptive = false;
        }
        if (typeof rect.height === 'number') {
            this.heightAdaptive = false;
        }
    }

    static widthAdaptive() {
        return new AdaptiveSize(new Size(null, null), true, false);
    }


    static heightAdaptive() {
        return new AdaptiveSize(new Size(null, null), false, true);
    }

    static adaptive() {
        return new AdaptiveSize(new Size(null, null), true, true);
    }
}


export class Position {
    constructor(
        public left?: number,
        public top?: number,
        public right?: number,
        public bottom?: number
    ) {

    }

    static origin() {
        return new Position(0, 0);
    }
}

export type AdaptivePositionOptions = {
    position?: Position,
    horizontal?: boolean,
    vertical?: boolean
}

export class AdaptivePosition extends Position {
    horizontal?: boolean;
    vertical?: boolean;

    constructor({
        position,
        horizontal,
        vertical
    }: AdaptivePositionOptions) {
        super(position!.left, position!.top, position!.right, position!.bottom);
        this.horizontal = horizontal;
        this.vertical = vertical;
    }

    static horizontal() {
        return new AdaptivePosition({
            horizontal: true,
            vertical: false
        });
    }
}

export class LayoutParentData extends ParentData {
    detach() {
        super.detach();
    }
}
export interface LayoutOptions {
    left: number
    top: number
    right: number
    bottom: number
    width: number
    height: number
    horizontal: boolean
    vertical: boolean
}
export class Layout extends BasicNode {
    left?: number
    top?: number
    right?: number
    bottom?: number
    horizontal?: boolean
    vertical?: boolean

    constructor(adaptivePosition: AdaptivePosition) {
        super();
        this.left = adaptivePosition.left;
        this.top = adaptivePosition.top;
        this.right = adaptivePosition.right;
        this.bottom = adaptivePosition.bottom;
        this.horizontal = adaptivePosition.horizontal;
        this.vertical = adaptivePosition.vertical;
    }
    setupParentData(child: BasicNode) {
        if (!(child.parentData instanceof LayoutParentData))
            child.parentData = new LayoutParentData();
    }

    adoptChild(child: BasicNode) {
        this.setupParentData(child);
        super.adoptChild(child);
    }
}

export interface WidgetOptions extends AdaptivePosition {
    id: string // 当前控件ID
    name?: string // 当前控件名称
    description?: string // 当前控件描述信息
    type: string // 控件类型
}

// [ParentData]可以实现一些相对于父元素的定位信息
export class WidgetParentData extends ContainerParentDataMixin<Layout>(LayoutParentData) {
    
    detach() {
        super.detach();
    }
}
export abstract class Widget extends ContainerNodeMixin<Layout, WidgetParentData>(Layout) {
    constructor(options: WidgetOptions) {
        super(new AdaptivePosition({
            position: new Position(options.left, options.top, options.right, options.bottom),
            horizontal: options.horizontal,
            vertical: options.vertical
        }));
    }
}
