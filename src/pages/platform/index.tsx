import React from "react";
import { ThemeProvider } from "styled-components";
import Platform from "@components/platform/index";
import { Confirm } from "@components/basic/common/confirm/confirm";
import LayoutTheme from "@styles/layout.theme";

import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css';
import 'tippy.js/dist/svg-arrow.css';
import 'tippy.js/animations/scale.css';
import 'tippy.js/animations/shift-away.css';


function LayoutPlatformPage() {
    return (
        <ThemeProvider theme={ LayoutTheme }>
            <Platform />
    
            <Confirm />
        </ThemeProvider>
    )
}

export default LayoutPlatformPage;