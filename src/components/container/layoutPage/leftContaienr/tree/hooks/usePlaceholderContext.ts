import React, { useContext } from "react"
import { PlaceholderContext } from "../providers/PlaceholderProvide"
import { PlaceholderProvideState } from "../types"


export const usePlaceholderContext = function() {
    const placeholderContext = useContext<PlaceholderProvideState>(PlaceholderContext as unknown as React.Context<PlaceholderProvideState>);
    return placeholderContext
}
