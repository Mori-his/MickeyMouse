import { forwardRef, ReactNode, useCallback, useImperativeHandle, useRef } from "react";
import styled from "styled-components";

const CollapseWrapper = styled.div`
    display: flex;
    flex-direction: column;

`;

const CollapseTitle = styled.div`
    display: flex;
    align-items: center;
    height: 42px;
    background: ${props => props.theme.main};
`;

const CollapseBody = styled.div`
    transition: height .5s;
`;

export type CollapseRef<T extends HTMLElement = HTMLElement> = {
    collapseEl: React.RefObject<T>
    collapseBodyEl: React.RefObject<T>
    setFold: (fold: boolean) => void
    fold: boolean
}

export type CollapseProps = {
    title: ReactNode
    onClick?: (fold: boolean) => void
    children?: ReactNode
    preventDefault?: boolean
}

export const Collapse = forwardRef(function Collapse(
    props: CollapseProps,
    divRef: React.ForwardedRef<CollapseRef<HTMLDivElement>>
) {
    const {
        title,
        children,
        onClick = () => {},
        preventDefault = false,
    } = props;

    const foldRef = useRef(false);
    const collapseBodyWrapRef = useRef<HTMLDivElement>(null);
    const collapseRef = useRef<HTMLDivElement>(null);
    const collapseBodyRef = useRef<HTMLDivElement>(null);
    

    const handleTitleClick = useCallback(function(fold: boolean) {
        if (collapseBodyWrapRef.current && collapseBodyRef.current) {
            const bodyStyle = getComputedStyle(collapseBodyRef.current);
            const bodyHeight = parseFloat(bodyStyle.height);
            // 为了收起有动画就得给每一次收起前设置个高度
            collapseBodyWrapRef.current.style.height = `${bodyHeight}px`;
            setTimeout(() => {
                if (!fold && collapseBodyWrapRef.current) {
                    // 如果收起
                    collapseBodyWrapRef.current.style.overflow = 'hidden';
                    collapseBodyWrapRef.current.style.height = '0px';
                }
                foldRef.current = !fold
                onClick(foldRef.current);
            });
            setTimeout(() => {
                if (!foldRef.current && collapseBodyWrapRef.current) {
                    // 如果展开结束了， timeout要和动画时长保持一致
                    collapseBodyWrapRef.current.style.overflow = 'visible';
                    collapseBodyWrapRef.current.style.height = 'auto';
                }
            }, 500);
        }
    }, [onClick])


    useImperativeHandle(divRef, () => ({
        collapseBodyEl: collapseBodyRef,
        collapseEl: collapseRef,
        setFold: handleTitleClick,
        fold: foldRef.current,
    }), [handleTitleClick]);

    return (
        <CollapseWrapper
            ref={ collapseRef }
            >
            <CollapseTitle
                onClick={ () => !preventDefault && handleTitleClick(foldRef.current) }
                >
                { title }
            </CollapseTitle>
            <CollapseBody
                ref={ collapseBodyWrapRef }
                >
                <div
                    ref={ collapseBodyRef }
                    >
                    { children }
                </div>
            </CollapseBody>
        </CollapseWrapper>
    );
});

