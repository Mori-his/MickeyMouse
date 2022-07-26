import Input from "@components/basic/form/input/input";
import { PureIconButton } from "@components/basic/iconButton";
import LightTippy from "@components/basic/toolTip/lightTippy";
import Title, { TitleCollapse } from "@components/container/common/title";
import ownerCaretaker from "@models/owners";
import { SeatVideoMode, SeatViewWidget, TSeatVideoMode, ValueLabel } from "@widgets/seatView";
import { observer } from "mobx-react";
import styled from "styled-components";
import Select, { GroupBase, mergeStyles, StylesConfig } from "react-select";
import { selectStyle } from "@styles/globals";
import { selectCustomTheme } from "@styles/layout.theme";


const TitleWrapper = styled.div`
    display: flex;
    align-items: center;
`;
const InputWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 16px;
    color: ${props => props.theme.lesser};
`;

const SeatViewWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.primary};
    padding: 4px 8px;
    border-radius: 12px;
    cursor: pointer;
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


export const SeatViewRender = observer(function() {
    const inputWidth = 72;
    const currWidget = ownerCaretaker.currOwner.currWidget as SeatViewWidget;
    
    const options: ValueLabel[] = [];
    for (let key in SeatVideoMode) {
        options.push(SeatVideoMode[key as unknown as keyof TSeatVideoMode])
    }

    return (
        <>
            <TitleCollapse
                title="视频模式"
                >
                <div className="padding16">
                    <Select
                        value={ options.find(option => option.value === currWidget.seatVideoMode.value) }
                        options={ options }
                        styles={ withSelectStyles }
                        theme={ selectCustomTheme }
                        onChange={ (option) => (console.log(option), currWidget.setVideoMode(option.value))}
                        />
                </div>
            </TitleCollapse>
            <TitleCollapse
                title={
                    <TitleWrapper>
                        <span>表情定位</span>
                        <PureIconButton
                            $title={ currWidget.activeEmoticon ? '取消表情设置' : '激活表情设置' }
                            icon={ currWidget.activeEmoticon ? 'checked' : 'checkout' }
                            active={ currWidget.activeEmoticon }
                            onClick={ () => currWidget.setActiveEmoticon(!currWidget.activeEmoticon) }
                            />
                    </TitleWrapper>
                }
                >
                <InputWrapper>
                    <LightTippy
                        content="表情大小"
                        >
                        <Input
                            type="number"
                            center
                            placeholder="大小"
                            width={ inputWidth }
                            value={ currWidget.emoticon.width }
                            onChange={ (event) => { currWidget.emoticon.setWidth(event.target.value || '')}}
                            />
                    </LightTippy>
                    <LightTippy
                        content="表情居左位置"
                        >
                        <Input
                            type="number"
                            center
                            placeholder="居左"
                            width={ inputWidth }
                            value={ currWidget.emoticon.left }
                            onChange={ (event) => { currWidget.emoticon.setLeft(event.target.value || '')}}
                            />
                    </LightTippy>
                    <LightTippy
                        content="表情居上位置"
                        >
                        <Input
                            type="number"
                            center
                            placeholder="居上"
                            width={ inputWidth }
                            value={ currWidget.emoticon.top }
                            onChange={ (event) => currWidget.emoticon.setTop(event.target.value || '') }
                            />
                    </LightTippy>
                </InputWrapper>
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
                            center
                            placeholder="座位号"
                            width={ inputWidth }
                            value={ currWidget.seat }
                            onChange={ (event) => currWidget.setSeat(event.target.value || '') }
                            />
                    </LightTippy>
                    <LightTippy
                        content="主持人上麦"
                        >
                        <SeatViewWrapper
                            onClick={ () => currWidget.setAsHost(!currWidget.asHost) }
                            >
                            <PureIconButton
                                icon={ currWidget.asHost ? 'checked' : 'checkout'}
                                active={ currWidget.asHost }
                                />
                            <span>主持</span>
                        </SeatViewWrapper>
                    </LightTippy>
                    <LightTippy
                        content="用户上麦"
                        >
                        <SeatViewWrapper
                            onClick={ () => currWidget.setAsGuest(!currWidget.asGuest) }
                            >
                            <PureIconButton
                                icon={ currWidget.asGuest ? 'checked' : 'checkout'}
                                active={ currWidget.asGuest }
                                />
                            <span>用户</span>
                        </SeatViewWrapper>
                    </LightTippy>
                </InputWrapper>
            </TitleCollapse>
        </>
    );
});
