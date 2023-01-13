export interface SyncProps {
    key: string
    value?: string
    label?: string
}

export interface ISyncAttr {
    value: string
    label?: string
    id?: string | number
}

export interface NodeSync {
    // sync的key
    key: string
    // sync的值
    value: string

    id?: string | number
}


export type InferType<T> = T extends infer P ? P : T;


export type Constructor<T = any> = new (...args: any[]) => T;


export type NoInfer<T> = [T][T extends any ? 0 : never];