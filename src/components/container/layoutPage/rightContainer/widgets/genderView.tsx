import { Textarea } from "@components/basic/form/textarea";
import { TextareaBox } from "@components/container/common/styleds/containerStyle";
import { TitleCollapse } from "@components/container/common/title";
import ownerCaretaker from "@models/owners";
import { GenderViewWidget } from "@widgets/genderView";


export const GenderViewRender = function() {
    const currWidget = ownerCaretaker.currOwner.currWidget as GenderViewWidget;
    return (
        <TitleCollapse
            title="性别图片设置"
            >
            <div className="padding16">
                <TextareaBox>
                    <Textarea
                        label="女性图片地址"
                        placeholder="请输入URL"
                        value={ currWidget.femaleSrc }
                        onChange={ (event) => currWidget.setFemaleSrc(event.target.value) }
                        />
                </TextareaBox>
                <TextareaBox>
                    <Textarea
                        label="男性图片地址"
                        placeholder="请输入URL"
                        value={ currWidget.manSrc }
                        onChange={ (event) => currWidget.setManSrc(event.target.value) }
                        />
                </TextareaBox>
                <TextareaBox>
                    <Textarea
                        label="无性别图片地址"
                        placeholder="请输入URL"
                        value={ currWidget.unisexSrc }
                        onChange={ (event) => currWidget.setUnisexSrc(event.target.value) }
                        />
                </TextareaBox>
            </div>
        </TitleCollapse>

    );
}
