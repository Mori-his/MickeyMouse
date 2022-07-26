import { WidgetOptions } from "@layout/core/layout";
import { TreeWidget } from "@widgets/treeWidget";
import { layoutToJson, syncsToJson } from "@models/factory/toJson";
import { Node } from "@models/factory/types";
import { widgetType } from "@models/factory/widgetTypeClassManage";
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype";


export interface StampViewWidgetOptions extends WidgetOptions{

}

/**
 * 盖章
 */
@widgetType('stampView',{icon: 'stamp_text', label: '盖章'})
export class StampViewWidget extends TreeWidget {
    type: string = 'stampView'

    constructor({
        ...superOptions
    }: StampViewWidgetOptions) {
        super(superOptions);
        makeObservableWithWidget(this, {
        });
        this.registerTracks();
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
        };
    }
}
