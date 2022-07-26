import { Collapse, CollapseProps } from "@components/basic/collapse";
import { PureIconButton } from "@components/basic/iconButton";
import Tippy from "@tippyjs/react";
import React, { ReactNode, useRef, useState } from "react";
import styled, { CSSProperties } from "styled-components";

const TitleWrapper = styled.div`
    width: 100%;
    color: ${ props => props.theme.lightText};
    font-size: 16px;
`;


interface TitleProps {
    title: ReactNode
    tips?: string | ReactNode
}
export default function Title(props: TitleProps) {
    const { tips, title } = props;
    return (
        <Tippy
            content={ tips }
            disabled={ !tips }
            >
            <TitleWrapper>
                <span>{ title }</span>
            </TitleWrapper>
        </Tippy>
    ) 
}


const EffectTitleWrapper = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
`;

export interface TitleCollapseProps extends CollapseProps {
    title: ReactNode
    actions?: ReactNode
    titleStyle?: CSSProperties
}

export function TitleCollapse(props: TitleCollapseProps) {
    const {
        title,
        actions,
        children,
        onClick = () => {},
        titleStyle = {},
        ...otherProps
    } = props;

    const [rotate, setRotate] = useState('rotate(0deg)');
    const collapseRef = useRef<React.ElementRef<typeof Collapse>>(null);
    // 默认是展开的
    const fold = useRef<boolean>(false);
    const handleCollapaseClick = function() {
        if (fold.current) {
            setRotate('rotate(0deg)')
        } else {
            setRotate('rotate(-90deg)')
        }
        collapseRef.current!.setFold(fold.current);
        onClick(fold.current);
        fold.current = !fold.current;
    }

    return (
        <Collapse
            { ...otherProps }
            ref={ collapseRef }
            preventDefault={ true }
            title={
                <EffectTitleWrapper
                    style={ titleStyle }
                    >
                    <Title title={ title } />
                    { actions }
                    <div
                        style={{
                            transition: 'transform .5s',
                            transform: rotate
                        }}
                        >
                        <PureIconButton
                            icon="arrowDown"
                            onClick={ handleCollapaseClick }
                            />
                    </div>
                </EffectTitleWrapper>
            }
            >
            { children }
        </Collapse>
    );
}
