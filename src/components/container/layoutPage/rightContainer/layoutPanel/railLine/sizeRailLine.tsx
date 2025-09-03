import Input from "@components/basic/form/input/input";
import IconButton from "@components/basic/iconButton";
import { observer } from "mobx-react";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import RailLine, { RailLineDirection, RailLineLocation } from "./railLine";
import ownerCaretaker from "@models/owners";

const RailLineIconButton = styled(IconButton)`
    margin-left: 32px;
`;

const SizeRailLineWrapper = styled.div`
    font-size: 12px;
    color: ${props => props.theme.white50};
`;

const SizeRailiLineItem = styled.label`
    position: relative;
    padding: 4px 0;
`;

// const SizeInput = styled.input`
//     width: 40px;
//     background: transparent;
//     border: none;
//     outline: none;
//     text-align: center;
//     color: ${props => props.theme.lightText};
//     &:focus,
//     &:active {
//         outline: none;
//     }
// `;
const SizeLabel = styled.span`
    position: absolute;
    left: 6px;
    bottom: 0px;
    width: 40px;
`;
const SizeLabelTop = styled(SizeLabel)`
    left: 12px;
`;
const SizeLabelHeight = styled.span`
    margin-left: 6px;
    line-height: 24px;
`;
const SizeLabelLeft = styled(SizeLabelHeight)`
    margin-left: 12px;
`;

const SizeInputHeight = styled(Input)`
    position: absolute;
    top: 0px;
    z-index: 1;
    width: 44px;
    background: transparent;
    border: none;
    outline: none;
    text-align: center;
    padding: 0;
    height: 16px;
    color: ${props => props.theme.lightText};
    &:focus,
    &:active {
        outline: none;
    }
`;
const SizeInputPosition = styled.div`
    position: absolute;
    top: 0px;
    z-index: 1;
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
    width: number | string
    height: number | string
}


/**
 * 宽高设置面板
 */
export const SizeRailLine = observer(function SizeRailLine() {
    const currWidget = ownerCaretaker.currOwner.currWidget!;

    const [isLock, setIsLock] = useState(false);
    const prevSize = useRef({
        width: currWidget.size.width,
        height: currWidget.size.height
    });
    const handleInputChange = function(
        event: React.ChangeEvent<HTMLInputElement>,
        type: InputType
    ) {
        const size = currWidget.size;
        const nextValue = event.target.value.replace(/[^0-9]/, '');
        if (type === InputType.WIDTH) {

            currWidget.size.setWidth(nextValue);
            currWidget.size.setHeight(size.height);
        } else {
            currWidget.size.setWidth(size.width);
            currWidget.size.setHeight(nextValue);
        }
    }
    const handleInputBlur = function(
        event: React.ChangeEvent<HTMLInputElement>,
        type: InputType
    ) {
        const size = currWidget.size;
        const nextValue = +event.target.value;
        let nextWidth = size.width;
        let nextHeight = size.height;
        if (isLock && prevSize.current.width && prevSize.current.height) {
            if (type === InputType.WIDTH) {
                const currentWidth = prevSize.current.width === null ? nextValue : prevSize.current.width;
                const scale = nextValue / +currentWidth;
                nextHeight = size.height ? +size.height * scale : ''
                nextWidth = nextValue;

                currWidget.size.setWidth(nextWidth);
                currWidget.size.setHeight(nextHeight);
            } else {
                const currentHeight = prevSize.current.height === null ? nextValue : prevSize.current.height;
                const scale = nextValue / +currentHeight;
                nextWidth = size.width ? +size.width * scale : '';
                nextHeight = nextValue;

                currWidget.size.setWidth(nextWidth);
                currWidget.size.setHeight(nextHeight);
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
                <Input
                    type="number"
                    width={ 42 }
                    height={ 16 }
                    style={{
                        padding: 0
                    }}
                    select
                    center
                    auto
                    placeholder="width"
                    backgroundColor="transparent"
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, InputType.WIDTH) }
                    onBlur={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputBlur(e, InputType.WIDTH) }
                    value={ currWidget.size.width }
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
                <SizeInputPosition>
                    <Input
                        type="number"
                        width={ 42 }
                        height={ 16 }
                        style={{
                            padding: 0,
                        }}
                        select
                        center
                        auto
                        placeholder="height"
                        backgroundColor="transparent"
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, InputType.HEIGHT) }
                        onBlur={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputBlur(e, InputType.HEIGHT) }
                        value={currWidget.size.height}
                        />
                </SizeInputPosition>
                <RailLine />
                <SizeLabelHeight >高度</SizeLabelHeight>
            </SizeRailiLineItem>
        </SizeRailLineWrapper>
    );

});


const PositionRailLineWrapper = styled.div`
    display: flex;
    flex-direction: column;
    color: ${ props => props.theme.white50 };
    font-size: 12px;
