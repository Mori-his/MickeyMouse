import React, { useEffect } from "react";
import Platform from "@components/platform/index";
import LayoutTheme from "@styles/layout.theme";
import { ThemeProvider } from "styled-components";
import { Confirm } from "@components/basic/common/confirm/confirm";
import { GlobalStyle } from '@styles/globals';

import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css';
import 'tippy.js/dist/svg-arrow.css';
import 'tippy.js/animations/scale.css';
import 'tippy.js/animations/shift-away.css';
import { LoadingBox } from "@components/basic/common/loading/loading";


function LayoutPlatformPage() {

    return (
        <ThemeProvider theme={ LayoutTheme }>
            <GlobalStyle />
            <Platform />
            <LoadingBox />
            <Confirm />
        </ThemeProvider>
    )
}

export default LayoutPlatformPage;