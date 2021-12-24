import { PureIconButton } from "@components/basic/iconButton";
import { TreeWidget } from "@layout/core/layout";
import BasicNode from "@layout/core/object";
import ownerCaretaker from "@models/owners";
import Tippy from "@tippyjs/react";
import { autorun } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";



const depthPaddingNum = 8

const TreeWrapper = styled.div``;

export default observer(function Tree() {
    return (
        <TreeWrapper>
            { CompositeItem(ownerCaretaker.currOwner) }
        </TreeWrapper>
    );
});




interface TreeItemPaddingProps {
    paddingLeft?: number
}
const TreeItemPadding = styled.div<TreeItemPaddingProps>`
    ${props => props.paddingLeft && `
        padding-left: ${props.paddingLeft}px;
    `};
    overflow: hidden;
`;

interface TreeItemGroupProps {
    paddingLeft?: number
    widget: TreeWidget
}
export const TreeItemGroup = observer(function (props: React.PropsWithChildren<TreeItemGroupProps>) {
    const { paddingLeft, widget } = props;
    return (
        <TreeItemPadding

            style={{height: widget.shrink ? 0 : 'auto'}}
            paddingLeft={ paddingLeft }
            >
            { props.children }
        </TreeItemPadding>
    );
})


const CompositeItem = function(child: BasicNode, depth: number = 0) {
    let items: Array<React.ReactChild> = [];
    const parentWidget = child as TreeWidget;
    // 此判断是为了让mobx得到最外层wedget更新
    if (!parentWidget.childCount) return [];
    child.visitChildren((visitChild: BasicNode) => {
        const currChild = visitChild as TreeWidget;
        // 如果没有监听的就不需要[observer]
        const OBTreeItem = observer(() => {
            return (
                <TreeItem
                    widget={currChild}
                    onClick={() => {
                        if (ownerCaretaker.currWidget === currChild) {
                            ownerCaretaker.selectedWidget();
                        } else {
                            ownerCaretaker.selectedWidget(currChild);
                        }
                    }}
                    onShrink={(shrink: boolean) => currChild.setShrink(shrink)}
                    />
            );
        });
        items.push(currChild.childCount ?
            <OBTreeItem key={currChild.id} />
            : <TreeItemGroup
                key={currChild.id}
                widget={ currChild }
                >
                <OBTreeItem />
            </TreeItemGroup>
        );
        // 递归循环子元素
        if (currChild.childCount) {
            const OBTreeItemWrapper = observer(() => {
                return (
                    <TreeItemGroup
                        paddingLeft={ (depth + 1) * depthPaddingNum }
                        widget={ currChild }
                        >
                        { CompositeItem(currChild, depth + 1) }
                    </TreeItemGroup>
                )
            });
            items = items.concat(<OBTreeItemWrapper key={`${depth + 1}-${currChild.id}`}/>);
        }
    });
    return items;
}


interface TreeItemWrapperProps {
    active?: boolean
}

const TreeItemHoverCss = css`
    background-color: ${props => props.theme.assist};
    .tree-shrink .svg-fill {
        fill: #fff;
    }
    .tree-item-name {
        color: ${props => props.theme.lightText};
    }
`;

const TreeItemWrapper = styled.div<TreeItemWrapperProps>`
    position: relative;
    display: flex;
    align-items: center;
    height: 32px;
    transition: background .3s;
    border-radius: 8px;
    margin: 4px 0;
    ${props => props.active && TreeItemHoverCss};
    &:hover {
        ${ TreeItemHoverCss }
    }
`;

interface TreeItemState {
    isSetting?: boolean
}

const TreeItemName = styled.span<TreeItemState>`
    color: ${props => props.theme.lesser};
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
    width: 32px;
    heihgt: 32px;
`;

interface TreeItemProps {
    widget: TreeWidget
    paddingLeft?: number
    onClick?: Function
    onShrink?: (shrink: boolean) => any
}

export const TreeItem = observer(function(props: TreeItemProps) {
    const {
        widget,
        paddingLeft,
        onClick = () => {},
        onShrink = () => {}
    } = props;
    const currWidget = ownerCaretaker.currWidget;
    const [showSetting, setShowSetting] = useState(false);
    const enterTarget = useRef(false);
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
    const handleShrinkClick = function() {
        onShrink(!widget.shrink);
    }
    useEffect(() => {
        if (!enterTarget.current) {
            setShowSetting(currWidget === widget);
        }
    }, [currWidget, widget]);
    return (
        <TreeItemWrapper
            onMouseEnter={ handleMouseEnter }
            onMouseLeave={ handleMouseLeave }
            style={{ paddingLeft }}
            active={ currWidget === widget }
            onClick={e => onClick()}
            >
            {
                // 当前节点有子元素的时候才会展示展开收起按钮
                widget.childCount ? <PureIconButton
                    icon={!widget.shrink ? "minus" : "plus" }
                    className="tree-shrink"
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
                >
                <TreeItemName
                    className="tree-item-name"
                    isSetting={ showSetting }
                    >
                    [{widget.type}]{ widget.name || '无说明'}
                </TreeItemName>
            </Tippy>
            {
                // 只有鼠标移入此节点或者选中此节点时才显示此设置项
                // 设置下包含 锁定/解锁、删除、隐藏
                showSetting ? (
                    <TreeItemSettings>
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
                        <PureIconButton
                            icon="delete"
                            defaultColor="#fff"
                            hoverColor="#ff0000"
                            size={ 24 }
                            $title="删除此节点"
                            onClick={(event: Event) => {
                                event.stopPropagation();
                                (widget.parent as TreeWidget).remove(widget);
                            }}
                            />
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
                    </TreeItemSettings>
                ) : null
            }
        </TreeItemWrapper>
    );
});
