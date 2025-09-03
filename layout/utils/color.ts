import { IRGBA } from "@/types/color";



export default class Color {
    

    constructor(
        public h: number,
        public s: number,
        public b: number,
        public a: number
    ) {
        this.a = +Math.max(Math.min(a, 1), 0).toFixed(2);
        this.h = +Math.max(Math.min(h, 360), 0).toFixed(1);
        this.s = +Math.max(Math.min(s, 100), 0).toFixed(1);
        this.b = +Math.max(Math.min(b, 100), 0).toFixed(1);
    }

    get rgba() {
        const rgb = Color.hsvToRgb(this.h, this.s, this.b);
        return {
            ...rgb,
            a: this.a,
        };
    }

    get hex() {
        const rgb = Color.hsvToRgb(this.h, this.s, this.b);
        return Color.rgbToHex(rgb.r, rgb.g, rgb.b);
    }

    static reHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    static isHex(hex: string): boolean {
        return Boolean(hex.match(this.reHex));
    }
    static is(color: Color, otherColor: Color) {
        if (color.h !== otherColor.h) return false;
        if (color.s !== otherColor.s) return false;
        if (color.b !== otherColor.b) return false;
        if (color.a !== otherColor.a) return false;
        return true
    }

    static isIRGBA(color: IRGBA, otherColor: IRGBA) {
        if (color.r !== otherColor.r) return false;
        if (color.g !== otherColor.g) return false;
        if (color.b !== otherColor.b) return false;
        if (color.a !== otherColor.a) return false;
        return true
    }

    static hexToRGB(hex: string) {
        if (!this.isHex(hex) || hex === "") hex = "000000";
        if ( hex.charAt(0)=="#" ) hex = hex.substring(1, hex.length);
        let r: number | string;
        let g: number | string;
        let b: number | string;
        let a: number | string = 1;
        if (hex.length === 3) {
            r = hex.substring(0, 1);
            g = hex.substring(1, 2);
            b = hex.substring(2, 3);
            r += r;
            g += g;
            b += b;
        } else {
            r = hex.substring(0, 2);
            g = hex.substring(2, 4)
            b = hex.substring(4, 6)
        }
        if (hex.length === 8) {
            a = hex.substring(6, 8);
            a = (parseInt(a, 16) / 255.0).toFixed(2);
        }
        r = parseInt(r, 16);
        g = parseInt(g, 16);
        b = parseInt(b, 16);
        return {
            r, g, b, a
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
        if(s > 100) s = 100;
        if(v > 100) v = 100;
        s /= 100.0;
        v /= 100.0
        const C = v * s;
        const hh = h / 60.0;
        const X = C * (1.0 - Math.abs((hh % 2) - 1.0));
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
        return new Color(h, s, b, a).rgba;
    }

    /**
     * RGB TO HSB
     * @param r - 红色
     * @param g - 绿色
     * @param b - 蓝色
     * @returns 色相，饱和度，明度
     */
    static rgbToHsb(r: number, g: number, b: number) {
        if (r < 0) r = 0;
        if (g < 0) g = 0;
        if (b < 0) b = 0;
        if (r > 255) r = 255;
        if (g > 255) g = 255;
        if (b > 255) b = 255;
        let hex: string | number = r * 65536 + g * 256 + b;
        hex = hex.toString(16).substring(0, 6);
        let len = hex.length;
        if (len < 6) {
            for(let i = 0; i < 6 - len;i++) {
                hex = '0' + hex;
            }
        }
        r /= 255;
        g /= 255;
        b /= 255;
        const M = Math.max(r, g, b);
        const m = Math.min(r, g, b);
        const C = M - m;
        let h = 0;
        if (C === 0) h = 0;
        else if(M === r) h = ((g - b) / C) % 6;
        else if(M === g) h = (b - r) / C + 2;
        else h = (r - g) / C + 4;
        h *= 60;
        if(h < 0) h += 360;
        let v = M;
        let s = C / v;
        if(v === 0)
            s = 0;
        return {
            h: +h.toFixed(0),
            s: +(s * 100).toFixed(1),
            b: +(v * 100).toFixed(1)
        };
    }

    static rgbToHex(r: number, g: number, b: number) {
        let hex: number | string = r * 65536 + g * 256 + b;
        hex = hex.toString(16).substring(0, 6);
        const len = hex.length;
        if ( len < 6 )
            for (let i = 0; i < 6 - len; i++)
                hex = '0'+hex;
        return `#${hex}`;
    }

    static reverse(hex: string){
        hex = '0x' + hex.replace(/#/g,"");
        const str= '000000' + (0xFFFFFF - +hex).toString(16);
        return '#' + str.substring(str.length - 6, str.length);
    }
}
