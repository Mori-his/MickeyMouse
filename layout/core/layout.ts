
import BasicNode, { ContainerNodeMixin, ContainerParentDataMixin, ParentData } from "./object";

const assert = console.assert;

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

class Fillet {
    
}

export class LayoutParentData extends ParentData {
    detach() {
        super.detach();
    }
}
export interface LayoutOptions {
    position: AdaptivePosition,
    size: AdaptiveSize
}
export class Layout extends BasicNode {
    left?: number
    top?: number
    right?: number
    bottom?: number
    horizontal?: boolean
    vertical?: boolean
    width?: number
    height?: number

    constructor(options: Partial<LayoutOptions> = {}) {
        super();
        this.left = options.position?.left;
        this.top = options.position?.top;
        this.right = options.position?.right;
        this.bottom = options.position?.bottom;
        this.horizontal = options.position?.horizontal;
        this.vertical = options.position?.vertical;
    }
    /**
     * 设置子节点的[ParentData]
     * @param child 要设置[parentData]的子节点
     * @override
     */
    setupParentData(child: BasicNode) {
        if (!(child.parentData instanceof LayoutParentData))
            child.parentData = new LayoutParentData();
    }

    /**
     * 关联子节点
     * @param child 要关联的子节点
     * @override
     */
    adoptChild(child: BasicNode) {
        this.setupParentData(child);
        super.adoptChild(child);
    }
}

export interface WidgetOptions extends AdaptivePosition {
    id: string // 当前控件ID
    name?: string // 当前控件名称
    description?: string // 当前控件描述信息
    visible?: boolean // 显示隐藏
    attachOnClick?: boolean // 是否给当前[Widget]增加点击事件
}

// [ParentData]可以实现一些相对于父元素的定位信息
// 如果想自定义ParentData尝试混入[ContainerParentDataMixin]
export class WidgetParentData extends ContainerParentDataMixin<Layout>(LayoutParentData) {
    
    detach() {
        super.detach();
    }
}
export abstract class Widget extends ContainerNodeMixin<Layout, WidgetParentData>(Layout) {
    id!: string
    name?: string
    description?: string
    visible: boolean
    attachOnClick: boolean

    abstract type: string

    #ids: string[] = [];

    constructor(options: WidgetOptions) {
        super(new AdaptivePosition({
            position: new Position(options.left, options.top, options.right, options.bottom),
            horizontal: options.horizontal,
            vertical: options.vertical
        }));
        this.id = options.id;
        this.name = options.name;
        this.description = options.description;
        this.visible = options.visible || true;
        this.attachOnClick = options.attachOnClick || false;
    }

    /**
     * 设置子节点的[ParentData]
     * @param child 要设置[parentData]的子节点
     * @override
     */
    setupParentData(child: BasicNode) {
        if (!(child.parentData instanceof LayoutParentData))
            child.parentData = new WidgetParentData();
    }

    /**
     * 关联子节点
     * @param child 要关联的子节点
     * @override
     */
    adoptChild(child: BasicNode) {
        this.setupParentData(child);
        super.adoptChild(child);
    }

    protected _insertIntoChildList(child: Widget, after?: Widget) {
        assert(this.hasId(child.id), `不能插入相同的ID [${child.id}], 请及时修改`);
        this.appendId(child.id);
        super._insertIntoChildList(child, after);
    }

    hasId(id: string) {
        return this.#ids.indexOf(id) > -1;
    }

    appendId(id: string) {
        if (this.hasId(id)) return
        this.#ids.push(id);
    }
}
