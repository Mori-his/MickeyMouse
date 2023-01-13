import { action, observable } from "mobx";
import { BorderRadius } from "@layout/core/boxBorder";
import { mobxTrackStates } from "@models/owners";
import { TreeWidget } from "@widgets/treeWidget";
import { Constructor } from "@/types/types";
import { MixinsObserve } from "@widgets/interface/widgetInterface";

export interface ObserveFilletProps {
    fillet: BorderRadius
}

/**
 * 多继承-圆角
 * @param Base - TreeWidget的所有派生类即可  
 * @returns Fillet抽象类  
 * @remarks
 * ```json
 *  {
 *      fillet: BorderRadius
 *      setFillet(fillet: BorderRadius): void
 *  }
 * ```
 * 需要借助 {@link Constructor}  
 * @example
 * ```ts
 *  class BasicWidget extends ObserveFillet(TreeWidget as Constructor<TreeWidget>) {
 *      type: string = 'basic'
 *  
 *      constructor(...args: any[]) {
 *          super(...args);
 * 
 *          makeObservableWithWidget(this, {
                ...super.registerObservable(),
                // ...当前类要注册的observable
            });
 *      }
 * 
 *      toJson() {}
 * }
 * ```
 */
export const ObserveFillet = <T extends Constructor<TreeWidget>>(Base: T) => {
    abstract class FilletAbstract extends Base implements MixinsObserve {
        fillet: BorderRadius
        constructor(...args: any[]) {
            const {
                fillet = new BorderRadius({}),
                ...otherProps
            }: Partial<ObserveFilletProps> = args[0];
            super(otherProps);

            this.fillet = fillet;
        }

        registerObservable() {
            return {
                fillet: observable,
                setFillet: action,
            };
        }

        /**
         * @override
         */
        registerTracks(): void {
            // 注册undo/redo
            mobxTrackStates(this, [
                { read: () => this.fillet, write: (fillet: BorderRadius) => this.setFillet(fillet) },
            ]);
            super.registerTracks();
        }

        setFillet(fillet: BorderRadius) {
            this.fillet = fillet;
        }

    }

    return FilletAbstract;
}
