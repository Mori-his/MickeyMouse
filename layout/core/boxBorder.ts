import Color from "@layout/utils/color"
import { assert } from "./assert"


export enum BorderStyle {
    none,
    solid,
}

export type BorderSideProps = {
    color?: Color
    width?: number | string
    style?: BorderStyle
}

export class BorderSide {
    color: Color
    width: number | string
    style: BorderStyle

    constructor({
        color = new Color(0, 0, 0, 1),
        width = '',
        style = BorderStyle.solid,
    }: BorderSideProps) {
        this.color = color;
        this.width = width;
        this.style = style;
    }

    copyWith({
        color,
        width,
        style,
    }: BorderSideProps) {
        assert(!width || width >= 0);
        return new BorderSide({
            color: color || this.color,
            width: width || this.width,
            style: style || this.style,
        });
    }
}


export type BorderAttr = {
    top: BorderSide
    right: BorderSide
    bottom: BorderSide
    left: BorderSide
}

export type BorderProps = BorderAttr

export interface BoxBorder extends Partial<BorderAttr> {
}

export class Border implements BoxBorder {
    top: BorderSide
    right: BorderSide
    bottom: BorderSide
    left: BorderSide
    
    constructor({
        top,
        right,
        bottom,
        left,
    }: BorderProps) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }

    static fromBorderSide(side: BorderSide) {
        assert(side);
        return new Border({
            top: side,
            right: side,
            bottom: side,
            left: side,
        });
    }

    static symmetric(vertical: BorderSide, horizontal: BorderSide) {
        assert(vertical);
        assert(horizontal);
        return new Border({
            top: horizontal,
            right: vertical,
            bottom: horizontal,
            left: vertical,
        });
    }

    static all(
        color: Color = new Color(0, 0, 0, 1),
        width: number = 1,
        style: BorderStyle
    ) {
        const side: BorderSide = new BorderSide({
            color: color,
            width: width,
            style: style
        });
        return Border.fromBorderSide(side);
    }
}


export class Radius {
    constructor(public x: number | null, public y: number | null) {}

    static circular(radius: number | null){
        return this.elliptical(radius, radius);
    }
  
    static elliptical(x: number | null, y: number | null) {
        return new Radius(x, y);
    }

    static zero = Radius.circular(0);
}

export type BorderRadiusAttr = {
    topLeft: Radius
    topRight: Radius
    bottomLeft: Radius
    bottomRight: Radius
}

export type BorderRadiusProps = Partial<BorderRadiusAttr>;

export class BorderRadius {
    topLeft?: Radius
    topRight?: Radius
    bottomLeft?: Radius
    bottomRight?: Radius

    constructor({
        topLeft,
        topRight,
        bottomLeft,
        bottomRight,
    }: BorderRadiusProps) {
        this.topLeft = topLeft
        this.topRight = topRight
        this.bottomLeft = bottomLeft
        this.bottomRight = bottomRight
    }

    static all(radius: Radius) {
        return new BorderRadius({
            topLeft: radius,
            topRight: radius,
            bottomLeft: radius,
            bottomRight: radius,
        });
    }

    static vertical(
        top: Radius = Radius.zero,
        bottom: Radius = Radius.zero
    ) {
        return new BorderRadius({
            topLeft: top,
            topRight: top,
            bottomLeft: bottom,
            bottomRight: bottom,
        });
    }

    static horizontal(
        left: Radius = Radius.zero,
        right: Radius = Radius.zero
    ) {
        return new BorderRadius({
            topLeft: left,
            topRight: right,
            bottomLeft: left,
            bottomRight: right,
        });
    }

    copyWith({
        topLeft,
        topRight,
        bottomLeft,
        bottomRight,
    }: BorderRadiusProps) {
        return new BorderRadius({
            topLeft: topLeft || this.topLeft,
            topRight: topRight || this.topRight,
            bottomLeft: bottomLeft || this.bottomLeft,
            bottomRight: bottomRight || this.bottomRight,
        });
    }


}





