import React from "react";
import { useRouter } from "next/router";

import { GlobalStyle } from '@styles/globals'
import MainContainer from "@components/container/layoutPage/mainContainer";
import { ThemeProvider } from 'styled-components';
import LayoutTheme from "@styles/layout.theme";
import { Message } from "@components/basic/common/message/message";
import { Confirm } from "@components/basic/common/confirm/confirm";
import * as widgets from '@widgets/index';


import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css';
import 'tippy.js/dist/svg-arrow.css';
import 'tippy.js/animations/scale.css';
import 'tippy.js/animations/shift-away.css';

import '@q/HJ-LayoutView/dist/style.css';
import { useInnitLayout } from "@/hooks/useInitLayout";


function LayoutConfigPage() {


    const router = useRouter();
    const { query } = router;

    // 为了让所有widget都导入进来
    // 不要删除此代码
    widgets;

    // 初始化布局
    useInnitLayout();
    

    return (
        <ThemeProvider theme={ LayoutTheme }>
            <GlobalStyle />
            <MainContainer />
            <Message />
            <Confirm />
        </ThemeProvider>
    );
}


export default LayoutConfigPage;




