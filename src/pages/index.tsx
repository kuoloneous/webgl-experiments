import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container, Grid, Card, CardContent, Box, Link as MuiLink,
} from '@material-ui/core';

interface Props {
  user: any
}

function HomePage() {
  return (
    <>
      <Head>
        <title>Homepage</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Box paddingTop={3}>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <ul>
                    <li>
                      <Link href="/animations/cube">
                        <MuiLink>
                          Cube
                        </MuiLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/animations/character">
                        <MuiLink>
                          Character
                        </MuiLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/animations/car">
                        <MuiLink>
                          Car
                        </MuiLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/animations/diamond-shibas">
                        <MuiLink>
                          Diamond Shibas
                        </MuiLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/animations/diamond-lv">
                        <MuiLink>
                          Diamond LV
                        </MuiLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/animations/backlit-vehicle">
                        <MuiLink>
                          Vehicle Showroom
                        </MuiLink>
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default HomePage;
