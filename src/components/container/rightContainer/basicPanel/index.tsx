import styled from "styled-components";

import Title from "../widgets/title";
import Input, { InputLabel } from "@components/basic/form/input/input";
import Select from "@components/basic/form/select";
import FormItem from "@components/basic/form/formItem/formItem";

const BasicPanelWarpper = styled.div`
    padding: 24px 8px 0;
`;

export default function BasicPanel() {

    return (
        <BasicPanelWarpper>
            <div>
                <Title
                    title="基本信息"
                    />
                </div>
                <FormItem>
                    <Input
                        label="ID:"
                        placeholder="请输入ID,ID必须唯一"
                        />
                </FormItem>
                <FormItem>
                    <Input
                        label="名称:"
                        placeholder="请输入名称"
                        />
                </FormItem>
                <FormItem>
                    <Input
                        label="游戏ID:"
                        placeholder="请输入游戏ID"
                        />
                </FormItem>
                <FormItem>
                    <InputLabel>切换类型: </InputLabel>
                    <Select
                        theme="dark"
                        width={ 184 }
                        options={ [{id: 0, name: 'View'}] }
                        />
                </FormItem>
        </BasicPanelWarpper>
    );
}
