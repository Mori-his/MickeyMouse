import { TreeWidget, WidgetOptions } from "@layout/core/layout"


export interface ViewWidgetOptions extends WidgetOptions{

}


export default class ViewWidget extends TreeWidget {
    type: string = 'view'

    constructor(options: ViewWidgetOptions) {
        super(options);
    }

    toJson() {
        return {};
    }
}
