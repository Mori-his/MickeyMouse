import { Textarea } from "@components/basic/form/textarea";
import { TextareaBox } from "@components/container/common/styleds/containerStyle";
import { TitleCollapse } from "@components/container/common/title";
import ownerCaretaker from "@models/owners";
import { FollowButtonWidget } from "@widgets/followButton";
import { observer } from "mobx-react";


export const FollowButtonRender = observer(function() {
    const currWidget = ownerCaretaker.currOwner.currWidget as FollowButtonWidget;
    return (
        <TitleCollapse
            title="关注按钮配置"
            >
            <div className="padding16">
                <TextareaBox>
                    <Textarea
                        label="关注按钮地址"
                        placeholder="请输入URL"
                        value={ currWidget.src || ''}
                        onChange={ (event) => currWidget.setSrc(event.target.value) }
                        />
                </TextareaBox>
            </div>
        </TitleCollapse>
    );
});
