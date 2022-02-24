
export type ActionMap<T extends { [index: string]: any}> = {
    [key in keyof T]: T[key] extends undefined
        ? {
            type: key
        }
        : {
            type: key
            payload: T[key]
        }
}

