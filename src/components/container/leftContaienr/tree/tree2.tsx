import React from "react";
import styled from "styled-components";
import { TreeInnerProps, TreeMethods } from "./types";


styled.div``;


export function TreeInner(
    props: React.PropsWithChildren<TreeInnerProps>,
    ref: React.ForwardedRef<TreeMethods>
) {

    return (
        <div>123</div>
    );
}



const Tree = React.forwardRef(TreeInner)  as <T = unknown>(
    props: TreeInnerProps<T> & { ref?: React.ForwardedRef<TreeMethods> }
) => ReturnType<typeof TreeInner>;

export default Tree;
