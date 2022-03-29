import React, { useState, useMemo } from 'react';
import { Box, ButtonGroup, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { collectAssetOfferByEscrow } from 'redux/collectedAssets/actions';
import LottieContainer from 'components/shared/LottieContainer';
import { primarySale } from 'transactions/smart-contract/escrow/offerByEscrow/primarySale';
import { secondarySale } from 'transactions/smart-contract/escrow/offerByEscrow/secondarySale';
import { closeContract } from 'transactions/smart-contract/escrow/offerByEscrow/closeContract';
import { algorandBaseUrl } from 'transactions/algorand/index';
import { deleteOfferByEscrowContract } from 'redux/algorand/actions';
import { setNotification } from 'redux/profile/actions';
import { removeBid, removeOffer } from 'redux/contracts/actions';
import { stopEvent } from 'helpers/functions';
import { NOTIFICATIONS } from 'configs';
import { getAssetInfo } from 'transactions/algorand/validations';
import PropTypes from 'prop-types';

const AssetCardButton = ({
    item,
    button,
    isOffer,
    isListing,
    isAuction,
    isBid,
    offers,
    cancelLoading = false,
    closeAuctionLoading = false,
    onViewOffer = () => {},
    onCancelListing = () => {},
    onCloseAuction = () => {},
    onViewBids = () => {},
    closeOutbyBids = () => {},
    haveAmount,
    assetId,
    closeMyBidAuctionLoading = {},
    isEndedAuction,
    isStartedAuction,
}) => {
    const dispatch = useDispatch();
    const { selectedWallet } = useSelector((state) => state.profile);
    const [cancelMyBidLoading, setCancelMyBidLoading] = useState(false);

    // const { user } = useSelector((state) => state.auth);

    const sendCollectedAsset = async (data, holderGuid) => {
        dispatch(collectAssetOfferByEscrow(holderGuid, data))
            .then((response) => {
                if (response?.status === 201) {
                    giveNotification(NOTIFICATIONS.success.offerComplated);
                    return dispatch(removeOffer(item?.guid, data?.contract));
                }
                giveNotification(NOTIFICATIONS.error.offerDontComplate);
            })
            .catch((err) => {
                giveNotification({ status: 'error', message: err?.message });
            });
    };

    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };

    const acceptContract = async (e, contract) => {
        stopEvent(e);
        try {
            if (!selectedWallet) {
                return giveNotification(NOTIFICATIONS.info.connectWallet);
            }
            let holder;
            const offer_guid = contract?.guid;
            const getHolderNode = item?.nodes?.find((node) =>
                node?.offers?.find((offer) => offer?.guid === offer_guid),
            );

            if (getHolderNode) {
                if (selectedWallet?.address !== getHolderNode?.holder) {
                    return giveNotification({
                        ...NOTIFICATIONS.warning.walletdoesntMatch,
                        message:
                            NOTIFICATIONS.warning.walletdoesntMatch.message +
                            ' : ' +
                            getHolderNode?.holder.slice(0, 6) +
                            '...',
                    });
                }
                if (!haveAmount) {
                    return giveNotification(NOTIFICATIONS.error.notEnoughBalance);
                }
                holder = getHolderNode;
            } else {
                const assetInfo = await getAssetInfo(assetId);
                holder = item.nodes?.find(
                    (node) =>
                        node?.holder === selectedWallet?.address &&
                        assetInfo?.balances?.find(
                            (wallet) => wallet?.address === node?.holder && wallet.amount > 0,
                        ),
                );
            }
            if (!holder) {
                return giveNotification(NOTIFICATIONS.warning.walletdoesntMatch);
            }

            if (selectedWallet?.address === contract?.teal_context?.asset_creator) {
                const response = await primarySale(
                    contract,
                    sendCollectedAsset,
                    () => {},
                    giveNotification,
                    holder,
                );
                if (response?.status === 400) {
                    return giveNotification({ status: 'error', message: response?.message });
                }
            } else {
                const response = await secondarySale(
                    contract,
                    selectedWallet?.address,
                    sendCollectedAsset,
                    () => {},
                    giveNotification,
                    holder,
                );
                if (response?.status === 400) {
                    return giveNotification({ status: 'error', message: response?.message });
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    const deleteOffer = async (guid) =>
        dispatch(deleteOfferByEscrowContract(guid)).then((res) => {
            dispatch(removeOffer(item?.guid));
        });

    const deleteBid = async (guid) =>
        dispatch(deleteOfferByEscrowContract(guid)).then((res) => {
            dispatch(removeBid({ asset_guid: item?.guid }));
        });

    const rejectOffer = async (e, contract) => {
        stopEvent(e);

        await closeContract(contract, deleteOffer);
        giveNotification(NOTIFICATIONS.success.offerRejected);
    };

    const rejectListing = async (e, contract) => {
        stopEvent(e);

        onCancelListing(item);
    };

    const closeAuction = (e, auction) => {
        stopEvent(e);

        onCloseAuction(item);
    };

    const clickOnBidBtn = (e, contract) => {
        stopEvent(e);
        if (isOfferNode) return rejectBid(contract);
        return closeOutbyBids(item, contract);
    };

    const rejectBid = async (contract) => {
        setCancelMyBidLoading(true);
        const response = await closeContract(contract, deleteBid);
        setCancelMyBidLoading(false);
        showResponseOfCanceling(response?.status, response?.message);
    };

    const showResponseOfCanceling = (status, message) => {
        switch (status) {
            case 'none':
                return giveNotification(NOTIFICATIONS.info.connectWallet);
            case 'revoke': {
                return giveNotification(NOTIFICATIONS.success.terminatedContract);
            }
            case 'error':
                return giveNotification({ status: 'error', message });
            default:
                return giveNotification(NOTIFICATIONS.error.wentWrong);
        }
    };

    const viewOffer = async (e, contract) => {
        stopEvent(e);
        const a = document.createElement('a');
        if (isOfferNode || contract?.type === 'SaleByEscrow') {
            a.href = `${algorandBaseUrl}/address/${contract?.compiled_teal_address}`;
        } else {
            a.href = `${algorandBaseUrl}/application/${contract?.auction?.app_id}`;
        }
        a.target = '_blank';
        a.click();
    };

    const offersAndBids = useMemo(() => {
        if (isBid) {
            const offers = item?.offers;
            const bids = item?.bids;
            return [...offers, ...bids];
        }
        return [];
    }, [isBid, item]);

    const isOfferNode = offersAndBids[0]?.type === 'OfferByEscrow';
    return (
        <Box className="asset-card-button-wrapper">
            {button && (
                <Button variant="outlined" color="secondary" size="large" fullWidth>
                    Place a Bid
                </Button>
            )}

            {isOffer && offers.length && (
                <Box paddingX={1} paddingY={2} textAlign="center">
                    {offers.length > 1 ? (
                        <Button
                            variant="outlined"
                            color="primary"
                            size="large"
                            fullWidth
                            onClick={(e) => onViewOffer(e, item?.guid)}
                        >
                            View Offers
                        </Button>
                    ) : (
                        <ButtonGroup>
                            <Button
                                className="color-error"
                                variant="outlined"
                                onClick={(e) => rejectOffer(e, offers[0])}
                            >
                                Decline
                            </Button>
                            <Button
                                className="color-green"
                                variant="outlined"
                                onClick={(e) => acceptContract(e, offers[0])}
                            >
                                Accept
                            </Button>
                        </ButtonGroup>
                    )}
                </Box>
            )}

            {isListing && (
                <Box paddingX={1} paddingY={2} textAlign="center">
                    {item?.sale && (
                        <ButtonGroup>
                            <Button
                                className="color-black"
                                variant="outlined"
                                onClick={(e) => viewOffer(e, item?.sale)}
                            >
                                View Escrow
                            </Button>

                            {cancelLoading ? (
                                <LottieContainer
                                    containerStyles={{
                                        height: '31px',
                                        width: '70px',
                                    }}
                                    lottieStyles={{ width: '35px' }}
                                />
                            ) : (
                                <Button
                                    variant="outlined"
                                    className="color-error"
                                    onClick={(e) => rejectListing(e, item?.sale)}
                                >
                                    Cancel
                                </Button>
                            )}
                        </ButtonGroup>
                    )}
                </Box>
            )}

            {isAuction && (
                <Box paddingX={1} paddingY={2} textAlign="center">
                    {(!isStartedAuction || isEndedAuction) &&
                        (closeAuctionLoading?.[item?.auction?.guid] ? (
                            <LottieContainer
                                containerStyles={{
                                    height: '31px',
                                    width: '70px',
                                }}
                                lottieStyles={{ width: '35px' }}
                            />
                        ) : (
                            <Button
                                variant="outlined"
                                className="color-error"
                                onClick={(e) => closeAuction(e, item?.auction)}
                            >
                                Close out
                            </Button>
                        ))}
                </Box>
            )}

            {isBid && (
                <Box paddingX={1} paddingY={2} textAlign="center">
                    {offersAndBids.length > 1 ? (
                        <Button
                            variant="outlined"
                            color="primary"
                            size="large"
                            fullWidth
                            onClick={(e) => onViewBids(e, item?.guid)}
                        >
                            View All
                        </Button>
                    ) : (
                        <ButtonGroup>
                            <Button
                                className="color-black"
                                variant="outlined"
                                onClick={(e) => viewOffer(e, offersAndBids[0])}
                            >
                                {isOfferNode ? 'View Offer' : 'View Bid'}
                            </Button>
                            {cancelMyBidLoading ||
                            closeMyBidAuctionLoading?.[offersAndBids[0]?.auction?.guid] ? (
                                <LottieContainer
                                    containerStyles={{
                                        height: '31px',
                                        width: '70px',
                                    }}
                                    lottieStyles={{ width: '35px' }}
                                />
                            ) : (
                                <Button
                                    className={isOfferNode ? 'color-error' : 'color-green'}
                                    variant="outlined"
                                    onClick={(e) => clickOnBidBtn(e, offersAndBids[0])}
                                >
                                    {isOfferNode ? 'Cancel' : 'Claim'}
                                </Button>
                            )}
                        </ButtonGroup>
                    )}
                </Box>
            )}
        </Box>
    );
};

AssetCardButton.propTypes = {
    isOffer: PropTypes.bool,
    isListing: PropTypes.bool,
    isAuction: PropTypes.bool,
    isBid: PropTypes.bool,
    cancelLoading: PropTypes.bool,
    closeAuctionLoading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    isEndedAuction: PropTypes.bool,
    isStartedAuction: PropTypes.bool,
    item: PropTypes.object,
    closeMyBidAuctionLoading: PropTypes.object,
    haveAmount: PropTypes.object,
    onViewOffer: PropTypes.func,
    onCancelListing: PropTypes.func,
    onCloseAuction: PropTypes.func,
    onViewBids: PropTypes.func,
    closeOutbyBids: PropTypes.func,
    assetId: PropTypes.number,
    offers: PropTypes.array,
};

export default AssetCardButton;
