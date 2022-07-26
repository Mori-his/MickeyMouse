import { WidgetOptions } from "@layout/core/layout";
import { TreeWidget } from "@widgets/treeWidget";
import syncAttr from "@models/syncManage/manage";
import { layoutToJson, syncsToJson } from "@models/factory/toJson";
import { Node } from '@models/factory/types';
import { widgetType } from "@models/factory/widgetTypeClassManage";
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype";
import { action, observable } from "mobx";
import { SourceSrc } from "./interface/widgetInterface";
import { mobxTrackStates } from "@models/owners";
import { TitleCollapse } from "@components/container/common/title";
import Input from "@components/basic/form/input/input";
import LightTippy from "@components/basic/toolTip/lightTippy";
import { AudioAnimRender } from "@components/container/layoutPage/rightContainer/widgets/audioAnim";


export interface AudioAnimWidgetOptions extends WidgetOptions{
    src?: string
}

/**
 * 呼吸灯动画
 */
@widgetType('audioAnim', {label: '音频动画', icon: 'audio_animate_text'})
export class AudioAnimWidget extends TreeWidget implements SourceSrc {
    type: string = 'audioAnim'
    @syncAttr({ key: 'audioAnim', value: 'url', label: '动画地址'})
    src?: string

    constructor({
        src,
        ...superOptions
    }: AudioAnimWidgetOptions) {
        super(superOptions);
        this.src = src;
        makeObservableWithWidget(this, {
            src: observable,
            setSrc: action,
        });
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
                url: this.src,
                isDispatchOnClickEvent: this.attachOnClick,
                visible: this.visible,
            },
            child: childrenJson,
            data: syncsToJson(this),
        }
    }

    render() {
        return <AudioAnimRender />;
    }
}
