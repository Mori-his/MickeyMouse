
export function assert<T = unknown>(value: T, message?: string | Error) {
    if (!value) {
        throw typeof message === 'string' ? new Error(message) : message;
    }
}
