import React, { useState, useEffect, useRef }  from "react";
import styled from "styled-components";
import IconButton from "@components/basic/iconButton";
import { ConfirmControl } from "@components/basic/common/confirm/confirm";
import { CustomScrollbar } from "@styles/globals";
import { modalControl, withModels } from "@components/hoc/modals";
import { NewConfigModal } from "@components/hoc/modals/newConfig";
import { useRouter } from "next/router";


const PlatformWrapper = styled.div`
    height: 100%;
    display: flex;
`;

const PlatformMenu = styled.div`
    width: 312px;
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
    backgroundImage: String
}
const PlatformLogo = styled.div<PlatformLogoProps>`
    margin: 0 8px 0 16px;   
    width: 112px;
    height: 104px;
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
        transition: all 1s ease-out;
    }
`;

const LayoutItem = styled(PlatformSection)`
    background-color: ${props => props.theme.main};
    :hover {
        transform: translate(-2px, -2px);
        box-shadow: 0px 2px 8px 0px #4ef2c0;
        transition: all 1s ease-out;
    }
    &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 16px;
        height: 176px;
        background: #4ef2c0;
    }
`;

const LayoutTitle = styled.div`
    margin-bottom: 24px;
`;
const LayoutDesc = styled.div`
    font-size: 14px;
    color: #7f7f7f;
`;

const LayoutOperate = styled.div`
    display: flex;
    position: absolute;
    top: 11px;
    right: 18px;
`;


function Container () {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [platformList, setPlatformList] = useState<any[]>([]);
    const container: any = useRef(null);
    const router = useRouter();
    useEffect(() => {
        getPlatformList();
        router.prefetch('/layout');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getPlatformList = () => {
        const platformList = [{
            id: 1,
            name: '花椒直播',
            img: 'https://p2.ssl.qhimg.com/t01bd8affce5ec65eba.png',
            layouts: [{
                id: 1,
                name: '花椒直播布局名称',
                desc: '布局介绍'
            }, {
                id: 2,
                name: '花椒直播布局名称',
                desc: '布局介绍布局介绍布局介绍布局介绍布局介绍布局介绍布局介绍布局介绍'
            }, {
                id: 3,
                name: '花椒直播布局名称',
                desc: '布局介绍布局介绍布局介绍布局介绍布局介绍布局介绍布局介绍布局介绍'
            }]
        }, {
            id: 2,
            name: '六间房',
            img: 'https://p2.ssl.qhimg.com/t01bd8affce5ec65eba.png',
            layouts: [{
                id: 1,
                name: '六间房布局名称',
                desc: '布局介绍'
            }, {
                id: 2,
                name: '六间房布局名称',
                desc: '布局介绍布局介绍布局介绍布局介绍布局介绍布局介绍布局介绍'
            }]
        }];
        setPlatformList(platformList);
    }

    const changePlatform = (index: number) => {
        setActiveIndex(index);
        container?.current?.scrollTo(0, 0)
    }

    const addLayout = () => {
        console.log('添加布局');
        modalControl.find(NewConfigModal)?.open({
            onConfirm(data) {
                console.log(data);
            },
        })
    }

    const selectLayout = (id: number) => {
        console.log('进入布局', id);
        router.push(`/layout?id=${id}`, )
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
                    platformList.map((i: any, index) => (
                        <MenuItem className={activeIndex === index ? 'active' : ''} key={i.id} onClick={() => changePlatform(index)}>
                            <PlatformLogo
                                backgroundImage={"https://p2.ssl.qhimg.com/t01bd8affce5ec65eba.png"}
                                />
                            { i.name }
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
                    platformList[activeIndex]?.layouts.map((i: any) => (
                        <LayoutItem key={i.id} onClick={() => selectLayout(i.id)}>
                            <LayoutTitle>{ i.name }</LayoutTitle>
                            <LayoutDesc>{ i.desc }</LayoutDesc>
                        
                            <LayoutOperate>
                                <IconButton
                                    icon="copy"
                                    $title="复制此布局"
                                    color="transparent"
                                    hoverBgColor="transparent"
                                    onClick={(event: Event) => {
                                        event.stopPropagation();
                                        copyLayout(i.id);
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
                                            deleteLayout(i.id);
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