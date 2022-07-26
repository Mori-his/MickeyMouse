import { WidgetOptions } from "@layout/core/layout";
import { TreeWidget } from "@widgets/treeWidget";
import syncAttr from "@models/syncManage/manage";
import { layoutToJson, syncsToJson } from "@models/factory/toJson";
import { Node } from "@models/factory/types";
import { widgetType } from "@models/factory/widgetTypeClassManage";
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype";
import { action, observable } from "mobx";
import { SourceSrc } from "./interface/widgetInterface";
import { mobxTrackStates } from "@models/owners";
import { FollowButtonRender } from "@components/container/layoutPage/rightContainer/widgets/followButton";


export interface FollowButtonWidgetOptions extends WidgetOptions{
    src?: string
}

/**
 * 关注按钮
 */
@widgetType('followButton', {label: '关注按钮', icon: 'follow_text'})
export class FollowButtonWidget extends TreeWidget implements SourceSrc {
    type: string = 'followButton'
    @syncAttr({ key: 'followButton', label: '关注按钮图片'})
    src?: string

    constructor({
        src,
        ...superOptions
    }: FollowButtonWidgetOptions) {
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
            prop: {
                layout: layoutToJson(this),
                isDispatchOnClickEvent: this.attachOnClick,
                visible: this.visible,
                url: this.src
            },
            child: childrenJson,
            data: syncsToJson(this),
        }
    }
    
    render() {
        return <FollowButtonRender />
    }
}
