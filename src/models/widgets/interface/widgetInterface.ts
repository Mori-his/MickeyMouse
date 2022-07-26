import { Border, BorderRadius, BorderSide } from "@layout/core/boxBorder"
import { LinearGradientdirection } from "@layout/core/gradient"
import { TreeWidget } from "@widgets/treeWidget";
import Color from "@layout/utils/color"


export enum IMAGE_FIT {
    COVER = 0, // 缩放后截取中间部分显示，不会变形，会有缺失，常用
    CONTAIN = 1, // 有留白，不会变形
    FILL = 2, // 铺满，会变形
}

// 外观
export abstract class Exterior extends TreeWidget {
    abstract activeBackground: boolean
    abstract activeBorder: boolean
    abstract background: Color | LinearGradientdirection
    abstract fillet: BorderRadius
    abstract border: Border

    abstract setActiveBackground(active: boolean): void
    abstract setActiveBorder(active: boolean): void
    abstract setBackground(color: Color | LinearGradientdirection): void
    abstract setFillet(fillet: BorderRadius): void
    abstract setBorder(side: BorderSide): void
}

export interface SourceSrc {
    src?: string
    setSrc(src?: string): void
}

export interface Effects extends SourceSrc, TreeWidget {
    blur?: boolean
    fit: IMAGE_FIT
    fillet?: BorderRadius
    border?: Border
    // borderColor?: Color
    setBlur(blur: boolean): void
    setFit(fit: IMAGE_FIT): void
    setFillet(fillet: BorderRadius): void
    setBorder(side: BorderSide): void
    // setBorderColor(color: Color): void
}
