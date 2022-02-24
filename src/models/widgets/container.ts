import { AdaptivePosition, AdaptiveSize, Widget } from "@layout/core/layout";
import { AbstractClass } from "@layout/types/types";


export function ContainerMixin(Base: AbstractClass) {
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
        super(options)
    }

    toJson() {
        return '{}';
    }
}

