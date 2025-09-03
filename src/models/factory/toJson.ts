import { Border, BorderRadius } from "@layout/core/boxBorder";
import { Direction, LinearGradientdirection } from "@layout/core/gradient";
import { TreeWidget } from "@widgets/treeWidget";
import Color from "@layout/utils/color";
import { isEmpty, isNull, isUndefined, omitBy, result } from "lodash";

export function backgroundToJson(background: Color | LinearGradientdirection) {
    const result: any = {}
    if (background instanceof Color)
        result['bgColor'] = omitBy({
            color: background.hex,
            alpha: background.a
        }, value => value === '' || isUndefined(value) || isNull(value));
    else if (background instanceof LinearGradientdirection) {
        const colors: {color: string, alpha: number}[] = [];
        background.colors.forEach((color: Color) => {
            colors.push({
                color: `${color.hex}`,
                alpha: color.a
            });
        });
        result['bgGradient'] = omitBy({
            orientation: background.direction === Direction.toRight ? 1 : 2,
            colors: colors
        }, value => isUndefined(value) || isNull(value));
    }
    return result;
}

export function borderToJson(border: Border, fillet: BorderRadius, activeBorder: boolean) {

    const round: any = {
            radius: fillet.bottomLeft?.x,
    };
    if (activeBorder) {
        round.borderColor = omitBy({
            color: border.bottom?.color.hex,
            alpha: border.bottom?.color.a
        }, value => value === '' || isUndefined(value) || isNull(value))
        round.color = border.bottom?.color.hex;
        round.alpha = border.bottom?.color.a;
        round.borderWidth = border.bottom?.width;
    }
    return {
        round: omitBy(round, value => value === '' || isUndefined(value) || isNull(value)), 
    };
}

export function layoutToJson(widget: TreeWidget) {
    // l,r,t,b最少存在2个值，大于等于2个值的不处理
    let l = parseInt(widget.position.left as string, 10);
    let t = parseInt(widget.position.top as string, 10);
    let r = parseInt(widget.position.right as string, 10);
    let b = parseInt(widget.position.bottom as string, 10);
    const w = parseInt(widget.size.width as string, 10);
    const h =  parseInt(widget.size.height as string, 10);
    const list = [l, t, r, b].filter(value => !isNaN(value))
    const len = list.length;
    switch(len) {
        case 0:
            l = 0;
            t = 0;
            break;
        case 1:
            if (isNaN(l)) {
                l = 0;
                break;
            }
            if (isNaN(t)) t = 0;
            break;
    }
    if (widget.position.horizontal) {
        // 如果水平居中被选中会和left、right产生互斥
        l = NaN;
        r = NaN;
    }
    if (widget.position.vertical) {
        // 如果垂直居中被选中会和top、bottom产生互斥
        t = NaN;
        b - NaN;
    }

    return omitBy({
        // Position
        l, r, t, b,
        // size
        w, h,
        ___layout: 0,
        ...omitBy({ // 如果value === 0 是默认值则不输出
            widthAuto: Number(widget.size.widthAdaptive), // 宽度自适应
            heightAuto: Number(widget.size.heightAdaptive), // 高度自适应
            centerLand: Number(widget.position.horizontal), // 水平居中
            centerPort: Number(widget.position.vertical), // 垂直居中
        }, (value => value === 0))
    }, (value: number) => !isEmpty(value) || isNaN(value) || isUndefined(value) || isNull(value))
}

export function syncsToJson(widget: TreeWidget) {
    const syncs = widget.syncs;
    const result: {[key: string]: string} = {};

    syncs.forEach(sync => {
        if (sync.key && sync.value) {
            result[sync.key] = sync.value
        }
    });

    return result;
}