import { ModalHOCProps } from "..";
import { TransitionScaleModal } from "@components/basic/modal";
import { JSONEditorBox } from "./jsonEditor";

export function DataConfigModal(props: ModalHOCProps) {
    const {
        onClose = () => {},
        onConfirm = () => {},
        onCancel = () => {},
        children,
        in: isOpen = false,
        ...otherProps
    } = props;

    


    return (
        <TransitionScaleModal
            in={ isOpen }
            maskClick={ () => onClose()}
            { ...otherProps }
            >
            <JSONEditorBox />
        </TransitionScaleModal>
    );
}