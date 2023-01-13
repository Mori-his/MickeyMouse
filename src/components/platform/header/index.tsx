import React from "react";
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import styled from "styled-components";
import IconButton from "@components/basic/iconButton";
import { ConfirmControl } from "@components/basic/common/confirm/confirm";
import Image from "next/image";
import Cookies from "js-cookie";
import { clearAuth } from "@utils/auth";


const HeaderWrapper = styled.div`
    width: 100%;
    height: 88px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background-color: ${props => props.theme.main};
    box-sizing: border-box;
    font-family: PingFang SC;
    font-size: 16px;
    color: #fff;
`;

const Logo = styled.div`
    width: 80px;
    height: 80px;
    /* background-color: #009186; */
`;


const AccountWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Avator = styled.div`
    width: 72px;
    height: 72px;
    background-color: #009186;
    border-radius: 50%;
`;

const UserName = styled.div`
    margin: 0 32px 0 8px;
`;

const ExitWrapper= styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 14px;
    width: 88px;
	height: 40px;
    box-sizing: border-box;
	background-color: #000;
	border-radius: 16px;
    cursor: pointer;
`;

function Header() {
    const router = useRouter();
    const name = Cookies.get('display');

    const handleLoginOut = () => {
        ConfirmControl.open({
            content: '确认要退出吗？'
        }).then((confirm) => {
            confirm.onClose();
            clearAuth(router);
        });
    }

    return (
        <HeaderWrapper>
            <Logo>
                <Image
                    src="https://p5.ssl.qhimg.com/t01a90d4fe5dbd6733a.png"
                    alt="logo"
                    width={80}
                    height={80}
                    />
            </Logo>
            <AccountWrapper>
                <Avator></Avator>
                <UserName>{ name }</UserName>
                <ExitWrapper onClick={handleLoginOut}>
                    <IconButton
                        icon="exit"
                        color="transparent"
                        hoverBgColor="transparent"
                        defaultColor="#fff"
                        />
                    退出
                </ExitWrapper>
            </AccountWrapper>
        </HeaderWrapper>
    )
}

export default Header;