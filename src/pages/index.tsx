import React from 'react';
import Head from 'next/head';

import {
  Container, Grid, Card, CardContent, Box,
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
            <Grid item>
              <Card>
                <CardContent>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
                  ea maiores reiciendis. Quod earum exercitationem esse vitae ad tenetur
                  laborum labore fugit vel laudantium veniam, beatae ducimus,
                  voluptas debitis! Voluptate?
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card>
                <CardContent>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
                  ea maiores reiciendis. Quod earum exercitationem esse vitae ad tenetur
                  laborum labore fugit vel laudantium veniam, beatae ducimus,
                  voluptas debitis! Voluptate?
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card>
                <CardContent>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
                  ea maiores reiciendis. Quod earum exercitationem esse vitae ad tenetur
                  laborum labore fugit vel laudantium veniam, beatae ducimus,
                  voluptas debitis! Voluptate?
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card>
                <CardContent>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
                  ea maiores reiciendis. Quod earum exercitationem esse vitae ad tenetur
                  laborum labore fugit vel laudantium veniam, beatae ducimus,
                  voluptas debitis! Voluptate?
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
