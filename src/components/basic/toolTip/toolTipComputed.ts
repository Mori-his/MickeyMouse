import { getStyleAttr } from "@utils/styleTool"

export type Placement = 'top' | 'bottom' | 'left' | 'right';
// 'top' | 'top-start' | 'top-end' |
// 'bottom' | 'bottom-start' | 'bottom-end' |
// 'right' | 'right-start' | 'right-end' |
// 'left' | 'left-start' | 'left-end';
export interface IExceedScrollAttrs {
    scrollX: number
    scrollY: number
    scrollWidth: number
    scrollHeight: number
}


export type OffsetLeft = number | {
    isLeft: boolean
    value: number
}

export default class FloatComputed {

    private targetElStyles!: CSSStyleDeclaration
    private floatElStyles!: CSSStyleDeclaration
    private targetWidth!: number
    private targetHeight!: number
    private targetOffsetTop!: number
    private targetOffsetLeft!: number
    private floatElWidth!: number
    private floatElHeight!: number
    private exceedScrollAttrs!: IExceedScrollAttrs
    // 箭头是否贴边
    #arrowWelt: 'left' | 'right' | 'center' = 'center';
    private arrowWidth: number = 8
    private arrowHeight: number = 8

    left: OffsetLeft = 0
    top: number = 0
    arrowLeft: number = 0
    arrowTop: number = 0

    constructor(
        public targetEl: HTMLElement,
        public toolTipEl: HTMLElement,
        public placement: Placement,
        public offset: number = 12
    ) {
        this.init();
    }

    init() {
        this.targetElStyles = getStyleAttr(this.targetEl) as CSSStyleDeclaration;
        this.floatElStyles = getStyleAttr(this.toolTipEl) as CSSStyleDeclaration;

        this.targetWidth = parseFloat(this.targetElStyles.width);
        this.targetHeight = parseFloat(this.targetElStyles.height);

        const targetClientRect = this.targetEl.getBoundingClientRect();

        this.targetOffsetTop = targetClientRect.y;
        this.targetOffsetLeft = targetClientRect.x;

        this.floatElWidth = parseFloat(this.floatElStyles.width);
        this.floatElHeight = parseFloat(this.floatElStyles.height);

        if (window.innerHeight < this.floatElHeight + this.targetHeight) return;

        this.exceedScrollAttrs = this.scrollAttrs();
        this.left = this.getOffsetLeft();
        this.top = this.getOffsetTop();
        this.arrowLeft =this.getArrowLeft();
        this.arrowTop =this.getArrowTop();
    }

    /**
     * 是否超出边界
     * @param left 当前Left值
     * @param top  当前top值
     */
    isExceedEdges(left: number, top: number) {
        if (left > 0) return true;
        const { innerHeight, innerWidth } = window;
        if (left + this.floatElWidth > innerWidth) return true;
        if (top + this.floatElHeight > innerHeight) return true;
    }
    scrollAttrs() {
        let parentEl = this.targetEl.parentElement;
        const innerWidth: number = window.innerWidth;
        const innerHeight: number = window.innerHeight;
        let parentScrollWidthEl;
        let parentScrollHeightEl;
        while(
            parentEl &&
            (parentEl.scrollWidth <= innerWidth || parentEl.scrollHeight <= innerHeight)
            ) {
            if (parentScrollWidthEl && parentScrollHeightEl) break;
            if (parentEl.scrollWidth > innerWidth) parentScrollWidthEl = parentEl;
            if (parentEl.scrollHeight > innerHeight) parentScrollHeightEl = parentEl;
            // 当前parent元素没有超出视图宽度
            parentEl = parentEl.parentElement;
        }
        return {
            scrollX: parentScrollWidthEl ? parentScrollWidthEl.scrollLeft : 0,
            scrollY: parentScrollHeightEl ? parentScrollHeightEl.scrollTop : 0,
            scrollWidth: parentScrollWidthEl ? parentScrollWidthEl.scrollWidth : 0,
            scrollHeight: parentScrollHeightEl ? parentScrollHeightEl.scrollHeight : 0,
        };
    }

    getOffsetTop(): number {
        const { scrollY } = this.exceedScrollAttrs;
        switch(this.placement) {
            case 'top':
                let top = this.targetOffsetTop - this.targetHeight - scrollY - this.offset;
                if (top < this.floatElHeight) {
                    // 居上的位置小于当前提示框的宽度改变方向为下方
                    this.placement = 'bottom';
                    return this.getOffsetTop();
                }
                return top;
            case 'bottom':
                let topToBottom = this.targetOffsetTop + this.targetHeight - scrollY + this.offset;
                if (topToBottom + this.floatElHeight > window.innerHeight) {
                    this.placement = 'top';
                    topToBottom -= this.targetHeight - this.arrowHeight;
                }
                return topToBottom;
        }   
        return 0;
    }
    getOffsetLeft() {
        const { scrollX } = this.exceedScrollAttrs;
        let left: OffsetLeft = (this.targetWidth - this.floatElWidth) / 2 + this.targetOffsetLeft - scrollX;
        if (left < 0) {
            left = 0;
            this.#arrowWelt = 'left';
        }
        if (left + this.floatElWidth >= window.innerWidth) {
            left = window.innerWidth - this.floatElWidth - this.offset;
            left = {
                isLeft: false,
                value: 0
            }
            this.#arrowWelt = 'right';
        }
        return left;
    }
    getArrowLeft() {
        const { scrollX } = this.exceedScrollAttrs;
        const targetLeft = this.targetOffsetLeft - scrollX;
        let targetCenter = targetLeft  + this.targetWidth / 4;
        if (targetCenter < 0) targetCenter = 0;
        switch(this.#arrowWelt) {
            case 'left':
                return targetCenter + (targetLeft <= 0 ? 0 : this.arrowWidth * 0.4);
            case 'right':
                const rightWidth = window.innerWidth - targetLeft;
                return this.floatElWidth - rightWidth + this.targetWidth / 4;
            default:
                return this.floatElWidth / 2 - this.arrowWidth;
        }
    }
    getArrowTop() {
        switch(this.placement) {
            case 'top':
                return this.floatElHeight;
            case 'bottom':
                return -(this.arrowHeight * 2);
            default:
                return this.floatElHeight;
        }
    }
}
