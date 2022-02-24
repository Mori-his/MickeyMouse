import styled from "styled-components";
import IconButton from "../iconButton";

export const ColorPickerBox = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const ColorValuePanel = styled.div`
    display: flex;
    margin-top: 8px;
`;

export const ColorInput = styled.input`
    border: none;
    outline: none;
    width: ${props => props.$width}px;
    height: 24px;
    font-size: 12px;
    text-align: center;
    &:active,
    &:focus {
        border: none;
        outline: none;
    }
`;
export const ColorInputBox = styled.div`
    display: flex;
    align-items: flex-end;
    border-bottom-width: 1px;
    border-bottom-color: ${props => props.theme.primary};
    border-bottom-style: solid;
    margin-left: 8px;
`;


export const ColorCollect = styled.div`
    display: flex;
    align-items: center;
    margin-top: 8px;
`;

export const ColorCollectItemWrapper = styled.div`
    background-color: #a5a4a6;
    background-image:
        linear-gradient(45deg, #d6d6d6 25%, transparent 0, transparent 75%, #d6d6d6 0),
        linear-gradient(45deg, #d6d6d6 25%, transparent 0, transparent 75%, #d6d6d6 0);
    background-position: 0 0, 6px 6px;
    background-size: 12px 12px;
    margin: 0 4px;
`;

export const ColorCollectItem = styled.div`
    width: 24px;
    height: 24px;
    cursor: pointer;
    border: 1px solid ${props => props.theme.lesser};
`;



