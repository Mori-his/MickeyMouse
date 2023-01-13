import { nanoid } from "nanoid";
import { useState } from "react";
import styled, { css, keyframes } from "styled-components"


const circularAnimation = keyframes`
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -40;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -120;
    }
`

const LoadingSvg = styled.svg`
    display: block;
    width: 100%;
    height: 100%;
`;

const LoadingCircle = styled.circle`
    animation: ${circularAnimation} 1.5s ease-in-out infinite;
    stroke: currentColor;
    stroke-width: 3;
    stroke-linecap: round;
`;


type CircleLoadingProps = {}

export function CircleLoading({}: CircleLoadingProps) {
  return (
    <LoadingSvg viewBox="25 25 50 50">
        <LoadingCircle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            />
    </LoadingSvg>
  )
}

type LoadingProps = {
    /**
     * Loading颜色
     */
    color: string
    /**
     * Loading大小
     */
    size: number
}

const SIZE_DEFAULT_VALUE = 24;

const LoadingWrapper = styled.div<LoadingProps>`
    ${props => `
        width: ${props.size}px;
        height: ${props.size}px;
        color: ${props.color};
    `}
`;

export function Loading(props: Partial<LoadingProps>) {
    const {
        color = '#f7f7f7',
        size = SIZE_DEFAULT_VALUE
    } = props;
    return (
        <LoadingWrapper
            color={ color }
            size={ size }
            >
            <CircleLoading />
        </LoadingWrapper>
    );
}


/**
 * Loading控制器
 */
export class LoadingControl {
    static open(): LoadingControl {
        return new LoadingControl(
            nanoid(),
            () => {}
        );
    }
    constructor(
        public uuid: string,
        private closeCallback: Function
    ) {}

    close() {
        this.closeCallback(this.uuid);
    }
}

interface LoadingBoxProps extends Partial<LoadingProps> {
    backgroundColor: string
    borderRadius: number
    text?: string
    textColor?: string
    isMask?: boolean
}

const LoadingBoxFixed = css`
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
`;
const LoadingBoxWrapper = styled.div`
    ${LoadingBoxFixed};
    z-index: 99;
`;
const LoadingBoxMask = styled.div`
    ${LoadingBoxFixed};
    background-color: rgba(0, 0, 0, .7);
    backdrop-filter: blur(4px);
`;
const LoadingBoxDiv = styled.div<LoadingBoxProps>`
    position: absolute;
    left: 50%;
    top: 10%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 6px rgba(255, 255, 255, .5);
    padding: 8px 16px;
    ${props => `
        border-radius: ${props.borderRadius}px;
        background-color: ${props.backgroundColor};
    `}
`;
type LoadingBoxTextProps = {
    color: string
}
const LoadingBoxText = styled.div<LoadingBoxTextProps>`
    font-size: 12px;
    margin-left: 8px;
    ${props => `
        color: ${props.color};
    `};
`;

export function LoadingBox(props: Partial<LoadingBoxProps>) {
    const {
        backgroundColor = '#000',
        size = SIZE_DEFAULT_VALUE,
        borderRadius = Math.ceil(size / 8 * 2.6),
        isMask = false,
        textColor = props.color || '#f7f7f7',
        text = '加载中...'
    } = props;

    const [showLoading, setShowLoading] = useState(false);

    const boxSize = size * 2;
    LoadingControl.open = function() {
        const uuid = nanoid();
        // 显示
        setShowLoading(true);
        return new LoadingControl(
            uuid,
            () => setShowLoading(false)
        )
    }

    return (
        showLoading ? <LoadingBoxWrapper>
            { isMask && <LoadingBoxMask />}
            <LoadingBoxDiv
                backgroundColor={ backgroundColor }
                size={ boxSize }
                borderRadius={ borderRadius }
                >
                <Loading
                    size={ size }
                    { ...props }
                    />
                <LoadingBoxText
                    color={ textColor }
                    >
                        { text }
                    </LoadingBoxText>
            </LoadingBoxDiv>
        </LoadingBoxWrapper> : <></>
    );
}
