import React from "react";
import { useRouter } from "next/router";

import { GlobalStyle } from '@styles/globals'
import MainContainer from "@components/container/mainContainer";
import { ThemeProvider } from 'styled-components';
import LayoutTheme from "@styles/Layout.theme";

function LayoutConfigPage() {
    const router = useRouter();
    const { query } = router;

    return (
        <ThemeProvider theme={ LayoutTheme }>
            <GlobalStyle />
            <MainContainer />
        </ThemeProvider>
    );
}


export default LayoutConfigPage;




