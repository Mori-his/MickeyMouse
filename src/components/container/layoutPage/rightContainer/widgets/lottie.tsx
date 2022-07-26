import { Textarea } from "@components/basic/form/textarea";
import { TitleCollapse } from "@components/container/common/title";
import ownerCaretaker from "@models/owners";
import { LottieWidget } from "@widgets/lottie";
import { observer } from "mobx-react";



export const LottieRender = observer(function() {
    const currWidget = ownerCaretaker.currOwner.currWidget as LottieWidget;
    return (
        <TitleCollapse
            title="动画地址"
            >
            <div className="padding16">
                <Textarea
                    label="动画地址"
                    placeholder="请输入URL"
                    value={ currWidget.src || '' }
                    onChange={ (event) => currWidget.setSrc(event.target.value)}
                    />
            </div>
        </TitleCollapse>
    );
});
