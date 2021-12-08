import styled from "styled-components";
import ColorHuePanel from "./colorHuePanel";
import ColorPanel, { PositionProps } from "./colorPanel";

const ColorPickerWrapper = styled.div``;

export default function ColorPicker() {
    const handleColorPanelChange = function(position: PositionProps) {
        // 明度 和 饱和度 被选择   值范围为0-1
    }
    const handleColorHuePanelChange = function(hue: number) {
        // 色相被选择 值范围0-360°
    }
    return (
        <ColorPickerWrapper>
            <ColorPanel
                onDragChange={ handleColorPanelChange }
                />
            <ColorHuePanel
                onDragChange={ handleColorHuePanelChange }
                />
        </ColorPickerWrapper>
    );
}
