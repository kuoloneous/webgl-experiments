/* istanbul ignore file */

import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { createGenerateClassName, StylesProvider, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Theme from '../utils/theme';
import Layout from '../components/layout';


const generateClassName = createGenerateClassName({
  productionPrefix: 'canoojss-',
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [key, setKey] = React.useState(0);

  function configureStyles(): void {
    setKey(1);
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  useEffect(() => {
    configureStyles();
  }, []);

  return (
    <>
      <Head>
        <title>Boilerplate Nextjs App</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <StylesProvider key={key} generateClassName={generateClassName}>
        <ThemeProvider theme={Theme}>
          <CssBaseline />
          <Layout {...pageProps}>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </StylesProvider>
    </>
  );
};

export default MyApp;
