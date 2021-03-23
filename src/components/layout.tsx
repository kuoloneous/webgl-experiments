import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import {
  makeStyles,
  Theme,
} from '@material-ui/core';
import FadePageTransition from './transitions/fade-page.transition';

interface Props {
  children: React.ReactNode,
  user: any
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  menuItem: {
    marginRight: theme.spacing(1),
  },
  grow: {
    flexGrow: 1,
  },
  content: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: '4.5rem',
    },
  },
}));

function Layout({ children, user }: Props) {
  const router = useRouter();
  const classes = useStyles();

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <div className={classes.root}>
        <FadePageTransition location={router.pathname}>
          <main>
            {children}
          </main>
        </FadePageTransition>
      </div>
    </>
  );
}

export default Layout;
