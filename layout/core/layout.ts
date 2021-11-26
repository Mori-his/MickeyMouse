
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
        public left: number | null,
        public top: number | null,
        public right: number | null,
        public bottom: number | null
    ) {

    }

    static origin() {
        return new Position(0, 0, null, null);
    }
}

type AdaptivePositionOptions = {
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

class LayoutParentData extends ParentData {
    size: Size = Size.zero();
    position: Position = new Position(null, null, null, null)
    toString() {
        return `
            width: ${this.size.width}
            height: ${this.size.height}
            left: ${this.position.left}
            top: ${this.position.top}
            right: ${this.position.right}
            bottom: ${this.position.bottom}
        `
    }
}

class Layout extends BasicNode {
    constructor() {
        super();
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



type ImageWidgetVisitor = (child: ImageWidget) => any;

export class ImageParentData extends ContainerParentDataMixin<Layout>(LayoutParentData) {
    background?: string
}

export class ImageWidget extends ContainerNodeMixin<Layout, ImageParentData>(Layout) {
    

    
}








// export default applyMixins(Layout, [AdaptivePosition, AdaptiveBox]);

