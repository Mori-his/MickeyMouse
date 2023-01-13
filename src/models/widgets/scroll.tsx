import { ScrollRender } from "@components/container/layoutPage/rightContainer/widgets/scroll";
import { WidgetOptions } from "@layout/core/layout";
import { Node } from "@models/factory/types";
import { widgetType } from "@models/factory/widgetTypeClassManage";
import { action, makeObservable, observable } from "mobx";
import { ViewWidget } from "./view";


export interface IContentSizeProps {
    width: string | number
    height: string | number
}
export interface IContentSize extends IContentSizeProps {
    setWidth(width: string | number): void
    setHeight(height: string | number): void
}

export class ContentSize implements IContentSize {
    width!: string | number;
    height!: string | number;
    constructor(props: IContentSizeProps) {
        this.width = props.width || '';
        this.height = props.height || '';
        makeObservable(this, {
            width: observable,
            height: observable,
            setWidth: action,
            setHeight: action,
        })
    }
    setWidth(width: string | number) {
        this.width = width;
    }
    setHeight(height: string | number) {
        this.height = height;
    }
}


export interface ScrollWidgetOptions extends WidgetOptions{
    contentSize: IContentSizeProps
}


@widgetType('scroll', {icon: 'view_text', label: '滑动容器组件'})
export class ScrollWidget extends ViewWidget {
    type: string = 'scroll';

    // 必填项
    contentSize!: IContentSize
    
    constructor({
        contentSize,
        ...superProps
    }: ScrollWidgetOptions) {
        super(superProps);
        this.contentSize = new ContentSize({
            width: contentSize?.width || '',
            height: contentSize?.height || '',
        });
        makeObservable(this, {
        });
    }

    toJson(): Partial<Node> {
        const obj = super.toJson();
        const scroll = {
            contentSize: {
                w: this.contentSize.width || 0,
                h: this.contentSize.height || 0
            }
        };

        obj.prop = {
            ...obj.prop,
            ...scroll,
        }
        return obj;
    }

    render() {
        return <ScrollRender />
    }
}
