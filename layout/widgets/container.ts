import { AdaptivePosition, AdaptiveSize, Widget } from "../core/layout";
import { Class } from "../types/types";


export function ContainerMixin(Base: Class) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
        }
    }
}

export interface ContainerOptions {
    position: AdaptivePosition,
    size: AdaptiveSize
}

export default class ContainerWidget extends ContainerMixin(Widget) {
    constructor(options: ContainerOptions) {
        super()
    }
}

