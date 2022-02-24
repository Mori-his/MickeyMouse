
export interface IHSB {
    h: number
    s: number
    b: number
}

export interface IHSBA extends IHSB {
    a: number
}
export interface IRGB {
    r: number
    g: number
    b: number
}

export interface IRGBA extends IRGB {
    a: number
}



export type TRGBSignle = 'r' | 'g' | 'b';
export type THSBSignle = 'h' | 's' | 'b';

