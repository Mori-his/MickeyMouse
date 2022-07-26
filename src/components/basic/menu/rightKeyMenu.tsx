import { Menu, MenuItem } from "@models/menu";
import { observer } from "mobx-react";
import React, { ComponentProps, ForwardedRef, forwardRef, PropsWithChildren, useCallback } from "react";
import styled from "styled-components";

const MenuWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 8px 0;
    border-radius: 8px;
    min-width: 184px;
    ${props => `
        border: 0.5px solid ${props.theme.lesser};
        background-color: ${props.theme.complementaryColor};
        box-shadow: 0 3px 6px rgba(0, 0, 0, .5);
    `};
`;

type PropsWithRightKeyMenu<P = {}> = P & {
    menus: Menu
    itemClick?: (menuItem: MenuItem, index: number) => void
}
/**
 * TODO
 * 1、菜单包含分割线数据结构设计
 * 2、实现分割组件 Divider
 * 3、实现多层Tippy的菜单
 */
const RightKeyMenu = observer(forwardRef(function RightKeyMenu(
    props: PropsWithRightKeyMenu<ComponentProps<'div'>>,
    divRef: ForwardedRef<HTMLDivElement>
) {
    const {
        menus,
        itemClick = () => {},
    } = props;


    const handleTreeContextMenu = useCallback(function(event: React.MouseEvent<HTMLDivElement>) {
        event.preventDefault();
    }, []);

    return (
        <MenuWrapper
            ref={ divRef }
            onContextMenuCapture={ handleTreeContextMenu }
            >
            {
                menus.map((menuItem, index) => {
                    const item = menuItem as unknown as MenuItem;
                    return <RightKeyMenuItem
                        key={ item.text }
                        disabled={ item.disable }
                        after={ item.shortcutsTip }
                        onClick={ () => {
                            itemClick(item, index);
                            item.onClick(item, index);
                            menus.onClick(item, index);
                        }}
                        >
                        { item.text }
                    </RightKeyMenuItem>
                })
            }
        </MenuWrapper>
    );
}));

interface MenuItemWrapperProps {
    disabled: boolean
}
const MenuItemWrapper = styled.div<MenuItemWrapperProps>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 24px;
    margin: 0 4px;
    padding: 0 8px;
    font-size: 12px;
    border-radius: 8px;
    cursor: default;
    ${
        props => props.disabled ? `
            color: ${props.theme.lesser};
            cursor: not-allowed;
        ` : `
            color: ${props.theme.lightText};
            &:hover {
                background-color: ${props.theme.assist};
                .menuItemTip {
                    color: ${props.theme.lightText};
                }
            }
        `
    };
    
`;
const MenuItemText = styled.span`
`;
const MenuItemTip = styled.span`
    color: ${props => props.theme.lesser};
    letter-spacing: 4px;
`;

type RightKeyMenuItemPropsWith<P = {}> = P & {
    // 当前项是否被禁止
    disabled?: boolean
    after?: React.ReactNode
}

export const RightKeyMenuItem = observer(forwardRef(function RightKeyMenuItem(
    props: PropsWithChildren<
            RightKeyMenuItemPropsWith<
                React.ComponentProps<
                    'div'
                >
            >
        >,
    divRef: ForwardedRef<HTMLDivElement>
) {
    const {
        ref,
        after,
        disabled = false,
        children,
        ...divProps
    } = props;

    return (
        <MenuItemWrapper
            { ...divProps }
            disabled={ disabled }
            ref={ divRef }
            >
            <MenuItemText>{ children }</MenuItemText>
            {
                after ? (
                    <MenuItemTip className="menuItemTip">
                        { after }
                    </MenuItemTip>
                ) : null
            }
        </MenuItemWrapper>
    );

}));

export default RightKeyMenu;

