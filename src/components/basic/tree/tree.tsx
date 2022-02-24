import styled from "styled-components";
import { DndProvider, DndContext } from 'react-dnd'
import { DragDropManager } from 'dnd-core'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { TreeWidget } from '@layout/core/layout'

const TreeWrapper = styled.div``;

type TreeProps = {
    data: TreeWidget,
}
interface ContainerProps extends TreeProps {
    dragDropManager?: DragDropManager
}

export function TreeContainer(props: ContainerProps) {

    const { dragDropManager } = props;
    console.log(dragDropManager?.getBackend());
    return (
        <></>
    );
}


export function TreeWithDndContext(props: TreeProps) {
    return (
        <DndContext.Consumer>
            {
                ({ dragDropManager }) => {
                    return (
                        <TreeContainer { ...props } dragDropManager={ dragDropManager } />
                    );
                }
            }
        </DndContext.Consumer>
    );
}

export default function Tree(props: TreeProps) {
    return (
        <DndProvider backend={ HTML5Backend }>
            <TreeWithDndContext { ...props } />
        </DndProvider>
    );
}
