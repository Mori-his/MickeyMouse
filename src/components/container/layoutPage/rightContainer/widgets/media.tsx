import Input from "@components/basic/form/input/input";
import { PureIconButton } from "@components/basic/iconButton";
import LightTippy from "@components/basic/toolTip/lightTippy";
import { TitleCollapse } from "@components/container/common/title";
import ownerCaretaker from "@models/owners";
import { observer } from "mobx-react";
import styled from "styled-components";
import Select, { GroupBase, mergeStyles, StylesConfig } from "react-select";
import { selectStyle } from "@styles/globals";
import { selectCustomTheme } from "@styles/layout.theme";
import { CameraList, MediaWidget, VideoModes } from "@widgets/media";
import { TextareaBox } from "@components/container/common/styleds/containerStyle";
import { Textarea } from "@components/basic/form/textarea";

const InputWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 16px;
    color: ${props => props.theme.lesser};
`;

const withSelectStyles: StylesConfig<any, false, GroupBase<any>> = mergeStyles(selectStyle, {
    control: (style) => ({
        ...style,
        backgroundColor: 'transparent',
    }),
    option: (style) => ({
        ...style,
        color: '#fff',
        lineHeight: 1.1,
    }),
    container: (style) => ({
        ...style,
        width: '100%'
    }),
});


export const MediaRender = observer(function() {
    const inputWidth = 72;
    const currWidget = ownerCaretaker.currOwner.currWidget as MediaWidget;
    

    return (
        <>
            <TitleCollapse
                title="音视频设置"
                >
                <div className="padding16">
                    <TextareaBox>
                        <Select
                            value={ CameraList.find(option => option.value === currWidget.camera.value) }
                            options={ CameraList }
                            styles={ withSelectStyles }
                            theme={ selectCustomTheme }
                            onChange={ (option) => (currWidget.setCamera(option.value))}
                            />
                    </TextareaBox>
                    <Select
                        value={ VideoModes.find(option => option.value === currWidget.video.value) }
                        options={ VideoModes }
                        styles={ withSelectStyles }
                        theme={ selectCustomTheme }
                        onChange={ (option) => (currWidget.setVideo(option.value))}
                        />
                </div>
            </TitleCollapse>
            <TitleCollapse
                title="座位设置"
                >
                <InputWrapper>
                    <LightTippy
                        content="座位号"
                        >
                        <Input
                            type="number"
                            label="座位号"
                            center
                            placeholder="座位号"
                            value={ currWidget.seat }
                            onChange={ (event) => currWidget.setSeat(event.target.value || '') }
                            />
                    </LightTippy>
                </InputWrapper>
            </TitleCollapse>
        </>
    );
});
