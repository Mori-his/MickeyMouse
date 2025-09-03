import Input from "@components/basic/form/input/input";
import { PureIconButton } from "@components/basic/iconButton";
import LightTippy from "@components/basic/toolTip/lightTippy";
import { TitleCollapse } from "@components/container/common/title";
import ownerCaretaker from "@models/owners";
import { BIGGER, MuteMode, SeatVideoMode, SeatViewWidget, TSeatVideoMode, ValueLabel, ZOOMABLE } from "@widgets/seatView";
import { observer } from "mobx-react";
import styled from "styled-components";
import Select, { GroupBase, mergeStyles, StylesConfig } from "react-select";
import { selectStyle } from "@styles/globals";
import { selectCustomTheme } from "@styles/layout.theme";
import { Textarea } from "@components/basic/form/textarea";


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

// const SeatTestEmoticon = styled.span`
//     flex-shrink: 0;
//     color: #fff;
//     margin-right: 4px;
// `;

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
        width: '100%',
    }),
});


export const SeatViewRender = observer(function() {
    const inputWidth = 72;
    const currWidget = ownerCaretaker.currOwner.currWidget as SeatViewWidget;
    
    const options: ValueLabel[] = [];
    const zoombleds = [
        { value: ZOOMABLE.NO, label: '否', },
        { value: ZOOMABLE.YES, label: '是' }
    ];
    const biggers = [
        { value: BIGGER.NO, label: '否' },
        { value: BIGGER.YES, label: '是' }
    ]
    for (const key in SeatVideoMode) {
        options.push(SeatVideoMode[key as unknown as keyof TSeatVideoMode])
    }

    const testEmoticonPosition = function() {
        const parent = document.querySelector(`[pid="${currWidget.id}"]`);
        if (!parent) return;
        const img: any = document.createElement('span');
        img.style = `
            position: absolute;
            width: ${currWidget.emoticon.width}px;
            height: ${currWidget.emoticon.width}px;
            top: ${currWidget.emoticon.top}px;
            left: ${currWidget.emoticon.left}px;
            background-image: url(https://image.huajiao.com/4fafd8c2dfbce6dcbd8b38435a0f76df.jpg);
            background-size: auto ${currWidget.emoticon.width}px ;
        `;
        parent.appendChild(img);
        setTimeout(() => {
            img.remove();
        }, 2000);
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
                        onChange={ (option) => currWidget.setVideoMode(option.value) }
                        />
                </div>
            </TitleCollapse>

            <TitleCollapse
                title="静音模式模式"
                >
                <div className="padding16">
                    <Select
                        value={ MuteMode.find(option => option.value === currWidget.mute) }
                        options={ MuteMode }
                        styles={ withSelectStyles }
                        theme={ selectCustomTheme }
                        onChange={ (option) => currWidget.setMute(option.value) }
                        />
                </div>
            </TitleCollapse>
            <TitleCollapse
                title="是否支持缩放,与[缩放配置]配合"
                >
                <LightTippy
                    content="用于告知客户端提供操作入口"
                    >
                    <div className="padding16">
                        <Select
                            value={ zoombleds.find(option => option.value === currWidget.zoomable) }
                            options={ zoombleds }
                            styles={ withSelectStyles }
                            theme={ selectCustomTheme }
                            onChange={ (option) => currWidget.setZoomable(option.value) }
                            />
                    </div>
                </LightTippy>
            </TitleCollapse>
            <TitleCollapse
                title="缩放配置"
                >
                <LightTippy
                    content="如果配置了支持缩放，则必须配置如下内容.如果当前为大窗，则此处填写的就是切换至小窗的布局。反之亦然"
                    >
                    <div className="padding16">
                        <Textarea
                            label="缩放后的标识"
                            placeholder="请输入缩放后的标识"
                            value={ currWidget.zoom.to }
                            onChange={ (event) => currWidget.setZoom({to: event.target.value})}
                            />
                    </div>
                </LightTippy>
            </TitleCollapse>
            <TitleCollapse
                title="当前是否为放大的窗口"
                >
                <div className="padding16">
                    <Select
                        value={ biggers.find(option => option.value === currWidget.bigger) }
                        options={ biggers }
                        styles={ withSelectStyles }
                        theme={ selectCustomTheme }
                        onChange={ (option) => currWidget.setBigger(option.value) }
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
                actions={
                    <PureIconButton
                        $title="表情定位测试"
                        icon='position'
                        onClick={ () => testEmoticonPosition() }
                        />
                }
                >
                <InputWrapper>
                    <LightTippy
                        content="表情大小"
                        >
                        <Input
                            label="大小"
                            labelAnimation
                            type="number"
                            center
                            select
                            auto
                            width={ inputWidth }
                            value={ currWidget.emoticon.width }
                            onChange={ (event) => { currWidget.emoticon.setWidth(event.target.value || '')}}
                            />
                    </LightTippy>
                    <LightTippy
                        content="表情居左位置"
                        >
                        <Input
                            label="居左"
                            labelAnimation
                            type="number"
                            center
                            select
                            auto
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
                            label="居上"
                            labelAnimation
                            type="number"
                            center
                            select
                            auto
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
                            label="座位号"
                            labelAnimation
                            type="number"
                            center
                            select
                            auto
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
