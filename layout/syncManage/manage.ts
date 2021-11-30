

export function syncAttr(target: any, attr: any) {
    const syncAttrManage: SyncAttrManage = SyncAttrManage.getInstance();
    syncAttrManage.set(target, attr);
}


export class SyncAttrManage {
    static instance: SyncAttrManage = new SyncAttrManage();
    static getInstance() { return this.instance}

    #syncWeakMap = new WeakMap();

    set(target: any, attr: string) {
        const targetValue = this.#syncWeakMap.get(target) || [];
        if (targetValue.indexOf(attr) > -1) return;
        this.#syncWeakMap.set(target, targetValue.concat(attr));
    }
    get(target: any): string[] {
        return this.#syncWeakMap.get(target) || [];
    }
    has(target: any) {
        return this.#syncWeakMap.has(target);
    }
    delete(target: any) {
        this.#syncWeakMap.delete(target);
    }
    clear() {
        this.#syncWeakMap = new WeakMap();
    }
}



export default  syncAttr
