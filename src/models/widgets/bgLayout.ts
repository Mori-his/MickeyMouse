import { Border, BorderRadius, BorderSide } from "@layout/core/boxBorder";
import { LinearGradientdirection } from "@layout/core/gradient";
import { WidgetOptions } from "@layout/core/layout"
import { TreeWidget } from "@widgets/treeWidget";
import syncAttr from "@models/syncManage/manage";
import Color from "@layout/utils/color";
import { backgroundToJson, borderToJson, layoutToJson, syncsToJson } from "@models/factory/toJson";
import { Node } from "@models/factory/types";
import { widgetType } from "@models/factory/widgetTypeClassManage";
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype";
import { action, observable } from "mobx";
import { Exterior } from "./interface/widgetInterface";
import { mobxTrackStates } from "@models/owners";


export interface BgLayoutWidgetOptions extends WidgetOptions{
    background?: Color | LinearGradientdirection
    fillet?: BorderRadius
    border?: Border
    activeBorder?: boolean
}

@widgetType('bgLayout', { label: '背景布局', icon: 'background_text'})
export class BgLayoutWidget extends TreeWidget implements Exterior {
    type: string = 'bgLayout'
    // @syncAttr({ key: 'bgLayout'})
    background: Color | LinearGradientdirection
    // @syncAttr({ key: 'bgLayout'})
    fillet: BorderRadius
    // @syncAttr({ key: 'bgLayout'})
    border: Border
    // @syncAttr({ key: 'bgLayout'})
    activeBackground!: boolean;
    // @syncAttr({ key: 'bgLayout'})
    activeBorder!: boolean;

    constructor({
        fillet = new BorderRadius({}),
        background,
        border,
        activeBorder,
        ...superOptions
    }: BgLayoutWidgetOptions) {
        super(superOptions);
        this.fillet = fillet;
        this.background = background || new Color(0, 0, 100, 1);
        this.border = border || new Border(
            Border.fromBorderSide(
                new BorderSide({
                    color: new Color(0, 0, 100, 1),
                })
            )
        );
        this.activeBackground = Boolean(background);
        this.activeBorder = Boolean(activeBorder);
        makeObservableWithWidget(this, {
            fillet: observable,
            border: observable,
            background: observable,
            activeBackground: observable,
            activeBorder: observable,
            setBorder: action,
            setFillet: action,
            setBackground: action,
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
            },
            child: childrenJson,
            data: syncsToJson(this),
        };
    }
}