import { WidgetOptions } from "@layout/core/layout";

// 变更伸缩状态的回调
export type ChangeOpenHandler = (newOpenIds: WidgetOptions['id'][]) => void;

// 展开处理
export type OpenHandler = (
    targetIds: WidgetOptions['id'] | WidgetOptions['id'][],
    callback?: ChangeOpenHandler
) => void;
// 关闭处理
export type CloseHandler = () => void;

// tree处理方法
export type TreeMethods = {
    open: OpenHandler;
    close: CloseHandler;
    openAll(): void;
    closeAll(): void;
};
export interface TreeInnerProps<T = unknown> {

}