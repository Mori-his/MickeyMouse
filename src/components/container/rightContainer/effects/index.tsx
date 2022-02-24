import { ActionMap } from "@/types/redux.type";
import FormItem from "@components/basic/form/formItem/formItem";
import Input from "@components/basic/form/input/input";
import IconButton from "@components/basic/iconButton";
import { ChangeEvent, useCallback, useReducer } from "react";
import styled from "styled-components";
import Title from "../widgets/title";

const EffectsWrapper = styled.div`
    padding: 0 8px;
    margin-top: 16px;
    font-size: 12px;
`;

const EffectsItem = styled.div`
    display: flex;
    align-items: center;
    padding: 4px 0;
`;

const EffectsItemLabel = styled.div`
    flex-shrink: 0;
    margin: 0 8px;
    color: ${props => props.theme.lesser};
`;

const IconGroupWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.primary};
    padding: 4px 8px;
    border-radius: 12px;
    margin-right: 8px;
`;

export enum EffectsActions {
    SET_IMAGE_BLUR,
    SET_IMAGE_FIT,
    SET_IMAGE_URL,
}
export enum ImageFit {
    cover,
    fill,
    contain
}

export type EffectsState = {
    [EffectsActions.SET_IMAGE_BLUR]: boolean
    [EffectsActions.SET_IMAGE_FIT]: ImageFit
    [EffectsActions.SET_IMAGE_URL]: string
}

export type EffectsAction = ActionMap<EffectsState>[keyof ActionMap<EffectsState>]

export function EffectsReducer(state: EffectsState, action: EffectsAction) {
    return {
        ...state,
        [action.type]: action.payload
    }
}

interface EffectsPanelProps {

}
export default function EffectsPanel(props: EffectsPanelProps) {
    const [{
        [EffectsActions.SET_IMAGE_BLUR]: isBlur,
        [EffectsActions.SET_IMAGE_FIT]: imageFit,
        [EffectsActions.SET_IMAGE_URL]: imageUrl
    }, dispatch] = useReducer(EffectsReducer, {
        [EffectsActions.SET_IMAGE_BLUR]: false,
        [EffectsActions.SET_IMAGE_FIT]: ImageFit.cover,
        [EffectsActions.SET_IMAGE_URL]: ''
    });

    const handleURLChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: EffectsActions.SET_IMAGE_URL,
            payload: event.target.value
        });
    }, []);

    const handleFitChange = useCallback((fit: ImageFit) => {
        dispatch({
            type: EffectsActions.SET_IMAGE_FIT,
            payload: fit
        })
    }, []);
    

    return (
        <EffectsWrapper>
            <Title
                title="效果"
                />
            <EffectsItem>
                <EffectsItemLabel>图片地址</EffectsItemLabel>
                <Input
                    placeholder="请输入URL"
                    onBlur={(e: ChangeEvent<HTMLInputElement>) => handleURLChange(e)}
                    defaultValue={ imageUrl }
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
                        active={ isBlur }
                        tippyProps={{
                            delay: [1000, null]
                        }}
                        onClick={() => dispatch({
                            type: EffectsActions.SET_IMAGE_BLUR,
                            payload: !isBlur
                        })}
                        />
                </IconGroupWrapper>
                <IconGroupWrapper>
                    <IconButton
                        $title="以正比缩放到合适位置，多余被裁减掉"
                        icon="coverImage"
                        color="transparent"
                        hoverBgColor="transparent"
                        active={ imageFit === ImageFit.cover }
                        tippyProps={{
                            delay: [1000, null]
                        }}
                        onClick={() => handleFitChange(ImageFit.cover)}
                        />
                    <IconButton
                        $title="填充整个容器"
                        icon="fillImage"
                        color="transparent"
                        hoverBgColor="transparent"
                        active={ imageFit === ImageFit.fill }
                        tippyProps={{
                            delay: [1000, null]
                        }}
                        onClick={() => handleFitChange(ImageFit.fill)}
                        />
                    <IconButton
                        $title="正比缩放至合适大小"
                        icon="containImage"
                        color="transparent"
                        hoverBgColor="transparent"
                        active={ imageFit === ImageFit.contain }
                        tippyProps={{
                            delay: [1000, null]
                        }}
                        onClick={() => handleFitChange(ImageFit.contain)}
                        />
                </IconGroupWrapper>
            </EffectsItem>
        </EffectsWrapper>
    );
}
