import React, { PropsWithChildren, ReactElement } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TreeInnerProps, TreeMethods } from "../types";

type Props<T> = PropsWithChildren<
TreeInnerProps<T> & {
  treeRef: React.ForwardedRef<TreeMethods>;
}
>;

export const Providers = <T extends unknown>(props: Props<T>): ReactElement => (
  <TreeProvider {...props}>
    <DragControlProvider>
      <PlaceholderProvider>
        <DndProvider options={ HTML5Backend }>{props.children}</DndProvider>
      </PlaceholderProvider>
    </DragControlProvider>
  </TreeProvider>
);