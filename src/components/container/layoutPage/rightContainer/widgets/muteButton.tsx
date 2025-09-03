import { Textarea } from "@components/basic/form/textarea";
import { TextareaBox } from "@components/container/common/styleds/containerStyle";
import { TitleCollapse } from "@components/container/common/title";
import ownerCaretaker from "@models/owners";
import { MuteButtonWidget } from "@widgets/muteButton";
import { observer } from "mobx-react";


export const MuteButtonRender = observer(function() {
    const currWidget = ownerCaretaker.currOwner.currWidget as MuteButtonWidget;

    return (
        <TitleCollapse
            title="按钮地址"
            >
            <div className="padding16">
                <TextareaBox>
                    <Textarea
                        label="开启音频图片地址"
                        placeholder="请输入URL"
                        value={ currWidget.openSrc || '' }
                        onChange={ (event) => currWidget.setOpenSrc(event.target.value)}
                        />
                </TextareaBox>
                <TextareaBox>
                    <Textarea
                        label="关闭音频图片地址"
                        placeholder="请输入URL"
                        value={ currWidget.closeSrc || '' }
                        onChange={ (event) => currWidget.setCloseSrc(event.target.value)}
                        />
                </TextareaBox>
            </div>
        </TitleCollapse>
    );
});