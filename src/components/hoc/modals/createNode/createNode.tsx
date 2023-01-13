import Button from "@components/basic/button";
import FormItem from "@components/basic/form/formItem/formItem";
import Input from "@components/basic/form/input/input";
import { PureIconButton } from "@components/basic/iconButton";
import { TransitionScaleModal } from "@components/basic/modal";
import styled, { ThemeProvider } from "styled-components";
import theme from '@styles/layout.theme';
import { ModalHOCProps } from "..";
import { WidgetTypeManage } from "@models/factory/widgetTypeClassManage";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { ActionMap } from "@/types/redux.type";
import { MessageControl } from "@components/basic/common";
import { IIcons } from "@components/basic/svgs/icons";
import { CustomScrollbar } from "@styles/globals";
import { nanoid } from "nanoid";


const height = '80vh';
const CreateNodeWrapper = styled.div`
    display: flex;
    width: 80vw;
    height: ${height};
    background-color: ${props => props.theme.complementaryColor};
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 3px 6px rgb(0 0 0 / 30%);
`;

const CreateNodeLeftList = styled.div`
    display: flex;
    flex-direction: column;
    height: ${height};
    overflow-x: hidden;
    overflow-y: overlay;
    border-radius: 16px 0 0 16px;
    background-color: ${props => props.theme.contrast};
    ${ CustomScrollbar };
`;

type CreateNodeItemProps = {
    active: boolean
}
const CreateNodeItem = styled.div<CreateNodeItemProps>`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    width: 200px;
    height: 88px;
    padding: 0 0 0 8px;
    cursor: pointer;
    ${({theme, active}) =>  active && `
        background-color: ${theme.complementaryColor};
    `};
    &:hover {
        background-color: ${props => props.theme.complementaryColor};
    }
`;
const CreateNodeItemText = styled.div`
    font-size: 14px;
    color: ${props => props.theme.lightText};
`;

const CreateNodeContext = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const NodeDescrition = styled.div`
    width: 80%;
    height: 300px;
    margin: 24px 0 64px;
    border-radius: 16px;
    padding: 8px;
    background-color: ${props => props.theme.contrast};
    color: ${props => props.theme.lightText};
`;

const NodeInput = styled(Input)`
    width: 200px;
    height: 40px;
`;

const NodeButton = styled(Button)`
    width: 104px;
    height: 40px;
    border-radius: 20px;
    margin: 0 12px;
`;

interface OptionProps {
    label: string
    value: string
    icon: IIcons
    isDisabled?: boolean
}

export enum CreateNodeActions {
    SET_NODE = 'setNode',
    SET_ID = 'setId',
    SET_NAME = 'setName',
}

export interface CreateNodeState {
    [CreateNodeActions.SET_NODE]: OptionProps | null
    [CreateNodeActions.SET_ID]: string
    [CreateNodeActions.SET_NAME]: string
}

export type CreateNodeAction =
    ActionMap<CreateNodeState>[keyof ActionMap<CreateNodeState>];

export function CreateNodeReducer(
    state: CreateNodeState,
    action: CreateNodeAction
) {
    return {
        ...state,
        [action.type]: action.payload,
    };
}



export function CreateNode(props: ModalHOCProps) {
    const widgetTypeManage = WidgetTypeManage.getInstance();
    const {
        onClose = () => {},
        onConfirm = () => {},
        onCancel = () => {},
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        children,
        in: isOpen = false,
        ...otherProps
    } = props;

    const [widgetTypes, setWidgetTypes] = useState<OptionProps[]>([]);
    const [state, dispatch] = useReducer(CreateNodeReducer, {
        [CreateNodeActions.SET_NODE]: null,
        [CreateNodeActions.SET_ID]: nanoid(8),
        [CreateNodeActions.SET_NAME]: '',
    });
    // ID变更
    const handleChangeID = function(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        dispatch({
            type: CreateNodeActions.SET_ID,
            payload: value
        });
    }
    // 名称变更
    const handleChangeName = function(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        dispatch({
            type: CreateNodeActions.SET_NAME,
            payload: value
        });
    }

    // 节点变更
    const handleChangeNode = function(props: OptionProps) {
        dispatch({
            type: CreateNodeActions.SET_NODE,
            payload: props
        });
    }

    // 确定添加
    const handleCreateClick = function() {
        if (!state[CreateNodeActions.SET_ID]) {
            MessageControl.open({
                content: '请输入ID'
            });
            return;
        }
        if (!state[CreateNodeActions.SET_NODE]) {
            MessageControl.open({
                content: '请选择节点类型'
            });
            return;
        }
        onConfirm(state);
    }

    useEffect(() => {
        widgetTypeManage.Map.forEach((attr, key: string) => {
            const item: OptionProps = {
                label: attr.label || key,
                value: key,
                icon: attr.icon || 'widget_text'
            }
            if (key !== 'root') {
                widgetTypes.push(item);
            }
        });
        dispatch({
            type: CreateNodeActions.SET_NODE,
            payload: widgetTypes[0]
        });
        setWidgetTypes([...widgetTypes]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [widgetTypeManage]);

    useEffect(() => {
        if(isOpen) {
            dispatch({
                type: CreateNodeActions.SET_ID,
                payload: nanoid(8)
            });
        }
    }, [isOpen])


    return (
        <ThemeProvider theme={ theme }>
            <TransitionScaleModal
                in={ isOpen }
                { ...otherProps }
                >
                <CreateNodeWrapper>
                    <CreateNodeLeftList>
                        {
                            widgetTypes.map((item, index) => (
                                <CreateNodeItem
                                    key={ `${item.value}_${index}` }
                                    active={ state[CreateNodeActions.SET_NODE]?.value === item.value }
                                    onClick={ () => handleChangeNode(item)}
                                    >
                                    <PureIconButton
                                        icon={item.icon}
                                        size={ 56 }
                                        defaultColor={ theme.lightText }
                                        />
                                    <CreateNodeItemText>
                                        { item.label }
                                    </CreateNodeItemText>
                                </CreateNodeItem>
                            ))
                        }
                    </CreateNodeLeftList>
                    <CreateNodeContext>
                        <NodeDescrition>{ state[CreateNodeActions.SET_NODE]?.label }</NodeDescrition>
                        <FormItem>
                            <NodeInput
                                label="ID"
                                placeholder="请输入ID"
                                value={ state[CreateNodeActions.SET_ID] || '' }
                                onChange={ handleChangeID }
                                />
                        </FormItem>
                        <FormItem>
                            <NodeInput
                                label="名称"
                                placeholder="请输入名称"
                                value={ state[CreateNodeActions.SET_NAME] || '' }
                                onChange={ handleChangeName }
                                />
                        </FormItem>
                        <FormItem>
                            <NodeButton
                                variant="primary"
                                onClick={ handleCreateClick }
                                >确定</NodeButton>
                            <NodeButton
                                variant="secondary"
                                onClick={ () => (onCancel(), onClose()) }
                                >取消</NodeButton>
                        </FormItem>
                    </CreateNodeContext>
                </CreateNodeWrapper>
            </TransitionScaleModal>
        </ThemeProvider>
    );
}
