import BasicNode from "./object"

export type AllProps = {
    left: number | string
    top: number | string
    right: number | string
    bottom: number | string
}
export interface IPosition {
    left?: number | string
    top?: number | string
    right?: number | string
    bottom?: number | string
    setLeft(left?: number | string): void
    setTop(top?: number | string): void
    setRight(right?: number | string): void
    setBottom(bottom?: number | string): void
    setOnly(props: AllProps): void
}

export class Position implements IPosition {
    left: number | string
    top: number | string
    right: number | string
    bottom!: number | string
    constructor(allProps: AllProps) {
        this.left = allProps.left;
        this.top = allProps.top;
        this.right = allProps.right;
        this.bottom = allProps.bottom;
    }

    setLeft(left: number | string): void {
        this.left = left;
    }

    setTop(top: number | string): void {
        this.top = top;
    }

    setRight(right: number | string): void {
        this.right = right;
    }

    setBottom(bottom: number | string): void {
        this.bottom = bottom;
    }

    setOnly({top, right, bottom, left}: AllProps) {
        this.setTop(top);
        this.setRight(right);
        this.setBottom(bottom);
        this.setLeft(left);
    }
}

export interface IAdaptivePosition extends IPosition {
    horizontal?: boolean
    vertical?: boolean
    setHorizontal(horizontal: boolean): void
    setVertical(vertical: boolean): void
    registerTracks?(widget: BasicNode): void
}

export type AdaptivePositionOptions = {
    position: AllProps,
    horizontal?: boolean,
    vertical?: boolean
}

export class AdaptivePosition extends Position implements IAdaptivePosition {
    horizontal?: boolean;
    vertical?: boolean;

    constructor({
        position,
        horizontal,
        vertical
    }: AdaptivePositionOptions) {
        super(position);
        this.horizontal = horizontal;
        this.vertical = vertical;
    }
    setHorizontal(horizontal: boolean) {
        this.horizontal = horizontal;
    }
    setVertical(vertical: boolean) {
        this.vertical = vertical;
    }
}