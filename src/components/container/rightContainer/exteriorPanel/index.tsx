import IconButton from "@components/basic/iconButton";
import { useContext, useReducer } from "react";
import styled, { ThemeContext } from "styled-components";
import Title from "../widgets/title";
import Input from '@components/basic/form/input/input';
import Tippy from "@tippyjs/react";
import ColorPicker from "@components/basic/colorPicker/colorPicker";
import { IRGBA } from "@/types/color";
import { ActionMap } from "@/types/redux.type";
import { ColorBlock } from "@components/basic/colorBlock";

const ExteriorPanelWrapper = styled.div`
    padding: 0 8px;
    margin-top: 8px;
`;

const IconGroupWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.primary};
    padding: 4px 8px;
    border-radius: 12px;
`;

const BorderWrapper = styled.div`
    display: flex;
    justify-content: space-around;
    margin-top: 16px;
`;
const ColorWrapper = styled.div`
    display: flex;
    align-items: center;
    font-size: 12px;
    margin-top: 8px;
`;
const ColorItem = styled.div`
    display: flex;
    align-items: center;
    margin: 0 4px;
`;
const ColorText = styled.span`
    color: ${props => props.theme.lesser};
`;

// 外设透明图样式， 暂注释
// const ColorAlphaWrapper = styled.div`
//     flex: 1;
//     display: flex;
//     align-items: center;
// `;
// const ColorAlphaOuter = styled.div`
//     position: relative;
//     width: 100%;
//     height: 4px;
//     border-radius: 2px;
//     background: ${props => props.theme.lesser};
// `;
// const ColorAlphaPoint = styled.div`
//     position: absolute;
//     top: 50%;
//     left: 0;
//     transform: translateY(-50%);
//     width: 16px;
//     height: 16px;
//     border-radius: 50%;
//     cursor: pointer;
//     ${props => `
//         background: ${props.theme.primary};
//         box-shadow: 0 1px 4px ${props.theme.primary};
//     `};
// `;



export enum ExteriorActions {
    SET_BORDER_RADIUS,
    SET_BORDER_WIDTH,
    SET_BORDER_COLOR,
    SET_BACKGROUND_COLOR,
    IS_CHECKED_BORDER_COLOR,
    IS_CHECKED_BACKGROUND_COLOR,
}

interface ExteriorState {
    [ExteriorActions.SET_BORDER_RADIUS]?: number
    [ExteriorActions.SET_BORDER_WIDTH]?: number
    [ExteriorActions.SET_BORDER_COLOR]: IRGBA
    [ExteriorActions.SET_BACKGROUND_COLOR]: IRGBA
    [ExteriorActions.IS_CHECKED_BACKGROUND_COLOR]: boolean
    [ExteriorActions.IS_CHECKED_BORDER_COLOR]: boolean
}

type ExteriorAction = ActionMap<ExteriorState>[keyof ActionMap<ExteriorState>]


export function exteriorReducer(state: ExteriorState, action: ExteriorAction) {
    if (action) {
        return {
            ...state,
            [action.type]: action.payload,
        }
    }
    return state;
}



