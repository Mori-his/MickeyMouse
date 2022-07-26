import { forwardRef, ReactNode, ForwardedRef } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";


const ModalWrapper = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ModalBackgroundBlur = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(68, 68, 68, 0.4);
    backdrop-filter: blur(4px);
    z-index: 1;
`;

const ModalContent = styled.div`
    position: relative;
    z-index: 2;
`;



export interface ModalBoxProps {
    maskClick?: Function
    container?: HTMLElement
    className?: string
    children?: ReactNode
}



export const PureModalBox = forwardRef(function PureModalBox(
    props: ModalBoxProps,
    modalRef: ForwardedRef<HTMLDivElement>
) {
    const {
        children,
        className,
        maskClick = () => {}
    } = props;

    return <ModalWrapper
            ref={ modalRef }
            className={ className }
            >
            <ModalBackgroundBlur
                onClick={ () => maskClick()}
                />
            <ModalContent className="modal-content">
                { children }
            </ModalContent>
        </ModalWrapper>
});







export default forwardRef(function ModalBox(
    props: ModalBoxProps,
    modalRef: ForwardedRef<HTMLDivElement>
) {
    const {
        children,
        container,
        className,
        maskClick = () => {}
    } = props;

    return createPortal(
        <ModalWrapper
            ref={ modalRef }
            className={ className }
            >
            <ModalBackgroundBlur
                onClick={ () => maskClick()}
                />
            <ModalContent className="modal-content">
                { children }
            </ModalContent>
        </ModalWrapper>
    , container || document.body);
});
