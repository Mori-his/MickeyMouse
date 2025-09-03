import { observer } from "mobx-react";
import { nanoid } from "nanoid";
import { ReactNode } from "react";
import styled from "styled-components";
import Button from "@components/basic/button";
import ownerCaretaker from "@models/owners";
import { UserItem } from "./widgets/UserItem";
import { UserListWidget } from "@widgets/userList";
import { UserAttr } from "@models/factory/types";


const SyncWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 8px;
`;

const AddSyncBtn = styled(Button)`
    width: 160px;
    height: 40px;
    font-size: 16px;
    margin-top: 16px;
`;


export const UserListPanel = observer(function UserListPanel() {
    const currWidget = ownerCaretaker.currOwner.currWidget as UserListWidget;
    
    const handleAddClick = function() {
        const widgetUsers = currWidget.users || [];
        currWidget.setUsers([...widgetUsers, {
            uid: '',
            pos: '',
            id: nanoid(6)
        }]);
    }

    const handleUserChange = function(value: UserAttr, index: number) {
        const widgetUsers: UserAttr[] = [...currWidget.users];
        if (widgetUsers[index]) {
            widgetUsers[index] = value;
            currWidget.setUsers([...widgetUsers]);
        }
    }

    const handleUserDelete = function(index: number) {
        const widgetUsers: UserAttr[] = [...currWidget.users];
        widgetUsers.splice(index, 1);
        currWidget.setUsers([...widgetUsers]);

    }

    const MapUserItem = function(): ReactNode {
        const widgetUsers = currWidget.users || [];
        if (!widgetUsers.length) return;
        return widgetUsers.map((widgetUser: UserAttr, index: number) => {
            const id = widgetUser.id;
            return (
                <UserItem
                    key={ id }
                    defaultUser={ widgetUser }
                    onChange={ (value) => handleUserChange(value, index) }
                    onDelete={ () => handleUserDelete(index) }
                    />
            );
        })
    }


    return (
        <SyncWrapper>
            { MapUserItem() }
            <AddSyncBtn
                onClick={ handleAddClick }
                >
                添加
            </AddSyncBtn>
        </SyncWrapper>
    );
});