import styled from "styled-components";
import IconButton from "@components/basic/iconButton";

const TabSettingsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 48px;
	border-radius: 2px;
    padding: 0 16px;
	background-color: ${props => props.theme.complementaryColor};
	box-shadow: 0px 2px 8px 0px ${props => props.theme.main};
`;

function TabSettings() {
    return (
        <TabSettingsWrapper>
            <IconButton
                icon="json"
                padding={ 8 }
                $title="查看当前配置项的JSON数据"
                />
            <IconButton
                icon="settings"
                padding={ 8 }
                $title="设置当前配置项"
                margin={{left: 8, right: 8}}
                />
            <IconButton
                icon="import"
                padding={ 8 }
                $title="导入配置项"
                />
        </TabSettingsWrapper>
    );
}

export default TabSettings;
