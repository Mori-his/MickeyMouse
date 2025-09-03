import { Border, BorderRadius, BorderSide } from "@layout/core/boxBorder";
import { LinearGradientdirection } from "@layout/core/gradient";
import { WidgetOptions } from "@layout/core/layout";
import Color from "@layout/utils/color";
import { backgroundToJson, borderToJson, layoutToJson, syncsToJson } from "@models/factory/toJson";
import { Node } from "@models/factory/types";
import { widgetType } from "@models/factory/widgetTypeClassManage";
import { mobxTrackStates } from "@models/owners";
import syncAttr from "@models/syncManage/manage";
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype";
import { action, observable } from "mobx";
import { Exterior } from "./interface/widgetInterface";
import { TreeWidget } from "./treeWidget";


export interface ContainerWidgetOptions extends WidgetOptions {
    usedBy: string
    fillet?: BorderRadius
    border?: Border
    activeBorder?: boolean
    background?: Color | LinearGradientdirection
}


export enum EUsedBy {
    AGORA_GAME = 'agora_game'
}

export type TUsedBy = {
    value: EUsedBy
    label: string
}

export const usedBys: TUsedBy[] = [
    {
        value: EUsedBy.AGORA_GAME,
        label: '声网互动游戏'
    }
]

// 可以继承ViewWidget

@widgetType('container', {label: '容器组件', icon: 'widget_text'})
export class ContainerWidget extends TreeWidget implements Exterior {
    type: string = 'container';
    // 使用此容器的对象
    @syncAttr({ key: 'container', label: '使用此容器的对象'})
    usedBy: TUsedBy = usedBys[0];

    background: Color | LinearGradientdirection
    fillet: BorderRadius
    border: Border
    activeBackground: boolean;
    activeBorder: boolean;

    constructor({
        usedBy,
        fillet = new BorderRadius({}),
        border,
        activeBorder,
        background,
        ...otherProps
    }: ContainerWidgetOptions) {
        super(otherProps);

        this.usedBy = usedBy ? usedBys.find(item => item.value === usedBy) || usedBys[0] : usedBys[0];
        this.fillet = fillet;
        this.border = border || new Border(
            Border.fromBorderSide(
                new BorderSide({
                    color: new Color(0, 0, 100, 1),
                })
            )
        );
        this.background = background || new Color(0, 0, 100, 1);
        this.activeBackground = Boolean(background);
        this.activeBorder = Boolean(activeBorder);
        makeObservableWithWidget(this, {
            usedBy: observable,
            fillet: observable,
            border: observable,
            background: observable,
            activeBackground: observable,
            activeBorder: observable,
            setBorder: action,
            setBackground: action,
            setFillet: action,
            setActiveBackground: action,
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
            { read: () => this.fillet, write: (fillet: BorderRadius) => this.setFillet(fillet) },
            { read: () => this.border, write: (border: Border) => this.setBorder(border) },
            { read: () => this.background, write: (color: Color | LinearGradientdirection) => this.setBackground(color) },
            { read: () => this.activeBackground, write: (active: boolean) => this.setActiveBackground(active) },
            { read: () => this.activeBorder, write: (active: boolean) => this.setActiveBorder(active) },
            { read: () => this.usedBy, write: (newState: TUsedBy) => this.setUsedBy(newState) },
        ]);
        super.registerTracks();
    }
    setActiveBackground(active: boolean): void {
        this.activeBackground = active;
    }
    setActiveBorder(active: boolean): void {
        this.activeBorder = active;
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

    setUsedBy(newState: TUsedBy) {
        this.usedBy = newState;
    }


    toJson(): Partial<Node> {
        const childrenJson: Array<Node> = [];
        this.visitChildren(child => {
            const currChild = child as TreeWidget;
            childrenJson.push(currChild.toJson() as Node);
        });
        let background: any = {};
        if (this.activeBackground) {
            background = backgroundToJson(this.background);
        }
        let round: any = borderToJson(
            this.border,
            this.fillet,
            this.activeBorder
        );
        return {
            id: this.id,
            name: this.type,
            desc: this.name,
            prop: {
                layout: layoutToJson(this),
                ...background,
                ...round,
                isDispatchOnClickEvent: this.attachOnClick,
                visible: this.visible,
                usedBy: this.usedBy.value
            },
            child: childrenJson,
            data: syncsToJson(this),
        };
    }
}

