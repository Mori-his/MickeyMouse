import { WidgetOptions } from "@layout/core/layout";
import { TreeWidget } from "@widgets/treeWidget";
import syncAttr from "@models/syncManage/manage";
import { layoutToJson, syncsToJson } from "@models/factory/toJson";
import { Node } from "@models/factory/types";
import { widgetType } from "@models/factory/widgetTypeClassManage";
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype";
import { omitBy } from "lodash";
import { action, observable } from "mobx";
import { SourceSrc } from "./interface/widgetInterface";
import { mobxTrackStates } from "@models/owners";
import { KeyframeRender } from "@components/container/layoutPage/rightContainer/widgets/keyframe";


export interface KeyframeWidgetOptions extends WidgetOptions{
    src?: string
}

/**
 * 帧动画
 */
@widgetType('keyframe', {label: '帧动画', 'icon': 'keyframe_text'})
export class KeyframeWidget extends TreeWidget implements SourceSrc {
    type: string = 'keyframe'
    @syncAttr({ key: 'keyframe', value: 'url', label: '动画地址'})
    src?: string

    constructor({
        src,
        ...superOptions
    }: KeyframeWidgetOptions) {
        super(superOptions);
        this.src = src;
        makeObservableWithWidget(this, {
            src: observable,
            setSrc: action,
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
        ]);
        super.registerTracks();
    }
    setSrc(src?: string) {
        this.src = src;
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
            prop: omitBy({
                layout: layoutToJson(this),
                isDispatchOnClickEvent: this.attachOnClick,
                visible: this.visible,
                url: this.src
            }, item => item === ''),
            child: childrenJson,
            data: syncsToJson(this),
        }
    }

    render() {
        return <KeyframeRender />
    }
}
