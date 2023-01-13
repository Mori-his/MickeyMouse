import { Border, BorderRadius, BorderSide } from "@layout/core/boxBorder"
import { LinearGradientdirection } from "@layout/core/gradient"
import { WidgetOptions } from "@layout/core/layout"
import { TreeWidget } from "@widgets/treeWidget";
import Color from "@layout/utils/color"
import { backgroundToJson, borderToJson, layoutToJson, syncsToJson } from "@models/factory/toJson"
import { Node, TSetting } from "@models/factory/types"
import { widgetType } from "@models/factory/widgetTypeClassManage"
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype"
import { action, makeObservable, observable } from "mobx"
import { Exterior } from "./interface/widgetInterface"
import { mobxTrackStates } from "@models/owners";
import { assert } from "@layout/core/assert";
import { isNull, isUndefined, omitBy } from "lodash";
import { RootRender } from "@components/container/layoutPage/rightContainer/widgets/root";


export interface RootWidgetOptions extends WidgetOptions{
    gameId?: number | string
    config?: string
    h5Data?: Object
    fillet?: BorderRadius
    background?: Color
    border?: Border
    activeBorder?: boolean
    contentHeight?: string | number
    minMsgsViewHeight?: string | number
    chatAreaMarginTop?: string | number
    layoutBySafeArea?: string | number
    canvasMargin?: ECanvasMargin
}

// 玩法列表
export const Games = [
    { label: '非玩法', value: 0 },
    { label: '团战PK', value: 3 },
    { label: '谁是卧底', value: 5 },
    { label: '你画我猜', value: 6 },
    { label: '抢占C位', value: 7 },
    { label: '跳一跳', value: 8 },
    { label: '连连看', value: 9 },
    { label: '摩登大厦', value: 10 },
    { label: '记忆卡', value: 11 },
    { label: '拍卖', value: 12 },
    { label: '团战pk-v2', value: 13 },
    { label: '睡吧', value: 15 },
    { label: '简易拍卖', value: 16 }
]

// canvasMargin枚举类型
export enum ECanvasMargin {
    CNS_DOWN_START = 0,
    SCREEN_TOP_START = 1
}

// canvasMargins可选列表
export const canvasMargins = [
    { value: ECanvasMargin.CNS_DOWN_START, label: '画布上边距', description: '可选，端上默认从台标下开始画布局。可选贴着屏幕顶开始画' },
    { value: ECanvasMargin.SCREEN_TOP_START, label: '从屏幕顶部边缘开始画', description: '可选，端上默认从台标下开始画布局。可选贴着屏幕顶开始画' }
]



export class RootSetting {

    contentHeight!: string | number
    minMsgsViewHeight!: string | number
    chatAreaMarginTop!: string | number
    // 未开发setter/getter
    // 是否从安全区以下开始布局。默认是true
    layoutBySafeArea?: string | number
    canvasMargin?: ECanvasMargin | null

    constructor(settings: TSetting) {
        Object.assign(this, settings);
        makeObservable(this, {
            contentHeight: observable,
            minMsgsViewHeight: observable,
            chatAreaMarginTop: observable,
            canvasMargin: observable,
            setContentHeight: action,
            setMinMsgsViewHeight: action,
            setChatAreaMarginTop: action,
            setCanvasMargin: action,
        });
    }

    setContentHeight(height: string | number) {
        // "minimum": 100,
        // "maximum": 3000,
        // assert(height < 100, '实际内容高度不能小于100');
        // assert(height > 3000, '实际内容高度不能大于3000');
        this.contentHeight = height;
    }
    
    setMinMsgsViewHeight(height: string | number) {
        // assert(height < 0, '弹幕区最小高度不能小于0');
        // assert(height > 1000, '弹幕区最小高度不能大于1000');
        this.minMsgsViewHeight = height;
    }
    
    setChatAreaMarginTop(top: string | number) {
        // assert(top < 0, '弹幕上边界距布局顶的高度不能小于0');
        // assert(top > 1000, '弹幕上边界距布局顶的高度不能大于1000');
        this.chatAreaMarginTop = top;
    }

    setCanvasMargin(marginType?: ECanvasMargin | null) {
        this.canvasMargin = marginType;
    }

    toJson() {
        return omitBy({
            contentHeight: this.contentHeight,
            minMsgsViewHeight: this.minMsgsViewHeight,
            chatAreaMarginTop: this.chatAreaMarginTop,
            layoutBySafeArea: this.layoutBySafeArea,
            canvasMargin: this.canvasMargin,
        }, value => isUndefined(value) || isNull(value));
    }
}




