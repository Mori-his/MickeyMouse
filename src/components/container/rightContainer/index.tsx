import styled from "styled-components";
import ColorPicker from "@components/basic/colorPicker/colorPicker";

const width = 280;

const RightWrapper = styled.div`
    position: absolute;
    right: 0;
    top: 88px;
    bottom: 0;
`;

const RightConfigPanel = styled.div`
    width: ${width}px;
    height: 100%;
    background-color: ${props => props.theme.contrast};
    box-shadow: -2px 0 8px 0 ${props => props.theme.main};
`;


export default function RightContainer() {
    return (
        <RightWrapper>
            <RightConfigPanel>
                <ColorPicker />
            </RightConfigPanel>
        </RightWrapper>
    );
}
