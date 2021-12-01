import { Widget, WidgetOptions } from "../core/layout"


export interface RootWidgetOptions extends WidgetOptions{
    gameID: number
    config?: string
}


export default class RootWidget extends Widget {
    type: string = 'root'
    gameId!: number
    config!: string
    constructor(options: RootWidgetOptions) {
        super(options);
    }
}
