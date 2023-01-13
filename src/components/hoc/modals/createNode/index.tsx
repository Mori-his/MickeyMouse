import styled, { ThemeProvider } from 'styled-components';
import Modal from '@components/basic/modal';
import ReactDOM from 'react-dom';
import theme, { selectCustomTheme } from '@styles/layout.theme';
import FormItem from '@components/basic/form/formItem/formItem';
import Input from '@components/basic/form/input/input';
import { WidgetTypeManage } from '@models/factory/widgetTypeClassManage';
import { ChangeEvent, useEffect, useReducer, useState } from 'react';
import { ModalHOCProps } from '..';
import Select, { GroupBase, SingleValue } from 'react-select';
import Button from '@components/basic/button';
import { ActionMap } from '@/types/redux.type';
import { MessageControl } from '@components/basic/common/message/message';
import { selectStyle } from '@styles/globals';


const CreateNodeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 424px;
    height: 248px;
    border-radius: 8px;
    background: #353C46;
    box-shadow: 0 3px 6px rgb(0 0 0 / 30%);
    color: #A5A4A6;
`;

interface SelectLabelProps {
    width?: number
}
const SelectLabel = styled.div<SelectLabelProps>`
    margin-right: 8px;
    min-width: ${props => props.width || 80}px;
    text-align: right;
    color: ${props => props.theme.white30};
    font-size: 14px;
`;

const CreateButton = styled(Button)`
    width: 88px;
    height: 32px;
`;
const CancelButton = styled(Button)`
    width: 88px;
    height: 32px;
    margin-left: 48px;
    background: ${props => props.theme.lightContrast};
    color: ${props => props.theme.primary};
    &:hover {
        background: ${props => props.theme.white30};
        color: ${props => props.theme.primary};
    }
`;


interface OptionProps {
    label: string
    value: string
    isDisabled?: boolean
}


export enum CreateNodeActions {
    SET_NODE_TYPE = 'setNodeType',
    SET_ID = 'setId',
    SET_NAME = 'setName',
}

export interface CreateNodeState {
    [CreateNodeActions.SET_NODE_TYPE]: OptionProps | null
    [CreateNodeActions.SET_ID]: string | number
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

/**
 * @deprecated - 弃用
 */
export const ModalCreateNode = function(props: ModalHOCProps) {
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
        [CreateNodeActions.SET_NODE_TYPE]: null,
        [CreateNodeActions.SET_ID]: '',
        [CreateNodeActions.SET_NAME]: '',
    });
    // 节点变更
    const handleSelectChange = function(option: SingleValue<OptionProps>) {
        dispatch({
            type: CreateNodeActions.SET_NODE_TYPE,
            payload: option
        });
    }
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

    // 确定添加
    const handleCreateClick = function() {
        if (!state[CreateNodeActions.SET_ID]) {
            MessageControl.open({
                content: '请输入ID'
            });
            return;
        }
        if (!state[CreateNodeActions.SET_NODE_TYPE]) {
            MessageControl.open({
                content: '请选择节点类型'
            });
            return;
        }
        onConfirm(state);
    }

    useEffect(() => {
        let i = 0;
        widgetTypeManage.Map.forEach((_, key: string) => {
            const item: OptionProps = {
                label: key,
                value: i.toString(),
            }
            if (key === 'root') {
                item['isDisabled'] = true
            }
            widgetTypes.push(item);
            i++;
        });
        setWidgetTypes([...widgetTypes]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [widgetTypeManage]);
    return (
        <ThemeProvider theme={ theme }>
            <Modal
                in={ isOpen }
                { ...otherProps }
                >
                <CreateNodeWrapper>
                    <FormItem>
                        <Input
                            label="ID"
                            placeholder="请输入ID"
                            width={320}
                            height={40}
                            value={ state[CreateNodeActions.SET_ID] || '' }
                            onChange={ handleChangeID }
                            />
                    </FormItem>
                    <FormItem>
                        <Input
                            label="名称"
                            placeholder="请输入名称"
                            width={320}
                            height={40}
                            value={ state[CreateNodeActions.SET_NAME] || '' }
                            onChange={ handleChangeName }
                            />
                    </FormItem>
                    <FormItem>
                        {
                            // 当前节点列表须存在
                            widgetTypes.length ? (
                                <>
                                    <SelectLabel>节点类型</SelectLabel>
                                    <Select<OptionProps, false, GroupBase<OptionProps>>
                                        options={ widgetTypes }
                                        value={ state[CreateNodeActions.SET_NODE_TYPE] }
                                        styles={ selectStyle }
                                        theme={ selectCustomTheme }
                                        isClearable={ false }
                                        placeholder="请选择节点类型"
                                        onChange={ (option: SingleValue<OptionProps>) => handleSelectChange(option) }
                                        /> 
                                </>
                            ) : null
                        }
                    </FormItem>
                    <FormItem>
                        <CreateButton
                            onClick={ () => handleCreateClick() }
                            >确定</CreateButton>
                        <CancelButton
                            onClick={ () => (onCancel(), onClose()) }
                            >取消</CancelButton>
                    </FormItem>
                </CreateNodeWrapper>
            </Modal>
        </ThemeProvider>
    );
}

export type ModalEvents = {
    onClose?: Function
    onMaskClick?: Function
    onConfirm?: <T = any>(data: T) => void
    onCancel?: Function
}

export class ModalCreateNodeControl {
    container!: HTMLDivElement
    open(props: ModalEvents) {
        const {
            onMaskClick = () => {},
            onClose = () => {},
            onConfirm = () => {},
            onCancel = () => {},
        } = props;
        this.container = document.createElement('div');
        ReactDOM.render(
            (
                <ModalCreateNode
                    in={ true }
                    onClose={ () => (this.close(), onClose()) }
                    maskClick={ onMaskClick }
                    onConfirm={ onConfirm }
                    onCancel={ onCancel }
                    />
            ),
            this.container
        );

        document.body.appendChild(this.container);
        return this;
    }

    close() {
        ReactDOM.unmountComponentAtNode(this.container);
        document.body.removeChild(this.container);
        return this;
    }
}

export const modalCreateNodeControl = new ModalCreateNodeControl();




