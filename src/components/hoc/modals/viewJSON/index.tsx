import { useRef } from "react";
import TreeJsonModal from "@components/basic/jsonPanel/treeJson.modal";
import ownerCaretaker from "@models/owners";
import Tree from "@components/container/layoutPage/leftContaienr/tree/tree";
import JSONEditor from "jsoneditor";
import { ModalHOCProps } from "..";
import { TransitionScaleModal } from "@components/basic/modal";
import { ItemClickProps } from "@components/container/layoutPage/leftContaienr/tree/types";



export function ViewJSONModal(props: ModalHOCProps) {
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

    const treeJsonModalRef = useRef<React.ElementRef<typeof TreeJsonModal>>(null);

    /**
     * 打开JSON预览模板后判断是否显示当前选中节点JSON
     * @param editor - JSON编辑器对象
     */
    const handleShowJsonModal = function(editor: JSONEditor) {
        const { currWidget } = ownerCaretaker.currOwner;
        if (currWidget && treeJsonModalRef.current) {
            editor?.set(currWidget.toJson());
        }
    }

    const handleTreeItemClick = function(props: ItemClickProps) {
        if (treeJsonModalRef.current) {
            const { editor } = treeJsonModalRef.current;
            editor?.set(props.node.toJson());
        }
    }

    return (
        <TransitionScaleModal
            in={ isOpen }
            { ...otherProps }
            >
            <TreeJsonModal
                ref={ treeJsonModalRef }
                onLoaded={ handleShowJsonModal }
                tree={
                    <Tree
                        mode="view"
                        onItemClick={ handleTreeItemClick }
                        />
                }
                onClose={ () => onClose() }
                />
        </TransitionScaleModal>
    );
}