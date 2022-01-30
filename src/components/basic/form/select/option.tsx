import styled, { css } from "styled-components";


export type OptionStyleWithProps<P = {}> = P & Partial<{
    bgColor: string
    hoverBgColor: string
    hoverColor: string
    color: string
    selected?: boolean
}>

const selectedColor = css<OptionStyleWithProps>`
    ${props => props.selected ? `
        background-color: ${props.hoverBgColor || '#469ADB'};
        color: ${props.hoverColor || props.theme.lightText};
    ` : `
        background-color: ${props.bgColor || props.theme.primary};
        color: ${props.color || props.theme.lightText};
    `}
`;

const OptionWrapper = styled.div<OptionStyleWithProps>`
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 8px;
    ${selectedColor};
    &:hover {
        ${props => `
            background-color: ${props.hoverBgColor || '#469ADB'};
            color: ${props.hoverColor || props.theme.lightText};
        `};
    }
`;


interface OptionProps {
    onClick?: Function
    children?: React.ReactNode
}


export default function Option(props: OptionStyleWithProps<OptionProps>) {
    const { selected = false } = props;
    return (
        <OptionWrapper
            { ...props }
            selected={ selected }
            onClick={e => props.onClick && props.onClick(e)}
            >
            <span>{ props.children }</span>
        </OptionWrapper>
    );
}

