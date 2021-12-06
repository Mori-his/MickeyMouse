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
- 对接DMG后台导入配置项(待确认)，可能也是后续要考虑的  

3、导出配置项  
- 根据设置好的布局配置导出对应的布局  
- 直接同步至DOM布局(待确认)  

4、当前布局数据配置项  
- 当前布局中额外的数据配置项用于对特殊布局做出相应处理

5、本地存储/服务端存储功能  
- 本地存储当前配置项或者有用户系统根据当前用户存储当前配置项

6、扩展功能点  
- ID自动生产
- 完善预览当前配置
- 简化sync配置项
- 增加多页配置
- 增加多页配置项同步数据
- 完善每个节点的配置项

### 现有的布局配置痛点  
1、id手动设置，运营产品嫌弃太麻烦， 增加自动生成  
2、缺少预览模式  
3、sync配置太麻烦  
4、缺少多布局配置项同步/批处理  
5、音视频缺少音视频的配置项  

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
  round: {
    radius: number
    borderColor: {
      color: string,
      alpha: number
    }
  }
}
type SyncData = {
	[key in keyof NodeProp]: string
}
interface Node {
	id: string
	name: string
	desc: string
	// 绑定`sync`
	// 主要包含[NodeProp]第一层的属性	
	data: SyncData
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
- 可更改节点类型

## 三、节点介绍

### 节点类型

- 文本节点  
1、文本内容  
2、字体大小  
3、字体  
4、字体颜色  
5、最大行数  
6、最大宽度  
7、文本对齐包括左对齐右对齐居中
8、格式化-正常和以万、千万、亿为基本单位
10、展示类型  

|文本展示类型|说明|取值|
|:--:|:--:|:--:|
|走马灯|如果文本超出会以走马灯形式展示文本|2|
|截断|如果文本超出会截断字符串|1|
|省略号|如果文本超出会以省略号展示(测试文本...)|0|

- 图片节点  
1、url  
2、是否高斯模糊  
3、显示模式-裁剪模式 cover|conatin|fill  

- `view`节点
1、背景色  支持水平|垂直线性渐变
2、




四、sync数据同步
1、选择属性下拉框式
2、下拉框可自定义编辑key
3、手动输入sync表达式



###  节点注意事项
1、每个节点有的属性可以绑定sync有的属性不可以绑定`sync`


### 长宽比计算公式

nextWidth / width = scaleWidth 宽度放大缩小倍数
nextHeight / height = scaleHeight 高度放大缩小倍数

newHeight = scaleWidth * height
newWidth = scaleHeight * width



-----------------------------------
# 功能实现部分


1、音视频中会自动下发 音视频控件  最好创建音频和视频控件

2、配置项共享功能   
- 全用户共享  
- 指定用户共享  

