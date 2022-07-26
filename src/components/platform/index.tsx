import React from "react";
import styled from "styled-components";
import Header from '@components/platform/header/index';
import Container from '@components/platform/container/index';

const BaseLayoutWrapper = styled.div`
    width: 100%;
    height: 100vh;
`;

const ContainerWrapper = styled.div`
    height: calc(100vh - 88px);
    background-color: ${props => props.theme.contrast};
`;

function BaseLayout () {
    return (
        <BaseLayoutWrapper>
            <Header />
            <ContainerWrapper>
                <Container />
            </ContainerWrapper>
        </BaseLayoutWrapper>
    )
}
export default BaseLayout;