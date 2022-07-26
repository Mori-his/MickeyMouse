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

export function getParentScrollEl(element: HTMLElement) {
    let el: HTMLElement | null = element;
    while (el && !isBody(el)){
        const elScrollHeight = el.scrollHeight;
        const elClientHeight = el.clientHeight;
        if (elScrollHeight > elClientHeight) {
            el.scrollTop = 1;
            if (el.scrollTop === 1) {
                el.scrollTop = 0;
                break;
            }
        }
        el = el.parentElement;
    }
    return el;
}

/**
 * 简单慢速滚动指定滚动条位置
 * @param {Number}} value 要移动的目标值
 * @param {String}} direction 方向,默认: scrollY, [scrollY, scrollX, scrollTop, scrollLeft]
 * scrollTop|scrollLeft是针对HTMLElement的
 * @param {Element|Window} target 目标元素，默认为window
 * @param {Number} speed 速率,默认:5
 * @returns Promise
 */
 export function toScroll(
    value: number,
    direction: any = 'scrollY',
    target: any = window,
    speed: number = 5,
) {
    return new Promise<void>((resolve) => {
        if (typeof value !== 'number') {
            return resolve();
        }

        if (target instanceof Window) {
            if (!['scrollY', 'scrollX'].includes(direction)) {
                throw new Error('滚动目标是[Window]请使用scrollY、scrollX属性');
            }
        } else if (!['scrollTop', 'scrollLeft'].includes(direction)) {
            throw new Error('滚动目标是[HTMLElement]请使用scrollTop、scrollLeft属性');
        }
        const dir = target[direction] - value > 0;
        let prevScrollValue = -1;
        let stop = false;
        setTimeout(() => {
            stop = true;
        }, 1000);
        const attrsY = ['scrollY', 'scrollTop'];
        const attrsX = ['scrollX', 'scrollLeft'];

        function animationScroll() {
            const scrollValue = target[direction];
            if (
                !stop
                && prevScrollValue !== scrollValue
                && ((dir && scrollValue > value) || (!dir && scrollValue < value))
            ) {
                requestAnimationFrame(() => {
                    let targetValue = Math.ceil((target[direction] - value) / speed);
                    if (!dir) {
                        targetValue = targetValue || -1;
                    } else {
                        targetValue = targetValue || 1;
                    }
                    prevScrollValue = target[direction];
                    target.scrollTo(
                        attrsX.indexOf(direction) > -1
                            ? target[direction] - targetValue
                            : 0,
                        attrsY.indexOf(direction) > -1 ? target[direction] - targetValue : 0,
                    );
                    animationScroll();
                });
            } else {
                return resolve();
            }
        }
        animationScroll();
    });
}

