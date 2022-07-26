import ownerCaretaker from "@models/owners";
import { ModalHOCProps } from "..";
import { TransitionScaleModal } from "@components/basic/modal";
import { widgetBuildBFS } from "@models/factory/widgetBuild.factory";
import { ImportJsonModal } from "@components/basic/jsonPanel/importJson.modal";


export function ImportJSONModal(props: ModalHOCProps) {
    const {
        onClose = () => {},
        onConfirm = () => {},
        onCancel = () => {},
        children,
        in: isOpen = false,
        ...otherProps
    } = props;

    const handleImportJson = function(json: any) {
        const root = widgetBuildBFS(json);
        // // 加入当前配置项的节点树
        ownerCaretaker.currOwner.removeAll();
        ownerCaretaker.currOwner.add(root);

        onClose();
    }

    return (
        <TransitionScaleModal
            in={ isOpen }
            maskClick={ () => onClose()}
            { ...otherProps }
            >
            <ImportJsonModal
                onImport={ (json: any) => handleImportJson(json)}
                onClose={ () => onClose() }
                />
        </TransitionScaleModal>
    );
}