export default function ExteriorPanel() {
    const theme = useContext(ThemeContext);

    const [{
        [ExteriorActions.SET_BORDER_COLOR]: borderColor,
        [ExteriorActions.SET_BORDER_RADIUS]: borderRadius,
        [ExteriorActions.SET_BORDER_WIDTH]: borderWidth,
        [ExteriorActions.SET_BACKGROUND_COLOR]: backgroundColor,
        [ExteriorActions.IS_CHECKED_BACKGROUND_COLOR]: isCheckedBackgroundColor,
        [ExteriorActions.IS_CHECKED_BORDER_COLOR]: isCheckedBorderColor,
    }, dispatch] = useReducer(exteriorReducer, {
        // 边框颜色
        [ExteriorActions.SET_BORDER_COLOR]: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
        },
        // 背景颜色
        [ExteriorActions.SET_BACKGROUND_COLOR]: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
        },
        [ExteriorActions.IS_CHECKED_BACKGROUND_COLOR]: false,
        [ExteriorActions.IS_CHECKED_BORDER_COLOR]: false,
    });

    const handleBackgroundColorChange = function() {}

    return (
        <ExteriorPanelWrapper>
            <Title
                title="外观"
                />
            <BorderWrapper>
                <IconGroupWrapper>
                    <IconButton
                        $title="用于边框上，所有圆角半径相同"
                        icon="angleFull"
                        color="transparent"
                        hoverBgColor="transparent"
                        activeColor={ theme.assist }
                        active={ true }
                        tippyProps={{
                            delay: [1000, null]
                        }}
                        />
                    <IconButton
                        $title="暂时不支持每个圆角的半径不同。"
                        icon="angleMulti"
                        color="transparent"
                        hoverBgColor="transparent"
                        activeColor={ theme.assist }
                        tippyProps={{
                            delay: [200, null]
                        }}
                        />
                </IconGroupWrapper>
                <Tippy
                    content="边框半径"
                    animation="scale"
                    theme="light"
                    delay={[1000, null]}
                    >
                    <Input
                        type="number"
                        width={ 86 }
                        center
                        placeholder="LTRB"
                        />
                </Tippy>
                <Input
                    type="number"
                    width={ 86 }
                    center
                    placeholder="边框粗细"
                    />
            </BorderWrapper>
            <ColorWrapper>
                <ColorItem>
                    <IconButton
                        $title={ isCheckedBackgroundColor ? '已激活背景色' : '未激活背景色' }
                        icon={ isCheckedBackgroundColor ? 'checked' : 'checkout' }
                        color="transparent"
                        hoverBgColor="transparent"
                        onClick={ () => dispatch({
                            type: ExteriorActions.IS_CHECKED_BACKGROUND_COLOR,
                            payload: !isCheckedBackgroundColor
                        })}
                        active={ isCheckedBackgroundColor }
                        />
                </ColorItem>
                <ColorItem>
                    <Tippy
                        content={ 
                            <ColorPicker
                                rgba={ backgroundColor }
                                onColorChange={ (rgba: IRGBA) => {
                                    dispatch({
                                        type: ExteriorActions.SET_BACKGROUND_COLOR,
                                        payload: rgba
                                    })
                                } }
                                />
                        }
                        animation="shift-away"
                        trigger="click"
                        hideOnClick={ true }
                        arrow={ true }
                        interactive={ true }
                        placement="left"
                        theme="light"
                        >
                        <ColorBlock
                            width={40}
                            height={ 16 }
                            rgba={ backgroundColor }
                            />
                    </Tippy>
                </ColorItem>
                <ColorItem>
                    <ColorText>背景</ColorText>
                </ColorItem>
                
            </ColorWrapper>
            <ColorWrapper>
                <ColorItem>
                    <IconButton
                        $title={ isCheckedBorderColor ? '已激活边框颜色' : '未激活边框颜色' }
                        icon={ isCheckedBorderColor ? 'checked' : 'checkout' }
                        color="transparent"
                        hoverBgColor="transparent"
                        onClick={ () => dispatch({
                            type: ExteriorActions.IS_CHECKED_BORDER_COLOR,
                            payload: !isCheckedBorderColor
                        })}
                        active={ isCheckedBorderColor }
                        />
                </ColorItem>
                <ColorItem>
                <Tippy
                        content={ 
                            <ColorPicker
                                rgba={ backgroundColor }
                                onColorChange={ (rgba: IRGBA) => {
                                    dispatch({
                                        type: ExteriorActions.SET_BORDER_COLOR,
                                        payload: rgba
                                    })
                                } }
                                />
                        }
                        animation="shift-away"
                        trigger="click"
                        hideOnClick={ true }
                        arrow={ true }
                        interactive={ true }
                        placement="left"
                        theme="light"
                        >
                        <ColorBlock
                            width={40}
                            height={ 16 }
                            rgba={ borderColor }
                            />
                    </Tippy>
                </ColorItem>
                <ColorItem>
                    <ColorText>边框</ColorText>
                </ColorItem>
            </ColorWrapper>
        </ExteriorPanelWrapper>
    );

}
