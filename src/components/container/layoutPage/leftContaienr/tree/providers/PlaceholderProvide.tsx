import { TreeWidget } from "@widgets/treeWidget";
import { createContext, PropsWithChildren, useState } from "react";
import { PlaceholderProvideState, TreeProps } from "../types";




export const PlaceholderContext = createContext({});


export type PlaceholderProvideProps = TreeProps & {

}

export const PlaceholderProvide = function(props: PropsWithChildren<PlaceholderProvideProps>) {

    const [dropWidget, setDropWidget] = useState<TreeWidget | null>(null);
    const [isTail, setIsTail] = useState(false);
    const value: PlaceholderProvideState = {
        dropWidget,
        isTail,
        showPlaceholder(widget, tail: boolean = false) {
            setDropWidget(widget);
            setIsTail(tail);
        },
        hidePlaceholder() {
            setDropWidget(null);
            setIsTail(false);
        },
    }

    return (
        <PlaceholderContext.Provider value={value}>
            { props.children }
        </PlaceholderContext.Provider>

    );


}

