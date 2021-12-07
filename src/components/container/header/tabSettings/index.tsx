import styled from "styled-components";
import IconButton from "@components/basic/iconButton";

const TabSettingsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
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
                icon="import"
                $title="导入配置项"
                margin={{left: 8, right: 8}}
                />
            <IconButton
                icon="settings"
                $title="设置当前配置项"
            />
        </TabSettingsWrapper>
    );
}

export default TabSettings;
