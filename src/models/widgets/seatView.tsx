import styled from "styled-components";
import { action, makeObservable, observable } from "mobx";
import { Border, BorderRadius, BorderSide } from "@layout/core/boxBorder";
import { LinearGradientdirection } from "@layout/core/gradient";
import { WidgetOptions } from "@layout/core/layout"
import { TreeWidget } from "@widgets/treeWidget";
import syncAttr from "@models/syncManage/manage";
import Color from "@layout/utils/color";
import { backgroundToJson, borderToJson, layoutToJson, syncsToJson } from "@models/factory/toJson";
import { Node, TEmoticon, TRound } from "@models/factory/types";
import { widgetType } from "@models/factory/widgetTypeClassManage";
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype";
import { mobxTrackStates } from "@models/owners";
import { TitleCollapse } from "@components/container/common/title";
import { PureIconButton } from "@components/basic/iconButton";
import Input from "@components/basic/form/input/input";
import LightTippy from "@components/basic/toolTip/lightTippy";
import { Exterior } from "./interface/widgetInterface";
import { isNull, isUndefined, omitBy } from "lodash";
import { SeatViewRender } from "@components/container/layoutPage/rightContainer/widgets/seatView";




interface EmoticonProps {
    width: number | string
    left: number | string
    top: number | string
}
export class Emoticon {
    width!: number | string
    left!: number | string
    top!: number | string

    constructor({
        width,
        left,
        top
    }: EmoticonProps) {
        this.width = width;
        this.left = left;
        this.top = top;
        makeObservable(this, {
            width: observable,
            left: observable,
            top: observable,
            setWidth: action,
            setLeft: action,
            setTop: action,
        });
    }

    registerTracks(widget: TreeWidget) {
        // 注册undo/redo
        mobxTrackStates(widget, [
            { read: () => this.width, write: (width: number | string) => this.setWidth(width) },
            { read: () => this.left, write: (left: number | string) => this.setLeft(left) },
            { read: () => this.top, write: (top: number | string) => this.setTop(top) },
        ]);
    }

    setWidth(newValue: number | string) {
        this.width = newValue;
    }
    setLeft(newValue: number | string) {
        this.left = newValue;
    }
    setTop(newValue: number | string) {
        this.top = newValue;
    }
}
export type ValueLabel = {
    value: number
    label: string
}

export enum VideoMode {
    allowVA,
    allowVV,
    allowVAC,
    allowVVC,
    notAllowV
}
export type TSeatVideoMode = {
    [VideoMode.allowVA]: ValueLabel,
    [VideoMode.allowVV]: ValueLabel,
    [VideoMode.allowVAC]: ValueLabel,
    [VideoMode.allowVVC]: ValueLabel,
    [VideoMode.notAllowV]: ValueLabel,
}
// VA = video audio
// VV = video  video
// VAC = video audio control
// VVC = video video control
export const SeatVideoMode: TSeatVideoMode = {
    [VideoMode.allowVA]: {
        value: 0,
        label: '允许使用视频模式，不展示视频操作按钮，音频模式上'
    },
    [VideoMode.allowVV]: {
        value: 1,
        label: '允许使用视频模式，不展示视频操作按钮，视频模式上'
    },
    [VideoMode.allowVAC]: {
        value: 2,
        label: '允许使用视频模式，展示视频操作按钮，音频模式上麦'
    },
    [VideoMode.allowVVC]: {
        value: 3,
        label: '允许使用视频模式，展示视频操作按钮，视频模式上麦'
    },
    [VideoMode.notAllowV]: {
        value: 4,
        label: '不允许使用视频模式，不展示视频操作按钮，音频模式'
    }
}


export interface SeatViewWidgetOptions extends WidgetOptions{
    fillet?: BorderRadius
    border?: Border
    background?: Color | LinearGradientdirection
    emoticon?: Emoticon
    seat?: number | string
    asHost?: boolean
    asGuest: boolean
    videoMode?: VideoMode
}

/**
 * 座位控件
 * 1、创建座位控件时要自动添加一个空座位
 * 2、空座位和音视频控件要放到prop->states->{[empty, audio, video]}
 * 3、除了[empty, audio, video]外都放在child里面
 */
@widgetType('seatView', {icon: 'seat_text', label: '座位'})
export class SeatViewWidget extends TreeWidget implements Exterior {
    type: string = 'seatView'

    @syncAttr({ key: 'seatView', label: '座位号'})
    seat!: number | string

    @syncAttr({ key: 'seatView', label: '主持人上麦'})
    asHost!: boolean

    @syncAttr({ key: 'seatView', label: '用户上麦'})
    asGuest!: boolean

    background: Color | LinearGradientdirection

    fillet: BorderRadius

    border: Border
    // 视频模式
    @syncAttr({ key: 'seatView', value: 'video', label: '视频模式'})
    seatVideoMode: ValueLabel = SeatVideoMode[VideoMode.allowVA]
    // 表情
    emoticon: Emoticon
    activeEmoticon: boolean
    activeBackground: boolean;
    activeBorder: boolean;

