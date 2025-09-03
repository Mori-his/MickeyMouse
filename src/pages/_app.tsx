import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import '../utils/axiosInstance';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // 如果浏览器得到焦点再重新获取请求
            refetchOnWindowFocus: true
        }
    }
});


function MyApp({ Component, pageProps }: AppProps) {
    return (<QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>)
}

export default MyApp
