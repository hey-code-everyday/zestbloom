import React from 'react';
import { Typography, Container, Grid } from '@material-ui/core';
import { ImgTag } from 'components/shared';
import bannerImg from 'assets/img/promotional-banner.jpg';

const PromotionalBanner = ({ className }) => {
    return (
        <Container className="promotional-banner-container">
            <Grid
                container
                justifyContent="space-between"
                spacing={3}
                alignItems="center"
                onClick={() =>
                    window.open('https://accursedshare.art/entangled-life-worldbuilders/', '_blank')
                }
                className="promotional-banner"
            >
                <Grid item md={3} style={{ padding: '0px' }}>
                    <div className="promotional-banner-images">
                        <ImgTag src={bannerImg} alt="Banner image" className="img" />
                    </div>
                </Grid>
                <Grid className="promotional-banner-content" item md={9} xs={12}>
                    <Typography variant="h2">ENTANGLED LIFE:</Typography>
                    <Typography variant="h2">
                        WORLDBUILDERS NFTS REPRESENT YOUR PATRONAGE OF SCIENCE, ART AND THE
                        ENVIRONMENT.
                    </Typography>
                    <Typography
                        variant="h5"
                        style={{ color: 'white', paddingBottom: '40px', paddingTop: '10px' }}
                    >
                        A PORTION OF THIS PROJECT'S REVENUE WILL SUPPORT MERLIN SHELDRAKE'S
                        CONTINUING RESEARCH ON FUNGI.
                    </Typography>
                    <Typography style={{ fontWeight: 'bold' }}>COMING IN MARCH!</Typography>
                </Grid>
            </Grid>
        </Container>
    );
};

export default PromotionalBanner;
