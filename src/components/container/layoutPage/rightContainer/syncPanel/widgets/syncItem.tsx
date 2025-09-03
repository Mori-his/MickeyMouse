import { ChangeEvent, ForwardedRef, forwardRef, useEffect, useState } from "react";
import { ISyncAttr, NodeSync } from "@/types/types";
import CreatableSelect from 'react-select/creatable';
import { observer } from "mobx-react";
import styled from "styled-components";
import { GroupBase, mergeStyles, SingleValue, StylesConfig } from "react-select";
import { PureIconButton } from "@components/basic/iconButton";
import theme, { selectCustomTheme } from '@styles/layout.theme';
import { selectStyle } from "@styles/globals";
import { Textarea } from "@components/basic/form/textarea";
import { TitleCollapse } from "../../../../common/title";

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
    id?: string | number
    // 可选择的sync列表
    syncs: ISyncAttr[]
    // 默认sync表达式值
    defaultSync?: defaultSyncProps
    onChange?: (sync: NodeSync) => void
    onDelete?: Function
    duration?: number
}

export const SyncItem = observer(forwardRef(function SyncItem(
    props: SyncItemProps,
    nodeRef: ForwardedRef<HTMLDivElement>
) {
    const {
        id,
        syncs = [],
        onChange = () => {},
        onDelete = () => {},
        defaultSync = null,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        duration = 500,
        ...otherProps
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
            id,
        });
    }

    const handleSyncValueChange = function(event: ChangeEvent<HTMLTextAreaElement>) {
        setSyncValue(event.target.value);
        onChange({
            key: selectSync?.value || '',
            value: event.target.value,
            id,
        });
    }

    return (
        <SyncItemWrapper
            ref={ nodeRef }
            { ...otherProps }
            >
            <TitleCollapse
                titleStyle={{
                    backgroundColor: theme.primary,
                    flex: 1,
                }}
                title={
                    <CreatableSelect<ISyncAttr, false, GroupBase<ISyncAttr> >
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
}));

