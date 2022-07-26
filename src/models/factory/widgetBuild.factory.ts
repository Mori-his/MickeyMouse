import { nanoid } from "nanoid";
import { WidgetOptions } from "@layout/core/layout";
import { TreeWidget } from "@widgets/treeWidget";
import { Layout, Node, State } from './types';
import Color from "@layout/utils/color";
import { Direction, LinearGradientdirection } from "@layout/core/gradient";
import { Border, BorderRadius, BorderSide, Radius } from "@layout/core/boxBorder";
import { WidgetTypeManage } from "./widgetTypeClassManage";
import { RootWidget } from "@widgets/root";
import { ObserveAdaptivePosition, ObservePosition } from "@widgets/observeLayout/observePosition";
import { ObserveAdaptiveSize, ObserveSize } from "@widgets/observeLayout/observeSize";
import { LabelWidgetOptions, TextFormat, TextOverflow, Alignment as LabelAlignment } from "@widgets/label";
import { Emoticon } from "@widgets/seatView";

function presetValue<T = number>(value?: T): T | string {
    if (typeof value !== 'undefined') return value;
    return '';
}

function setPosition(layout?: Partial<Layout>) {
    const _layout = {
        left: presetValue(layout?.l),
        top: presetValue(layout?.t),
        right: presetValue(layout?.r),
        bottom: presetValue(layout?.b)
    };
    const position = new ObserveAdaptivePosition({
        position: {
            left: _layout.left,
            top: _layout.top,
            right: _layout.right,
            bottom: _layout.bottom,
        },
        horizontal: Boolean(layout?.centerLand),
        vertical: Boolean(layout?.centerPort),
    });
    return position;
}

function setSize(layout?: Partial<Layout>) {
    const _layout = {
        width: presetValue(layout?.w),
        height: presetValue(layout?.h),
        widthAuto: Boolean(layout?.widthAuto),
        heightAuto: Boolean(layout?.heightAuto),
    }
    const sizeBox = new ObserveAdaptiveSize({
        size: new ObserveSize(
            _layout.width,
            _layout.height
        ),
        widthAdaptive: _layout.widthAuto,
        heightAdaptive: _layout.heightAuto,
    });
    return sizeBox;
}



