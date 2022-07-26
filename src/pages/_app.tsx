import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClientProvider, QueryClient } from 'react-query';

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
    </QueryClientProvider>)
}

export default MyApp
