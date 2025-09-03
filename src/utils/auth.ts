import Cookies from "js-cookie"
import { NextRouter } from "next/router";

export const clearAuth = (router?: NextRouter) => {
    Cookies.remove('display');
    Cookies.remove('username');
    Cookies.remove('email');
    Cookies.remove('token');
    if (router) {
        router.replace('/login');
    }
}