import { Widget, WidgetOptions } from "../core/layout";

enum IMAGE_FIT {
    COVER,
    FILL,
    CONTAIN
}

interface ImageWidgetOptions extends WidgetOptions {
    src: string
    blur: boolean
    fit: IMAGE_FIT
}

export default class ImageWidget extends Widget {
    
}
