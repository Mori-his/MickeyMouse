import styled from "styled-components";


const OptionWrapper = styled.div`
    &:hover {
        background-color: #469ADB;
        color: #fff;
    }
`;

type OptionStyleWithProps<P> = P & {
    hoverColor: string
    color: string
    fontSize: number
}

interface OptionProps<T = string> {
    name: string
    value: T
    onSelected?: Function
}

export default function Option<T = string>(props: OptionStyleWithProps<OptionProps<T>>) {

    return (
        <OptionWrapper
            onClick={e => props.onSelected && props.onSelected(props)}
            >
            <span>{ props.name }</span>
        </OptionWrapper>
    );
}

