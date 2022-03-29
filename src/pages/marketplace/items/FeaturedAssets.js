import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Container, Grid, Typography } from '@material-ui/core';
import AssetCard from 'components/elements/cards/assetCard';
import Slider from 'components/shared/slider';
import { getFilteredAssetElements } from '../util';
import { getAssetsForMarketPlace } from 'redux/marketplace/actions';
import PropTypes from 'prop-types';

const FeaturedAssets = ({ mobile }) => {
    const dispatch = useDispatch();
    const {
        marketplaceAssets: { featured_work: assets },
    } = useSelector((state) => state.marketplace);
    const { isLoggedIn } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(
            getAssetsForMarketPlace(
                getFilteredAssetElements({
                    category: ['featured_work'],
                }),
                'featured_work',
            ),
        );
    }, [dispatch]);

    return (
        <Grid item xs={12} className="featured-assets slide-container">
            <Container maxWidth="xl">
                <Box mb={2} display="flex" alignItems="flex-end" justifyContent="space-between">
                    <Typography className="text-white" variant="h2">
                        Spotlight
                    </Typography>
                </Box>
                <Slider
                    options={{
                        slidesToShow: 3,
                        ...(mobile
                            ? {
                                  centerMode: true,
                                  infinite: true,
                                  centerPadding: '60px',
                                  responsive: [
                                      {
                                          breakpoint: 600,
                                          settings: {
                                              slidesToShow: 1,
                                              slidesToScroll: 1,
                                          },
                                      },
                                  ],
                              }
                            : {}),
                    }}
                >
                    {assets?.map((item) => (
                        <Box p={2.5} key={item?.guid} height={250}>
                            <AssetCard
                                mobile={mobile}
                                item={item}
                                upvoteAsset={() => {}}
                                unUpvoteAsset={() => {}}
                                toFavoritesAssets={() => {}}
                                removeFromFavoritesAssets={() => {}}
                                isLoggedIn={isLoggedIn}
                                changeAssetVisibility={() => {}}
                            />
                        </Box>
                    ))}
                </Slider>
            </Container>
        </Grid>
    );
};

FeaturedAssets.propTypes = {
    mobile: PropTypes.bool,
};

export default FeaturedAssets;
