import { Border, BorderRadius, BorderSide } from "@layout/core/boxBorder"
import { LinearGradientdirection } from "@layout/core/gradient"
import { WidgetOptions } from "@layout/core/layout"
import { TreeWidget } from "@widgets/treeWidget";
import Color from "@layout/utils/color"
import { backgroundToJson, borderToJson, layoutToJson, syncsToJson } from "@models/factory/toJson"
import { Node } from "@models/factory/types"
import { widgetType } from "@models/factory/widgetTypeClassManage"
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype"
import { action, observable } from "mobx"
import { Exterior } from "./interface/widgetInterface"
import { mobxTrackStates } from "@models/owners";


export interface RootWidgetOptions extends WidgetOptions{
    gameId?: number | string
    config?: string
    h5Data?: Object
    fillet?: BorderRadius
    background?: Color
    border?: Border
}


@widgetType('root', {label: '根节点'})
export class RootWidget extends TreeWidget implements Exterior {
    type: string = 'root'
    
    // 禁止移动
    __forbidMove: boolean = true;
    // 是否允许有兄弟节点
    allowSibling: boolean = false;
    
    // 游戏ID 只有Root节点存在
    gameId?: number | string
    // h5配置项 -> h5config
    config?: string
    /**
     * 圆角
     */
    fillet: BorderRadius
    border: Border
    background: Color | LinearGradientdirection

    activeBackground: boolean
    activeBorder: boolean

    h5Data: Object = {}

    constructor({
        gameId = 0,
        config = '',
        h5Data = {},
        fillet = new BorderRadius({}),
        border,
        background,
        ...superOptions
    }: RootWidgetOptions) {
        super(superOptions);
        this.gameId = gameId;
        this.config = config;
        this.h5Data = h5Data;
        this.fillet = fillet;
        this.border = border || new Border(
            Border.fromBorderSide(
                new BorderSide({
                    color: new Color(0, 0, 100, 1),
                    width: 1
                })
            )
        );
        this.background = background || new Color(0, 0, 100, 1);
        this.activeBackground = Boolean(background);
        this.activeBorder = Boolean(border);
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
    
    setGameId(newId?: string | number) {
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
        let round: any = {}
        if (this.activeBorder) {
            round = borderToJson(this.border, this.fillet);
        }

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
            data: syncsToJson(this),
        };
    }
}
