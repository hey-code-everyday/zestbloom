import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Typography } from '@material-ui/core';
import AssetCard from 'components/elements/cards/assetCard';
import ConfirmModal from 'components/elements/modal/confirmModal';
import { cancelOldContract } from 'transactions/smart-contract/escrow/saleByEscrow/cancelOldContract';
import { deleteEscrowContract } from 'redux/algorand/actions';
import { setNotification } from 'redux/profile/actions';
import { removeListing } from 'redux/contracts/actions';
import { CONTRACT_INFO, NOTIFICATIONS } from 'configs';
import InfiniteScroll from 'react-infinite-scroll-component';
import LottieContainer from 'components/shared/LottieContainer';
import { loadMore } from 'redux/contracts/actions';
import { withWalletFallback } from 'hoc/withWalletFallback';
import PropTypes from 'prop-types';

const ProfileContractsListings = ({ listings, next, walletFallback }) => {
    const dispatch = useDispatch();
    const { selectedWallet } = useSelector((state) => state.profile);

    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [currentListing, setCurrentListing] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    const openCancelModal = () => {
        setCancelModalVisible(true);
    };

    const closeCancelModal = () => {
        setCancelModalVisible(false);
    };

    const onClickCancel = (item) => {
        setCurrentListing(item);
        openCancelModal();
    };

    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };

    const showResponseOfCanceling = (status, message) => {
        switch (status) {
            case 'none':
                return giveNotification(NOTIFICATIONS.info.dontHaveContract);
            case 'bought':
                return giveNotification(NOTIFICATIONS.info.noBelongToYou);
            case 'revoke':
                return giveNotification(NOTIFICATIONS.success.terminatedContract);
            case 'error':
                return giveNotification({ status: 'error', message });
            default:
                return giveNotification(NOTIFICATIONS.error.wentWrong);
        }
    };

    const trowError = () => {
        setCancelLoading(false);
        showResponseOfCanceling(
            NOTIFICATIONS.error.wentWrong.status,
            NOTIFICATIONS.error.wentWrong.message,
        );
    };

    const deleteListing = async () => dispatch(removeListing(currentListing?.guid));

    const endListing = async () => {
        try {
            closeCancelModal();
            if (!selectedWallet) {
                return giveNotification(NOTIFICATIONS.info.connectWallet);
            }

            setCancelLoading(true);
            const teal = currentListing?.sale;

            if (!teal) {
                setCancelLoading(false);
                return giveNotification(NOTIFICATIONS.info.dontHaveContract);
            }

            const holder = teal?.teal_context?.new_seller || teal?.teal_context?.asset_creator;

            if (selectedWallet.address !== holder) {
                setCancelLoading(false);
                return giveNotification({
                    ...NOTIFICATIONS.warning.walletdoesntMatch,
                    message:
                        NOTIFICATIONS.warning.walletdoesntMatch.message +
                        ' : ' +
                        holder.slice(0, 6) +
                        '...',
                });
            }

            const cancelResult = await cancelOldContract(
                teal,
                currentListing?.asset?.asset_id,
                selectedWallet,
                walletFallback,
            );

            if (cancelResult?.status === 'error') {
                setCancelLoading(false);
                return showResponseOfCanceling(cancelResult?.status, cancelResult?.message);
            }

            dispatch(deleteEscrowContract(teal?.guid, cancelResult?.blob))
                .then((response) => {
                    if (response?.status === 204) {
                        setCancelLoading(false);
                        showResponseOfCanceling(cancelResult?.status);
                        // return dispatch(deleteContract(node?.guid));
                        return deleteListing();
                    }
                    trowError();
                })
                .catch((err) => {
                    console.log(err);
                    trowError();
                });
        } catch (err) {
            console.log(err);
            trowError();
        }
    };
    const allListings = useMemo(() => {
        const all = listings?.flatMap((node) => {
            const createNewNode = node.listings.map((sale) => ({ ...node, sale }));
            return createNewNode;
        });
        return all;
    }, [listings]);

    const loadMoreAssets = () => {
        dispatch(loadMore(next, 'listings'));
    };

    return (
        <div className="w-100">
            <Typography className="contracts-header-label" variant="h3">
                Listings
            </Typography>
            <InfiniteScroll
                dataLength={allListings.length}
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
                    justifyContent={allListings?.length === 0 ? 'center' : 'flex-start'}
                >
                    {allListings.length ? (
                        <Grid item xs={12} className="assetsGrid">
                            {allListings.map((item, index) => (
                                <AssetCard
                                    key={item?.guid + index}
                                    item={item}
                                    isListing
                                    onCancelListing={onClickCancel}
                                    cancelLoading={cancelLoading}
                                />
                            ))}
                        </Grid>
                    ) : (
                        <Box py={4}>You have no listings.</Box>
                    )}
                </Grid>
            </InfiniteScroll>

            <ConfirmModal
                open={cancelModalVisible}
                onClose={closeCancelModal}
                onConfirm={endListing}
                info={CONTRACT_INFO}
            />
        </div>
    );
};

ProfileContractsListings.propTypes = {
    listings: PropTypes.array,
    next: PropTypes.string,
    walletFallback: PropTypes.string,
};

export default withWalletFallback(ProfileContractsListings);
