import { LyricRender } from "@components/container/layoutPage/rightContainer/widgets/lyric";
import { WidgetOptions } from "@layout/core/layout";
import Color from "@layout/utils/color";
import { Node } from "@models/factory/types";
import { widgetType } from "@models/factory/widgetTypeClassManage";
import syncAttr from "@models/syncManage/manage";
import { isNull, isUndefined, omitBy } from "lodash";
import { action, makeObservable, observable } from "mobx";
import { ViewWidget } from "./view";


export interface LyricWidgetOptions extends WidgetOptions{
    lyrics?: Object
    highlightTextColor?: Color
    normalTextColor?: Color
    highlghtTextSize?: number | string
    normalTextSize?: number | string
    numberOfRows?: number | string
}

@widgetType('lyric', {icon: 'view_text', label: 'K歌组件'})
export class LyricWidget extends ViewWidget {
    type: string = 'lyric';
    @syncAttr({ key: 'lyric', value: 'lyric', label: '歌词'})
    lyrics?: Object                      // 歌词数据
    highlightTextColor!: Color           // 高亮歌词颜色
    normalTextColor!: Color              // 普通歌词颜色
    highlghtTextSize: number | string = 20        // 高亮歌词字体大小，默认20
    normalTextSize: number | string = 17          // 普通歌词字体大小，默认17
    numberOfRows: number | string = 2             // 歌词行数，默认值为2，ios通过总高度除以行数计算行高度

    constructor({
        lyrics,
        highlightTextColor = new Color(0, 0, 100, 1),
        normalTextColor = new Color(0, 0, 100, 1),
        highlghtTextSize = 20,
        normalTextSize = 17,
        numberOfRows = 2,
        ...superProps
    }: LyricWidgetOptions) {
        super(superProps);
        this.lyrics = lyrics;
        this.highlightTextColor = highlightTextColor;
        this.normalTextColor = normalTextColor;
        this.highlghtTextSize = highlghtTextSize;
        this.normalTextSize = normalTextSize;
        this.numberOfRows = numberOfRows;
        makeObservable(this, {
            highlightTextColor: observable,
            normalTextColor: observable,
            highlghtTextSize: observable,
            normalTextSize: observable,
            numberOfRows: observable,
            setLyrics: action,
            setHighlightTextColor: action,
            setNormalTextColor: action,
            setHighlghtTextSize: action,
            setNormalTextSize: action,
            setNumberOfRows: action,
        });
    }
    setLyrics(lyrics: Object) {
        this.lyrics = lyrics;
    }

    setHighlightTextColor(color: Color) {
        this.highlightTextColor = color;
    }
    setNormalTextColor(color: Color) {
        this.normalTextColor = color;
    }
    setHighlghtTextSize(size: number | string) {
        this.highlghtTextSize = size;
    }
    setNormalTextSize(size: number | string) {
        this.normalTextSize = size;
    }
    setNumberOfRows(rows: number | string) {
        this.numberOfRows = rows;
    }

    toJson(): Partial<Node> {
        const obj = super.toJson();
        const lyrics = omitBy({
            lyrics: this.lyrics,
            highlightTextColor: {
                color: this.highlightTextColor.hex,
                alpha: this.highlightTextColor.a
            },
            normalTextColor: {
                color: this.normalTextColor.hex,
                alpha: this.normalTextColor.a
            },
            highlghtTextSize: this.highlghtTextSize,
            normalTextSize: this.normalTextSize,
            numberOfRows: this.numberOfRows
        }, value => value === '' || isUndefined(value) || isNull(value));

        obj.prop = {
            ...obj.prop,
            ...lyrics,
        }
        return obj;
    }

    render() {
        return <LyricRender />
    }
}
