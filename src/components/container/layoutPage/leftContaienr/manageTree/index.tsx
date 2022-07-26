import { MessageControl } from "@components/basic/common";
import { PureIconButton } from "@components/basic/iconButton";
import ownerCaretaker from "@models/owners";
import { deleteWidget, isDelete, isMoveDown, isMoveUp, moveDown, moveUp } from "@utils/tree.tool";
import { observer } from "mobx-react";
import { useContext } from "react";
import styled, { ThemeContext } from "styled-components";

const ManageTreeWrapper = styled.div`
    display: flex;
    align-items: center;
    margin: 8px 0;
    height: 32px;
    background-color: ${props => props.theme.primary};
    border-radius: 8px;
    padding: 0 8px;
`;



export const ManageTree = observer(function() {
    const currWidget = ownerCaretaker.currOwner?.currWidget;

    const theme = useContext(ThemeContext);

    const setAllShrink = function(state: boolean) {
        const tree = ownerCaretaker.currOwner?.rollTree;
        if (!tree) return;

        for( let key in tree) {
            const widget = tree[key];
            if (widget.childCount) {
                widget.setShrink(state);
            }
        }
    }

    // const isMoveUpDisabled = !currWidget || !isMoveUp(currWidget);
    // const isMoveDownDisabled = !currWidget || !isMoveDown(currWidget);
    const isDeleteDisabled = !currWidget || !isDelete(currWidget);
    return (

        <ManageTreeWrapper>
            <PureIconButton
                icon="upfold"
                $title="全部收起"
                onClick={ () => setAllShrink(true) }
                />
            <PureIconButton
                icon="unfold"
                $title="全部展开"
                onClick={ () => setAllShrink(false) }
                />
            <PureIconButton
                icon="move"
                $title={ ownerCaretaker.currOwner?.isMove ? '当前可拖动' : '当前不可拖动'}
                onClick={ () => ownerCaretaker.currOwner?.setIsMove(!ownerCaretaker.currOwner?.isMove)}
                active={ ownerCaretaker.currOwner?.isMove }
                activeColor={ theme.assits }
                />
            {/* 等回退支持移动和删除的时候在支持这些便捷功能 */}
            {/* <PureIconButton
                icon="moveUp"
                $title="上移一层"
                disabled={ isMoveUpDisabled }
                onClick={ () => moveUp(currWidget!)}
                />
            <PureIconButton
                icon="moveDown"
                $title="下移一层"
                disabled={ isMoveDownDisabled }

                onClick={ () => moveDown(currWidget!)}
                /> */}
            {/* <PureIconButton
                icon="copy"
                $title="复制"
                // disabled={ !currWidget || currWidget.type === 'root' }
                // onClick={ () => MessageControl.open({ content: 'text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111text11111'}) }
                /> */}
            <PureIconButton
                icon="delete"
                $title="删除"
                disabled={ isDeleteDisabled }
                onClick={ () => deleteWidget(currWidget!)}
                />
        </ManageTreeWrapper>
    );
});

