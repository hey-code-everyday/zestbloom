import React, { useState } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import AssetCard from 'components/elements/cards/assetCard';
import AssetBidsModal from 'components/elements/modal/assetBidsModal';
import ConfirmModal from 'components/elements/modal/confirmModal';
import { useDispatch, useSelector } from 'react-redux';
import { close_app_blob, close_app } from 'redux/auction/actions';
import { setNotification } from 'redux/profile/actions';
import { NOTIFICATIONS, CLOSE_AUCTION } from 'configs';
import { closeAuction } from 'transactions/smart-contract/escrow/auctionByEscrow/closeAuction';
import { removeBid } from 'redux/contracts/actions';
import InfiniteScroll from 'react-infinite-scroll-component';
import LottieContainer from 'components/shared/LottieContainer';
import { loadMore } from 'redux/contracts/actions';
import PropTypes from 'prop-types';

const ProfileContractsBids = ({ bids, next }) => {
    const dispatch = useDispatch();
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [selectedBid, setSelectedBid] = useState(null);
    const [asset, setAsset] = useState(null);
    const [openAuctionCloseModal, setOpenAuctionCloseModal] = useState(false);
    const { selectedWallet } = useSelector((state) => state.profile);
    const selectedItem = bids.find(({ guid }) => guid === selectedOffer);

    const [closeMyBidAuctionLoading, setCloseMyBidAuctionLoading] = useState({});

    const onViewBids = (e, item_guid) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedOffer(item_guid);
    };

    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };

    const checkForClosing = (auction) => {
        const now = new Date();
        const end = new Date(auction?.end_time * 1000);

        if (end - now > 0) {
            giveNotification(NOTIFICATIONS.warning.auctionNoEnded);
            return false;
        }

        return true;
    };

    const onCloseOffersModal = () => setSelectedOffer(null);

    const onOpenAuctionCloseModal = (auction) => {
        if (checkForClosing(auction)) setOpenAuctionCloseModal(true);
    };

    const onCloseAuctionCloseModal = () => {
        setOpenAuctionCloseModal(false);
    };

    const throwError = () => {
        giveNotification(NOTIFICATIONS.error.wentWrong);
        // finishBid();
    };

    const closeOutbyBids = (item, bid) => {
        onOpenAuctionCloseModal(bid?.auction);
        setAsset(item);
        setSelectedBid(bid);
    };

    const onCloseAppBlob = async () => dispatch(close_app_blob(selectedBid?.auction?.guid));

    const onCloseApp = async (data) => dispatch(close_app(data));

    const changeLottieVisibility = (value) => {
        setCloseMyBidAuctionLoading((prev) => ({ ...prev, [selectedBid?.auction?.guid]: value }));
    };

    const deleteBid = async () =>
        dispatch(
            removeBid({
                asset_guid: asset?.guid,
                bid_guid: selectedItem ? selectedBid?.guid : null,
            }),
        );

    const onCloseAuctionSubmit = async (e) => {
        try {
            onCloseAuctionCloseModal();
            if (!selectedWallet) {
                return giveNotification(NOTIFICATIONS.info.connectWallet);
            }
            changeLottieVisibility(true);
            const args = {
                onCloseAppBlob,
                onCloseApp,
                throwError,
                auction_guid: selectedBid?.auction?.guid,
                giveNotification,
                setIsLoadingClose: changeLottieVisibility,
                reloadAsset: deleteBid,
            };
            closeAuction(args);
        } catch (err) {
            console.log(err);
        }
    };

    const loadMoreAssets = () => {
        dispatch(loadMore(next, 'bids'));
    };

    return (
        <div className="w-100">
            <Typography className="contracts-header-label" variant="h3">
                Open Bids
            </Typography>
            <InfiniteScroll
                dataLength={bids.length}
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
                    justifyContent={bids?.length === 0 ? 'center' : 'flex-start'}
                >
                    {bids.length ? (
                        <Grid item xs={12} className="assetsGrid">
                            {bids.map((item, index) => (
                                <AssetCard
                                    key={item?.guid + index}
                                    item={item}
                                    isBid
                                    onViewBids={onViewBids}
                                    closeOutbyBids={closeOutbyBids}
                                    closeMyBidAuctionLoading={closeMyBidAuctionLoading}
                                />
                            ))}
                        </Grid>
                    ) : (
                        <Box py={4}>You have no bids.</Box>
                    )}
                </Grid>
            </InfiniteScroll>

            {selectedItem && (
                <AssetBidsModal
                    selectedItem={selectedItem}
                    open={
                        !!(
                            selectedItem &&
                            (selectedItem?.offers?.length || selectedItem?.bids?.length)
                        )
                    }
                    onClose={onCloseOffersModal}
                    closeOutbyBids={closeOutbyBids}
                    closeMyBidAuctionLoading={closeMyBidAuctionLoading}
                />
            )}
            <ConfirmModal
                open={openAuctionCloseModal}
                onClose={onCloseAuctionCloseModal}
                onConfirm={onCloseAuctionSubmit}
                info={CLOSE_AUCTION}
            />
        </div>
    );
};

ProfileContractsBids.propTypes = {
    bids: PropTypes.array,
    next: PropTypes.string,
};

export default ProfileContractsBids;
