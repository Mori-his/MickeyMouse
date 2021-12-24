import { TreeWidget, WidgetOptions } from "@layout/core/layout";
import syncAttr from "@layout/syncManage/manage";

export enum IMAGE_FIT {
    COVER = 0, // 缩放后截取中间部分显示，不会变形，会有缺失，常用
    CONTAIN = 1, // 有留白，不会变形
    FILL = 2, // 铺满，会变形
}

export interface ImageWidgetOptions extends WidgetOptions {
    src: string
    blur?: boolean
    fit?: IMAGE_FIT
}

export default class ImageWidget extends TreeWidget {
    @syncAttr
    src!: string
    @syncAttr
    blur!: boolean
    @syncAttr
    fit!: IMAGE_FIT
    type: string = 'image'
    constructor(options: ImageWidgetOptions) {
        super(options);
        this.src = options.src;
        this.blur = options.blur || false;
        this.fit = options.fit || IMAGE_FIT.COVER;
    }

    toJson() {
        return {};
    }
}
