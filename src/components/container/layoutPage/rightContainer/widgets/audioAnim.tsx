import { Textarea } from "@components/basic/form/textarea";
import { TitleCollapse } from "@components/container/common/title";
import ownerCaretaker from "@models/owners";
import { AudioAnimWidget } from "@widgets/audioAnim";
import { observer } from "mobx-react";



export const AudioAnimRender = observer(function() {
    const currWidget = ownerCaretaker.currOwner.currWidget as AudioAnimWidget;

    return (
        <TitleCollapse
            title="动画地址"
            >
            <div className="padding16">
                <Textarea
                    label="动画地址"
                    placeholder="请输入动画地址"
                    value={ currWidget.src || '' }
                    onChange={ (event) => currWidget.setSrc(event.target.value || '')}
                    />
            </div>

        </TitleCollapse>
    );
});
