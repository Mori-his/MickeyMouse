import Input from "@components/basic/form/input/input";
import LightTippy from "@components/basic/toolTip/lightTippy";
import { TitleCollapse } from "@components/container/common/title";
import ownerCaretaker from "@models/owners";
import { observer } from "mobx-react";
import styled from "styled-components";
import { ScrollWidget } from "@widgets/scroll";

const InputWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 16px;
    color: ${props => props.theme.lesser};
`;


export const ScrollRender = observer(function() {
    // const inputWidth = 72;
    const currWidget = ownerCaretaker.currOwner.currWidget as ScrollWidget;
    

    return (
        <>
            <TitleCollapse
                title="滚动内容宽高设置"
                >
                <InputWrapper>
                    <LightTippy
                        content="内容总宽度"
                        >
                        <Input
                            label="宽度"
                            labelAnimation
                            type="number"
                            center
                            placeholder="宽度"
                            width={120}
                            minimum={0}
                            onBlur={ e => currWidget.contentSize.setWidth(e.target.value || '') }
                            defaultValue={ currWidget.contentSize.width }
                            />
                    </LightTippy>
                    <LightTippy
                        content="内容总高度"
                        >
                        <Input
                            label="高度"
                            labelAnimation
                            type="number"
                            center
                            placeholder="高度"
                            width={120}
                            minimum={0}
                            onBlur={ e => currWidget.contentSize.setHeight(e.target.value || '') }
                            defaultValue={ currWidget.contentSize.height }
                            />
                    </LightTippy>
                </InputWrapper>
            </TitleCollapse>
        </>
    );
});
