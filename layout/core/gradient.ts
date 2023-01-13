import Color from "@layout/utils/color";
import { Alignment } from "./alignment";
import { assert } from "./assert";

export enum TileMode {
    /**
     * ![](https://flutter.github.io/assets-for-api-docs/assets/dart-ui/tile_mode_clamp_linear.png)
     * ![](https://flutter.github.io/assets-for-api-docs/assets/dart-ui/tile_mode_clamp_radial.png)
     */
    clamp,
    /**
     * ![](https://flutter.github.io/assets-for-api-docs/assets/dart-ui/tile_mode_repeated_linear.png)
     * ![](https://flutter.github.io/assets-for-api-docs/assets/dart-ui/tile_mode_repeated_radial.png) 
     */
    repeated,
    /**
     * ![](https://flutter.github.io/assets-for-api-docs/assets/dart-ui/tile_mode_mirror_linear.png)
     * ![](https://flutter.github.io/assets-for-api-docs/assets/dart-ui/tile_mode_mirror_radial.png)
     */
    mirror,
    decal
}

export abstract class Gradient {
    /**
     * 颜色列表设置为Color类来承载颜色
     * @param colors - 颜色列表
     */
    constructor(
        public colors: Array<Color>,
        public stops?: Array<number>,
    ) {}

    _impliedStops() {
        if (this.stops != null)
            return this.stops!;
        assert(this.colors.length >= 2, 'colors list must have at least two colors');
        const separation = 1.0 / (this.colors.length - 1);
        return this.colors.map((color: Color, index: number) => index * separation)
    }
}

/**
 * 目前线性渐变没这么复杂  简单声明占位
 */
export class LinearGradient extends Gradient {
    constructor(
        public begin: Alignment = Alignment.centerLeft,
        public end: Alignment = Alignment.centerRight,
        public colors: Array<Color>,
        public stops?: Array<number>,
        public tileMode: TileMode = TileMode.clamp
    ) {
        super(colors, stops);
    }
}


export enum Direction {
    toRight,
    toBottom
}

export class LinearGradientdirection extends Gradient {

    constructor(
        public direction: Direction = Direction.toRight,
        public colors: Array<Color>,
        public stops?: Array<number>
    ){
        super(colors, stops);
    }
}



