import Tippy, { TippyProps } from "@tippyjs/react";
import React from "react";

export default function LightTippy(props: React.PropsWithChildren<TippyProps>) {

    return (
        <Tippy
            animation="scale"
            { ...props }
            theme='light'
            >
            { props.children }
        </Tippy>
    );
}
