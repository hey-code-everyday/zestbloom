import React, { useMemo, useState } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import AssetCard from 'components/elements/cards/assetCard';
import ConfirmModal from 'components/elements/modal/confirmModal';
import { setNotification } from 'redux/profile/actions';
import { NOTIFICATIONS, CLOSE_AUCTION } from 'configs';
import { close_app_blob, close_app } from 'redux/auction/actions';
import { closeAuction } from 'transactions/smart-contract/escrow/auctionByEscrow/closeAuction';
import { removeAuction, loadMore } from 'redux/contracts/actions';
import LottieContainer from 'components/shared/LottieContainer';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';

const ProfileContractsAuctions = ({ auctions, next }) => {
    const dispatch = useDispatch();
    const [openAuctionCloseModal, setOpenAuctionCloseModal] = useState(false);
    const [currentNode, setCurrentNode] = useState(null);
    const [closeAuctionLoading, setIsLoadingClose] = useState({});
    const { selectedWallet } = useSelector((state) => state.profile);
    const allAuctions = useMemo(() => {
        const all = auctions?.flatMap((node) => {
            const createNewNode = node.auctions.map((auction) => ({ ...node, auction }));
            return createNewNode;
        });
        return all;
    }, [auctions]);

    const deleteAuction = () => {
        dispatch(removeAuction(currentNode?.guid, currentNode?.auction.guid));
    };

    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };

    const checkForClosing = (auction) => {
        const now = new Date();
        const end = new Date(auction?.end_time * 1000);
        const start = new Date(auction?.start_time * 1000);

        if (end - now > 0 && now > start) {
            giveNotification(NOTIFICATIONS.warning.auctionNoEnded);
            return false;
        }

        return true;
    };

    const onOpenAuctionCloseModal = (auction) => {
        if (checkForClosing(auction)) setOpenAuctionCloseModal(true);
    };

    const onCloseAuction = (node) => {
        onOpenAuctionCloseModal(node?.auction);
        setCurrentNode(node);
    };

    const onCloseAuctionCloseModal = () => {
        setOpenAuctionCloseModal(false);
    };

    const throwError = () => {
        giveNotification(NOTIFICATIONS.error.wentWrong);
        // finishBid();
    };

    const onCloseAppBlob = async () => dispatch(close_app_blob(currentNode?.auction?.guid));
    const onCloseApp = async (data) => dispatch(close_app(data));

    const changeLottieVisibility = (value) => {
        setIsLoadingClose((prev) => ({ ...prev, [currentNode?.auction?.guid]: value }));
    };
    const onCloseAuctionSubmit = async (e) => {
        try {
            onCloseAuctionCloseModal();
            if (!selectedWallet) {
                return giveNotification(NOTIFICATIONS.info.connectWallet);
            }
            if (selectedWallet?.address !== currentNode?.auction?.seller) {
                return giveNotification({
                    ...NOTIFICATIONS.warning.walletdoesntMatch,
                    message:
                        NOTIFICATIONS.warning.walletdoesntMatch.message +
                        ' : ' +
                        currentNode?.auction?.seller.slice(0, 6) +
                        '...',
                });
            }
            changeLottieVisibility(true);
            const args = {
                onCloseAppBlob,
                onCloseApp,
                throwError,
                auction_guid: currentNode?.auction?.guid,
                giveNotification,
                setIsLoadingClose: changeLottieVisibility,
                reloadAsset: deleteAuction,
            };
            closeAuction(args);
        } catch (err) {
            console.log(err);
        }
    };

    const loadMoreAssets = () => {
        dispatch(loadMore(next, 'auctions'));
    };
    return (
        <div className="w-100">
            <Typography className="contracts-header-label" variant="h3">
                Auctions
            </Typography>

            <InfiniteScroll
                dataLength={allAuctions.length}
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
                    justifyContent={allAuctions?.length === 0 ? 'center' : 'flex-start'}
                >
                    {allAuctions.length ? (
                        <Grid item xs={12} className="assetsGrid mb-2">
                            {allAuctions.map((item, i) => (
                                <AssetCard
                                    key={`${item?.guid}${i}`}
                                    item={item}
                                    isAuction
                                    onCloseAuction={onCloseAuction}
                                    closeAuctionLoading={closeAuctionLoading}
                                />
                            ))}
                        </Grid>
                    ) : (
                        <Box py={4}>You have no auctions.</Box>
                    )}
                </Grid>
            </InfiniteScroll>
            <ConfirmModal
                open={openAuctionCloseModal}
                onClose={onCloseAuctionCloseModal}
                onConfirm={onCloseAuctionSubmit}
                info={CLOSE_AUCTION}
            />
        </div>
    );
};

ProfileContractsAuctions.propTypes = {
    auctions: PropTypes.array,
    next: PropTypes.string,
};

export default ProfileContractsAuctions;