`;
const PositionRailLineItem = styled.div`
    display: flex;
`;

// interface Position {
//     left: number | string
//     top: number | string
//     right: number | string
//     bottom: number | string
// }

export const PositionRailLine = observer(function PositionRailLine() {
    const currWidget = ownerCaretaker.currOwner.currWidget!;
    const [isLock, setIsLock] = useState(false);

    const handleInputChange = function(
        event: React.ChangeEvent<HTMLInputElement>,
        type: InputType
    ) {
        const nextValue = event.target.value;
        if (isLock) {
            currWidget.position.setOnly({
                left: nextValue,
                top: nextValue,
                right: nextValue,
                bottom: nextValue
            });
            return;
        }
        switch(type) {
            case InputType.TOP:
                currWidget.position.setTop(nextValue);
                break;
            case InputType.RIGHT:
                currWidget.position.setRight(nextValue);
                break;
            case InputType.BOTTOM:
                currWidget.position.setBottom(nextValue);
                break;
            case InputType.LEFT:
                currWidget.position.setLeft(nextValue);
                break;
        }
    }    

    return (
        <PositionRailLineWrapper>
            <PositionRailLineItem>
                <SizeRailiLineItem>
                    <Input
                        type="number"
                        width={ 40 }
                        height={ 16 }
                        style={{
                            padding: 0,
                        }}
                        select
                        center
                        auto
                        backgroundColor="transparent"
                        placeholder="left"
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, InputType.LEFT) }
                        value={ currWidget.position.left }
                        />
                    <RailLine
                        direction={ RailLineDirection.TOP}
                        />
                    <SizeLabel>左边</SizeLabel>
                </SizeRailiLineItem>
                <SizeRailiLineItem>
                    <div style={{marginLeft: 4}}>
                        <Input
                            type="number"
                            width={ 40 }
                            height={ 16 }
                            style={{
                                padding: 0
                            }}
                            select
                            center
                            auto
                            backgroundColor="transparent"
                            placeholder="top"
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, InputType.TOP) }
                            value={currWidget.position.top}
                            />
                    </div>
                    <RailLine
                        direction={ RailLineDirection.TOP}
                        location={ RailLineLocation.LEFT }
                        />
                    <SizeLabelTop>顶边</SizeLabelTop>
                </SizeRailiLineItem>
            </PositionRailLineItem>
            <RailLineIconButton
                $title="同步"
                icon={ isLock ? 'lock' : 'unlock' }
                color="transparent"
                hoverBgColor="transparent"
                onClick={() => setIsLock(!isLock) }
                />
            <PositionRailLineItem>
                <SizeRailiLineItem>
                    <SizeInputHeight
                        type="number"
                        select
                        auto
                        placeholder="right"
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, InputType.RIGHT) }
                        value={currWidget.position.right}
                        />
                    <RailLine />
                    <SizeLabelHeight >右边</SizeLabelHeight>
                </SizeRailiLineItem>
                <SizeRailiLineItem>
                    <SizeInputHeight
                        type="number"
                        select
                        auto
                        placeholder="bottom"
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, InputType.BOTTOM) }
                        value={currWidget.position.bottom}
                        style={{marginLeft: 2}}
                        />
                    <RailLine location={ RailLineLocation.LEFT } />
                    <SizeLabelLeft >底边</SizeLabelLeft>
                </SizeRailiLineItem>
            </PositionRailLineItem>
        </PositionRailLineWrapper>
    );
});
