import { WidgetOptions } from "@layout/core/layout";
import { TreeWidget } from "@widgets/treeWidget";
import { layoutToJson, syncsToJson } from "@models/factory/toJson";
import { Node } from "@models/factory/types";
import { widgetType } from "@models/factory/widgetTypeClassManage";
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype";

export interface VideoViewWidgetOptions extends WidgetOptions{

}

/**
 * 视频控件
 * 视频控件只能在座位下
 */
@widgetType('videoView', {icon: 'video_text', label: '视频模式'})
export class VideoViewWidget extends TreeWidget {
    type: string = 'videoView'

    constructor({
        ...superOptions
    }: VideoViewWidgetOptions) {
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
    //     assert(false, '视频组件只能添加在座位组件之下');
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
        };
    }
}
