import React, { useState, useEffect, useRef }  from "react";
import styled from "styled-components";
import IconButton from "@components/basic/iconButton";
import { ConfirmControl } from "@components/basic/common/confirm/confirm";
import { CustomScrollbar } from "@styles/globals";
import { modalControl, withModels } from "@components/hoc/modals";
import { NewConfigModal } from "@components/hoc/modals/newConfig";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { LayoutConfig } from "@/types/platform/platform";
import { api } from "@utils/axiosInstance";
import { LoadingControl } from "@components/basic/common/loading/loading";


const PlatformWrapper = styled.div`
    height: 100%;
    display: flex;
`;

const PlatformMenu = styled.div`
    width: 224px;
    background-color: ${props => props.theme.main};
    overflow: auto;
    ${ CustomScrollbar }
`;

const MenuItem = styled.div`
    height: 136px;
    font-size: 18px;
    color: #fff;
    display: flex;
    align-items: center;
    cursor: pointer;
    &.active,
    &:hover {
        background-color: ${props => props.theme.contrast};
    }
`;

type PlatformLogoProps = {
    backgroundImage: string
}
const PlatformLogo = styled.div<PlatformLogoProps>`
    margin: 0 8px 0 16px;   
    width: 72px;
    height: 64px;
    border-radius: 16px;
    ${props => `
        background: url(${props.backgroundImage});
    `}
    background-size: 100% 100%;
    overflow: hidden;
`;

const PlatformContainer = styled.div`
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    padding: 40px 48px;
    background-color: ${props => props.theme.contrast};
    overflow: auto;
    box-sizing: border-box;
    ${ CustomScrollbar }
`;

const PlatformSection = styled.div`
    position: relative;
    margin: 16px 20px;
    padding: 8px 9px 8px 25px;
    width: calc(30% - 20px); 
    min-width: 280px;
    height: 144px;
    font-size: 18px;
    color: #fff;
    border-radius: 16px;
    overflow: hidden;
    box-sizing: border-box;
    cursor: pointer;
`;

const AddLayout = styled(PlatformSection)`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.assist};
    :hover {
        transform: translate(-2px, -2px);
        box-shadow: 0px 2px 8px 0px ${props => props.theme.assist};
        transition: all .2s ease-out;
    }
`;

const LayoutItemColors = [
    '#4ef2c0', '#544EF2', '#f24eed',
    '#edf24e', '#f2c94e', '#f24e8a',
    '#f24e69', '#6ff24e', '#f27f4e'
];
interface LayoutItemProps {
    itemColor: string
}
const LayoutItem = styled(PlatformSection)<LayoutItemProps>`
    background-color: ${props => props.theme.main};
    :hover {
        transform: translate(-2px, -2px);
        box-shadow: 0px 2px 8px 0px ${props => props.itemColor};
        transition: all .2s ease-out;
    }
    &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 16px;
        height: 176px;
        background: ${props => props.itemColor};
    }
`;

const LayoutTitle = styled.div`
    margin-bottom: 24px;
`;
const LayoutDesc = styled.div`
    font-size: 14px;
    color: ${props => props.theme.white30};
`;

const LayoutOperate = styled.div`
    display: flex;
    position: absolute;
    top: 11px;
    right: 18px;
`;


function Container () {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const container: any = useRef(null);
    const router = useRouter();
    useEffect(() => {
        // getPlatformList();
        router.prefetch('/layout');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { isLoading, error, data } = useQuery({
        queryKey: ["layoutConfig"],
        queryFn: () =>
          api
            .get("https://layout-api.test.huajiao.com/layoutConfig/getLayoutConfigList")
            .then((res: any) => res.data),
    });
    
    if (isLoading) return <>Loading...</>;

    if (error) return <>An error has occurred</>;

    const layoutConfig: Array<LayoutConfig> = data.layoutConfigList || [];
    const changePlatform = (index: number) => {
        setActiveIndex(index);
        container?.current?.scrollTo(0, 0)
    }

    const addLayout = () => {
        console.log('添加布局');
        modalControl.find(NewConfigModal)?.open({
            onConfirm(data) {
                const PlatformId = layoutConfig[activeIndex].platFormId;
                const { name: layoutName, description: layoutDesc} = data;
                api.post('https://layout-api.test.huajiao.com/layoutConfig/saveLayoutConfig', {
                    data: {
                        PlatformId,
                        layoutName,
                        layoutDesc,
                        layoutData: '{}'
                    }
                })
            },
        })
    }

    const selectLayout = (id: number) => {
        console.log('进入布局', id);
        const loading = LoadingControl.open();
        router.push(`/layout?id=${id}`, ).finally(() => {
            loading.close();
        });
    }

    const copyLayout = (id: number) => {
        console.log('复制布局', id);
    }

    const deleteLayout = (id: number) => {
        console.log('删除布局', id);
    }

    return (
        <PlatformWrapper>
            <PlatformMenu>
                {
                    layoutConfig.map((layout: LayoutConfig, index: number) => (
                        <MenuItem
                            className={activeIndex === index ? 'active' : ''}
                            key={layout.platFormId}
                            onClick={() => changePlatform(index)}
                            >
                            <PlatformLogo
                                backgroundImage={layout.platformIcon}
                                />
                            { layout.platformName }
                        </MenuItem>
                    ))
                }
            </PlatformMenu>

            <PlatformContainer ref={ container }>
                <AddLayout onClick={ addLayout }>
                    <IconButton
                        icon="add"
                        color="transparent"
                        hoverBgColor="transparent"
                        defaultColor="#fff"
                        />
                    添加布局
                </AddLayout>

                {
                    layoutConfig[activeIndex]?.layoutConfigList.map((item, index) => (
                        <LayoutItem
                            key={item.layoutId}
                            itemColor={LayoutItemColors[index % LayoutItemColors.length]}
                            onClick={() => selectLayout(item.layoutId)}
                            title="点击进入布局配置页"
                            >
                            <LayoutTitle>{ item.layoutName }</LayoutTitle>
                            <LayoutDesc>{ item.layoutDesc }</LayoutDesc>
                        
                            <LayoutOperate>
                                <IconButton
                                    icon="copy"
                                    $title="复制此布局"
                                    color="transparent"
                                    hoverBgColor="transparent"
                                    onClick={(event: Event) => {
                                        event.stopPropagation();
                                        copyLayout(item.layoutId);
                                    }}
                                    />
                                <IconButton
                                    icon="delete"
                                    $title="删除此布局"
                                    color="transparent"
                                    hoverBgColor="transparent"
                                    onClick={(event: Event) => {
                                        event.stopPropagation();
                                        ConfirmControl.open({
                                            content: '确认要删除吗？'
                                        }).then((confirm) => {
                                            confirm.onClose();
                                            deleteLayout(item.layoutId);
                                        })
                                    }}
                                    />
                            </LayoutOperate>
                        </LayoutItem>
                    )) 
                }
            </PlatformContainer>
        </PlatformWrapper>
    )
}
export default withModels(NewConfigModal)(Container);