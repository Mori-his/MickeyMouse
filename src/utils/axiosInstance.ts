import axios from "axios";
import Cookies from "js-cookie";
import { clearAuth } from "./auth";

export function isTest() {
    const re = /\.test|localhost/;
    return re.test(window.location.origin);
}


// 如果有特定`header`头信息请在`create`的`config`参数里填写
// 这样写不会影响全局`axios`
export const api = axios.create();

api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token && config.headers) {
        Object.assign(config.headers, {
            // token必须在headers上
            'token': `${token}`
        });
    }
    return config;
});
api.interceptors.response.use((response) => {
    // 目前response的code码只有7(未登录)
    if (response.data.code === 7) {
        // code为7是未登录
        // 如果未登录则删除已存在的token
        clearAuth();
        return Promise.reject(response.data);
    }
    if (response.data.code !== 0) {
        console.error(`[${Date.now()}]请求出错啦~,错误代码: ${response.data.code}`);
        console.error(`[${Date.now()}]请求出错啦~,错误信息: ${JSON.stringify(response.data)}`);
        return Promise.reject(response.data);
    }
    return response.data;
}, (error) => {
    console.error(error);
    return Promise.reject(error);
});
