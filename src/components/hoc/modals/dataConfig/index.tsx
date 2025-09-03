import { ModalHOCProps } from "..";
import { TransitionScaleModal } from "@components/basic/modal";
import { JSONEditorBox } from "./jsonEditor";

export function DataConfigModal(props: ModalHOCProps) {
    const {
        onClose = () => {},
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onConfirm = () => {},
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onCancel = () => {},
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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