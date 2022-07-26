import { action, observable } from "mobx";
import styled from "styled-components";
import { omitBy } from "lodash";
import { WidgetOptions } from "@layout/core/layout";
import { TreeWidget } from "@widgets/treeWidget";
import syncAttr from "@models/syncManage/manage";
import { layoutToJson, syncsToJson } from "@models/factory/toJson";
import { Node } from "@models/factory/types";
import { widgetType } from "@models/factory/widgetTypeClassManage";
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype";
import { mobxTrackStates } from "@models/owners";
import { MuteButtonRender } from "@components/container/layoutPage/rightContainer/widgets/muteButton";


export interface MuteButtonWidgetOptions extends WidgetOptions{
    openSrc?: string
    closeSrc?: string
}

/**
 * 静音按钮
 */
@widgetType('muteButton', {icon: 'mute_text', label: '静音按钮'})
export class MuteButtonWidget extends TreeWidget {
    type: string = 'muteButton'

    @syncAttr({ key: 'muteButton', value: 'onSrc', label: '开启声音图片地址'})
    openSrc?: string
    @syncAttr({ key: 'muteButton', value: 'offSrc', label: '关闭声音图片地址'})
    closeSrc?: string

    constructor({
        openSrc,
        closeSrc,
        ...superOptions
    }: MuteButtonWidgetOptions) {
        super(superOptions);
        this.openSrc = openSrc;
        this.closeSrc = closeSrc;
        makeObservableWithWidget(this, {
            openSrc: observable,
            closeSrc: observable,
            setOpenSrc: action,
            setCloseSrc: action,
        });
        this.registerTracks();
    }

    /**
     * @override
     */
    registerTracks(): void {
        // 注册undo/redo
        mobxTrackStates(this, [
            { read: () => this.openSrc, write: (src: string) => this.setOpenSrc(src) },
            { read: () => this.closeSrc, write: (src: string) => this.setCloseSrc(src) },
        ]);
        super.registerTracks();
    }

    setOpenSrc(src?: string) {
        this.openSrc = src;
    }
    setCloseSrc(src?: string) {
        this.closeSrc = src;
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
                openSrc: this.openSrc,
                closeSrc: this.closeSrc
            }, item => item === ''),
            child: childrenJson,
            data: syncsToJson(this),
        }
    }

    render() {
       return <MuteButtonRender />
    }
}
