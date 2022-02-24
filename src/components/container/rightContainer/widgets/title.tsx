import Tippy from "@tippyjs/react";
import styled from "styled-components";


const TitleWrapper = styled.div`
    color: ${ props => props.theme.lightText};
    font-size: 16px;
`;


interface TitleProps {
    title: string
    tips?: string | React.ReactNode
}
export default function Title(props: TitleProps) {
    const { tips, title } = props;
    return (
        <Tippy
            content={ tips }
            disabled={ !tips }
            >
            <TitleWrapper>
                <span>{ title }</span>
            </TitleWrapper>
        </Tippy>
    ) 
}