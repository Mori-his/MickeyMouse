import { Border, BorderRadius, BorderSide } from "@layout/core/boxBorder";
import { WidgetOptions } from "@layout/core/layout";
import { TreeWidget } from "@widgets/treeWidget";
import syncAttr from "@models/syncManage/manage";
import Color from "@layout/utils/color";
import { borderToJson, layoutToJson, syncsToJson } from "@models/factory/toJson";
import { Node } from "@models/factory/types";
import { widgetType } from "@models/factory/widgetTypeClassManage";
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype";
import { omitBy } from "lodash";
import { action, observable } from "mobx";
import { Effects } from "./interface/widgetInterface";
import { mobxTrackStates } from "@models/owners";
import { Owner } from "@models/owners/owner";

export enum IMAGE_FIT {
    COVER = 0, // 缩放后截取中间部分显示，不会变形，会有缺失，常用
    CONTAIN = 1, // 有留白，不会变形
    FILL = 2, // 铺满，会变形
}

export interface ImageWidgetOptions extends WidgetOptions {
    src?: string
    blur?: boolean
    fit?: IMAGE_FIT
    fillet?: BorderRadius
    border?: Border
    activeBorder?: boolean
}

const defaultImageUrl: string[] = [
    'https://image.huajiao.com/282d7a42543a693df238be19391c20ad-100_100.jpg',
    'https://image.huajiao.com/2ef7bb264d134a46ee257d41a591505a-100_100.jpg',
    'https://image.huajiao.com/fec8ef91a4b2a57c99f9756fd2694e86-100_100.jpg',
    'https://image.huajiao.com/c3514822de1a993b51dce2e95537fbc0-100_100.jpg',
    'https://image.huajiao.com/d94dd1b8deaafa02624a24a288ac4ab1-100_100.jpg',
    'https://image.huajiao.com/8a72386b5ee2620b0d25e4ebd37e86d6-100_100.jpg',
    'https://image.huajiao.com/4a628b12530dbf0ee10dc828661274c1-100_100.jpg',
    'https://image.huajiao.com/4afeb3664ef4a593f3ee390c7e5667b9-100_100.jpg'
];

function getRandomImage() {
    const random = Math.random();
    const index = Math.floor(random * defaultImageUrl.length);
    return defaultImageUrl[index];
}


@widgetType('image', {label: '图片', icon: 'image_text'})
export class ImageWidget extends TreeWidget implements Effects {
    type: string = 'image'

    @syncAttr({ key: 'image', label: '图片地址'})
    src?: string
    @syncAttr({ key: 'image', label: '高斯模糊'})
    blur!: boolean
    @syncAttr({ key: 'image', value: 'mode', label: '显示模式'})
    fit!: IMAGE_FIT
    // @syncAttr({ key: 'image'})
    fillet: BorderRadius
    // @syncAttr({ key: 'image'})
    border: Border

    // @syncAttr({ key: 'image'})
    activeBorder!: boolean;


    private defaultImageSrc?: string

    constructor({
        src,
        blur = false,
        fit = IMAGE_FIT.COVER,
        fillet = new BorderRadius({}),
        border,
        activeBorder,
        ...superOptions
    }: ImageWidgetOptions) {
        super(superOptions);
        this.src = src;
        this.defaultImageSrc = src;

        this.blur = blur;
        this.fit = fit;
        this.fillet = fillet;
        this.border = border || Border.fromBorderSide(
            new BorderSide({
                color: new Color(0, 0, 100, 1),
            })
        );
        this.activeBorder = Boolean(activeBorder);
        makeObservableWithWidget(this, {
            src: observable,
            blur: observable,
            fit: observable,
            border: observable,
            fillet: observable,
            activeBorder: observable,
            setSrc: action,
            setBlur: action,
            setFit: action,
            setBorder: action,
            setFillet: action,
            setActiveBorder: action,
        });
        this.registerTracks();
    }
    /**
     * @override
     */
    registerTracks(): void {
        // 注册undo/redo
        mobxTrackStates(this, [
            { read: () => this.src, write: (src: string) => this.setSrc(src) },
            { read: () => this.blur, write: (blur: boolean) => this.setBlur(blur) },
            { read: () => this.fit, write: (fit: IMAGE_FIT) => this.setFit(fit) },
            { read: () => this.fillet, write: (fillet: BorderRadius) => this.setFillet(fillet) },
            { read: () => this.border, write: (border: Border) => (this.setBorder(border)) },
            { read: () => this.activeBorder, write: (active: boolean) => this.setActiveBorder(active) },
        ]);
        super.registerTracks();
    }

    setSrc(src?: string) {
        this.src = src;
        this.defaultImageSrc = src;
    }

    setBlur(blur: boolean) {
        this.blur = blur;
    }

    setFit(fit: IMAGE_FIT) {
        this.fit = fit;
    }

    setBorder(side: BorderSide | Border) {
        if (side instanceof Border) {
            this.border = side;
        } else {
            this.border = Border.fromBorderSide(side);
        }
    }

    setFillet(fillet: BorderRadius) {
        this.fillet = fillet;
    }
    setActiveBorder(active: boolean): void {
        this.activeBorder = active;
    }

    toJson(): Partial<Node> {
        const childrenJson: Array<Node> = [];
        this.visitChildren(child => {
            const currChild = child as TreeWidget;
            childrenJson.push(currChild.toJson() as Node);
        });
        const round: any = borderToJson(
            this.border,
            this.fillet,
            this.activeBorder,
        );

        const isAutoImage = (this.root as Owner)?.isAutoImage;

        if (!this.src && !this.defaultImageSrc && isAutoImage) {
            this.defaultImageSrc = getRandomImage();
        }

        return {
            id: this.id,
            name: this.type,
            desc: this.name,
            ___imageComponent: '',
            prop: {
                layout: layoutToJson(this),
                ...round,
                isDispatchOnClickEvent: this.attachOnClick,
                visible: this.visible,
                ...omitBy({
                    src: isAutoImage ? this.defaultImageSrc : this.src,
                    mode: this.fit,
                    blur: this.blur
                }, item => item === '')
            },
            child: childrenJson,
            data: syncsToJson(this),
        };
    }
}
