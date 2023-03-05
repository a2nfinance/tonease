import {useEffect} from "react";
import { Box, ChakraProvider } from '@chakra-ui/react';
import { createStandaloneToast } from '@chakra-ui/toast';
import "@fontsource/roboto";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import Head from 'next/head';
import { Provider } from "react-redux";
import WithSubnavigation from 'src/components/layout/Navbar';
import { store } from "../controller/store";
import { theme } from "../theme/theme";
const { ToastContainer } = createStandaloneToast()
const manifestUrl = 'https://tonease.a2n.finance/tonconnect-manifest.json';
import NProgress from "nprogress"
import Router from "next/router"

Router.events.on("routeChangeStart", (url) => {
    NProgress.start()
})

Router.events.on("routeChangeComplete", (url) => {
    NProgress.done()
})

Router.events.on("routeChangeError", (url) => {
    NProgress.done()
})

function MyApp({ Component, pageProps }) {

    useEffect(() => {
        import('@twa-dev/sdk');
    }, [])
    return (
        <TonConnectUIProvider manifestUrl={manifestUrl}>
            <ChakraProvider theme={theme}>
                <Provider store={store}>

                    <>

                        <WithSubnavigation />
                        <Box margin="auto" maxW={"768px"} my={5} px={5}>
                            <Component {...pageProps} />
                        </Box>

                        <ToastContainer />
                    </>

                </Provider>
            </ChakraProvider>
        </TonConnectUIProvider>

    )
}

export default MyApp