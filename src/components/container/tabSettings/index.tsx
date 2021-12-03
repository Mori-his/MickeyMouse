import styled from "styled-components";
import IconButton from "../../basic/iconButton";

const TabSettingsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap-reverse;
    width: 100%;
    height: 48px;
	background-color: #2a313c;
	box-shadow: 0px 2px 8px 0px #222831;
	border-radius: 2px;
    padding: 0 16px;
`;

function TabSettings() {
    return (
        <TabSettingsWrapper>
            <IconButton
                active={ false }
                icon="import"
            />
        </TabSettingsWrapper>
    );
}

export default TabSettings;
