import styled from "styled-components";
import IconButton, { PureIconButton } from "@components/basic/iconButton";
import { modalControl, withModels } from "@components/hoc/modals";
import { ViewJSONModal } from "@components/hoc/modals/viewJSON";
import { ImportJSONModal } from "@components/hoc/modals/importJson";
import ownerCaretaker from "@models/owners";
import { DataConfigModal } from "@components/hoc/modals/dataConfig";
import { observer } from "mobx-react";

const TabSettingsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 48px;
	border-radius: 2px;
    padding: 0 16px;
	background-color: ${props => props.theme.complementaryColor};
	box-shadow: 0px 2px 8px 0px ${props => props.theme.main};
`;


const TabSettings = observer(function TabSettings() {

    return (
        <TabSettingsWrapper>
            <IconButton
                icon="json"
                padding={ 8 }
                $title="查看当前配置项的JSON数据"
                onClick={ () =>  modalControl.find(ViewJSONModal)?.open() }
                />
            <IconButton
                icon="settings"
                padding={ 8 }
                $title="设置当前配置项"
                margin={{left: 8, right: 8}}
                onClick={ () => modalControl.find(DataConfigModal)?.open() }
                />
            <IconButton
                icon="import"
                padding={ 8 }
                $title="导入配置项"
                margin={{left: 8, right: 8}}
                onClick={ () => modalControl.find(ImportJSONModal)?.open() }
                />
            <IconButton
                icon="undo"
                padding={ 8 }
                $title="撤销"
                margin={{left: 8, right: 8}}
                onClick={ () => ownerCaretaker.currOwner?.undo()}
                disabled={ !ownerCaretaker.currOwner?.memoto }
                />
            <IconButton
                icon="redo"
                padding={ 8 }
                $title="重做"
                onClick={ () => ownerCaretaker.currOwner?.redo()}
                disabled={ !ownerCaretaker.currOwner?.isRedo }
                />
        </TabSettingsWrapper>
    );
});

export default withModels(
    ViewJSONModal,
    ImportJSONModal,
    DataConfigModal,
)(TabSettings);
