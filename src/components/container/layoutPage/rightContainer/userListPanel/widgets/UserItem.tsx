import { ChangeEvent, ForwardedRef, forwardRef, useState } from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import theme from '@styles/layout.theme';
import { PureIconButton } from "@components/basic/iconButton";
import Input from "@components/basic/form/input/input";
import { TitleCollapse } from "@components/container/common/title";
import { UserAttr } from "@models/factory/types";

const UserItemWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 8px 0 0;
`;

const InputWrapper = styled.div`
    padding: 8px;
    background: ${props => props.theme.main};
    textarea {
        color: ${props => props.theme.white50};
        font-size: 14px;
    }
`;


interface UserItemProps {
    defaultUser: UserAttr
    onChange?: (user: UserAttr) => void
    onDelete?: () => void
}

export const UserItem = observer(forwardRef(function UserItem(
    props: UserItemProps,
    nodeRef: ForwardedRef<HTMLDivElement>
) {
    const {
        onChange = () => {},
        onDelete = () => {},
        ...otherProps
    } = props;

    const [uidValue, setUidValue] = useState(props.defaultUser.uid);
    const [posValue, setPosValue] = useState(props.defaultUser.pos);
    

    const handleUidChange = function(event: ChangeEvent<HTMLInputElement>) {
        const uid = event.target.value;
        setUidValue(uid);
        onChange({
            ...props.defaultUser,
            uid,
        });
    }

    const handlePosChange = function(event: ChangeEvent<HTMLInputElement>) {
        const pos = event.target.value;
        setPosValue(pos);
        onChange({
            ...props.defaultUser,
            pos,
        });
    }

    return (
        <UserItemWrapper
            ref={ nodeRef }
            { ...otherProps }
            >
            <TitleCollapse
                titleStyle={{
                    backgroundColor: theme.primary,
                    flex: 1,
                }}
                title={
                    <InputWrapper>
                        <Input
                            placeholder="请输入用户uid"
                            value={ uidValue }
                            onChange={ handleUidChange }
                            />
                    </InputWrapper>
                }
                actions={
                    <PureIconButton
                        icon="delete"
                        onClick={ onDelete }
                        />
                }
                >
                <InputWrapper>
                    <Input
                        placeholder="请输入用户顺序"
                        type='number'
                        value={ posValue }
                        onChange={ handlePosChange }
                        />
                </InputWrapper>
            </TitleCollapse>
        </UserItemWrapper>
    );
}));

