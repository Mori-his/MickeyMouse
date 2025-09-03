import Button from "@components/basic/button";
import { TransitionScaleModal } from "@components/basic/modal";
import { nanoid } from "nanoid";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import styled, { css } from "styled-components";



const ConfirmBox = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 14px;
`;

const flexCenterStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ConfirmWrapper = styled.div`
    ${ flexCenterStyle };
    flex-direction: column;
    background: ${props => props.theme.main};
    color: ${props => props.theme.white50};
    box-shadow: 0 3px 6px rgb(0 0 0 / 30%);
    border-radius: 8px;
    min-width: 320px;
    min-height: 160px;
`;

const ConfirmContent = styled.div`
    ${ flexCenterStyle };
    max-width: 30vw;
    padding: 16px;
    flex: 1;
    line-height: 1.3;
`;
const ConfirmBtnBox = styled.div`
    ${ flexCenterStyle };
    margin: auto 0 8px;
`;

const ConfirmBtn = styled(Button)`
    ${ flexCenterStyle };
    margin: 0 8px;
    
`;

// 预留样式做确认框区分用
const ConfirmOK = styled(ConfirmBtn)``;
const ConfirmCancel = styled(ConfirmBtn)``;



interface OpenProps {
    content: ReactNode
}


/**
 * 消息提示控制器
 */
export class ConfirmControl {
    resolve!: Function
    reject!: Function
    static open(_: OpenProps) {
        return Promise.resolve(new ConfirmControl(
            '',
            nanoid(),
            () => {}
        ));
    }
    constructor(
        public content: ReactNode,
        public uuid: string,
        private closeCallback: Function
    ) {}
    

    onClose() {
        this.closeCallback(this.uuid);
    }
}

export interface ConfirmProps {
    max?: number
    onLoaded?: Function
    onLeave?: Function
}

export const Confirm = function(props: ConfirmProps) {
    const {
        max = 6,
        onLoaded = () => {},
        onLeave = () => {},
    } = props;
    const [confirms, setConfirms] = useState<ConfirmControl[]>([]);
    const closeConfirm = useCallback(function(uuid: string) {
        setConfirms((prevMessages) => prevMessages.filter(message => message.uuid !== uuid));
    }, [])

    // TODO
    // 状态
    // export type MessageType = 'info' | 'success' | 'danger' | 'warning'
    ConfirmControl.open = function(
        { content }: OpenProps
    ) {

        // 每一个Message都是一个实例
        // 这样就可以用链式调用来关闭当前Message
        const uuid = nanoid();
        const confirmControl = new ConfirmControl(
            content,
            uuid,
            closeConfirm
        );
        // 添加Message
        confirms.push(confirmControl);
        setConfirms([...confirms]);

        return new Promise<ConfirmControl>((resolve, reject) => {
            confirmControl.resolve = resolve;
            confirmControl.reject = reject;
        });
    }

    useEffect(() => {
        // 如果长处最大限制则先进先出
        if (confirms.length >= max) {
            const { uuid } = confirms[0]
            closeConfirm(uuid);
        }
    }, [max, confirms, closeConfirm]);

    useEffect(() => {
      onLoaded();
    
      return () => {
        onLeave();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <ConfirmBox>
            <TransitionGroup component={null} className="modal-list">
                {
                    confirms.map((confirm) => (
                        <TransitionScaleModal
                            key={ confirm.uuid }
                            >
                            <ConfirmWrapper
                                >
                                <ConfirmContent>
                                    { confirm.content }
                                </ConfirmContent>
                                <ConfirmBtnBox>
                                    <ConfirmOK
                                        variant="primary"
                                        onClick={() => confirm.resolve(confirm)}
                                        >确认</ConfirmOK>
                                    <ConfirmCancel
                                        variant="secondary"
                                        onClick={() => (
                                            confirm.reject,
                                            confirm.onClose()
                                        )}
                                        >取消</ConfirmCancel>
                                </ConfirmBtnBox>
                            </ConfirmWrapper>
                        </TransitionScaleModal>
                    ))
                }
            </TransitionGroup>
        </ConfirmBox>
    );
}



