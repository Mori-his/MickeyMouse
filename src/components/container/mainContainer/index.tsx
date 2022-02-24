import React from "react";
import styled from "styled-components";
import Tabs from "@components/container/header/tabs";
import TabSettings from "@components/container/header/tabSettings";
import { useRouter } from "next/router";
import CenterContainer from "../centerContainer";
import LeftContainer from "../leftContaienr";
import RightContainer from "../rightContainer";


const MainContainerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: ${props => props.theme.main};
`;

const Header = styled.header`
    position: relative;
    z-index: 4;
`;

const Article = styled.article`
    display: flex;
    justify-content: center;
`;

function MainContainer() {
    const router = useRouter();
    const { id } = router.query;
    return (
        <MainContainerWrapper>
            <Header>
                <Tabs />
                <TabSettings />
            </Header>
            <Article>
                <LeftContainer />
                <CenterContainer />
                <RightContainer />
            </Article>
        </MainContainerWrapper>
    )
}

export default MainContainer;


