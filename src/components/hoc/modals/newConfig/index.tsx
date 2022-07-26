import { ActionMap } from "@/types/redux.type";
import Button from "@components/basic/button";
import FormItem from "@components/basic/form/formItem/formItem";
import Input from "@components/basic/form/input/input";
import { TransitionScaleModal } from "@components/basic/modal";
import { CustomScrollbar } from "@styles/globals";
import { ChangeEvent, useReducer } from "react";
import styled from "styled-components";
import { ModalHOCProps } from "..";


const NewConfigWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 424px;
    min-height: 248px;
    border-radius: 8px;
    background: #353C46;
    box-shadow: 0 3px 6px rgb(0 0 0 / 30%);
    color: #A5A4A6;
    overflow: auto;
    ${ CustomScrollbar };
`;

const TextareaStyle = styled.textarea`
    background: ${props => props.theme.primary};
    color: ${props => props.theme.lightText};
    padding: 8px;
    border-radius: 8px;
    border: none;
    outline: none;
    resize: none;
    ${ CustomScrollbar };
`;

const CreateButton = styled(Button)`
    margin-right: 16px;
`;

export enum CreateConfigActions {
    SET_NAME = 'setName',
    SET_DESCRIPTION = 'setDescription',
}

export interface CreateNodeState {
    [CreateConfigActions.SET_NAME]: string
    [CreateConfigActions.SET_DESCRIPTION]: string
}

export type CreateNodeAction =
    ActionMap<CreateNodeState>[keyof ActionMap<CreateNodeState>];

export function CreateConfigReducer(
    state: CreateNodeState,
    action: CreateNodeAction
) {
    return {
        ...state,
        [action.type]: action.payload,
    };
}


export const NewConfigModal = function(props: ModalHOCProps) {
    const {
        onClose = () => {},
        onConfirm = () => {},
        onCancel = () => {},
        children,
        in: isOpen = false,
        ...otherProps
    } = props;
    const [{
        [CreateConfigActions.SET_NAME]: name,
        [CreateConfigActions.SET_DESCRIPTION]: description,
    }, dispatch] = useReducer(CreateConfigReducer, {
        [CreateConfigActions.SET_NAME]: '',
        [CreateConfigActions.SET_DESCRIPTION]: '',
    });

    const handleNameChange = function(event: ChangeEvent<HTMLInputElement>) {
        dispatch({
            type: CreateConfigActions.SET_NAME,
            payload: event.target.value
        });
    }
    const handleDescriptionChange = function(event: ChangeEvent<HTMLTextAreaElement>) {
        dispatch({
            type: CreateConfigActions.SET_DESCRIPTION,
            payload: event.target.value
        });
    }

    // 确定添加
    const handleCreateClick = function() {
        onConfirm({
            name,
            description
        });
    }

    return (
        <TransitionScaleModal
            in={ isOpen }
            { ...otherProps }
            >
            <NewConfigWrapper>
                <FormItem>
                    <Input
                        label="配置项名称"
                        placeholder="请输入配置名称"
                        value={ name }
                        onChange={ handleNameChange }
                        />
                </FormItem>
                <FormItem>
                    <TextareaStyle
                        rows={ 6 }
                        cols={ 30 }
                        placeholder="用一句话介绍下当前配置项吧。"
                        value={ description }
                        onChange={ handleDescriptionChange }
                        />
                </FormItem>
                <FormItem>
                    <CreateButton
                        variant="primary"
                        onClick={ () => handleCreateClick() }
                        >创建配置</CreateButton>
                    <Button
                        variant="secondary"
                        onClick={ () => (onCancel(), onClose()) }
                        >取消</Button>
                </FormItem>
            </NewConfigWrapper>
        </TransitionScaleModal>
    );
}
