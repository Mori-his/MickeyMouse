
export type ClassType<T> = new(...args: any[]) => T;
export type Class = new(...args: any[]) => any;
export type AbstractClass = abstract new(...args: any[]) => any;
export type ClassMixin<T> = (base: T) => T;



