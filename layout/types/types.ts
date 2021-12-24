import { LeftState } from "@components/basic/toolTip/toolTipBox";


export type ClassType<T> = new(...args: any[]) => T;
export type Class = new(...args: any[]) => any;
export type AbstractClass = abstract new(...args: any[]) => any;




/**
 * Fillet 圆角系列
 */

export type TAngle = {
    topLeft: number
    topRight: number
    bottomLeft: number
    bottomRight: number
}

