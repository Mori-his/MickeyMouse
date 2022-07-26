import BasicNode, { ContainerNodeMixin, ContainerParentDataMixin, IBasicNode, ParentData } from "./object";
import cloneDeep from 'lodash/cloneDeep';
import { IAdaptivePosition } from "./position";
import { AdaptiveSize, IAdaptiveSize, Size } from "./sizeBox";
import { PositionRailLine } from "@components/container/layoutPage/rightContainer/layoutPanel/railLine/sizeRailLine";

export class LayoutParentData extends ParentData {
    detach() {
        super.detach();
    }
}

export interface ILayout {
}
export interface LayoutOptions {
}

export class Layout extends BasicNode implements ILayout {

    
    /**
     * 设置子节点的[ParentData]
     * @param child 要设置[parentData]的子节点
     * @override
     */
    setupParentData(child: BasicNode) {
        if (!(child.parentData instanceof LayoutParentData))
            child.parentData = new LayoutParentData();
    }

    /**
     * 关联子节点
     * @param child 要关联的子节点
     * @override
     */
    adoptChild(child: BasicNode) {
        this.setupParentData(child);
        super.adoptChild(child);
    }
}

export interface WidgetOptions {
    id: string | number // 当前控件ID
    name?: string // 当前控件名称
    description?: string // 当前控件描述信息
    visible?: boolean // 显示隐藏
    attachOnClick?: boolean // 是否给当前[Widget]增加点击事件
    position: IAdaptivePosition
    size: IAdaptiveSize
}

// [ParentData]可以实现一些相对于父元素的定位信息
// 如果想自定义ParentData尝试混入[ContainerParentDataMixin]
export class WidgetParentData extends ContainerParentDataMixin<Layout>(LayoutParentData) {
    
    detach() {
        super.detach();
    }
}
export abstract class Widget extends ContainerNodeMixin<Layout, WidgetParentData>(Layout) {
    /**
     * 节点唯一ID
     */
    id!: string | number
    /**
     * 节点名称信息
     */
    name?: string
    /**
     * 节点描述信息
     */
    description?: string
    /**
     * 是否默认显示， 默认： true
     */
    visible: boolean
    /**
     * 是否可被点击
     */
    attachOnClick: boolean



    position!: IAdaptivePosition
    size!: IAdaptiveSize

    abstract type: string

    constructor({
        id,
        name,
        description,
        visible,
        attachOnClick,
        position,
        size,
        ...superOptions
    }: WidgetOptions) {
        super(superOptions);
        this.id = id;
        this.name = name;
        this.description = description;
        this.visible = typeof visible !== 'undefined' ? Boolean(visible) : true;
        this.attachOnClick = typeof visible !== 'undefined' ? Boolean(attachOnClick) : false;
        this.position = position;
        this.size = size;
    }

    /**
     * 设置子节点的[ParentData]
     * @param child 要设置[parentData]的子节点
     * @override
     */
    setupParentData(child: BasicNode) {
        if (!(child.parentData instanceof LayoutParentData))
            child.parentData = new WidgetParentData();
    }

    /**
     * 关联子节点
     * @param child 要关联的子节点
     * @override
     */
    adoptChild(child: BasicNode) {
        this.setupParentData(child);
        super.adoptChild(child);
    }

    setWidthAdaptive(widthAdaptive: boolean): void {
        this.size.setWidthAdaptive(widthAdaptive);
    }

    setHeightAdaptive(heightAdaptive: boolean): void {
        this.size.setHeightAdaptive(heightAdaptive);
    }

    setWidth(width: number | string): void {
        this.size.setWidth(width);
    }

    setHeight(height: number | string): void {
        this.size.setHeight(height);
    }

    setHorizontal(horizontal: boolean): void {
        this.position.setHorizontal(horizontal);
    }

    setVertical(vertical: boolean): void {
        this.position.setVertical(vertical);
    }

    setLeft(left?: number): void {
        this.position.setLeft(left);
    }

    setTop(top?: number): void {
        this.position.setTop(top);
    }

    setRight(right?: number): void {
        this.position.setRight(right);
    }

    setBottom(bottom?: number): void {
        this.position.setBottom(bottom);
    }

    setAttachOnClick(newValue: boolean) {
        this.attachOnClick = newValue;
    }

    setVisible(newValue: boolean) {
        this.visible = newValue;
    }

    setId(id: string | number) {
        this.id = id;
    }
    setName(name: string) {
        this.name = name;
    }


    setType(newType: string) {
        // 需要抽象工厂创建此类型Widget
    }

    abstract toJson(): Object;
}


