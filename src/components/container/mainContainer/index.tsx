import React from "react";
import styled from "styled-components";
import Tabs from "../tabs";
import TabSettings from "../tabSettings";


const MainContainerWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

function MainContainer() {
    return (
        <MainContainerWrapper>
            <Tabs />
            <TabSettings />
        </MainContainerWrapper>
    )
}

export default MainContainer;


