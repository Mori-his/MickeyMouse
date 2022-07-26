import React from 'react';
import styled from "styled-components";
import { TitleCollapse } from "../../../common/title";
import { PaddingRL8 } from '../../../common/styleds/containerStyle';
import { FontAlignment, FontColor, FontFormat, FontMaxLine, FontMaxWidth, FontSize, FontTextOverflow, SelectFontFamily, TextInput } from './widgets';

const TextPanelWrapper = styled.div`
    color: #fff;
    font-size: 12px;
    margin-top: 8px;
`;

const FlexJustifyBetween = styled.div`
    display: flex;
    justify-content: space-between;
`;

const TextPanelItem = styled(FlexJustifyBetween)`
    padding: 8px 0;
`;


export default function TextPanel() {

    return (
        <TextPanelWrapper>
            <TitleCollapse title="文本">
                <PaddingRL8>
                    <TextPanelItem>
                        {/* 输入文本 */}
                        <TextInput />
                    </TextPanelItem>
                    <TextPanelItem>
                        {/* 文字大小 */}
                        <FontSize />
                        {/* 字体 */}
                        <SelectFontFamily />
                    </TextPanelItem>
                    <TextPanelItem>
                        {/* 文字颜色 */}
                        <FontColor />
                        {/* 文字最大行数 */}
                        <FontMaxLine />
                        {/* 文字最大宽度 */}
                        <FontMaxWidth />
                    </TextPanelItem>
                    <TextPanelItem>
                        {/* 文字超出后处理方式 */}
                        <FontTextOverflow />
                        {/* 文字对齐方式 */}
                        <FontAlignment />
                        {/* 文字格式化模式 千/万 */}
                        <FontFormat />
                    </TextPanelItem>
                </PaddingRL8>
            </TitleCollapse>
        </TextPanelWrapper>
    );
}
