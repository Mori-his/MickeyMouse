import { TreeWidget } from "@widgets/treeWidget"



export interface ItemClickProps {
    parentNode: TreeWidget
    depth: number
    node: TreeWidget
}

export type TreeState = {
    mode?: 'view' | 'edit'
    onItemClick?: (props: ItemClickProps) => void
}

export type PlaceholderProvideState = {
    dropWidget: TreeWidget | null
    isTail: boolean
    showPlaceholder(widget: TreeWidget, tail?: boolean): void
    hidePlaceholder(): void
}


export interface TreeProps {
    mode?: 'view' | 'edit',
    onItemClick?: (props: ItemClickProps) => void
}

