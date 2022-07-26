import styled from "styled-components";

import { TitleCollapse } from "../../../common/title";
import Input from "@components/basic/form/input/input";
import FormItem from "@components/basic/form/formItem/formItem";
import ownerCaretaker from "@models/owners";
import { observer } from "mobx-react";
import { ChangeEvent } from "react";
import { RootWidget } from "@widgets/root";
import { PaddingRL8 } from "../../../common/styleds/containerStyle";
import { nanoid } from "nanoid";


const BasicPanelWarpper = styled.div`
`;

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
                            label="ID:"
                            placeholder="请输入ID,ID必须唯一"
                            value={ currWidget.id }
                            onChange={ (e: ChangeEvent<HTMLInputElement>) => handleIdChange(e) }
                            onBlur={ (e: ChangeEvent<HTMLInputElement>) => handleIdBlur(e)}
                            />
                    </FormItem>
                    <FormItem>
                        <Input
                            label="名称:"
                            placeholder="请输入名称"
                            value={ currWidget.name || '' }
                            onChange={ (e: ChangeEvent<HTMLInputElement>) => currWidget.setName(e.target.value) }
                            />
                    </FormItem>
                    {
                        currWidget.type === 'root' &&
                        <FormItem>
                            <Input
                                label="游戏ID:"
                                placeholder="请输入游戏ID"
                                value={ (currWidget as RootWidget).gameId }
                                onChange={ (e: ChangeEvent<HTMLInputElement>) => (currWidget as RootWidget).setGameId(e.target.value) }
                                />
                        </FormItem>
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
