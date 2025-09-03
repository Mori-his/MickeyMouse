import { HTMLWithWidgetAttr } from "@/types/components/leftContainer/tree/tree";
import { PureIconButton } from "@components/basic/iconButton";
import { ConfirmControl } from "@components/basic/common/confirm/confirm";
import ownerCaretaker, { OwnerCaretaker } from "@models/owners";
import Tippy from "@tippyjs/react";
import { widgetAttrName } from "@utils/styleTool";
import { TreeWidget } from "@widgets/treeWidget";
import { observer } from "mobx-react";
import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { useTreeContext } from "./hooks/useTreeContext";

interface TreeItemWrapperProps {
    active?: boolean
    draging?: boolean
}

const TreeItemHoverCss = css`
    background-color: ${props => props.theme.blue400};
    .tree-shrink  {
        flex-shrink: 0;
    }
    .tree-shrink .svg-fill {
        fill: #fff;
    }
    .tree-item-name {
        color: ${props => props.theme.lightText};
    }
`;
const TreeItemActiveCss = css`
    background-color: ${props => props.theme.blue700};
    .tree-shrink  {
        flex-shrink: 0;
    }
    .tree-shrink .svg-fill {
        fill: #fff;
    }
    .tree-item-name {
        color: ${props => props.theme.lightText};
    }
`;

interface TreeItemBoxProps {
    isDrag: boolean
}
const TreeItemBox = styled.div<TreeItemBoxProps>`
    position: relative;
    box-sizing: border-box;
    min-width: 180px;
    ${props => props.isDrag && `
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            box-sizing: border-box;
            height: 32px;
            border: 1px dashed #fff;
            border-radius: 8px;
            background-color: ${props.theme.primary};
            opacity: 0.6;
        }
    `};

    .tree-shrink {
        width: 32px;
    }
`;

const TreeItemWrapper = styled.div<TreeItemWrapperProps>`
    position: relative;
    display: flex;
    align-items: center;
    height: 32px;
    transition: background .3s;
    border-radius: 8px;
    margin: 2px 0;
    background: ${props => props.theme.main};
    ${props => props.active && TreeItemActiveCss};
    &:hover {
        ${props => !props.draging && TreeItemHoverCss};
    }
`;

interface TreeItemState {
    isSetting?: boolean
}

const TreeItemName = styled.span<TreeItemState>`
    color: ${props => props.theme.white40};
    font-weight: bold;
    font-size: 12px;
    ${props => props.isSetting && `
        margin-right: 96px;
    `};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

const TreeItemSettings = styled.div`
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
`;
const TreeItemShrinkBox = styled.div`
    width: 16px;
    height: 32px;
