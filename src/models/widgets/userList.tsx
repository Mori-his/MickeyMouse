import { WidgetOptions } from "@layout/core/layout";
import { TreeWidget } from "@widgets/treeWidget";
import syncAttr from "@models/syncManage/manage";
import { layoutToJson, syncsToJson } from "@models/factory/toJson";
import { Node, UserAttr } from "@models/factory/types";
import { widgetType } from "@models/factory/widgetTypeClassManage";
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype";
import { action, observable } from "mobx";
import { mobxTrackStates } from "@models/owners";
import { UserListRender } from "@components/container/layoutPage/rightContainer/widgets/userList";

export interface UserListWidgetOptions extends WidgetOptions{
    users: UserAttr[]
}

/**
 * 用户列表
 */
@widgetType('userList', {label: '用户列表', icon: 'follow_text'})
export class UserListWidget extends TreeWidget {
    type: string = 'userList'
    @syncAttr({ key: 'userList', label: '用户列表'})
    users: UserAttr[]

    constructor({
        users,
        ...superOptions
    }: UserListWidgetOptions) {
        super(superOptions);
        this.users = users || [];
        makeObservableWithWidget(this, {
            users: observable,
            setUsers: action,
        });
        this.registerTracks();
    }
    /**
     * @override
     */
    registerTracks(): void {
        // 注册undo/redo
        mobxTrackStates(this, [
            { read: () => this.users, write: (users: []) => this.setUsers(users) },
        ]);
        super.registerTracks();
    }

    setUsers(users: UserAttr[]) {
        this.users = users;
    }
    
    toJson(): Partial<Node> {
        const childrenJson: Array<Node> = [];
        this.visitChildren(child => {
            const currChild = child as TreeWidget;
            childrenJson.push(currChild.toJson() as Node);
        });

        return {
            id: this.id,
            name: this.type,
            desc: this.name,
            prop: {
                layout: layoutToJson(this),
                isDispatchOnClickEvent: this.attachOnClick,
                visible: this.visible,
                userList: this.users
            },
            child: childrenJson,
            data: syncsToJson(this),
        }
    }
    
    render() {
        return <UserListRender />
    }
}
