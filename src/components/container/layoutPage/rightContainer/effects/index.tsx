import Input from "@components/basic/form/input/input";
import IconButton from "@components/basic/iconButton";
import ownerCaretaker from "@models/owners";
import { IMAGE_FIT } from "@widgets/image";
import { Effects } from "@widgets/interface/widgetInterface";
import { observer } from "mobx-react";
import { ChangeEvent, useCallback } from "react";
import styled from "styled-components";
import { PaddingRL8 } from "../../../common/styleds/containerStyle";
import { TitleCollapse } from "../../../common/title";

const EffectsWrapper = styled.div`
    font-size: 12px;
`;

const EffectTitleWrapper = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
`;

const EffectsItem = styled.div`
    display: flex;
    align-items: center;
    padding: 4px 0;
`;

const EffectsItemLabel = styled.div`
    flex-shrink: 0;
    margin: 0 8px;
    color: ${(props) => props.theme.lesser};
`;

const IconGroupWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${(props) => props.theme.primary};
    padding: 4px 8px;
    border-radius: 12px;
    margin-right: 8px;
`;


interface EffectsPanelProps { }
export default observer(function EffectsPanel(_props: EffectsPanelProps) {
    const currWidget = ownerCaretaker.currOwner.currWidget as Effects;

    // 处理URL被改变
    const handleURLChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
            currWidget.setSrc(event.target.value);
    }, [currWidget]);
    
    // 处理图片显示效果
    const handleFitChange = useCallback((fit: IMAGE_FIT) => {
        currWidget.setFit(fit);
    }, [currWidget]);
    
    return (
        <EffectsWrapper>
            <TitleCollapse
                title="效果"
                >
                <PaddingRL8>
                    <EffectsItem>
                        <EffectsItemLabel>图片地址</EffectsItemLabel>
                        <Input
                            placeholder="请输入URL"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleURLChange(e)}
                            value={ currWidget.src || '' }
                        />
                    </EffectsItem>
                    <EffectsItem>
                        <EffectsItemLabel>图片效果</EffectsItemLabel>
                        <IconGroupWrapper>
                            <IconButton
                                $title="高斯模糊"
                                icon="blur"
                                color="transparent"
                                hoverBgColor="transparent"
                                active={currWidget.blur}
                                tippyProps={{
                                    delay: [1000, null],
                                }}
                                onClick={() => currWidget.setBlur(!currWidget.blur)}
                            />
                        </IconGroupWrapper>
                        <IconGroupWrapper>
                            <IconButton
                                $title="以正比缩放到合适位置，多余被裁减掉"
                                icon="coverImage"
                                color="transparent"
                                hoverBgColor="transparent"
                                active={currWidget.fit === IMAGE_FIT.COVER}
                                tippyProps={{
                                    delay: [1000, null],
                                }}
                                onClick={() => handleFitChange(IMAGE_FIT.COVER)}
                            />
                            <IconButton
                                $title="填充整个容器"
                                icon="fillImage"
                                color="transparent"
                                hoverBgColor="transparent"
                                active={currWidget.fit === IMAGE_FIT.FILL}
                                tippyProps={{
                                    delay: [1000, null],
                                }}
                                onClick={() => handleFitChange(IMAGE_FIT.FILL)}
                            />
                            <IconButton
                                $title="正比缩放至合适大小"
                                icon="containImage"
                                color="transparent"
                                hoverBgColor="transparent"
                                active={currWidget.fit === IMAGE_FIT.CONTAIN}
                                tippyProps={{
                                    delay: [1000, null],
                                }}
                                onClick={() => handleFitChange(IMAGE_FIT.CONTAIN)}
                            />
                        </IconGroupWrapper>
                    </EffectsItem>
                </PaddingRL8>
            </TitleCollapse>
        </EffectsWrapper>
    );
});
