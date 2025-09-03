import React, { useContext } from "react"
import { TreeContext } from "../providers/TreeProvide";
import { TreeState } from "../types";


export const useTreeContext = function() {
    const treeContext = useContext<TreeState>(TreeContext as unknown as React.Context<TreeState>);
    return treeContext
}
