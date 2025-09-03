import { IIcons } from "@components/basic/svgs/icons";
import { Class } from "@layout/types/types";



export interface WidgetTypeProps {
    label?: string
    icon?: IIcons
}
export interface  WidgetMapType extends WidgetTypeProps {
    value: Class
}
export class WidgetTypeManage {
    static instance: WidgetTypeManage = new WidgetTypeManage();
    static getInstance() { return this.instance}

    #widgetTypeWeakMap: Map<string, WidgetMapType> = new Map();

    set(key: string, attr: WidgetMapType) {
        this.#widgetTypeWeakMap.set(key, attr);
    }
    get(key: string): WidgetMapType | undefined {
        return this.#widgetTypeWeakMap.get(key);
    }
    has(key: string) {
        return this.#widgetTypeWeakMap.has(key);
    }
    delete(key: string) {
        this.#widgetTypeWeakMap.delete(key);
    }
    clear() {
        this.#widgetTypeWeakMap = new Map();
    }
    log() {
        console.log(this.#widgetTypeWeakMap)
    }
    get Map() {
        return this.#widgetTypeWeakMap
    } 
}

export const widgetTypeManage = WidgetTypeManage.getInstance();


export function widgetType(type: string, props: WidgetTypeProps = {}) {
    const widgetTypeManage: WidgetTypeManage = WidgetTypeManage.getInstance();    
    
    return (constructor: Class) => {
        widgetTypeManage.set(type, {
           label: props.label,
           icon: props.icon,
           value: constructor
        });
    }
}

