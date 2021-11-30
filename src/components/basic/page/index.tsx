import styled from "styled-components";


const PageButtonWrapper = styled.div<{$active: boolean}>`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 112px;
    height: 40px;
    color: ${props => props.$active ? '#fff' : '#666'};
    background-color: ${props => props.$active ? '#2a313c' : '#222831'}
`;

const PageButton = styled.div``;

const CloseWrapper = styled.div`
    position: absolute;
    left: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
`;



export interface PageBtnProps {
    closeOnClick: Function
    active: boolean
    children: React.ReactNode
}

export default function PageBtn(props: PageBtnProps) {
    return (
        <PageButtonWrapper $active={props.active}>
            <PageButton>{ props.children }</PageButton>
            <CloseWrapper>

            </CloseWrapper>
        </PageButtonWrapper>
    );
}




