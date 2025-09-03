import React from "react";
import styled from "styled-components";
import Tabs from "@components/container/layoutPage/header/tabs";
import TabSettings from "@components/container/layoutPage/header/tabSettings";
import { useRouter } from "next/router";
// import CenterContainer from "../centerContainer";
// import LeftContainer from "../leftContaienr";
// import RightContainer from "../rightContainer";
import dynamic from 'next/dynamic';
import { CustomScrollbar } from "@styles/globals";
import { SideBar } from "../sideBar";

const DynamicRightContainer = dynamic(() => import('../rightContainer'), {
    loading({isLoading}) {
        return isLoading ? <>Loading...</> : null;
    },
})
const DynamicCenterContainer = dynamic(() => import('../centerContainer'), {
    loading({isLoading}) {
        return isLoading ? <>Loading...</> : null;
    },
})
const DynamicLeftContainer = dynamic(() => import('../leftContaienr'), {
    loading({isLoading}) {
        return isLoading ? <>Loading...</> : null;
    },
})

const MainWrapper = styled.div`
    display: flex;
`;

const MainContainerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 56px;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: ${props => props.theme.main};
    font-size: 14px;
    overflow: hidden;
`;

const Header = styled.header`
    position: relative;
    z-index: 4;
`;

const Article = styled.article`
    display: flex;
    justify-content: center;
    overflow: overlay;
    ${ CustomScrollbar };
`;

function MainContainer() {
    const router = useRouter();
    const { id } = router.query;
    return (
        <MainWrapper>
            <SideBar />
            <MainContainerWrapper>
                <Header>
                    <Tabs />
                    <TabSettings />
                </Header>
                <Article>
                    <DynamicLeftContainer />
                    <DynamicCenterContainer />
                    <DynamicRightContainer />
                </Article>
            </MainContainerWrapper>
        </MainWrapper>
    )
}

export default MainContainer;


