export interface SyncProps {
    key: string
    value?: string
    label?: string
}

export interface ISyncAttr {
    value: string,
    label?: string
}

export interface NodeSync {
    // sync的key
    key: string
    // sync的值
    value: string
}


export type InferType<T> = T extends infer P ? P : T;
