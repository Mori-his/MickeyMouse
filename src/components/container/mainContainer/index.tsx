import React from "react";
import styled from "styled-components";
import Tabs from "@components/container/header/tabs";
import TabSettings from "@components/container/header/tabSettings";
import { useRouter } from "next/router";
import CenterContainer from "../centerContainer";
import LeftContainer from "../leftContaienr";


const MainContainerWrapper = styled.div`
    display: flex;
    flex-direction: column;
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
            <header>
                <Tabs />
                <TabSettings />
            </header>
            <Article>
                <LeftContainer />
                <CenterContainer />
            </Article>
        </MainContainerWrapper>
    )
}

export default MainContainer;


