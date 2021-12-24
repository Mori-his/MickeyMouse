import React from "react";
import { useRouter } from "next/router";

import { GlobalStyle } from '@styles/globals'
import MainContainer from "@components/container/mainContainer";
import { ThemeProvider } from 'styled-components';
import LayoutTheme from "@styles/layout.theme";

import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css';
import 'tippy.js/dist/svg-arrow.css';
import 'tippy.js/animations/scale.css';
import 'tippy.js/animations/shift-away.css';

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




