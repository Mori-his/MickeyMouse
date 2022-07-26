import { ISyncAttr, NodeSync } from "@/types/types";
import { PureIconButton } from "@components/basic/iconButton";
import Select, { GroupBase, mergeStyles, SingleValue, StylesConfig } from "react-select";
import styled from "styled-components";
import { TitleCollapse } from "../../../../common/title";
import theme, { selectCustomTheme } from '@styles/layout.theme';
import { ChangeEvent, useEffect, useState } from "react";
import { CustomScrollbar, selectStyle } from "@styles/globals";
import { Textarea } from "@components/basic/form/textarea";

const SyncItemWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 8px 0 0;
`;

const SyncInputWrapper = styled.div`
    padding: 8px;
    background: ${props => props.theme.main};
    textarea {
        color: ${props => props.theme.white50};
        font-size: 14px;
    }
`;


const withSelectStyles: StylesConfig<any, false, GroupBase<any>> = mergeStyles(selectStyle, {
    control: (style) => ({
        ...style,
        background: 'transparent',
    }),
    container: (style) => ({
        ...style,
        width: '100%',
    }),
});

interface defaultSyncProps extends ISyncAttr {
    syncValue: string
}

interface SyncItemProps {
    // 可选择的sync列表
    syncs: ISyncAttr[]
    // 默认sync表达式值
    defaultSync?: defaultSyncProps
    onChange?: (sync: NodeSync) => void
    onDelete?: Function
}

export function SyncItem(props: SyncItemProps) {
    const {
        syncs = [],
        onChange = () => {},
        onDelete = () => {},
        defaultSync = null,
    } = props;
    // 选中的sync
    const [selectSync, setSelectSync] = useState<ISyncAttr | null>(defaultSync)
    // sync表达式
    const [syncValue, setSyncValue] = useState('');

    useEffect(() => {
        if (defaultSync) {
            setSelectSync(defaultSync);
            setSyncValue(defaultSync.syncValue);
        }
    }, [defaultSync]);
    

    const handleSelectChange = function (option: ISyncAttr) {
        setSelectSync(option);
        onChange({
            key: option.value,
            value: syncValue,
        });
    }

    const handleSyncValueChange = function(event: ChangeEvent<HTMLTextAreaElement>) {
        setSyncValue(event.target.value);
        onChange({
            key: selectSync?.value || '',
            value: event.target.value,
        });
    }

    return (
        <SyncItemWrapper>
            <TitleCollapse
                titleStyle={{
                    backgroundColor: theme.primary,
                    flex: 1,
                }}
                title={
                    <Select<ISyncAttr, false, GroupBase<ISyncAttr> >
                        options={ syncs }
                        value={ selectSync }
                        styles={ withSelectStyles }
                        theme={ selectCustomTheme }
                        placeholder="请选择要绑定的属性"
                        onChange={ (option: SingleValue<ISyncAttr>) => option && handleSelectChange(option) }
                        />
                }
                actions={
                    <PureIconButton
                        icon="delete"
                        onClick={ onDelete }
                        />
                }
                >
                <SyncInputWrapper>
                    <Textarea
                        placeholder="请输入表达式"
                        value={ syncValue }
                        onChange={ handleSyncValueChange }
                        />
                </SyncInputWrapper>
            </TitleCollapse>
        </SyncItemWrapper>
    );
};

