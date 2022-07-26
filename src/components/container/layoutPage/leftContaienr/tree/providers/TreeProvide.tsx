import { createContext, PropsWithChildren } from "react";
import { TreeProps, TreeState } from "../types";



export const TreeContext = createContext({});



export type TreeProvideProps = TreeProps & {

}
export const TreeProvide = function(props: PropsWithChildren<TreeProvideProps>) {
    const { mode = 'edit'} = props;
    const value: TreeState = {
        ...props,
        mode,
    }


    return (
        <TreeContext.Provider value={value}>
            { props.children }
        </TreeContext.Provider>
    );
}

