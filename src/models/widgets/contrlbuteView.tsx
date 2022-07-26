import { WidgetOptions } from "@layout/core/layout";
import { TreeWidget } from "@widgets/treeWidget";
import syncAttr from "@models/syncManage/manage";
import { layoutToJson, syncsToJson } from "@models/factory/toJson";
import { Node } from "@models/factory/types";
import { widgetType } from "@models/factory/widgetTypeClassManage";
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype";
import { action, observable } from "mobx";
import { mobxTrackStates } from "@models/owners";
import { ContrlbuteViewRender } from "@components/container/layoutPage/rightContainer/widgets/contrlbuteView";


export interface ContrlbuteViewWidgetOptions extends WidgetOptions{
    // 粉丝宽度
    fansWidth?: number
    // 粉丝边框宽度
    fansBorderWidth?: number
    // 粉丝边距
    fansEdgeInsets?: number
}

/**
 * 三人贡献榜
 */
@widgetType('contributeView', {label: '三人贡献榜'})
export class ContributeViewWidget extends TreeWidget {
    type: string = 'contributeView'
    // 粉丝宽度
    @syncAttr({ key: 'contributeView', label: '粉丝宽度'})
    fansWidth?: number | string
    // 粉丝边框宽度
    @syncAttr({ key: 'contributeView', label: '粉丝边框宽度'})
    fansBorderWidth?: number | string
    // 粉丝边距
    @syncAttr({ key: 'contributeView', value: 'fansMargin', label: '粉丝外边距'})
    fansEdgeInsets?: number | string

    constructor({
        fansWidth,
        fansBorderWidth,
        fansEdgeInsets,
        ...superOptions
    }: ContrlbuteViewWidgetOptions) {
        super(superOptions);
        this.fansWidth = fansWidth;
        this.fansBorderWidth = fansBorderWidth;
        this.fansEdgeInsets = fansEdgeInsets;
        makeObservableWithWidget(this, {
            fansWidth: observable,
            fansBorderWidth: observable,
            fansEdgeInsets: observable,
            
            setFansEdgeInsets: action,
            setFansBorderWidth: action,
            setFansWidth: action,

        });
        this.registerTracks();
    }

    /**
     * @override
     */
    registerTracks(): void {
        // 注册undo/redo
        mobxTrackStates(this, [
            { read: () => this.fansWidth, write: (width: number) => this.setFansWidth(width) },
            { read: () => this.fansBorderWidth, write: (width: number) => this.setFansBorderWidth(width) },
            { read: () => this.fansEdgeInsets, write: (edge: number) => this.setFansEdgeInsets(edge) },
        ]);
        super.registerTracks();
    }

    setFansEdgeInsets(edge: number | string) {
        this.fansEdgeInsets = edge;
    }

    setFansBorderWidth(width?: number | string) {
        this.fansBorderWidth = width;
    }

    setFansWidth(width?: number | string) {
        this.fansWidth = width;
    }
    
    toJson(): Partial<Node> {
        const childrenJson: Array<Node> = [];
        this.visitChildren(child => {
            const currChild = child as TreeWidget;
            childrenJson.push(currChild.toJson() as Node);
        });

        return {
            id: this.id,
            name: this.type,
            desc: this.name,
            prop: {
                layout: layoutToJson(this),
                isDispatchOnClickEvent: this.attachOnClick,
                visible: this.visible,
                fansWidth: this.fansWidth,
                fansBorderWidth: this.fansBorderWidth,
                fansMargin: this.fansEdgeInsets
            },
            child: childrenJson,
            data: syncsToJson(this),
        };
    }

    render() {
        return <ContrlbuteViewRender />
    }
}
