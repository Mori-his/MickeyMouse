import styled from "styled-components";
import { observer } from "mobx-react";
import { ChangeEvent } from "react";
import CreatableSelect from 'react-select/creatable';
import { GroupBase, mergeStyles, StylesConfig } from "react-select";
import { nanoid } from "nanoid";

import Input from "@components/basic/form/input/input";
import FormItem from "@components/basic/form/formItem/formItem";
import ownerCaretaker from "@models/owners";
import { Games, RootWidget } from "@widgets/root";
import { selectStyle } from "@styles/globals";
import { selectCustomTheme } from "@styles/layout.theme";
import { TitleCollapse } from "../../../common/title";
import { InputBeforeSpan, PaddingRL8 } from "../../../common/styleds/containerStyle";


const BasicPanelWarpper = styled.div`
`;

const InputBeforeSpanExt = styled(InputBeforeSpan)`
    width: 70px;
    text-align: right;
`;

const GameLabel = styled.span`
    min-width: 80px;
    text-align: right;
    margin-right: 8px;
    color: #7F7F7F;
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
        zIndex: 7,
        width: '100%',
        overflow: 'revert'
    }),
});

export default observer(function BasicPanel() {

    const currWidget = ownerCaretaker.currOwner.currWidget!;

    const handleIdChange = function(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        currWidget.setId(value);
    }

    const handleIdBlur = function(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target.value) {
            currWidget.setId(nanoid(16));
        }
    }

    return (
        <BasicPanelWarpper>
            <TitleCollapse
                title="基本信息"
                >
                <PaddingRL8>
                    <FormItem>
                        <Input
                            before={
                                <InputBeforeSpanExt>ID:</InputBeforeSpanExt>
                            }
                            placeholder="请输入ID,ID必须唯一"
                            value={ currWidget.id }
                            onChange={ (e: ChangeEvent<HTMLInputElement>) => handleIdChange(e) }
                            onBlur={ (e: ChangeEvent<HTMLInputElement>) => handleIdBlur(e)}
                            />
                    </FormItem>
                    <FormItem>
                        <Input
                            before={
                                <InputBeforeSpanExt>名称:</InputBeforeSpanExt>
                            }
                            placeholder="请输入名称"
                            value={ currWidget.name || '' }
                            onChange={ (e: ChangeEvent<HTMLInputElement>) => currWidget.setName(e.target.value) }
                            />
                    </FormItem>
                    {
                        currWidget.type === 'root' && (
                            <>
                                <FormItem>
                                    <GameLabel>玩法: </GameLabel>
                                    <CreatableSelect
                                        value={ Games.find(option => +option.value === (currWidget as RootWidget).gameId) }
                                        options={ Games }
                                        styles={ withSelectStyles }
                                        theme={ selectCustomTheme }
                                        onChange={ (option) => ((currWidget as RootWidget).setGameId(option.value))}
                                        />
                                </FormItem>
                            </>
                        )
                    }
                    {/* <FormItem>
                        <InputLabel>切换类型: </InputLabel>
                        <Select
                            theme="dark"
                            width={ 184 }
                            options={ [{ id: 0, name: currWidget.type }] }
                            />
                    </FormItem> */}
                </PaddingRL8>
            </TitleCollapse>
        </BasicPanelWarpper>
    );
});