@widgetType('root', {label: '根节点'})
export class RootWidget extends TreeWidget implements Exterior {
    type: string = 'root'
    
    // 禁止移动
    __forbidMove: boolean = true;
    // 是否允许有兄弟节点
    allowSibling: boolean = false;
    
    // 游戏ID 只有Root节点存在
    gameId: number | string = 0
    // h5配置项 -> h5config
    config?: string
    // 圆角
    fillet: BorderRadius
    border: Border
    background: Color | LinearGradientdirection

    activeBackground: boolean
    activeBorder: boolean

    h5Data: Object = {}

    setting!: RootSetting

    constructor({
        gameId = 0,
        config = '',
        h5Data = {},
        fillet = new BorderRadius({}),
        border,
        activeBorder,
        background,
        contentHeight = 460,
        minMsgsViewHeight = 170,
        layoutBySafeArea = '1',
        chatAreaMarginTop,
        canvasMargin,
        ...superOptions
    }: RootWidgetOptions) {
        super(superOptions);
        this.gameId = gameId;
        this.config = config;
        this.h5Data = h5Data;
        this.fillet = fillet;
        this.setting = new RootSetting({
            contentHeight,
            minMsgsViewHeight,
            chatAreaMarginTop,
            layoutBySafeArea,
            canvasMargin,
        });
        this.border = border || new Border(
            Border.fromBorderSide(
                new BorderSide({
                    color: new Color(0, 0, 100, 1),
                })
            )
        );
        // 这里的“或”是为了activeBackground是否被选中而故意而为之的
        this.background = background || new Color(0, 0, 100, 1);
        this.activeBackground = Boolean(background);
        this.activeBorder = Boolean(activeBorder);
        makeObservableWithWidget(this, {
            gameId: observable,
            config: observable,
            h5Data: observable,
            border: observable,
            fillet: observable,
            background: observable,
            activeBackground: observable,
            activeBorder: observable,
            setFillet: action,
            setBorder: action,
            setGameId: action,
            setConfig: action,
            setH5Data: action,
            setBackground: action,
            setActiveBackground: action,
            setActiveBorder: action,
        }, {
            deep: true
        });
        this.registerTracks();
    }

    /**
     * @override
     */
    registerTracks(): void {
        // 注册undo/redo
        mobxTrackStates(this, [
            { read: () => this.gameId, write: (gameId: string) => this.setGameId(gameId) },
            { read: () => this.config, write: (config: string) => this.setConfig(config) },
            { read: () => this.h5Data, write: (h5Data: Object) => this.setH5Data(h5Data) },
            { read: () => this.border, write: (side: Border) => this.setBorder(side) },
            { read: () => this.fillet, write: (fillet: BorderRadius) => this.setFillet(fillet) },
            { read: () => this.background, write: (color: Color | LinearGradientdirection) => this.setBackground(color) },
            { read: () => this.activeBackground, write: (active: boolean) => this.setActiveBackground(active) },
            { read: () => this.activeBorder, write: (active: boolean) => this.setActiveBorder(active) },
        ]);
        super.registerTracks();
    }
    
    setGameId(newId: string | number) {
        this.gameId = newId;
    }

    setConfig(config?: string) {
        this.config = config;
    }

    setH5Data(data: Object) {
        this.h5Data = data;
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

    setBackground(color: Color | LinearGradientdirection) {
        this.background = color;
    }


    setActiveBackground(active: boolean): void {
        this.activeBackground = active;
    }
    setActiveBorder(active: boolean): void {
        this.activeBorder = active;
    }

    toJson(): Partial<Node> {
        const childrenJson: Array<Node> = [];
        const backgroundLayout: { bgLayout?: Node } = {};
        this.visitChildren(child => {
            const currChild = child as TreeWidget;
            if (currChild.type === 'bgLayout') {
                backgroundLayout.bgLayout = currChild.toJson() as Node;
            } else {
                childrenJson.push(currChild.toJson() as Node);
            }
        });
        let background: any = {};
        if (this.activeBackground) {
            background = backgroundToJson(this.background);
        }
        const round: any = borderToJson(this.border, this.fillet, this.activeBorder);

        return {
            id: this.id,
            name: this.type,
            game: this.gameId,
            desc: this.name,
            h5Config: this.config,
            h5Data: this.h5Data,
            ...backgroundLayout,
            prop: {
                layout: layoutToJson(this),
                ...background,
                ...round,
                isDispatchOnClickEvent: this.attachOnClick,
                visible: this.visible,
            },
            child: childrenJson,
            setting: this.setting.toJson(),
            data: syncsToJson(this),
        };
    }

    render() {
        return <RootRender />
    }
}
