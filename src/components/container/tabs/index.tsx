import { observer } from 'mobx-react';
import React, { ReactElement, useState } from "react";
import styled from "styled-components";
import { Owner, OwnerCaretaker } from "../../../model/owners";
import { HiddenScrollbar } from "../../../styles/globals";
import AppendButton from "../../basic/appendButton";
import Tab, { TabProps } from "../../basic/tab";

const TabsWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    background-color: #222831;
    overflow-y: hidden;
    overflow-x: auto;
    .append-button {
        margin-left: 16px;
    }
`;

const HideScrollbarTabsWrapper = styled(TabsWrapper)`
    ${HiddenScrollbar}
`


const ownerCaretaker = OwnerCaretaker.getInstance();

export interface TagIteratorProps {
    onChange?: Function
    closeOnclick?: Function
    tabIndex: number
}
export const TagIterator = observer((props: React.PropsWithChildren<TagIteratorProps>) => {
    const onChangeIndex = function(event: Event, index: number) {
        props.onChange && props.onChange(event, index);
    }
    let tabs: ReactElement<TabProps>[] = [];

    if (ownerCaretaker.childCount === 0) return <React.Fragment />

    ownerCaretaker.visitChildren((child, index) => {
        const childNode: Owner = child as Owner;
        tabs.push(
            <Tab
                key={index}
                active={index === props.tabIndex}
                onClick={(e: Event) => onChangeIndex(e, index)}
            >{ childNode.name }</Tab>
        );
    })

    return (
        <React.Fragment>
            { tabs }
        </React.Fragment>
    )
})


export interface TabsProps {
    onChange?: Function
    closeOnClick?: Function
}

const handleApeendClick = function(event: Event) {
    event.stopPropagation();
    const owner = new Owner();
    ownerCaretaker.add(owner);
}
const Tabs = observer((props: React.PropsWithChildren<TabsProps>) => {
    const handleTabOnChange = function(event: Event, activeIndex: number) {
        event.stopPropagation();
        ownerCaretaker.updateSelectedIndex(activeIndex)
    }
    return (
        <HideScrollbarTabsWrapper>
            <TagIterator
                tabIndex={ ownerCaretaker.selectIndex }
                closeOnclick={ props.closeOnClick }
                onChange={ handleTabOnChange }
                />
            <AppendButton
                className="append-button"
                onClick={handleApeendClick}
                />
        </HideScrollbarTabsWrapper>
    );
})

export default Tabs;

