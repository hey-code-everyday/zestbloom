import React, { useState } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import AssetCard from 'components/elements/cards/assetCard';
import AssetOffersModal from 'components/elements/modal/assetOffersModal';
import InfiniteScroll from 'react-infinite-scroll-component';
import LottieContainer from 'components/shared/LottieContainer';
import { useDispatch } from 'react-redux';
import { loadMore } from 'redux/contracts/actions';
import PropTypes from 'prop-types';

const ProfileContractsOffers = ({ offers, assetsInWallet, next }) => {
    const dispatch = useDispatch();
    const [selectedOffer, setSelectedOffer] = useState(null);
    const selectedItem = offers.find(({ guid }) => guid === selectedOffer);

    const onViewOffer = (e, offerId) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedOffer(offerId);
    };

    const loadMoreAssets = () => {
        dispatch(loadMore(next, 'offers'));
    };

    const onCloseOffersModal = () => setSelectedOffer(null);
    return (
        <div className="w-100">
            <Typography className="contracts-header-label" variant="h3">
                Pending Offers
            </Typography>
            <InfiniteScroll
                dataLength={offers.length}
                next={loadMoreAssets}
                hasMore={next ? true : false}
                loader={
                    <LottieContainer
                        containerStyles={{
                            height: '49px',
                            width: '100%',
                            marginTop: '40px',
                        }}
                        lottieStyles={{ width: '50px' }}
                    />
                }
                style={{ overflow: 'hidden', minHeight: '100px' }}
            >
                <Grid
                    container
                    spacing={3}
                    justifyContent={offers?.length === 0 ? 'center' : 'flex-start'}
                >
                    {offers.length ? (
                        <Grid item xs={12} className="assetsGrid mb-2">
                            {offers.map((item, index) => (
                                <AssetCard
                                    key={item?.guid + index}
                                    item={item}
                                    isOffer
                                    onViewOffer={onViewOffer}
                                    assetsInWallet={assetsInWallet}
                                />
                            ))}
                        </Grid>
                    ) : (
                        <Box py={4}>You have no pending offers.</Box>
                    )}
                </Grid>
            </InfiniteScroll>

            <AssetOffersModal
                selectedItem={selectedItem}
                open={!!(selectedItem && selectedItem?.offers?.length)}
                onClose={onCloseOffersModal}
            />
        </div>
    );
};

ProfileContractsOffers.propTypes = {
    offers: PropTypes.array,
    next: PropTypes.string,
    assetsInWallet: PropTypes.array,
};

export default ProfileContractsOffers;
