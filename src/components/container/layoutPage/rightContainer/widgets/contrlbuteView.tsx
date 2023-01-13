import styled from "styled-components";
import Input from "@components/basic/form/input/input";
import LightTippy from "@components/basic/toolTip/lightTippy";
import { TitleCollapse } from "@components/container/common/title";
import ownerCaretaker from "@models/owners";
import { ContributeViewWidget } from "@widgets/contrlbuteView";
import { observer } from "mobx-react";


const InputWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 16px;
    color: ${props => props.theme.lesser};
`;

export const ContrlbuteViewRender = observer(function() {
    const inputWidth = 72;
    const currWidget = ownerCaretaker.currOwner.currWidget as ContributeViewWidget;

    return (
        <TitleCollapse
            title="三人贡献榜"
            >
            <InputWrapper>
                <LightTippy
                    content="粉丝宽度"
                    >
                    <Input
                        label="宽度"
                        labelAnimation
                        type="number"
                        center
                        width={ inputWidth }
                        value={ currWidget.fansWidth }
                        onChange={ (event) => { currWidget.setFansWidth(event.target.value)}}
                        />
                </LightTippy>
                <LightTippy
                    content="粉丝边框宽度"
                    >
                    <Input
                        label="边框宽度"
                        labelAnimation
                        type="number"
                        center
                        width={ inputWidth }
                        value={ currWidget.fansBorderWidth }
                        onChange={ (event) => { currWidget.setFansBorderWidth(event.target.value)}}
                        />
                </LightTippy>
                <LightTippy
                    content="粉丝边距"
                    >
                    <Input
                        label="边距"
                        labelAnimation
                        type="number"
                        center
                        placeholder="边距"
                        width={ inputWidth }
                        value={ currWidget.fansEdgeInsets }
                        onChange={ (event) => currWidget.setFansEdgeInsets(event.target.value) }
                        />
                </LightTippy>
            </InputWrapper>
        </TitleCollapse>
    );
});