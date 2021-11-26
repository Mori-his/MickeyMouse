import { Widget, WidgetOptions } from "../core/layout";

enum IMAGE_MODE {
    COVER,
    FILL,
    CONTAIN
}

interface ImageWidgetOptions extends WidgetOptions {
    src: string
    blur: boolean
    mode: IMAGE_MODE
}

export default class ImageWidget extends Widget {
    
}
