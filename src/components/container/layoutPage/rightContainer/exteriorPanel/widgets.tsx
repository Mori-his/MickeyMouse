import Input from "@components/basic/form/input/input";
import IconButton from "@components/basic/iconButton";
import LightTippy from "@components/basic/toolTip/lightTippy";
import { BorderRadius, Radius } from "@layout/core/boxBorder";
import ownerCaretaker from "@models/owners";
import { Exterior } from "@widgets/interface/widgetInterface";
import { observer } from "mobx-react";
import { ChangeEvent, useContext } from "react";
import styled, { ThemeContext } from "styled-components";


const IconGroupWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.primary};
    padding: 4px 8px;
    border-radius: 12px;
`;

export const ExteriorBorder = observer(function ExteriorBorder() {
    const currWidget = ownerCaretaker.currOwner.currWidget! as Exterior;
    const theme = useContext(ThemeContext);

    const handleBorderChange = function(event: ChangeEvent<HTMLInputElement>) {
        const value = +event.target.value || null;
        currWidget.setFillet(
            BorderRadius.all(
                Radius.circular(value)
            ),
        );
    }
    
    return (
        <>
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
            <LightTippy
                content="边框半径"
                >
                <Input
                    type="number"
                    width={ 86 }
                    center
                    placeholder="LTRB"
                    onChange={ e => handleBorderChange(e) }
                    value={ currWidget.fillet.bottomLeft?.x || '' }
                    />
            </LightTippy>
        </>
    );
});
