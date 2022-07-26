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
import { LottieRender } from "@components/container/layoutPage/rightContainer/widgets/lottie";


export interface LottieWidgetOptions extends WidgetOptions{
    src?: string
}

/**
 * json动画
 */
@widgetType('lottie', {icon: 'lottie_text', label: 'JSON动画'})
export class LottieWidget extends TreeWidget implements SourceSrc {
    type: string = 'lottie'
    @syncAttr({ key: 'lottie', value: 'url', label: '动画地址'})
    src?: string

    constructor({
        src,
        ...superOptions
    }: LottieWidgetOptions) {
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
                src: this.src
            },
            child: childrenJson,
            data: syncsToJson(this),
        }
    }

    render() {
        return <LottieRender />;
    }
}
