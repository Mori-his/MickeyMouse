


export default class Color {
    

    constructor(
        private h: number,
        private s: number,
        private b: number
    ) {

    }

    static reHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    static isHex(hex: string): boolean {
        return Boolean(hex.match(this.reHex));
    }

    static hexToRGB(hex: string) {
        if (!this.isHex(hex)) return hex;
        hex = hex.substring(1);
        if( hex.length==3 ) {
            let r = hex.substring(0,1);
            let g = hex.substring(1,2);
            let b = hex.substring(2,3);
            r = r + r;
            g = g + g;
            b = b + b;
            hex = `${r}${g}${b}`;
        }
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return {
            r, g, b
        }
    }

    static hexToRGBA(hex: string, opacity: number = 1) {
        if (opacity > 1) opacity = 1;
        if (opacity < 0) opacity = 0;
        if (!this.isHex(hex)) return hex;
        const RGB = this.hexToRGB(hex);
        if (typeof RGB === 'string') return hex;
        return `rgba(${RGB.r}, ${RGB.g}, ${RGB.b}, ${opacity})`;
    }

    static hsvToRgb(h: number, s: number, v: number) {
        if(h < 0) h = 0;
        if(s < 0) s = 0;
        if(v < 0) v = 0;
        if(h >= 360) h = 359;
        const C = v * s;
        const hh = h / 60.0;
        const X = C*(1.0-Math.abs((hh%2)-1.0));
        let r = 0;
        let g = r;
        let b = r;
        if(hh >= 0 && hh < 1) {
            r = C;
            g = X;
        } else if(hh >= 1 && hh < 2) {
            r = X;
            g = C;
        } else if(hh >= 2 && hh < 3) {
            g = C;
            b = X;
        } else if(hh >= 3 && hh < 4) {
            g = X;
            b = C;
        } else if(hh >= 4 && hh < 5) {
            r = X;
            b = C;
        } else {
            r = C;
            b = X;
        }
        const m = v-C;
        r += m;
        g += m;
        b += m;
        r *= 255.0;
        g *= 255.0;
        b *= 255.0;
        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);
        return {r, g, b};
    }

    static hsbToRgba(h: number, s: number, b: number, a: number) {
        const rgb = this.hsvToRgb(h, s, b);
        return {
            ...rgb,
            a
        };
    }

    /**
     * RGB TO HSB
     * @param r 红色
     * @param g 绿色
     * @param b 蓝色
     * @returns 色相，饱和度，明度
     */
    static rgbToHsb(r: number, g: number, b: number) {
        if(r < 0) r = 0;
        if(g < 0) g = 0;
        if(b < 0) b = 0;
        if(r > 255) r = 255;
        if(g > 255) g = 255;
        if(b > 255) b = 255;
        // let hex = 0;
        if(b < 0) b = 0;
        // to hs(b/v)
        r /= 255;
        g /= 255;
        b /= 255;
        const M = Math.max(r, g, b);
        const m = Math.min(r, g, b);
        const C = M - m;
        let h = 0;
        if(C === 0) h = 0;
        else if(M === r) h = ((g - b) / C) % 6;
        else if(M === g) h = (b - r) / C + 2;
        else h = (r - g) / C + 4;
        h *= 60;
        if(h < 0) h += 360;
        let v = M;
        let s = C / v;
        if(v === 0)
            s = 0;
        return {h, s, b: v};
    }

    static rgbToHex(r: number, g: number, b: number) {
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
}
