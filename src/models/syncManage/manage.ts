import { ISyncAttr, SyncProps } from "@/types/types";

// 如果有通用的sync可以在这里添加并且描述
export const basicSyncs: ISyncAttr[] = [
    { value: 'name', label: '名称' },
    { value: 'visible', label: '是否显示' },
    { value: 'attachOnClick', label: '是否可点击' },
]

export class SyncAttrManage {
    static instance: SyncAttrManage = new SyncAttrManage();
    static getInstance() { return this.instance}

    #syncWeakMap: Map<string, ISyncAttr[]> = new Map();

    set(item: SyncProps, attr: string) {
        const targetValue = this.#syncWeakMap.get(item.key) || [];
        const currAttr = {
            value: item.value || attr,
            label: item.label
        }
        if (targetValue.find(item => item.value === attr)) return;
        this.#syncWeakMap.set(item.key, targetValue.concat(currAttr));
    }
    get(key: string): ISyncAttr[] {
        return this.#syncWeakMap.get(key) || [];
    }
    has(key: string) {
        return this.#syncWeakMap.has(key);
    }
    delete(key: string) {
        this.#syncWeakMap.delete(key);
    }
    clear() {
        this.#syncWeakMap = new Map();
    }
    log() {
        console.log(this.#syncWeakMap)
    }

    get Map() {
        return this.#syncWeakMap;
    }
}

export const syncAttrManage = new SyncAttrManage();

export function syncAttr(item: SyncProps) {
    return (_: any, attr: string) => {
        syncAttrManage.set(item, attr);
    }
}




export default  syncAttr
