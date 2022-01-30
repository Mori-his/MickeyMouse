import IconButton from "@components/basic/iconButton";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import RailLine, { RailLineDirection, RailLineLocation } from "./railLine";


const getInputValue = function(value: number | null): string {
    if (typeof value === 'number') {
        return value.toString()
    }
    return '';
}

const RailLineIconButton = styled(IconButton)`
    margin-left: 32px;
`;

const SizeRailLineWrapper = styled.div`
    font-size: 12px;
    color: ${props => props.theme.white50};
`;

const SizeRailiLineItem = styled.div`
    position: relative;
    padding: 4px 0;
`;

const SizeInput = styled.input`
    width: 40px;
    background: transparent;
    border: none;
    outline: none;
    text-align: center;
    color: ${props => props.theme.lightText};
    &:focus,
    &:active {
        outline: none;
    }
`;
const SizeLabel = styled.span`
    position: absolute;
    left: 6px;
    bottom: 2px;
`;
const SizeLabelHeight = styled.span`
    margin-left: 6px;
    line-height: 24px;
`;

const SizeInputHeight = styled.input`
    position: absolute;
    top: 0px;
    z-index: 1;
    width: 40px;
    background: transparent;
    border: none;
    outline: none;
    text-align: center;
    color: ${props => props.theme.lightText};
    &:focus,
    &:active {
        outline: none;
    }
`;

export enum InputType {
    WIDTH,
    HEIGHT,
    LEFT = 'left',
    TOP = 'top',
    RIGHT = 'right',
    BOTTOM = 'bottom'
}

export interface Size {
    width: number | null
    height: number | null
}


export default function SizeRailLine() {
    const [isLock, setIsLock] = useState(false);
    const [size, setSize] = useState<Size>({
        width: null,
        height: null
    });
    const prevSize = useRef(size);
    const handleInputChange = function(
        event: React.ChangeEvent<HTMLInputElement>,
        type: InputType
    ) {
        const nextValue = +event.target.value;
        if (type === InputType.WIDTH) {
            setSize({
                width: nextValue,
                height: size.height
            });
        } else {
            setSize({
                height: nextValue,
                width: size.width
            });
        }
    }
    const handleInputBlur = function(
        event: React.ChangeEvent<HTMLInputElement>,
        type: InputType
    ) {
        const nextValue = +event.target.value;
        let nextWidth = size.width;
        let nextHeight = size.height;
        if (isLock && prevSize.current.width && prevSize.current.height) {
            if (type === InputType.WIDTH) {
                const currentWidth = prevSize.current.width === null ? nextValue : prevSize.current.width;
                const scale = nextValue / currentWidth;
                nextHeight = size.height !== null ? size.height * scale : null
                nextWidth = nextValue;
                setSize({
                    height: nextHeight,
                    width: nextValue
                });
            } else {
                const currentHeight = prevSize.current.height === null ? nextValue : prevSize.current.height;
                const scale = nextValue / currentHeight;
                nextWidth = size.width !== null ? size.width * scale : null;
                nextHeight = nextValue;
                setSize({
                    width: nextWidth,
                    height: nextHeight
                });
            }
        }

        prevSize.current = {
            width: nextWidth,
            height: nextHeight
        };
    }

    return (
        <SizeRailLineWrapper>
            <SizeRailiLineItem>
                <SizeInput
                    type="number"
                    placeholder="width"
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, InputType.WIDTH) }
                    onBlur={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputBlur(e, InputType.WIDTH) }
                    value={ getInputValue(size.width) }
                    />
                <RailLine
                    direction={ RailLineDirection.TOP}
                    />
                <SizeLabel>宽度</SizeLabel>
            </SizeRailiLineItem>
            <RailLineIconButton
                icon={ isLock ? 'lock' : 'unlock' }
                color="transparent"
                hoverBgColor="transparent"
                className="size-rail_line-icon"
                onClick={() => setIsLock(!isLock) }
                />
            <SizeRailiLineItem>
                <SizeInputHeight
                    type="number"
                    placeholder="height"
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, InputType.HEIGHT) }
                    onBlur={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputBlur(e, InputType.HEIGHT) }
                    value={ getInputValue(size.height) }
                    />
                <RailLine />
                <SizeLabelHeight >高度</SizeLabelHeight>
            </SizeRailiLineItem>
        </SizeRailLineWrapper>
    );

}


const PositionRailLineWrapper = styled.div`
    display: flex;
    flex-direction: column;
    color: ${ props => props.theme.white50 };
    font-size: 12px;
`;
const PositionRailLineItem = styled.div`
    display: flex;
`;

interface Position {
    left: number | null
    top: number | null
    right: number | null
    bottom: number | null
}

export function PositionRailLine() {
    const [isLock, setIsLock] = useState(false);
    const [position, setPosition] = useState<Position>({
        left: null,
        top: null,
        bottom: null,
        right: null
    });
    const handleInputChange = function(
        event: React.ChangeEvent<HTMLInputElement>,
        type: InputType
    ) {
        const nextValue: number = +event.target.value;
        if (isLock) {
            setPosition({
                left: nextValue,
                top: nextValue,
                right: nextValue,
                bottom: nextValue
            })
            return;
        }
        const _position: Position = {
            ...position
        };
        switch(type) {
            case InputType.TOP:
                _position.top = nextValue;
                break;
            case InputType.RIGHT:
                _position.right = nextValue;
                break;
            case InputType.BOTTOM:
                _position.bottom = nextValue;
                break;
            case InputType.LEFT:
                _position.left = nextValue;
                break;
        }
        setPosition(_position);
    }

    return (
        <PositionRailLineWrapper>
            <PositionRailLineItem>
                <SizeRailiLineItem>
                    <SizeInput
                        type="number"
                        placeholder="left"
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, InputType.LEFT) }
                        value={ getInputValue(position.left) }
                        />
                    <RailLine
                        direction={ RailLineDirection.TOP}
                        />
                    <SizeLabel>左边</SizeLabel>
                </SizeRailiLineItem>
                <SizeRailiLineItem>
                    <SizeInput
                        type="number"
                        placeholder="top"
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, InputType.TOP) }
                        value={ getInputValue(position.top) }
                        />
                    <RailLine
                        direction={ RailLineDirection.TOP}
                        location={ RailLineLocation.LEFT }
                        />
                    <SizeLabel>顶边</SizeLabel>
                </SizeRailiLineItem>
            </PositionRailLineItem>
            <RailLineIconButton
                icon={ isLock ? 'lock' : 'unlock' }
                color="transparent"
                hoverBgColor="transparent"
                onClick={() => setIsLock(!isLock) }
                />
            <PositionRailLineItem>
                <SizeRailiLineItem>
                    <SizeInputHeight
                        type="number"
                        placeholder="right"
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, InputType.RIGHT) }
                        value={ getInputValue(position.right) }
                        />
                    <RailLine />
                    <SizeLabelHeight >右边</SizeLabelHeight>
                </SizeRailiLineItem>
                <SizeRailiLineItem>
                    <SizeInputHeight
                        type="number"
                        placeholder="bottom"
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, InputType.BOTTOM) }
                        value={ getInputValue(position.bottom) }
                        />
                    <RailLine location={ RailLineLocation.LEFT } />
                    <SizeLabelHeight >底边</SizeLabelHeight>
                </SizeRailiLineItem>
            </PositionRailLineItem>
        </PositionRailLineWrapper>
    );
}
