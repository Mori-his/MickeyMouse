import { MediaRender } from "@components/container/layoutPage/rightContainer/widgets/media";
import { Border, BorderRadius, BorderSide } from "@layout/core/boxBorder";
import { LinearGradientdirection } from "@layout/core/gradient";
import { WidgetOptions } from "@layout/core/layout";
import Color from "@layout/utils/color";
import { backgroundToJson, borderToJson, layoutToJson, syncsToJson } from "@models/factory/toJson";
import { Node, TRound } from "@models/factory/types";
import { widgetType } from "@models/factory/widgetTypeClassManage";
import { mobxTrackStates } from "@models/owners";
import syncAttr from "@models/syncManage/manage";
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype";
import { isUndefined, omitBy } from "lodash";
import { action, observable } from "mobx";
import { Exterior } from "./interface/widgetInterface";
import { TreeWidget } from "./treeWidget";

export enum ECamera {
    NOT_PUSH = 0,
    PUSH_ONE = 1,
    PUSH_TWO = 2,
}
export type TCameraItem = {
    value: ECamera,
    label: string
};

export const CameraList: TCameraItem[] = [
    {
        value: ECamera.NOT_PUSH,
        label: '优先级0，不可被推流',
    },
    {
        value: ECamera.PUSH_ONE,
        label: '优先级1，当客户端处于推流状态时，优先往值为1的组件上推',
    },
    {
        value: ECamera.PUSH_TWO,
        label: '优先级2，当客户端需要推两路流时，第二路流往值为2的组件上推',
    }
];


export enum EVideoMode {
    NOT_ALLOW = 0,
    ALLOW_AUDIO_VIDEO = 1,
    ALLOW_VIDEO = 2,
}
export type TVideoMode = {
    label: string
    value: EVideoMode
}

export const VideoModes: TVideoMode[] = [
    {
        label: '不允许使用视频模式，音频模式上麦',
        value: EVideoMode.NOT_ALLOW,
    },
    {
        label: '允许使用视频模式，音频模式上麦',
        value: EVideoMode.ALLOW_AUDIO_VIDEO,
    },
    {
        label: '仅允许视频模式上麦',
        value: EVideoMode.ALLOW_VIDEO,
    }
]


export interface MediaWidgetOptions extends WidgetOptions{
    seat?: number | string
    video?: number | string
    camera?: number | string
    snH265?: string
    sn?: string
    uid?: string
    relay?: string
    fillet?: BorderRadius
    border?: Border
    background?: Color | LinearGradientdirection
}


@widgetType('media', {icon: 'widget_text', label: '媒体座位'})
export class MediaWidget extends TreeWidget implements Exterior {
    type: string = 'media';
    
    @syncAttr({key: 'media', label: '流信息(relay)'})
    relay: string = '';
    
    @syncAttr({key: 'media', label: '用户ID'})
    uid: string = '';
    
    @syncAttr({key: 'media', label: 'sn'})
    sn: string = '';
    
    @syncAttr({key: 'media', value: "sn_h265",  label: 'sn_h265'})
    snH265: string = ''

    // 当为0时表示此组件不可被推流，当客户端处于推流状态时，优先往值为1的组件上推，当客户端需要推两路流时，第二路流往值为2的组件上推
    @syncAttr({key: 'media', label: '摄像头标识'})
    camera!: TCameraItem

    @syncAttr({ key: 'media', label: '视频模式'})
    video: TVideoMode = VideoModes[1]

    @syncAttr({key: 'media', label: '座位号'})
    seat!: number | string

    background: Color | LinearGradientdirection
    fillet: BorderRadius
    border: Border
    activeBackground: boolean;
    activeBorder: boolean;

    constructor({
        relay = '',
        uid = '',
        sn = '',
        snH265 = '',
        seat = '',
        camera,
        video,
        background,
        fillet = new BorderRadius({}),
        border,
        ...otherProps
    }: MediaWidgetOptions) {
        super(otherProps);

        this.relay = relay;
        this.uid = uid;
        this.snH265 = snH265;
        this.camera = typeof camera === 'number' ? CameraList[camera] : CameraList[1];
        this.video = typeof video === 'number' ? VideoModes[video] : VideoModes[1];
        this.seat = seat;

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
        this.activeBackground = Boolean(background);
        this.activeBorder = Boolean(border);

        makeObservableWithWidget(this, {
            relay: observable,
            uid: observable,
            sn: observable,
            snH265: observable,
            camera: observable,
            video: observable,
            seat: observable,
            activeBackground: observable,
            activeBorder: observable,
            background: observable,
            fillet: observable,
            border: observable,
            setRelay: action,
            setUid: action,
            setSN: action,
            setSNH265: action,
            setCamera: action,
            setVideo: action,
            setSeat: action,
            setActiveBackground: action,
            setActiveBorder: action,
            setBackground: action,
            setFillet: action,
            setBorder: action,
        });
        this.registerTracks();
    }
    /**
     * @override
     */
     registerTracks(): void {
        // 注册undo/redo
        mobxTrackStates(this, [
            { read: () => this.video, write: (videoMode: TVideoMode) => this.setVideo(videoMode) },
            { read: () => this.seat, write: (seat: number) => this.setSeat(seat) },
            { read: () => this.fillet, write: (fillet: BorderRadius) => this.setFillet(fillet) },
            { read: () => this.border, write: (border: Border) => this.setBorder(border) },
            { read: () => this.background, write: (color: Color | LinearGradientdirection) => this.setBackground(color) },
            { read: () => this.activeBackground, write: (active: boolean) => this.setActiveBackground(active) },
            { read: () => this.activeBorder, write: (active: boolean) => this.setActiveBorder(active) },
        ]);
        // 注册表情的监听
        super.registerTracks();
    }

    setActiveBackground(active: boolean): void {
       this.activeBackground = active;
    }
    setActiveBorder(active: boolean): void {
        this.activeBorder = active;
    }
    setBackground(color: Color | LinearGradientdirection): void {
        this.background = color;
    }
    setFillet(fillet: BorderRadius): void {
        this.fillet = fillet;
    }
    setBorder(side: BorderSide | Border) {
        if (side instanceof Border) {
            this.border = side;
        } else {
            this.border = Border.fromBorderSide(side);
        }
    }

    setRelay(newState: string) {
        this.relay = newState;
    }

    setUid(newState: string) {
        this.uid = newState;
    }

    setSN(newState: string) {
        this.sn = newState;
    }

    setSNH265(newState: string) {
        this.snH265 = newState
    }

    setCamera(newState: TCameraItem) {
        this.camera = newState;
    }

    setVideo(newState: TVideoMode) {
        this.video = newState;
    }

    setSeat(newState: string | number) {
        this.seat = newState;
    }

    render() {
        return <MediaRender />
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

        return {
            id: this.id,
            name: this.type,
            desc: this.name,
            prop: omitBy({
                layout: layoutToJson(this),
                ...background,
                ...round,
                isDispatchOnClickEvent: this.attachOnClick,
                visible: this.visible,
                states,
                seat: this.seat,
                video: this.video.value,
                camera: this.camera.value,
                uid: this.uid,
                sn: this.sn,
                sn_h265: this.snH265,
                relay: this.relay
            }, item => item === '' || isUndefined(item)),
            child: childrenJson,
            data: syncsToJson(this),
        };
    }
    
}