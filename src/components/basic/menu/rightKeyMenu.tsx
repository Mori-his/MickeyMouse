import React, { ComponentProps, ForwardedRef, forwardRef, PropsWithChildren, useImperativeHandle } from "react";
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

export type TMenuItemWith<P = {}> = P & {
    text: string
    tips?: string
    disabled?: boolean
    children?: TMenuItemWith[]
}

type PropsWithRightKeyMenu<P = {}> = P & {
    menus: TMenuItemWith<ComponentProps<'div'>>[]
    itemClick?: (menuItem: TMenuItemWith, index: number) => void
}
/**
 * TODO
 * 1、菜单包含分割线数据结构设计
 * 2、实现分割组件 Divider
 * 3、实现多层Tippy的菜单
 */
const RightKeyMenu = forwardRef(function RightKeyMenu(
    props: PropsWithRightKeyMenu<ComponentProps<'div'>>,
    divRef: ForwardedRef<HTMLDivElement>
) {
    const {
        ref,
        menus,
        itemClick = () => {},
        ...divProps
    } = props;
    // useImperativeHandle(
    //   ref,
    //   () => ({
    //     getValue() {}
    //   }),
    //   []
    // );    


    return (
        <MenuWrapper
            ref={ divRef }
            { ...divProps }
            >
            {
                menus.map(({ref, text, disabled, tips, onClick = () => {}, ...itemProps}, index) => (
                    <RightKeyMenuItem
                        key={ text }
                        disabled={ disabled }
                        after={ tips }
                        onClick={ (event: React.MouseEvent<HTMLDivElement>) => {
                            itemClick(menus[index], index);
                            onClick(event);
                        }}
                        { ...itemProps }
                        >
                        { text }
                    </RightKeyMenuItem>
                ))
            }
        </MenuWrapper>
    );
});

interface MenuItemWrapperProps {
    disabled: boolean
}
const MenuItemWrapper = styled.div<MenuItemWrapperProps>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 24px;
    margin: 0 8px;
    padding: 0 8px;
    font-size: 12px;
    color: ${props => props.disabled ? props.theme.lesser : props.theme.lightText};
    border-radius: 8px;
    cursor: default;
    &:hover {
        background-color: ${props => props.theme.assist};
    }
`;
const MenuItemText = styled.span`
`;
const MenuItemTip = styled.span`

`;

type RightKeyMenuItemPropsWith<P = {}> = P & {
    // 当前项是否被禁止
    disabled?: boolean
    after?: React.ReactNode
}

export const RightKeyMenuItem = forwardRef(function RightKeyMenuItem(
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
                    <MenuItemTip>
                        { after }
                    </MenuItemTip>
                ) : null
            }
        </MenuItemWrapper>
    );

})

export default RightKeyMenu;