`;

interface TreeItemProps {
    widget: TreeWidget
    paddingLeft?: number
    onClick?: Function
    onShrink?: (shrink: boolean) => any
}

/**
 * 树状结构单节点
 * 节点只管理当前节点的状态显示，不处理节点增删改查操作
 */
export const TreeItem = observer(function(props: TreeItemProps) {
    const treeContext = useTreeContext();

    const {
        widget,
        paddingLeft,
        onClick = () => {},
        onShrink = () => {}
    } = props;
    const { currWidget } = ownerCaretaker.currOwner;
    const [showSetting, setShowSetting] = useState(false);
    const enterTarget = useRef(false);
    // 当前Treeitem最外层元素
    const treeItemRef = useRef(null);
    const owner = widget.owner as OwnerCaretaker;
    // 鼠标移入目标元素显示设置按钮
    const handleMouseEnter = function(event: React.MouseEvent) {
        setShowSetting(true);
        enterTarget.current = true;
    }
    // 鼠标移出当前节点
    const handleMouseLeave = function(event: React.MouseEvent) {
        // 如果是选中元素 移除后不隐藏设置按钮
        enterTarget.current = false;
        if (currWidget === widget) return;
        setShowSetting(false);
    }

    // 展开/收起按钮被点击
    const handleShrinkClick = function(event: React.MouseEvent) {
        event.stopPropagation();
        onShrink(!widget.shrink);
    }
    const handleDragStart = function(event: React.DragEvent<HTMLDivElement>) {
        event.dataTransfer.setData('text/plain', '');
        event.dataTransfer.dropEffect = 'move';
    }

    useEffect(() => {
        if (!enterTarget.current) {
            setShowSetting(currWidget === widget);
        }

        widget.__el = treeItemRef.current || undefined;
    }, [currWidget, widget]);

    useEffect(() => {
        if (treeItemRef.current) {
            // 把当前widget和元素做一次绑定
            // 主要用于拖拽时方便获取到指定widget
            (treeItemRef.current as HTMLWithWidgetAttr)[widgetAttrName] = widget;
            widget.__el = treeItemRef.current;
        }
    }, [widget]);
    return (
        <TreeItemBox
            isDrag={ !widget.lock && owner?.targetWidget === widget }
            >
            <TreeItemWrapper
                ref={ treeItemRef }
                onDragStart={ handleDragStart }
                draggable={ !widget.lock && !widget.forbidMove && ownerCaretaker.currOwner?.isMove }
                onMouseEnter={ handleMouseEnter }
                onMouseLeave={ handleMouseLeave }
                style={{ paddingLeft }}
                active={ currWidget === widget}
                onClick={_ => (!widget.lock && onClick())}
                draging={ Boolean(owner?.targetWidget) }
                >
                {
                    // 当前节点有子元素的时候才会展示展开收起按钮
                    widget.childCount ? <PureIconButton
                        icon={!widget.shrink ? "minus" : "plus" }
                        className="tree-shrink"
                        defaultColor="#fff"
                        onClick={ handleShrinkClick }
                        />
                    : <TreeItemShrinkBox />
                }
                <Tippy
                    content={`[${widget.type}]${ widget.name || '无说明'}`}
                    delay={ [500, 0] }
                    arrow={ false }
                    animation="scale"
                    theme="light"
                    trigger={ ownerCaretaker.targetWidget ? 'click' : 'mouseenter focus' }
                    >
                    <TreeItemName
                        className="tree-item-name"
                        isSetting={ showSetting }
                        >
                        [{widget.type}]{ widget.name || '无说明'}
                    </TreeItemName>
                </Tippy>
                {/* 
                // 只有鼠标移入此节点或者选中此节点时才显示此设置项
                // 设置下包含 锁定/解锁、删除、隐藏
                */}
                <TreeItemSettings>
                    {/* {
                        treeContext.mode !== 'view' &&
                        showSetting &&
                        widget.type !== 'root' &&
                            <PureIconButton
                                icon="delete"
                                defaultColor="#fff"
                                hoverColor="#ff0000"
                                size={ 24 }
                                $title="删除此节点"
                                onClick={(event: Event) => {
                                    event.stopPropagation();
                                    ConfirmControl.open({
                                        content: '确认要删除吗？'
                                    }).then((confirm) => {
                                        confirm.onClose();
                                        (widget.parent as TreeWidget).remove(widget);
                                    });
                                }}
                                />
                    } */}
                    {
                        treeContext.mode !== 'view' && (showSetting || widget.lock) &&
                            <PureIconButton
                                icon={ widget.lock ? 'lock' : 'unlock'}
                                defaultColor="#fff"
                                size={ 24 }
                                $title={ widget.lock ? '解锁' : '锁定' }
                                onClick={(event: Event) => {
                                    event.stopPropagation();
                                    widget.setLock(!widget.lock);
                                }}
                                />
                    }
                    {
                        treeContext.mode !== 'view' && (showSetting || !widget.visible) &&
                            <PureIconButton
                                icon={widget.visible ? 'eye' : 'eyeClose'}
                                defaultColor="#fff"
                                size={ 24 }
                                $title={widget.visible ? '隐藏' : '显示'}
                                onClick={(event: Event) => {
                                    event.stopPropagation();
                                    widget.setVisible(!widget.visible);
                                }}
                                />
                    }
                </TreeItemSettings>
            </TreeItemWrapper>
        </TreeItemBox>
    );
});