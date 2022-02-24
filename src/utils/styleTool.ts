import { HTMLWithWidgetAttr } from "@/types/components/leftContainer/tree/tree";

export function getStyleAttr(el: HTMLElement, attr?: keyof CSSStyleDeclaration) {
    try {
        const styles = window.getComputedStyle(el)
        if (!styles) throw new Error('请提供一个<HTMLElement>类型的参数')
        if (attr)
            return styles[attr];
        else
            return styles
    } catch(err) {
        console.error('获取StyleAttr失败:', err);
    }
}

export function getOffsetTop(el: HTMLElement) {
    let top: number = 0;
    while(el?.offsetParent) {
        top += el.offsetTop;
        el = el.offsetParent as HTMLElement;
    }
    return top;
}
export function getOffsetLeft(el: HTMLElement) {
    let left: number = 0;
    while(el?.offsetParent) {
        left += el.offsetLeft;
        el = el.offsetParent as HTMLElement;
    }
    return left;
}

export const widgetAttrName = '@@__widget';

export function isBody(el: HTMLElement) {
    return document.body === el;
}

export function getDragElement(el: HTMLWithWidgetAttr) {
    let _el: HTMLWithWidgetAttr | null = el;
    while (_el && !isBody(_el as unknown as HTMLElement) && !_el[widgetAttrName]) {
        _el = _el.parentNode as unknown as HTMLWithWidgetAttr;
    }
    return !isBody(_el as unknown as HTMLElement) && _el;
}
