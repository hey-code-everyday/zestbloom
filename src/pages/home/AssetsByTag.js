import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Typography, Box, Container, Grid, Button } from '@material-ui/core';
import AssetCard from 'components/elements/cards/assetCard';
import Slider from 'components/shared/slider';
import { getFilteredAssetElements } from '../marketplace/util';
import { getAssetsForMarketPlaceByTag } from 'redux/marketplace/actions';

const AssetsByTag = ({ title, tag, isLoggedIn }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { marketplaceAssets } = useSelector((state) => state.marketplace);

    const goToMarketplace = () => history.push('/marketplace');

    useEffect(() => {
        dispatch(getAssetsForMarketPlaceByTag(getFilteredAssetElements({}, null, [tag]), tag));
    }, [tag, dispatch]);

    if (!marketplaceAssets[tag]?.length) return null;

    return (
        <div className="home-assets-tag">
            <Container maxWidth="xl">
                <Box mb={2} display="flex" alignItems="flex-end" justifyContent="space-between">
                    <Typography className="text-white" variant="h2">
                        {title}
                    </Typography>
                    <Box className="view-all">
                        <Button onClick={goToMarketplace} className="view-all-btn">
                            View All
                        </Button>
                    </Box>
                </Box>

                <Grid container spacing={3} className="list-with-link">
                    <Grid xs={12} item={true}>
                        <Slider
                            options={{
                                slidesToShow: 3,
                                slidesToScroll: 3,
                                infinite: true,
                            }}
                        >
                            {(marketplaceAssets[tag] ?? [])?.map((item) => (
                                <Box p={1} key={item?.guid} height={250}>
                                    <AssetCard
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
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default AssetsByTag;
