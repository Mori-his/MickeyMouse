import React from "react";
import { useRouter } from "next/router";

import { GlobalStyle } from '../../styles/globals'
import MainContainer from "../../components/container/mainContainer";

function LayoutConfigPage() {
    const router = useRouter();
    const { query } = router;

    return (
        <React.Fragment>
            <GlobalStyle />
            <MainContainer />
        </React.Fragment>
    );
}


export default LayoutConfigPage;




