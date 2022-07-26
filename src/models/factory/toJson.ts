import { Border, BorderRadius } from "@layout/core/boxBorder";
import { Direction, LinearGradientdirection } from "@layout/core/gradient";
import { TreeWidget } from "@widgets/treeWidget";
import Color from "@layout/utils/color";
import { isNull, isUndefined, omitBy, result } from "lodash";

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

export function borderToJson(border: Border, fillet: BorderRadius) {
    return {
        round: omitBy({
            borderWidth: border.bottom?.width,
            color: border.bottom?.color.hex,
            alpha: border.bottom?.color.a,
            radius: fillet.bottomLeft?.x,
            borderColor: omitBy({
                color: border.bottom?.color.hex,
                alpha: border.bottom?.color.a
            }, value => value === '' || isUndefined(value) || isNull(value))
        }, value => value === '' || isUndefined(value) || isNull(value))
    }
}

export function layoutToJson(widget: TreeWidget) {
    return omitBy({
        l: widget.position.left,
        r: widget.position.right,
        t: widget.position.top,
        b: widget.position.bottom,
        w: widget.size.width,
        h: widget.size.height,
        ...omitBy({ // 如果value === 0 是默认值则不输出
            widthAuto: Number(widget.size.widthAdaptive), // 宽度自适应
            heightAuto: Number(widget.size.heightAdaptive), // 高度自适应
            centerLand: Number(widget.position.horizontal), // 水平居中
            centerPort: Number(widget.position.vertical), // 垂直居中
        }, (value => value === 0))
    }, value => value === '' || isUndefined(value) || isNull(value))
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