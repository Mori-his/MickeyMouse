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
import { KeyframeProRender } from "@components/container/layoutPage/rightContainer/widgets/keyframePro";

export interface IKeyframeResourse {
    image?: string
    animation?: string
}


export interface KeyframeProWidgetOptions extends WidgetOptions{
    res?: IKeyframeResourse
}

/**
 * 帧动画 升级版
 */
@widgetType('keyframePro', {label: '帧动画PRO', icon: 'keyframe_pro_text'})
export class KeyframeProWidget extends TreeWidget {
    type: string = 'keyframePro'
    @syncAttr({ key: 'keyframePro', value: 'res', label: '动画地址'})
    res: IKeyframeResourse = {}

    constructor({
        res,
        ...superOptions
    }: KeyframeProWidgetOptions) {
        super(superOptions);
        this.res = res || {};
        makeObservableWithWidget(this, {
            res: observable,
            setRes: action,
        });
        this.registerTracks();
    }

    /**
     * @override
     */
    registerTracks(): void {
        // 注册undo/redo
        mobxTrackStates(this, [
            { read: () => this.res, write: (res: IKeyframeResourse) => this.setRes(res) },
        ]);
        super.registerTracks();
    }

    setRes(res: IKeyframeResourse) {
        Object.assign(this.res, res);
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
                res: omitBy({
                    image: this.res.image,
                    animation: this.res.animation,
                }, item => item === ''),
            },
            child: childrenJson,
            data: syncsToJson(this),
        }
    }

    render() {
        return <KeyframeProRender />
    }
}
