import { messageTransition } from "@styles/globals";
import { nanoid } from "nanoid";
import { PropsWithChildren, ReactNode, useEffect, useRef, useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import styled from "styled-components";



const MessageBox = styled.div`
    position: fixed;
    top: 100px;
    left: 50%;
    z-index: 9999;
    transform: translate(-50%);
    display: flex;
    flex-direction: column;
    font-size: 14px;
`;





interface OpenProps {
    content: ReactNode
}


/**
 * 消息提示控制器
 */
export class MessageControl {
    static open(props: OpenProps, duration: number | boolean = 3000): MessageControl {
        return new MessageControl(
            '',
            nanoid(),
            () => {}
        );
    }
    constructor(
        public content: ReactNode,
        public uuid: string,
        private closeCallback: Function
    ) {}

    close() {
        this.closeCallback(this.uuid);
    }
}

export interface MessageProps {
    max?: number
    onLoaded?: Function
    onLeave?: Function
}

export const Message = function(props: MessageProps) {
    const {
        max = 6,
        onLoaded = () => {},
        onLeave = () => {},
    } = props;
    const [messages, setMessages] = useState<MessageControl[]>([]);
    const closeMessage = function(uuid: string) {
        setMessages((prevMessages) => prevMessages.filter(message => message.uuid !== uuid));
    }

    // TODO
    // 状态
    // export type MessageType = 'info' | 'success' | 'danger' | 'warning'
    MessageControl.open = function(
        { content }: OpenProps,
        duration: number | boolean = 3000
    ) {

        // 每一个Message都是一个实例
        // 这样就可以用链式调用来关闭当前Message
        const uuid = nanoid();
        const messageControl = new MessageControl(content, uuid, closeMessage);
        // 添加Message
        messages.push(messageControl);
        setMessages([...messages]);

        if (typeof duration !== 'boolean') {
            // 如果有定时则等待自动关闭
            setTimeout(() => {
                closeMessage(uuid);
            }, duration);
        }
        return messageControl;
    }

    useEffect(() => {
        // 如果长处最大限制则先进先出
        if (messages.length >= max) {
            const { uuid } = messages[0]
            closeMessage(uuid);
        }
    }, [max, messages]);

    useEffect(() => {
      onLoaded();
    
      return () => {
        onLeave();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    

    return (
        <MessageBox>
            <TransitionGroup component={null}>
                {
                    messages.map((message) => (
                        <TransitionMessage
                            key={message.uuid}
                            >
                            { message.content }
                        </TransitionMessage>
                    ))
                }
            </TransitionGroup>
        </MessageBox>
    );
}


const MessageWrapper = styled.div<{duration: number}>`
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.white50};
    box-shadow: 0 3px 6px rgb(0 0 0 / 30%);
    border-radius: 8px;
    min-width: 160px;
    min-height: 40px;
    max-width: 320px;
    margin-bottom: 8px;
    padding: 8px;
    word-break: break-word;
    ${props => messageTransition(props)}
`;

export const TransitionMessage = function(props: PropsWithChildren<{duration?: number}>) {
    const {
        duration = 300,
        children,
        ...transitionProps
    } = props;
    const nodeRef = useRef(null);
    return (
        <CSSTransition
            { ...transitionProps }
            classNames="message-transition"
            timeout={ duration }
            unmountOnExit
            nodeRef={ nodeRef }
            >
            <MessageWrapper
                ref={ nodeRef }
                duration={ duration }
                >
                { children }
            </MessageWrapper>
        </CSSTransition>
    );
}

