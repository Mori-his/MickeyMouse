import { Constructor } from "@/types/types";
import { Border, BorderSide } from "@layout/core/boxBorder";
import Color from "@layout/utils/color";
import { mobxTrackStates } from "@models/owners";
import { MixinsObserve } from "@widgets/interface/widgetInterface";
import { TreeWidget } from "@widgets/treeWidget";
import { action, observable } from "mobx";

export interface ObserveBorderProps {
    border: Border
    activeBorder: boolean
}

/**
 * 多继承-边框
 * @param Base - TreeWidget的所有派生类即可
 * @returns Border抽象类
 * @remarks
 * ### 此类结构体
 * 需要借助：  
 * {@link BorderSide}  
 * {@link Border}  
 * ```json
 *  {
 *      border: Border
 *      activeBorder: Boolean
 *      setBorder(side: BorderSide | Border): void
 *      setActiveBorder(active: boolean): void
 *  }
 * ```
 * @example
 * 需要借助：  
 * {@link Constructor}  
 * {@link TreeWidget}  
 * ```ts
 *  class BasicWidget extends ObserveBorder(TreeWidget as Constructor<TreeWidget>) {
 *      type: string = 'basic'
 * 
 *      constructor(...args: any[]) {
 *          super(...args);
 *          makeObservableWithWidget(this, {
                ...super.registerObservable(),
                // ...当前类要注册的observable
            });
 *      }
 *      toJson() {}
 * }
 * ```
 */
export const ObserveBorder = <T extends Constructor<TreeWidget>>(Base: T) => {
    abstract class BorderAbstract extends Base implements MixinsObserve {
        border: Border
        activeBorder!: boolean;
        constructor(...args: any[]) {
            const {
                border,
                activeBorder,
                ...otherProps
            }: Partial<ObserveBorderProps> = args[0];
            super(otherProps);
            this.border = border || Border.fromBorderSide(
                new BorderSide({
                    color: new Color(0, 0, 100, 1),
                })
            );
            this.activeBorder = Boolean(activeBorder);
        }

        registerObservable() {
            return {
                activeBorder: observable,
                border: observable,
                setBorder: action,
                setActiveBorder: action,
            }
        }

        /**
         * @override
         */
        registerTracks(): void {
            // 注册undo/redo
            mobxTrackStates(this, [
                { read: () => this.border, write: (border: Border) => (this.setBorder(border)) },
                { read: () => this.activeBorder, write: (active: boolean) => this.setActiveBorder(active) },
            ]);
            super.registerTracks();
        }

        setBorder(side: BorderSide | Border) {
            if (side instanceof Border) {
                this.border = side;
            } else {
                this.border = Border.fromBorderSide(side);
            }
        }

        setActiveBorder(active: boolean): void {
            this.activeBorder = active;
        }
    }

    return BorderAbstract;
}