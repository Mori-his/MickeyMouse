import { Widget, WidgetOptions } from "../core/layout"


export interface ViewWidgetOptions extends WidgetOptions{

}


export default class ViewWidget extends Widget {
    type: string = 'view'

    constructor(options: ViewWidgetOptions) {
        super(options);
    }
}
