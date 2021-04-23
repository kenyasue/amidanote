import "../styles/vars.scss";
import "../styles/global.scss";
import type { AppProps /*, AppContext */ } from "next/app";
import { Provider } from "next-auth/client";
import Head from "next/head";
import "highlight.js/styles/tomorrow-night.css";

import { useReducer } from "react";
import { appStateContext, dispatcherContext } from "../lib/reducer/context";
import reducer from "../lib/reducer/reducer";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [state, dispatch] = useReducer(reducer, {
    selectedDocument: {},
    triggerSave: false,
  });

  return (
    <Provider session={pageProps.session}>
      <appStateContext.Provider value={state}>
        <dispatcherContext.Provider value={dispatch}>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
            />

            <link rel="preconnect" href="https://fonts.gstatic.com"></link>
            <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
              rel="stylesheet"
            ></link>

            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/favicon/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon/favicon-16x16.png"
            />
            <link rel="manifest" href="/favicon/site.webmanifest" />
            <meta name="msapplication-TileColor" content="#da532c" />
            <meta name="theme-color" content="#ffffff"></meta>

            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-9SXMDCBS13"
            ></script>

            <script
              dangerouslySetInnerHTML={{
                __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-9SXMDCBS13');`,
              }}
            />

            <title>Amidanote - simplest note app</title>
          </Head>
          <Component {...pageProps} />
        </dispatcherContext.Provider>
      </appStateContext.Provider>
    </Provider>
  );
}
