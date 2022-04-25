import React from 'react';
import { useSelector } from 'react-redux';

import { Container, Grid, Box } from '@material-ui/core';

import { BANNER_LIST } from 'configs';
import { StartCollectingSearch } from 'components/shared';
import ExplainWithIcon from 'components/elements/home/ExplainWithIcon';
import PlayNFTs from 'components/elements/home/PlayNFTs';

const Banner = () => {
    const { bannerPlaceholder } = useSelector((state) => state.marketplace);

    return (
        <div className="banner">
            <div className="banner-bg"></div>
            <div className="banner-bg"></div>
            <div className="banner-bg"></div>
            <div className="banner-bg"></div>
            <div className="banner-bg animation-down-top"></div>
            <Container maxWidth="xl">
                <Grid container justifyContent="space-between" spacing={3} alignItems="center">
                    <Grid item md={6} sm={12} className="z-index-top animation-left-right">
                        <Box className="text-uppercase text-h1">FIND YOUR TREASURE</Box>
                        <Box className="text-h4">Algorand Digital Asset Exchange</Box>
                        <Box display="flex" my={4} alignItems="start">
                            {BANNER_LIST.map(({ icon, text, color }) => (
                                <ExplainWithIcon
                                    key={text}
                                    iconSrc={icon}
                                    text={text}
                                    color={color}
                                />
                            ))}
                        </Box>
                        <StartCollectingSearch id="banner-search" />
                    </Grid>

                    <Grid item md={6} sm={12} className="z-index-top animation-right-left mx-auto">
                        <PlayNFTs nfts={bannerPlaceholder.slice(0, 3)} />
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default Banner;
