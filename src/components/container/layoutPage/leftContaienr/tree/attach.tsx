import { createPortal } from "react-dom";
import styled from "styled-components";

interface EmptyNodeProps {
    borderColor: string
    borderRadius: number
}
const EmptyNode = styled.div<EmptyNodeProps>`
    ${props => `
        width: ${typeof props.$width === 'number' && props.$width > -1 ? props.$width + 'px' : '100%'};
        height: ${typeof props.$height === 'number' && props.$height > -1 ? props.$height + 'px' : '100%'};
        border: 1px dashed ${props.borderColor};
        border-radius: ${props.borderRadius}px;
    `};
`;

interface AttachEmptyNodeProps {
    target: HTMLElement | null
    width?: number
    height?: number
    borderColor?: string
    borderRadius?: number
}
export function AttachEmptyNode(props: AttachEmptyNodeProps) {
    const { target, width, height = 32, borderColor = '#fff', borderRadius = 8 } = props;

    return target ? createPortal(
        (<EmptyNode
            $width={ width }
            $height={ height }
            borderColor={ borderColor }
            borderRadius={ borderRadius }
            />),
        target
    ) : null
}
