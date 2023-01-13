
export type LayoutConfigItem = {
    /**
     * 布局ID
     */
    layoutId: number
    /**
     * 布局名称
     */
    layoutName: string
    /**
     * 布局描述信息
     */
    layoutDesc: string
    /**
     * 归属平台ID
     */
    platformId: number
}
export type LayoutConfig = {
    /**
     * 平台ID
     */
    platFormId: number
    /**
     * 平台名称
     */
    platformName: string
    /**
     * 平台序号
     */
    platformSeq: number
    /**
     * 平台Logo
     */
    platformIcon: string
    /**
     * 当前平台列表
     */
    layoutConfigList: Array<LayoutConfigItem>
}
