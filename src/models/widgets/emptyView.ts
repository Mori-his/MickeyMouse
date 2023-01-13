import { assert } from "@layout/core/assert";
import { WidgetOptions } from "@layout/core/layout";
import { TreeWidget } from "@widgets/treeWidget";
import { layoutToJson, syncsToJson } from "@models/factory/toJson";
import { Node } from "@models/factory/types";
import { widgetType } from "@models/factory/widgetTypeClassManage";
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype";
import { SeatViewWidget } from ".";


export interface EmptyViewWidgetOptions extends WidgetOptions{

}

/**
 * 空控件
 */
@widgetType('emptyView', {label: '空视图/空座位', icon: 'seat_empty_text'})
export class EmptyViewWidget extends TreeWidget {
    type: string = 'emptyView'

    constructor({
        ...superOptions
    }: EmptyViewWidgetOptions) {
        super(superOptions);
        makeObservableWithWidget(this, {
        });
        this.registerTracks();
    }
    
    /**
     * 设置父节点
     * @param parent - 父节点
     * @override
     */
    setParent(parent: SeatViewWidget) {
        if (!parent) return
        if (parent instanceof SeatViewWidget) {
            super.setParent(parent);
            return;
        }
        assert(false, '空座位组件只能添加在座位组件之下');
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
            },
            child: childrenJson,
            data: syncsToJson(this),
        }
    }
}
