import { TitleCollapse } from "@components/container/common/title";
import { UserListPanel } from "../userListPanel";


export const UserListRender = function() {
    return (
        <TitleCollapse
            title="用户列表配置"
            >
            <div className="padding16">
                <UserListPanel />
            </div>
        </TitleCollapse>
    );
}
