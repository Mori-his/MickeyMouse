import { modalTransition } from "@styles/globals";
import { ReactNode, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import ModalBox from "./modalBox";

export interface ModalProps {
    in?: boolean
    container?: HTMLElement
    maskClick?: Function
    children?: ReactNode
}

export default function Modal(props: ModalProps) {
    const {
        in: isOpen = false,
        children,
        container,
        maskClick = () => {}
    } = props;

    return isOpen ? 
            <ModalBox
                container={ container }
                maskClick={ () => maskClick() }
                >{ children }</ModalBox>
        : null;
}




type ModalWithTransitionStylesProps = {
    duration: number
}

const ModalWithTransitionStyles = styled(ModalBox)<ModalWithTransitionStylesProps>`
    // 统一动画开始
    ${props => modalTransition(props)}
`;

export interface TransitionScaleModalProps extends ModalProps {
    duration?: number
}

export function TransitionScaleModal(props: TransitionScaleModalProps) {
    const {
        in: isOpen = false,
        children,
        container,
        duration = 300,
        maskClick = () => {}
    } = props;

    const ModalRef = useRef(null);

    return <CSSTransition
        { ...props }
        in={isOpen}
        timeout={ duration }
        classNames="modal-transition"
        unmountOnExit
        nodeRef={ ModalRef }
        >
            <ModalWithTransitionStyles
                ref={ ModalRef }
                container={ container }
                duration={ duration }
                maskClick={ () => maskClick() }
                >
            { children }
            </ModalWithTransitionStyles>
    </CSSTransition>
}








type ModalWithTransitionOpacityStylesProps = {
    duration: number
}
const ModalWithTransitionOpacityStyles = styled(ModalBox)<ModalWithTransitionOpacityStylesProps>`
    &.modal-transition-enter {
        opacity: 0;
    }
    &.modal-transition-enter-active {
        transition: opacity ${props => props.duration}ms;
        opacity: 1;
    }
    &.modal-transition-exit {
        opacity: 1;
    }
    &.modal-transition-exit-active {
        transition: opacity ${props => props.duration}ms;
        opacity: 0;
    }
`;

export interface TransitionOpacityModalProps extends ModalProps {
    duration?: number
}

export function TransitionOpacityModal(props: TransitionOpacityModalProps) {
    const {
        in: isOpen = false,
        children,
        container,
        duration = 300,
        maskClick = () => {}
    } = props;

    const ModalRef = useRef(null);

    return <CSSTransition
        in={isOpen}
        timeout={ duration }
        className="modal-transition"
        classNames="modal-transition"
        unmountOnExit
        nodeRef={ ModalRef }
        >
            <ModalWithTransitionOpacityStyles
                ref={ ModalRef }
                container={ container }
                duration={ duration }
                maskClick={ () => maskClick() }
                >
            { children }
            </ModalWithTransitionOpacityStyles>
    </CSSTransition>
}





