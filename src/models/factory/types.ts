export type Layout =  {
    l: number | string
    t: number | string
    r: number | string
    b: number | string
    w: number | string
    h: number | string
    // 横向居中
    centerLand: number
    // 垂直居中
    centerPort: number
    widthAuto: number
    heightAuto: number
}
export type NodeColor = {
    color: string
    alpha: number
}

export type BgGradient = {
    orientation: string
    colors: Array<NodeColor>
}

export type TRound = {
    borderWidth: string | number
    color: string
    alpha: string | number
    radius: string | number
    borderColor: Partial<NodeColor>
}

export type State = {
    empty: Node
    video: Node
    audio: Node
}

export type GenderUrl = {
    F: string
    M: string
    N: string
}

export type Res = {
    image: string
    animation: string
}

export interface UserAttr {
    id: string | number
    uid: string
    pos: string
}

export type NodeProps = {
    layout: Partial<Layout>
    bgGradient: BgGradient
    bgColor: NodeColor
    textColor: NodeColor
    round: TRound
    isDispatchOnClickEvent: boolean
    visible: boolean
    states: State
    maxLines: string | number
    // 格式化方式 0 默认，正常数字，1：千/万转换
    format: '0' | '1'
    maxWidth: string | number
    // 末尾处理方式：0：... 1: 截断默认, 2:跑马灯
    ellipsize: '0' | '1' | '2'
    // 对齐方式 0：居左，1：居右，2：居中
    gravity: '0' | '1' | '2'
    url: string
    fansWidth: string | number
    fansBorderWidth: string | number
    fansMargin: string | number
    genderUrl: Partial<GenderUrl>
    mode: string | number
    blur: string | number
    src: string
    text: string
    textSize: string | number
    fontName: string
    openSrc: string
    closeSrc: string
    res: Partial<Res>
    seat: string | number
    video: string | number
    sn: string
    sn_h265: string
    camera:  number | string
    uid:  string
    relay:  string
    // agora_game
    usedBy: string
    asHost: '0' | '1'
    asGuest: '0' | '1'
    userList: UserAttr[]
    zoom: { to?: string }
    bigger: number | string
    zoomable: number | string
    mute: number | string
    // lyrics组件
    lyrics: Object                          // 歌词数据
    highlightTextColor: NodeColor           // 高亮歌词颜色
    normalTextColor: NodeColor              // 普通歌词颜色
    highlghtTextSize: number                // 高亮歌词字体大小，默认20
    normalTextSize: number                  // 普通歌词字体大小，默认17
    numberOfRows: number                    // 歌词行数，默认值为2，ios通过总高度除以行数计算行高度
    contentSize: {
        w: string | number,
        h: string | number
    }
    stream: Object
}

export type TEmoticon = {
    l: string | number
    t: string | number
    w: string | number
}

// RootSetting的类型定义
export type TSetting = {
    contentHeight: string | number
    minMsgsViewHeight: string | number
    layoutBySafeArea: string | number
    chatAreaMarginTop?: string | number
    canvasMargin?: string | number
}


export type Node = {
    id: string | number
    ___imageComponent?: string | Object
    name: string
    prop: Partial<NodeProps>
    desc: string,
    child: Node[],
    game: string | number
    bgLayout?: Node
    h5Config: string
    h5Data: Object
    data: { [key: string]: string}
    setting: Partial<TSetting>
    emoticon?: Partial<TEmoticon>
}
