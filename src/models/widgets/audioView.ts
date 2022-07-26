import { assert } from "@layout/core/assert";
import { WidgetOptions } from "@layout/core/layout";
import { TreeWidget } from "@widgets/treeWidget";
import { layoutToJson, syncsToJson } from "@models/factory/toJson";
import { Node } from "@models/factory/types";
import { widgetType } from "@models/factory/widgetTypeClassManage";
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype";
import { SeatViewWidget } from ".";


export interface AudioViewWidgetOptions extends WidgetOptions{

}

/**
 * 音频控件
 * 音频控件只能在座位下
 */
@widgetType('audioView', {label: '音频模式', icon: 'audio_text'})
export class AudioViewWidget extends TreeWidget {
    type: string = 'audioView'

    constructor({
        ...superOptions
    }: AudioViewWidgetOptions) {
        super(superOptions);
        makeObservableWithWidget(this, {
        });
        this.registerTracks();
    }
    
    /**
     * 设置父节点
     * @param parent 父节点
     * @override
     */
    // setParent(parent: SeatViewWidget) {
    //     if (parent instanceof SeatViewWidget) {
    //         super.setParent(parent);
    //         return;
    //     }
    //     assert(false, '音频组件只能添加在座位组件之下');
    // }
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
            },
            child: childrenJson,
            data: syncsToJson(this),
        }
    }
}
