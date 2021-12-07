import styled from "styled-components"

const CenterWrapper = styled.section`
    margin: 0 auto;
    color: #fff;
`;
const LayoutContainer = styled.div`
    position: relative;
    width: 375px;
	height: 667px;
    border-radius: 20px;
    background-color: #393e46;
`;
const LayoutTitle = styled.h1`
    margin: 68px 0 8px 8px;
`;

export default function CenterContainer() {
    return (
        <CenterWrapper>
            <LayoutTitle>项目名称</LayoutTitle>
            <LayoutContainer></LayoutContainer>
        </CenterWrapper>
    )
}
