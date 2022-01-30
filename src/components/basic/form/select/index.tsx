import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Option from "./option";
import theme from "@styles/layout.theme";
import IconButton from "../../iconButton";
import { IconProps } from "@components/basic/svgs/icons";

interface SelectWrapperProps {
    isUnfold: boolean
    bgColor?: string
    activeBgColor?: string
    optionActiveBgColor?: string
    optionBgColor?: string
}

const SelectWrapper = styled.div<SelectWrapperProps>`
    position: relative;
    z-index: 1;
    height: 32px;
    line-height: 32px;
    ${props => `
        background-color: ${props.bgColor || props.theme.primary};
        color: ${props.$color || '#fff'};
    `};
    ${props => props.isUnfold ? `
        color: #fff;
        border-radius: 8px 8px 0 0;
        background-color: ${props.activeBgColor} 
    ` : `
        border-radius: 8px;
        transition: border-radius .3s .1s;
    `};
    font-size: 12px;
    user-select: none;
    transition: background .5s;
`;

const SelectValue = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0 0 8px;
    height: 32px;
    box-sizing: border-box;
`;

const SelectOptionsWrapper = styled.div<SelectWrapperProps>`
    transition: opacity .5s, visibility .6s;
    border-radius: 0 0 8px 8px;
    padding: 8px 0;
    box-sizing: border-box;
    ${props => `
        background-color: ${props.bgColor};
        box-shadow: 0 1px 6px ${props.optionBgColor || props.theme.primary};
    `};
    ${props => props.isUnfold ? `
        opacity: 1;
        background-color: ${props.optionActiveBgColor};
    ` : `
        visibility: hidden;
        opacity: 0;
    `};
`;

const ArrowIconButton = styled(IconButton)`
    margin-right: 8px;
`;


export type TSelectTheme = 'dark' | 'light';

export interface ISelectThemeItem {
    bgColor: string
    color: string
    activeBgColor: string
    optionBgColor: string
    optionActiveBgColor: string
    optionHoverBgColor: string
    optionColor: string
    optionHoverColor: string
}
export interface ISelectTheme {
    dark: ISelectThemeItem
    light: ISelectThemeItem
}

const selectTheme: ISelectTheme = {
    dark: {
        bgColor: theme.primary,
        activeBgColor: theme.primary,
        color: theme.lightText,
        optionBgColor: theme.primary,
        optionActiveBgColor: theme.primary,
        optionHoverBgColor: theme.assist,
        optionColor: theme.lightText,
        optionHoverColor: theme.lightText,
    },
    light: {
        bgColor: theme.light,
        activeBgColor: theme.lesser,
        color: theme.primary,
        optionBgColor: theme.lesser,
        optionActiveBgColor: theme.lesser,
        optionHoverBgColor: theme.assist,
        optionColor: theme.primary,
        optionHoverColor: theme.lightText,
    }
}


export function selectOption(options: Array<IOption>, id: number) {
    const filterOptions = options.filter(option => option.id === id);
    if (filterOptions && filterOptions[0]) return filterOptions[0];
    return options[0];
}

export interface IOption<T = {}, P = number> {
    name: string
    value?: T
    id?: P
}

type PropsWithSelect<T = number> = {
    onChangeOption?: Function
    theme?: TSelectTheme
    options: Array<IOption>
    defaultOptionId?: T
    width?: number
}

export default function Select(props: PropsWithSelect) {
    const { theme = 'light', defaultOptionId } = props;
    const [isUnfold, setIsUnfold] = useState(false);
    const [currOption, setCurrOption] = useState(props.options[0])
    const currTheme = selectTheme[theme];
    useEffect(() => {
        if (typeof defaultOptionId === 'number') {
            setCurrOption(selectOption(props.options, defaultOptionId));
        }
    }, [defaultOptionId, props.options]);

    const handleOptionChange = function(e: Event, option: IOption) {
        if (option.id === currOption.id) return;
        setCurrOption(option);
        props.onChangeOption && props.onChangeOption(e, option)
    }

    useEffect(() => {
        const handleDocClick = function() {
            isUnfold && setIsUnfold(false);
        }
        document.addEventListener('click', handleDocClick);
        return () => {
            document.removeEventListener('click', handleDocClick);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUnfold]);

    return (
        <SelectWrapper
            isUnfold={ isUnfold }
            onClick={e => { e.stopPropagation();setIsUnfold(!isUnfold)} }
            bgColor={ currTheme.bgColor }
            activeBgColor={ currTheme.optionActiveBgColor }
            $color={ currTheme.color }
            style={{ width: props.width }}
            >
            <SelectValue>
                { currOption.name }
                <ArrowIconButton
                    icon="arrowDown"
                    color="transparent"
                    hoverBgColor="transparent"
                    hoverColor={ currTheme.color }
                    size={24}
                    defaultColor={ currTheme.color }
                    />
            </SelectValue>
            <SelectOptionsWrapper
                isUnfold={ isUnfold }
                bgColor={ currTheme.bgColor }
                optionActiveBgColor={ currTheme.optionActiveBgColor }
                optionBgColor={ currTheme.optionBgColor }
                >
                {
                    props.options.map(option => (
                        <Option
                            key={option.name}
                            bgColor={ currTheme.optionBgColor }
                            hoverBgColor={ currTheme.optionHoverBgColor }
                            color={ currTheme.optionColor}
                            hoverColor={ currTheme.optionHoverColor}
                            selected={option.id === currOption.id}
                            onClick={(e: Event) => handleOptionChange(e, option)}
                            >
                            { option.name }
                        </Option>
                    ))
                }
            </SelectOptionsWrapper>
        </SelectWrapper>
    );
}





