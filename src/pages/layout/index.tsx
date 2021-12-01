import React from "react";
import { useRouter } from "next/router";

import { GlobalStyle } from '../../styles/globals'
import Tabs from "../../components/container/tabs";

class TestDecorator {
    text = 123;
}

function decoratorTest(target: any, a: any) {
    console.log(target, a);
}


function LayoutConfigPage() {
    const router = useRouter();
    const { query } = router;
    const handleTabClick = function(event: Event) {

    }
    return (
        <React.Fragment>
            <GlobalStyle />
            <div>
                <Tabs />
            </div>
        </React.Fragment>
    );
}


export default LayoutConfigPage;