export function initializeWidgetParams(options: Partial<Node>) {
    
    let params: WidgetOptions & {
        [x: string]: any
    } = {
        id: options.id || nanoid(10),
        name: options.desc,
        width: options.prop?.layout?.w,
        height: options.prop?.layout?.h,
        position: setPosition(options.prop?.layout),
        size: setSize(options.prop?.layout)
    };

    
    
    if (options.prop) {
        // 图片地址以及图片效果
        if (options.name === 'image') {
            params.src = options.prop.src;
            params.blur = options.prop.blur;
            params.fit = options.prop.mode;
        }
        // 背景颜色
        if (options.prop.bgColor && options.prop.bgColor.color) {
            const bgColor = options.prop.bgColor;
            const rgb = Color.hexToRGB(bgColor.color as string);
            if (typeof rgb !== 'string') {
                const hsb = Color.rgbToHsb(rgb.r, rgb.g, rgb.b);
                params.background = new Color(hsb.h, hsb.s, hsb.b, +bgColor.alpha);
            }
        }

        // 渐变开始
        if (options.prop.bgGradient) {
            const bgGradient = options.prop.bgGradient;
            const colors: Color[] = [];
            type ItemColor = {color: string, alpha: number}
            bgGradient.colors?.forEach((item: ItemColor) => {
                const rgb = Color.hexToRGB(item.color);
                if (typeof rgb !== 'string') {
                    const hsb = Color.rgbToHsb(rgb.r, rgb.g, rgb.b);
                    colors.push(new Color(hsb.h, hsb.s, hsb.b, +item.alpha));
                }
            });
            let linearGradient;
            if (+bgGradient.orientation === 1) {
                // 从左到右
                linearGradient = new LinearGradientdirection(
                    Direction.toRight,
                    colors,
                );
            } else {
                linearGradient = new LinearGradientdirection(
                    Direction.toRight,
                    colors,
                );
            }
            params.background = linearGradient;
        }
        // 圆角处理
        if (options.prop.round) {
            const round = options.prop.round;
            // 圆角
            if (typeof round.radius === 'string' || typeof round.radius === 'number') {
                params.fillet = BorderRadius.all(Radius.circular(+round.radius));
            }
            if (typeof round.borderWidth === 'string' || typeof round.borderWidth === 'number') {
                const sideParams: {
                    width: number
                    color?: Color
                } = {
                    width: +round.borderWidth,
                };
                if (round.borderColor) {
                    try {
                        const rgb = Color.hexToRGB(round.borderColor.color!);
                        if (typeof rgb !== 'string') {
                            const hsb = Color.rgbToHsb(rgb.r, rgb.g, rgb.b);
                            // 可能是Undefined
                            sideParams.color = new Color(hsb.h, hsb.s, hsb.b, round.borderColor.alpha!);
                        }
                    } catch(err) {
                        console.error('请输入正确的边框颜色:', options);
                        console.error(err);
                    }
                }
                params.border = Border.fromBorderSide(new BorderSide(sideParams)) 
            }
        }
        // 文本颜色
        if (options.prop.textColor && options.prop.textColor.color) {
            let rgb;
            try {
                rgb = Color.hexToRGB(options.prop.textColor.color);
                
            } catch(err) {
                console.error('请输入正确的Color值,位置在：', options);
            }
            if (rgb && typeof rgb !== 'string') {
                const hsb = Color.rgbToHsb(rgb.r, rgb.g, rgb.b);
                const alpah = options.prop.textColor.alpha
                params.fontColor = new Color(
                    hsb.h,
                    hsb.s,
                    hsb.b,
                    +alpah > -1 ? options.prop.textColor.alpha : 1
                );
            }
        }
        // 文本最大行数
        if (options.prop.maxLines) {
            (params as LabelWidgetOptions).maxLine = +options.prop.maxLines;
        }
        // 文本格式化方式
        if (options.prop.format) {
            (params as LabelWidgetOptions).textFormat = options.prop.format === '1' ? TextFormat.convert : TextFormat.normal;
        }
        // 文本最大宽度
        if (options.prop.maxWidth) {
            (params as LabelWidgetOptions).maxWidth = +options.prop.maxWidth;
        }
        // 文本超出后尾部截取方式
        if (options.prop.ellipsize) {
            let textOverflow;
            if (options.prop.ellipsize === '1') {
                textOverflow = TextOverflow.clip;
            } else if (options.prop.ellipsize === '2') {
                textOverflow = TextOverflow.swiper;
            }
            (params as LabelWidgetOptions).textOverflow = textOverflow;

        }
        // 文本居中方式
        if (options.prop.gravity) {
            let alignment = LabelAlignment.left;
            if (options.prop.gravity === '1') {
                alignment = LabelAlignment.right;
            } else if (options.prop.gravity === '2') {
                alignment = LabelAlignment.center;
            }
            (params as LabelWidgetOptions).alignment = alignment;
        }
        // sync绑定
        if (options.data) {
            const syncs = [];
            for (const key in options.data) {
                syncs.push({
                    key: key,
                    value: options.data[key]
                });
            }
            params.syncs = syncs;
        }

        if (options.emoticon) {
            params.emoticon = new Emoticon({
                width: options.emoticon.w || '',
                left: options.emoticon.l || '',
                top: options.emoticon.t || '',
            });
        }

        params.text = options.prop.text;
        params.fontSize = options.prop.textSize;
        params.fontFamily = options.prop.fontName;
        params.visible = 'visible' in options.prop ? options.prop.visible : true ;
        params.attachOnClick = options.prop.isDispatchOnClickEvent;
        params.usedBy = options.prop.usedBy;
        params.seat =  options.prop.seat;
        params.video =  options.prop.video;
        params.camera =  options.prop.camera;
        params.snH265 =  options.prop.sn_h265;
        params.sn =  options.prop.sn;
        params.uid =  options.prop.uid;
        params.relay =  options.prop.relay;
    }
    if (options.game) {
        params.gameId = options.game;
    }

    if (options.h5Config) {
        params.config = options.h5Config;
    }

    if (options.h5Data) {
        params.h5Data = options.h5Data;
    }
    return params;
}

export const initRootWidget = function () {
    return new RootWidget({
        id: nanoid(10),
        position: new ObserveAdaptivePosition({
            position: new ObservePosition({
                left: '',
                top: '',
                right: '',
                bottom: ''
            })
        }),
        size: new ObserveAdaptiveSize({
            size: new ObserveSize(),
        })
    });
}

const widgetTypeManage = WidgetTypeManage.getInstance();


function createWidget(node: Node): TreeWidget {
    const widgetType = widgetTypeManage.get(node.name);
    if (!widgetType) {
        console.log(node);
        console.error(`没有查询到[${node.name}]对象请检查节点是否被实现或载入.`);
        return initRootWidget();
    }
    const { value: Widget } = widgetType;
    const newWidget = new Widget(initializeWidgetParams(node)) as TreeWidget;
    return newWidget;
}