    constructor({
        seat = '',
        asHost = false,
        asGuest = false,
        fillet = new BorderRadius({}),
        border,
        background,
        emoticon,
        videoMode,
        ...superOptions
    }: SeatViewWidgetOptions) {
        super(superOptions);
        this.seat = seat;
        this.asHost = asHost;
        this.asGuest = asGuest;
        this.fillet = fillet;
        this.background = background || new Color(0, 0, 100, 1);
        this.border = border || new Border(
            Border.fromBorderSide(
                new BorderSide({
                    color: new Color(0, 0, 100, 1),
                    width: 1
                })
            )
        );
        this.emoticon = emoticon || new Emoticon({
            width: '',
            left: '',
            top: ''
        });
        this.activeEmoticon = Boolean(emoticon);
        this.activeBackground = Boolean(background);
        this.activeBorder = Boolean(border);
        if (videoMode) {
            this.seatVideoMode = SeatVideoMode[videoMode];
        } else {
            this.seatVideoMode = SeatVideoMode[VideoMode.allowVA];
        }
        makeObservableWithWidget(this, {
            fillet: observable,
            border: observable,
            background: observable,
            activeBorder: observable,
            activeBackground: observable,
            seat: observable,
            asHost: observable,
            asGuest: observable,
            seatVideoMode: observable,
            activeEmoticon: observable,
            setBorder: action,
            setFillet: action,
            setAsHost: action,
            setAsGuest: action,
            setSeat: action,
            setVideoMode: action,
            setBackground: action,
            setActiveBackground: action,
            setActiveBorder: action,
            setActiveEmoticon: action
        });
        this.registerTracks();
    }

    /**
     * @override
     */
    registerTracks(): void {
        // 注册undo/redo
        mobxTrackStates(this, [
            { read: () => this.seatVideoMode, write: (videoMode: VideoMode) => this.setVideoMode(videoMode) },
            { read: () => this.asGuest, write: (asGuest: boolean) => this.setAsGuest(asGuest) },
            { read: () => this.asHost, write: (asHost: boolean) => this.setAsHost(asHost) },
            { read: () => this.seat, write: (seat: number) => this.setSeat(seat) },
            { read: () => this.fillet, write: (fillet: BorderRadius) => this.setFillet(fillet) },
            { read: () => this.border, write: (border: Border) => this.setBorder(border) },
            { read: () => this.background, write: (color: Color | LinearGradientdirection) => this.setBackground(color) },
            { read: () => this.activeBackground, write: (active: boolean) => this.setActiveBackground(active) },
            { read: () => this.activeBorder, write: (active: boolean) => this.setActiveBorder(active) },
            { read: () => this.activeEmoticon, write: (active: boolean) => this.setActiveEmoticon(active) },
        ]);
        // 注册表情的监听
        this.emoticon.registerTracks(this);
        super.registerTracks();
    }

    setActiveBackground(active: boolean): void {
        this.activeBackground = active;
    }
    setActiveBorder(active: boolean): void {
        this.activeBorder = active;
    }

    /**
     * 设置当前座位视频模式
     * @param videoMode 视频模式
     */
    setVideoMode(videoMode: VideoMode) {
        this.seatVideoMode = SeatVideoMode[videoMode];
    }

    /**
     * 设置是否是用户上麦
     * @param asGuest 是否是用户上麦
     */
    setAsGuest(asGuest: boolean) {
        this.asGuest = asGuest;
    }

    setBorder(side: BorderSide | Border) {
        if (side instanceof Border) {
            this.border = side;
        } else {
            this.border = Border.fromBorderSide(side);
        }
    }

    setFillet(fillet: BorderRadius) {
        this.fillet = fillet;
    }

    /**
     * 设置是否为主持人上麦
     * @param asHost 是否是主持人上麦
     */
    setAsHost(asHost: boolean) {
        this.asHost = asHost;
    }

    /**
     * 设置当前座位号
     * @param seatNumber 座位号
     */
    setSeat(seatNumber: number | string) {
        this.seat = seatNumber;
    }

    setBackground(color: Color | LinearGradientdirection) {
        this.background = color;
    }

    setActiveEmoticon(active: boolean) {
        this.activeEmoticon = active;
    }

    toJson(): Partial<Node> {
        const childrenJson: Array<Node> = [];
        const states: {
            empty?: Node
            video?: Node
            audio?: Node
        } = {};
        this.visitChildren(child => {
            const currChild = child as TreeWidget;
            switch(currChild.type) {
                case 'emptyView':
                    states.empty = currChild.toJson() as Node;
                    break;
                case 'videoView':
                    states.video = currChild.toJson() as Node;
                    break;
                case 'audioView':
                    states.audio = currChild.toJson() as Node;
                    break;
                default:
                    childrenJson.push(currChild.toJson() as Node);
            }
        });
        let background: any = {};
        if (this.activeBackground) {
            background = backgroundToJson(this.background);
        }
        let round: {round?: Partial<TRound>} = {};
        if (this.activeBorder) {
            round = borderToJson(this.border, this.fillet);
        }
        let emoticon: {emoticon?: Partial<TEmoticon>} = {};
        if (this.activeEmoticon) {
            emoticon = {
                emoticon: omitBy({
                    w: this.emoticon.width,
                    l: this.emoticon.left,
                    t: this.emoticon.top,
                }, value => value === '' || isUndefined(value) || isNull(value))
            };
        }

        return {
            id: this.id,
            name: this.type,
            desc: this.name,
            prop: {
                layout: layoutToJson(this),
                ...background,
                ...round,
                isDispatchOnClickEvent: this.attachOnClick,
                visible: this.visible,
                states,
                seat: this.seat,
                asHost: this.asHost,
                asGuest: this.asGuest,
            },
            child: childrenJson,
            ...emoticon,
            data: syncsToJson(this),
        };
    }

    render() {
        return <SeatViewRender />;
    }
}
