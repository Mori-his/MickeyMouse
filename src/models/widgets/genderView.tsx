import { WidgetOptions } from "@layout/core/layout";
import { TreeWidget } from "@widgets/treeWidget";
import syncAttr from "@models/syncManage/manage";
import { layoutToJson, syncsToJson } from "@models/factory/toJson";
import { Node } from "@models/factory/types";
import { widgetType } from "@models/factory/widgetTypeClassManage";
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype";
import { isUndefined, omitBy } from "lodash";
import { action, observable } from "mobx";
import { mobxTrackStates } from "@models/owners";
import { GenderViewRender } from "@components/container/layoutPage/rightContainer/widgets/genderView";


export interface GenderViewWidgetOptions extends WidgetOptions{
    manSrc?: string
    femaleSrc?: string
    unisexSrc?: string
}

/**
 * 性别
 */
@widgetType('genderView', {label: '性别', icon: 'gender_text'})
export class GenderViewWidget extends TreeWidget {
    type: string = 'genderView'
    @syncAttr({ key: 'genderView', value: 'M', label: '男图片'})
    manSrc?: string
    @syncAttr({ key: 'genderView', value: 'F', label: '女性图片'})
    femaleSrc?: string
    @syncAttr({ key: 'genderView', value: 'N', label: '未知性别图片'})
    unisexSrc?: string

    constructor({
        manSrc,
        femaleSrc,
        unisexSrc,
        ...superOptions
    }: GenderViewWidgetOptions) {
        super(superOptions);
        this.manSrc = manSrc;
        this.femaleSrc = femaleSrc;
        this.unisexSrc = unisexSrc;
        makeObservableWithWidget(this, {
            manSrc: observable,
            femaleSrc: observable,
            unisexSrc: observable,
            setManSrc: action,
            setFemaleSrc: action,
            setUnisexSrc: action,
        });
        this.registerTracks();
    }
    /**
     * @override
     */
    registerTracks(): void {
        // 注册undo/redo
        mobxTrackStates(this, [
            { read: () => this.manSrc, write: (src: string) => this.setManSrc(src) },
            { read: () => this.femaleSrc, write: (src: string) => this.setFemaleSrc(src) },
            { read: () => this.unisexSrc, write: (src:string) => this.setUnisexSrc(src) },
        ]);
        super.registerTracks();
    }

    setManSrc(src?: string) {
        this.manSrc = src;
    }
    setFemaleSrc(src?: string) {
        this.femaleSrc = src;
    }
    setUnisexSrc(src?: string) {
        this.unisexSrc = src;
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
                genderUrl: omitBy({
                    F: this.femaleSrc,
                    M: this.manSrc,
                    N: this.unisexSrc
                }, item => item === '' || isUndefined(item))
            },
            child: childrenJson,
            data: syncsToJson(this),
        }
    }

    render() {
        return <GenderViewRender />
    }
}
