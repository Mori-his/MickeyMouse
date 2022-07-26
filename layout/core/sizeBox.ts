import BasicNode from "./object";

export interface ISize {
    width: number | string
    height: number | string
    setWidth(width: number | string): void
    setHeight(height: number | string): void
}
export class Size implements ISize {
    constructor(public width: number | string = '', public height: number | string = '') {}

    setWidth(width: number | string) {
        this.width = width || '';
    }

    setHeight(height: number | string) {
        this.height = height || '';
    }

    static zero() {
        return new Size(0, 0);
    }
}

export interface IAdaptiveSizeProps {
    size: Size,
    widthAdaptive?: boolean
    heightAdaptive?: boolean
}

export interface  IAdaptiveSize extends ISize {
    widthAdaptive?: boolean
    heightAdaptive?: boolean
    setWidthAdaptive(widthAdaptive: boolean): void
    setHeightAdaptive(heightAdaptive: boolean): void
    registerTracks?(widget: BasicNode): void
}
export class AdaptiveSize extends Size implements IAdaptiveSize {
    widthAdaptive?: boolean
    heightAdaptive?: boolean

    constructor({
        size,
        widthAdaptive,
        heightAdaptive
    }: IAdaptiveSizeProps) {
        super(size.width, size.height);
        this.widthAdaptive = Boolean(widthAdaptive);
        this.heightAdaptive = Boolean(heightAdaptive);
    }

    setWidthAdaptive(widthAdaptive: boolean) {
        this.widthAdaptive = widthAdaptive;
    }
    setHeightAdaptive(heightAdaptive: boolean) {
        this.heightAdaptive = heightAdaptive;
    }
}