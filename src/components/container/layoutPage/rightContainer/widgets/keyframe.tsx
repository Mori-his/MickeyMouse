import { Textarea } from "@components/basic/form/textarea";
import { TextareaBox } from "@components/container/common/styleds/containerStyle";
import { TitleCollapse } from "@components/container/common/title";
import ownerCaretaker from "@models/owners";
import { KeyframeWidget } from "@widgets/keyframe";
import { observer } from "mobx-react";

export const KeyframeRender = observer(function() {
    const currWidget = ownerCaretaker.currOwner.currWidget as KeyframeWidget;
    
    return (
        <TitleCollapse
            title="动画配置"
            >
            <div className="padding16">
                <TextareaBox>
                    <Textarea
                        label="动画地址"
                        placeholder="请输入URL"
                        value={ currWidget.src || ''}
                        onChange={ (event) => currWidget.setSrc(event.target.value) }
                        />
                </TextareaBox>
            </div>
        </TitleCollapse>
    );
});
