import { Border, BorderRadius, BorderSide } from "@layout/core/boxBorder";
import { LinearGradientdirection } from "@layout/core/gradient";
import { WidgetOptions } from "@layout/core/layout";
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
import { ObserveBorder } from "./observeLayout/observeBorder";
import { Constructor } from "@/types/types";


export interface ViewWidgetOptions extends WidgetOptions{
    fillet?: BorderRadius
    border?: Border
    activeBorder?: boolean
    background?: Color | LinearGradientdirection
}


@widgetType('view', {icon: 'view_text', label: '视图'})
export class ViewWidget extends ObserveBorder(TreeWidget as Constructor<TreeWidget>) implements Exterior {
    type: string = 'view'

    background: Color | LinearGradientdirection
    fillet: BorderRadius
    activeBackground: boolean;

    constructor({
        fillet = new BorderRadius({}),
        // border,
        background,
        // activeBorder,
        ...superOptions
    }: ViewWidgetOptions) {
        super(superOptions);
        this.fillet = fillet;
        this.background = background || new Color(0, 0, 100, 1);
        this.activeBackground = Boolean(background);
        makeObservableWithWidget(this, {
            fillet: observable,
            background: observable,
            activeBackground: observable,
            setBackground: action,
            setFillet: action,
            setActiveBackground: action,
            ...super.registerObservable(),
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
            // { read: () => this.border, write: (border: Border) => this.setBorder(border) },
            { read: () => this.background, write: (color: Color | LinearGradientdirection) => this.setBackground(color) },
            { read: () => this.activeBackground, write: (active: boolean) => this.setActiveBackground(active) },
            // { read: () => this.activeBorder, write: (active: boolean) => this.setActiveBorder(active) },
        ]);
        super.registerTracks();
    }
    setActiveBackground(active: boolean): void {
        this.activeBackground = active;
    }
    // setActiveBorder(active: boolean): void {
    //     this.activeBorder = active;
    // }

    // setBorder(side: BorderSide | Border) {
    //     if (side instanceof Border) {
    //         this.border = side;
    //     } else {
    //         this.border = Border.fromBorderSide(side);
    //     }
    // }

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
        const round = borderToJson(this.border, this.fillet, this.activeBorder);

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

// export const ObserveViewWidget = ObserveBorder(ViewWidget);
