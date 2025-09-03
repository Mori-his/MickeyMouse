import { ModalProps } from '@components/basic/modal';
import {
    ComponentType,
    // Dispatch,
    // SetStateAction,
    useState
} from 'react';


// 高阶组件传递通用Modal参数声明
export interface ModalHOCProps<T = any> extends Partial<ModalProps> {
    onClose?: Function
    onConfirm?: (data: T) => void
    onCancel?: Function
}

// WeekMap  Value 声明
export interface ModalControlWeekMapProps {
    index: number
    open(props?: ModalHOCProps): ModalControlWeekMapProps
    close(): ModalControlWeekMapProps
}


export class ModalsControl {
    private modalControl: WeakMap<ComponentType<ModalHOCProps>, ModalControlWeekMapProps> = new WeakMap();

    find(modal: ComponentType<ModalHOCProps>) {
        return this.weakMap.get(modal);
    }

    get weakMap() {
        return this.modalControl;
    }
}
// 创建control实例
// 可以当做单例来使用
export const modalControl = new ModalsControl();
// : [
//     {modalsIsShow: boolean[], modalsProps: ModalHOCProps[] },
//     {setModalsIsShow: Dispatch<SetStateAction<boolean[]>>, setModalsProps: Dispatch<SetStateAction<ModalHOCProps[]>>}
// ] 
/**
 * 创建Modal操作
 * @param modals - 弹框列表
 * @returns
 * ```json
 * [
 *     {modalsIsShow: boolean[], modalsProps: ModalHOCProps[] },
 *     {setModalsIsShow: Dispatch<SetStateAction<boolean[]>>, setModalsProps: Dispatch<SetStateAction<ModalHOCProps[]>>}
 * ]
 * ```
 */
function useModals(modals: ComponentType<ModalHOCProps>[]) {
    const [modalsIsShow, setModalsIsShow] = useState<boolean[]>(new Array(modals.length).fill(false));
    const [modalsProps, setModalsProps] = useState<ModalHOCProps[]>(new Array(modals.length).fill({}));

    modals.forEach((modal, index) => {
        modalControl.weakMap.set(modal, {
            index,
            open<T = any>(props?: ModalHOCProps<T>) {
                modalsIsShow.splice(index, 1, true);
                if (props) {
                    modalsProps.splice(index, 1, props);
                    setModalsProps(modalsProps);
                }
                setModalsIsShow([...modalsIsShow]);
                return modalControl.find(modal)!;
            },
            close() {
                modalsIsShow.splice(index, 1, false);
                setModalsIsShow([...modalsIsShow]);
                return modalControl.find(modal)!;
            }
        });
    });

    return [{modalsIsShow, modalsProps}, {setModalsIsShow, setModalsProps}];
}





export const withModels = function(...modals: ComponentType<ModalHOCProps>[]) {

    return function WithComponent<T>(Component: ComponentType<T>) {
        function ModalContainer(props: T) {
            const [{
                modalsIsShow,
                modalsProps,
            }] = useModals(modals);
            return (
                <>
                    <Component { ...props } />
                    {
                        modals.map((Modal, index) => (
                            <Modal
                                key={ index }
                                { ...modalsProps![index] }
                                in={ modalsIsShow![index] }
                                onClose={ () => modalControl.find(Modal)?.close() }
                                />
                        ))
                    }
                </>
            );
        }
        // 定义调试时用到的名称
        ModalContainer.displayName = 'WithModalContainer';
        return ModalContainer;
    }

}



