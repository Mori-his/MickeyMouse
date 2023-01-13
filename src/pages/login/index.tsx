import React, { useCallback, useEffect, useReducer } from "react";
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import styled from "styled-components";
import Input from '@components/basic/form/input/input';
import Button from '@components/basic/button';
import { ActionMap } from '@/types/redux.type';
import Image from "next/image";
import Cookies from "js-cookie";
import { LoginResponse } from "@/types/login/login";
import { api } from "@utils/axiosInstance";

const Wrapper = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(225deg, #393e46 0%,  #282d36 58%, #0b0c0e 100%);
`;
const LoginWrapper = styled.div`
    position: fixed;
    top: 50%;
    right: 208px;
    transform: translate3d(0, -50%, 0);
    padding: 136px 64px 80px;
	background-color: #222831;
	box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.28);
	border-radius: 16px;
    box-sizing: border-box;
`;

const Logo = styled.div`
    margin: -180px auto 11px;
    width: 180px;
    height: 190px;
    /* background-color: #469adb; */
`;


type ButtonProps = {
    backgroundColor?: string
    disabled?: boolean
}
const LoginButton = styled(Button)<ButtonProps>`
    width: 368px;
	height: 56px;
	background-color: #469adb;
    color: #fff;
	border-radius: 16px;
    ${props => `
        background-color: ${props.backgroundColor};
        cursor: ${props.disabled ? 'not-allowed' : ''};
        opacity: ${props.disabled ? '0.5' : '1'};
    `}
`;

const Row = styled.div`
    margin-top: 24px;
`;


const enum LoginActions {
    SET_USERNAME = 'setUsername',
    SET_PASSWORD = 'setPassword',
}
export interface LoginState {
    [LoginActions.SET_USERNAME]: string
    [LoginActions.SET_PASSWORD]: string
}

export type LoginAction =
    ActionMap<LoginState>[keyof ActionMap<LoginState>];

export function LoginReducer(
    state: LoginState,
    action: LoginAction
) {
    return {
        ...state,
        [action.type]: action.payload,
    };
}


const LayoutLoginPage = function () {
    const router = useRouter();
    const [state, dispatch] = useReducer(LoginReducer, {
        [LoginActions.SET_USERNAME]: '',
        [LoginActions.SET_PASSWORD]: '',
    }); 

    const handleLogin = () => {
        if (!checkCanLogin()) return;

        // TODO: 登录逻辑
        Cookie.set('token', '111');
        router.replace('/platform');
    }

    const checkCanLogin = () => {
        for(const item of Object.values(state)) {
            if (item === '') return false;
        }
        return true;
    }

    const handleDomainLogin = () => {
        const ref = encodeURIComponent(`${location.origin}/login`);
        window.location.href = `https://login.ops.qihoo.net:4436/sec/login?ref=${ref}`
        console.log('预账号登录')
    }

    const loginQuery = useCallback(async (sid: string) => {
        const res = await api.get('https://layout-api.test.huajiao.com/system/login', {
            params: {
                sid
            },
        });
        const data: LoginResponse = res.data;
        if (data.loginInfo) {
            Cookies.set('display', data.loginInfo.display);
            Cookies.set('email', data.loginInfo.email);
            Cookies.set('token', data.loginInfo.token);
            Cookies.set('username', data.loginInfo.username);
            // 如果登录成功则跳转
            router.replace('/platform');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // 预取页面
        router.prefetch('/platform')
        // 判断是否登录
        if (router.query.sid) {
            loginQuery(router.query.sid.toString());
        }
        return () => {
            
        }
    }, [loginQuery, router])
    

    return (
        <Wrapper>
            <LoginWrapper>
                <Logo>
                    <Image
                        src="https://p5.ssl.qhimg.com/t01a90d4fe5dbd6733a.png"
                        alt="logo"
                        width={180}
                        height={190}
                        />
                </Logo>
                <Row>
                    <Input
                        width={ 368 }
                        height={ 48 }
                        name="username"
                        backgroundColor="#fff"
                        placeholder={ '请输入用户名' }
                        onChange={ (e) => dispatch({type: LoginActions.SET_USERNAME, payload: e.target.value}) }
                        />
                </Row>
                <Row>
                    <Input
                        width={ 368 }
                        height={ 48 }
                        name="password"
                        backgroundColor="#fff"
                        placeholder={ '请输入密码' }
                        onChange={ (e) => dispatch({type: LoginActions.SET_PASSWORD, payload: e.target.value}) }
                        />
                </Row>
                <Row>
                    <LoginButton
                        disabled={ !checkCanLogin() }
                        onClick={ handleLogin }
                        >
                        登录
                    </LoginButton>
                </Row>
                <Row>
                    <LoginButton
                        backgroundColor="#04773e"
                        onClick={ handleDomainLogin }
                        >
                        域账号登录
                    </LoginButton>
                </Row>
            </LoginWrapper>
        </Wrapper>
    )
}


LayoutLoginPage.getInitialProps = async ({ query }: any) => {
    return {
        ...query,
    };
}

export default LayoutLoginPage;