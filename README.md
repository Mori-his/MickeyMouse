# MickeyMouse
布局配置


> 统一布局配置系统，主要应用于APP中动态布局配置。  

## 功能点划分：  
一、当前页面设置项  
> 也可以有用户系统，然后服务端存储用户配置信息.  


1、座位默认显示状态  
- 座位默认显示主要应用于当客户端加载布局是默认显示的状态（待确认）

2、导入配置项  
- 根据指定好的JSON规则加载对应布局

3、导出配置项  
- 根据设置好的布局配置导出对应的布局

4、当前布局数据配置项  
- 当前布局中额外的数据配置项用于对特殊布局做出相应处理

5、本地存储/服务端存储功能  
- 本地存储当前配置项或者有用户系统根据当前用户存储当前配置项

二、布局管理配置

### $\color{red}{节点}$
> - `节点`代表了一个`控件`的配置项
> - 节点都必须存在一个`ID`,
> - 节点的特性属性由节点类型决定
> - 节点都有统一的`id`、`name`、`name`,`prop`、`layout`、`child`属性
> - 节点支持右键功能 *右键功能待补充*
> - 节点可删除，除根节点外


### $\color{red}{节点的基本结构(只包含通用结构体)}$
```ts
interface NodeProp {
  layout?: {
    // [left] 相对父元素的左边距离
    l?: number
    // [top] 相对父元素的上边边距离
    t?: number
    // [right] 相对父元素的右边距离
    r?: number
    // [bottom] 相对父元素的下边距离
    b?: number
    // [width] 当前控件的宽度
    w?: number
    // [height] 当前控件的高度
    h?: number
    // 宽度是否自适应 0：false 1: true, 默认0
    // 根据内容撑大容器
    widthAuto?: 0 | 1
    // 高度是否自适应 0：false 1: true, 默认0
    // 根据内容撑大容器
    heightAuto: 0 | 1
    // 是否垂直居中 0：false 1: true, 默认0
    centerPort?: 0 | 1
    // 是否水平居中 0：false 1: true, 默认0
    centerLand?: 0 | 1
  }
  // 是否有点击事件，默认false
  isDispatchOnClickEvent: boolean
  // 是否显示，默认显示
  visible: boolean
}
interface Node {
  id: string
  name: string
  desc: string
  data: {
    // 绑定`sync`
    // 主要包含[NodeProp]第一层的属性
    [key in keyof NodeProp]: string
  }
  prop: NodeProp
}

```

1、根节点
- 每一个布局必须包含根节点，且只能有一个  
- 根节点不能被拷贝  

2、普通控件节点  
- 普通节点可以移动位置  
- 可拷贝  
- 可粘贴  
- 可拖动  
- 可同步其它相同类型节点  
- 支持跨布局同步相同节点（待定）

三、节点介绍

### 节点类型