type ParentQueue = {widget: TreeWidget, countChild: number}
// 广度优先创建树节点
export function widgetBuildBFS(treeJson: Node): TreeWidget {
    if (typeof treeJson !== 'object') {
        console.warn('导入的不是一个JSON');
        return initRootWidget();
    }
    if (!treeJson.name) {
        console.warn('当前导入组件的根节点没有name')
        return initRootWidget();
    }

    const queues: Node[] = [];
    const parentQueues: ParentQueue[] = [];
    let rootWidget: TreeWidget = initRootWidget();
    queues.push(treeJson)

    while(queues.length) {
        const newNode = queues.shift()!;
        const newWidget = createWidget(newNode!);
        if (newNode.name === 'root') {
            rootWidget = newWidget;
        }
        // 取出当前父节点
        let currParent: ParentQueue;
        if (parentQueues.length) {
            currParent = parentQueues[0];
            currParent.widget.add(newWidget);
            currParent.countChild--;
            if (currParent.countChild === 0) {
                parentQueues.shift();
            }
        }

        const parent = {
            widget: newWidget,
            countChild: 0,
        }
        if (newNode.bgLayout) {
            // 如果有背景
            queues.push(newNode.bgLayout);
            parent.countChild++;
        }
        if (newNode.prop && newNode.prop.states) {
            // 座位下 有音视频的控件
            for (let key in newNode.prop.states) {
                queues.push(newNode.prop.states[key as keyof State]);
                parent.countChild++;
            }
        }
        if (newNode.child && newNode.child.length) {
            // 如果有子元素
            for (let i = 0; i < newNode.child.length; i++) {
                queues.push(newNode.child[i]);
                parent.countChild++;
            }
        }


        if (parent.countChild) {
            // 如果有子节点
            parentQueues.push(parent);
        }
    }
    return rootWidget;
}


export function widgetBuildFactory(treeJson: Node): TreeWidget {
    if (typeof treeJson !== 'object') {
        console.warn('导入的不是一个JSON');
        return initRootWidget();
    }
    if (!treeJson.name) {
        console.warn('当前导入组件的根节点没有name')
        return initRootWidget();
    }

    const widgetType = widgetTypeManage.get(treeJson.name);
    if (!widgetType) {
        console.error(`没有查询到[${treeJson.name}]对象请检查节点是否被实现或载入.`);
        return initRootWidget();
    }
    const { value: Widget } = widgetType;
    const root = new Widget(initializeWidgetParams(treeJson)) as TreeWidget;

    if (treeJson.bgLayout) {
        root.addAll(widgetBuildChildren([treeJson.bgLayout]));
    }
    if (treeJson.child && treeJson.child.length) {
        const widgets = widgetBuildChildren(treeJson.child);
        root.addAll(widgets)
    }
    if (treeJson.prop && treeJson.prop.states) {
        const widgets = widgetBuildState(treeJson.prop.states);
        if (widgets) {
            root.addAll(widgets);
        }
    }
    return root;
}

function widgetBuildChildren(children: Node[]) {
    let results: TreeWidget[] = [];
    children.forEach((child: Node) => {
        const widgetType = widgetTypeManage.get(child.name);
        if (!widgetType) {
            console.error(`没有查询到[${child.name}]对象请检查节点是否被实现或载入.`);
            return;
        }
        const { value: Widget } = widgetType;
        const currNodeWidget = new Widget(initializeWidgetParams(child)) as TreeWidget;
        if (child.child instanceof Array) {
            const widgets = widgetBuildChildren(child.child);
            currNodeWidget.addAll(widgets)
        }
        if (child.prop && child.prop.states) {
            const widgets = widgetBuildState(child.prop.states);
            if (widgets) {
                currNodeWidget.addAll(widgets);
            }
        }
        results.push(currNodeWidget);
    });
    return results;
}

function widgetBuildState(states: State) {
    if (!states) return;
    let results = [];
    for (let key in states) {
        const child = states[key as keyof State];
        const widgetType = widgetTypeManage.get(child.name);
        if (!widgetType) {
            console.error(`没有查询到[${child.name}]对象请检查节点是否被实现或载入.`);
            continue;
        }
        const { value: Widget } = widgetType;
        const currNodeWidget = new Widget(initializeWidgetParams(child)) as TreeWidget;
        if (child.child instanceof Array) {
            const widgets = widgetBuildChildren(child.child);
            currNodeWidget.addAll(widgets)
        }
        results.push(currNodeWidget);
    }
    return results;
}




