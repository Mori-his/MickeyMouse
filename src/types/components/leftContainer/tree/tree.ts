import { TreeWidget } from "@widgets/treeWidget";

export interface  HTMLWithWidgetAttr extends Node {
    ['@@__widget']: TreeWidget
}
