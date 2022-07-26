import { WidgetOptions } from "@layout/core/layout";
import { TreeWidget } from "@widgets/treeWidget";
import syncAttr from "@models/syncManage/manage";
import Color from "@layout/utils/color";
import { layoutToJson, syncsToJson } from "@models/factory/toJson";
import { Node } from "@models/factory/types";
import { widgetType } from "@models/factory/widgetTypeClassManage";
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype";
import { isUndefined, omitBy } from "lodash";
import { action, observable } from "mobx";
import { mobxTrackStates } from "@models/owners";


export interface LabelWidgetOptions extends WidgetOptions{
    text?: string
    fontSize?: number
    fontFamily?: string
    fontColor?: Color
    maxLine?: number
    textFormat?: TextFormat
    maxWidth?: number
    textOverflow?: TextOverflow
    alignment?: Alignment
}


export enum TextOverflow {
    swiper,
    clip,
}
export enum Alignment {
    left,
    center,
    right,
}
export enum TextFormat {
    normal,
    convert
}

/**
 * 文本控件
 */
@widgetType('label', {icon: 'label_text', label: '文本'})
export class LabelViewWidget extends TreeWidget {
    type: string = 'label'

    @syncAttr({ key: 'label', label: '文本'})
    text?: string
    @syncAttr({ key: 'label', value: 'textSize', label: '字体大小'})
    fontSize?: number | string
    @syncAttr({ key: 'label', value: 'fontName', label: '字体'})
    fontFamily?: string
    // @syncAttr({ key: 'label'})
    fontColor: Color
    @syncAttr({ key: 'label', value: 'maxLines', label: '最大行数'})
    maxLine?: number | string
    @syncAttr({ key: 'label', value: 'format', label: '格式化方式'})
    textFormat?: TextFormat
    @syncAttr({ key: 'label', label: '最大宽度'})
    maxWidth?: number | string
    @syncAttr({ key: 'label', value: 'ellipsize', label: '末尾处理方式'})
    textOverflow?: TextOverflow
    @syncAttr({ key: 'label', value: 'gravity', label: '对齐方式'})
    alignment?: Alignment
    constructor({
        text,
        fontSize,
        fontFamily,
        fontColor,
        maxLine,
        textFormat,
        maxWidth,
        textOverflow,
        alignment,
        ...superOptions
    }: LabelWidgetOptions) {
        super(superOptions);

        this.text = text;
        this.fontSize = fontSize || '';
        this.fontFamily = fontFamily;
        this.fontColor = fontColor || new Color(0, 0, 100, 1);
        this.maxLine = maxLine || '';
        this.textFormat = textFormat || TextFormat.normal;
        this.maxWidth = maxWidth || '';
        this.textOverflow = textOverflow;
        this.alignment = alignment;
        makeObservableWithWidget(this, {
            text: observable,
            fontSize: observable,
            fontFamily: observable,
            fontColor: observable,
            maxLine: observable,
            textFormat: observable,
            maxWidth: observable,
            textOverflow: observable,
            alignment: observable,
            setText: action,
            setFontSize: action,
            setFontFamily: action,
            setFontColor: action,
            setMaxLine: action,
            setTextFormat: action,
            setMaxWidth: action,
            setTextOverflow: action,
            setAlignment: action
        });
        this.registerTracks();
    }

    /**
     * @override
     */
    registerTracks(): void {
        // 注册undo/redo
        mobxTrackStates(this, [
            { read: () => this.text, write: (text: string) => this.setText(text) },
            { read: () => this.fontSize, write: (fontSize: string | number) => this.setFontSize(fontSize) },
            { read: () => this.fontFamily, write: (fontFamily: string) => this.setFontFamily(fontFamily) },
            { read: () => this.fontColor, write: (fontColor: Color) => this.setFontColor(fontColor) },
            { read: () => this.maxLine, write: (maxLine: string | number) => this.setMaxLine(maxLine) },
            { read: () => this.textFormat, write: (textFormat: TextFormat) => this.setTextFormat(textFormat) },
            { read: () => this.maxWidth, write: (maxWidth: number | string) => this.setMaxWidth(maxWidth) },
            { read: () => this.textOverflow, write: (textOverflow: TextOverflow) => this.setTextOverflow(textOverflow) },
            { read: () => this.alignment, write: (alignment: Alignment) => this.setAlignment(alignment) },
        ]);
        super.registerTracks();
    }

    setText(text?: string) {
        this.text = text;
    }

    setFontSize(fontSize?: number | string) {
        this.fontSize = fontSize;
    }

    setFontFamily(fontFamily?: string) {
        this.fontFamily = fontFamily;
    }

    setFontColor(color: Color) {
        this.fontColor = color;
    }
    
    setMaxLine(maxLine?: number | string) {
        this.maxLine = maxLine;
    }
    
    setTextFormat(textFormat: TextFormat) {
        this.textFormat = textFormat;
    }

    setMaxWidth(maxWidth?: number | string) {
        this.maxWidth = maxWidth;
    }

    setTextOverflow(textOverflow?: TextOverflow) {
        this.textOverflow = textOverflow;
    }

    setAlignment(alignment?: Alignment) {
        this.alignment = alignment;
    }

    toJson(): Partial<Node> {
        const childrenJson: Array<Node> = [];
        this.visitChildren(child => {
            const currChild = child as TreeWidget;
            childrenJson.push(currChild.toJson() as Node);
        });

        return {
            id: this.id,
            name: this.type,
            desc: this.name,
            prop: omitBy({
                layout: layoutToJson(this),
                isDispatchOnClickEvent: this.attachOnClick,
                visible: this.visible,
                maxLines: this.maxLine,
                format: this.textFormat === TextFormat.convert ? "1" : "",
                maxWidth: this.maxWidth,
                ellipsize: this.textOverflow,
                gravity: "1",
                text: this.text,
                textSize: this.fontSize,
                fontName: this.fontFamily,
                textColor: {
                    color: this.fontColor.hex,
                    alpha: this.fontColor.a
                },
            }, item => item === '' || isUndefined(item)),
            child: childrenJson,
            data: syncsToJson(this),
        }
    }
}
