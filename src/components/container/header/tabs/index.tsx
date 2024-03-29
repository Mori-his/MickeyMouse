// import { observer } from 'mobx-react';
import React, { ReactElement } from "react";
import styled from "styled-components";
import ownerCaretaker, { Owner } from "@models/owners";
import { HiddenScrollbar } from "@styles/globals";
import AppendButton from "@components/basic/appendButton";
import Tab, { TabProps } from "@components/basic/tab";
import { observer } from "mobx-react";

/**
 * ===========================================================
 *                  styled-components
 * ===========================================================
 */

const TabsWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    background-color: ${props => props.theme.main};
    overflow-y: hidden;
    overflow-x: auto;
    .append-button {
        margin-left: 16px;
    }
`;

const HideScrollbarTabsWrapper = styled(TabsWrapper)`
    ${HiddenScrollbar}
`

/**
 * ===========================================================
 *                  TabList组件
 * 1、TabList组件依赖于[ownerCaretaker]
 * 2、TabList接受[onChange, onClose]事件回调
 * 3、TabList接受[tabIndex]默认选中索引，下标从0开始
 * ===========================================================
 */
type TagCallback = (event: Event, owner: Owner, index: number) => any
export interface TagListProps {
    onChange?: TagCallback
    onClose?: TagCallback
    tabIndex: number
}
export const TagList = observer((props: React.PropsWithChildren<TagListProps>) => {
    let tabs: ReactElement<TabProps>[] = [];
    
    // 勿删此操作，因Mobx依赖收集，如果没有observable属性的引用不会尝试更新此组件
    // 此组件使用的是访问者模式无侵入源代码，所以如果不增加此[childCount]会导致收集不到
    if (ownerCaretaker.childCount === 0) return <React.Fragment />
    
    // 当前tab选中状态被改变
    const onChangeIndex = function(event: Event, childNode: Owner, index: number) {
        props.onChange && props.onChange(event, childNode, index);
    }

    // 当前tab名称被改变
    const handleNameChange = function(name: string, child: Owner) {
        if (name === '') return;
        child.setName(name);
    }

    ownerCaretaker.visitChildren((child: any, index: number) => {
        const childNode: Owner = child as Owner;
        tabs.push(
            <Tab
                key={index}
                active={index === props.tabIndex}
                onClick={(e: Event) => onChangeIndex(e, childNode, index)}
                onClose={(e: Event) => props.onClose && props.onClose(e, childNode, index)}
                onNameChange={ (name: string) => handleNameChange(name, childNode) }
                $title={ childNode.name }
            >{ childNode.name }</Tab>
        );
    })

    return (
        <React.Fragment>
            { tabs }
        </React.Fragment>
    )
});


export interface TabsProps {
    onChange?: Function
    onClose?: Function
}

const handleApeendClick = function(event: Event) {
    event.stopPropagation();
    const owner = new Owner();
    ownerCaretaker.add(owner);
    ownerCaretaker.selectedOwner(owner, ownerCaretaker.childCount - 1);
}


const Tabs = observer((props: React.PropsWithChildren<TabsProps>) => {
    const handleCloseClick = function(event: Event, owner: Owner, index: number) {
        event.stopPropagation();
        ownerCaretaker.remove(owner);
        props.onClose && props.onClose(event, owner, index)
    }
    const handleTabChange = function(event: Event, owner: Owner, activeIndex: number) {
        event.stopPropagation();
        ownerCaretaker.selectedOwner(owner, activeIndex);
    }
    return (
        <HideScrollbarTabsWrapper>
            <TagList
                tabIndex={ ownerCaretaker.selectIndex }
                onClose={ handleCloseClick }
                onChange={ handleTabChange }
                />
            <AppendButton
                className="append-button"
                onClick={handleApeendClick}
                />
        </HideScrollbarTabsWrapper>
    );
});

export default Tabs;

