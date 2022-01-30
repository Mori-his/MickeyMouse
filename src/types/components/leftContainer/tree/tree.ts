import { TreeWidget } from "@layout/core/layout";

export interface  HTMLWithWidgetAttr extends Node {
    ['@@__widget']: TreeWidget
}
