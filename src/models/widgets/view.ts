import { TreeWidget, WidgetOptions } from "@layout/core/layout"
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype";


export interface ViewWidgetOptions extends WidgetOptions{

}


export default class ViewWidget extends TreeWidget {
    type: string = 'view'

    constructor(options: ViewWidgetOptions) {
        super(options);
        makeObservableWithWidget(this, {

        });
    }

    toJson() {
        return {};
    }
}
