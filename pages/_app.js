import React, { useCallback, useEffect, useState } from 'react';
import Head from "next/head";
import PropTypes from "prop-types"
import { appWithTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import NextNprogress from "nextjs-progressbar";

import store from "../store";
import { Provider } from "react-redux";

import { SessionProvider } from 'next-auth/react';

import Layout from "components/layout/Layout";

import "react-datepicker/dist/react-datepicker.css";

import "styles/globals.scss";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import debounce from 'utils/debounce';
import GlobalSetting from "helper/settings/GlobalSetting";
import { ScrollToTopButton } from 'components/UI';
import axios from 'axios';

const FONT_SIZE_BASE = 16;
const FONT_SIZE_RATIO = 0.1122 / 3;

function MyApp({ Component, pageProps }) {


  const [colorEnd, setColorEnd] = useState('')

  useEffect(() => {
    
    const subDomain = window.location.host.split('.')[0];

    axios.get(`https://api.telgani.com/api/v1/partner/y-renting-cars`)
    .then(res => {

      setColorEnd(res?.data?.data?.main_color_hex)

      localStorage.setItem('imageBanner', res?.data?.data?.images?.banner?.file_path);
      localStorage.setItem('imageLogo', res?.data?.data?.images?.logo?.file_path);
      localStorage.setItem('headerContent', res?.data?.data?.header_content?.en);

    })
    .catch(err => {
      console.log(err)
    }); 
  
  }, [setColorEnd]);

  useEffect(() => {
    const defaultColorPrimary = '#15A9BE'
    document.documentElement.style.setProperty("--primary",  colorEnd ? colorEnd : defaultColorPrimary);
  }, [colorEnd])



  const handleResize = useCallback(debounce(() => {
    const fontSize =
      window.innerWidth < 425
        ? `${(window.innerWidth * FONT_SIZE_RATIO).toFixed(1)}px`
        : `${FONT_SIZE_BASE}px`;
    document.documentElement.style.fontSize = fontSize;
  }, 100), []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [handleResize]);

  const getLayout =
    Component.getLayout || ((page) => <Layout>{page}</Layout>);
  return (
    <SessionProvider
      session={pageProps.session} >
      <Provider store={store}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />
          <script
            type="text/javascript"
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.MAP_API_KEY}&libraries=places`}
            async
            defer
          ></script>
          <title>Telgani - B2B</title>
        </Head>
        <NextNprogress
          color="#15A9BE"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={true}
          showSpinner={false}

        />

        <ToastContainer
          position="top-center"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{
            zIndex: 99999
          }}
        />

        <GlobalSetting>
          {getLayout(<Component {...pageProps} />)}
        </GlobalSetting>

        {/* ScrollToTopButton */}
        <ScrollToTopButton />
      </Provider>
    </SessionProvider>
  );
}
MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired
}


export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default appWithTranslation(MyApp);
