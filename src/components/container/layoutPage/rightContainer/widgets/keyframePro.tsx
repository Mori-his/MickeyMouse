import { Textarea } from "@components/basic/form/textarea";
import { TextareaBox } from "@components/container/common/styleds/containerStyle";
import { TitleCollapse } from "@components/container/common/title";
import ownerCaretaker from "@models/owners";
import { KeyframeProWidget } from "@widgets/keyframePro";
import { observer } from "mobx-react";



export const KeyframeProRender = observer(function() {
    const currWidget = ownerCaretaker.currOwner.currWidget as KeyframeProWidget;

    return (
        <TitleCollapse
            title="动画配置"
            >
            <div className="padding16">
                <TextareaBox>
                    <Textarea
                        label="图片地址"
                        placeholder="请输入URL"
                        value={ currWidget.res.image || '' }
                        onChange={ (event) => currWidget.setRes({ image: event.target.value })}
                        />
                </TextareaBox>
                <TextareaBox>
                    <Textarea
                        label="动画配置文件地址"
                        placeholder="请输入URL"
                        value={ currWidget.res.animation || '' }
                        onChange={ (event) => currWidget.setRes({ animation: event.target.value })}
                        />
                </TextareaBox>
            </div>

        </TitleCollapse>
    );
});
