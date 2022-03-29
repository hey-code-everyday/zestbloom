import React, { useState } from 'react';
import { Button, Box, Avatar, ListItem, Grid, Divider } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import LottieContainer from 'components/shared/LottieContainer';
import { Link } from 'react-router-dom';
import AlgoFont from 'assets/img/algo-font.svg';
import { deleteOfferByEscrowContract } from 'redux/algorand/actions';
import { setNotification } from 'redux/profile/actions';
import { closeContract } from 'transactions/smart-contract/escrow/offerByEscrow/closeContract';
import { NOTIFICATIONS } from 'configs';
import { algorandBaseUrl } from 'transactions/algorand/index';
import { stopEvent } from 'helpers/functions';
import { removeBid } from 'redux/contracts/actions';
import { showUserName } from 'helpers/functions';

export const Bids = ({
    contract,
    number,
    selectedItem,
    closeOutbyBids,
    closeMyBidAuctionLoading,
}) => {
    const dispatch = useDispatch();
    const [cancelMyBidLoading, setCancelMyBidLoading] = useState(false);

    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };

    const deleteBid = async (guid) =>
        dispatch(deleteOfferByEscrowContract(guid)).then((res) => {
            dispatch(removeBid({ asset_guid: selectedItem?.guid, offer_guid: contract?.guid }));
        });

    const clickOnBidBtn = (e, contract) => {
        stopEvent(e);
        if (isOffer) return rejectBid(contract);
        return closeOutbyBids(selectedItem, contract);
    };

    const rejectBid = async (e) => {
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

    const { maker, teal_context } = contract;

    const isOffer = contract?.type === 'OfferByEscrow';

    return (
        <>
            <ListItem className="offer-list-item">
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Box className="offer-list-item-number">{number + 1}.</Box>
                    </Grid>
                    <Grid item className="profile-info-wrapper">
                        <Grid container alignItems="center">
                            <Grid item>
                                <Box className="image">
                                    <Avatar
                                        alt={maker?.username}
                                        src={!!maker?.avatar ? maker?.avatar : './'}
                                    />
                                </Box>
                            </Grid>
                            <Grid item>
                                <Box
                                    fontWeight="bold"
                                    fontFamily="h1.fontFamily"
                                    className="link primary offer-list-item-username"
                                    component={Link}
                                    to={`/profile/${maker?.username}`}
                                    pl={2}
                                    title={maker?.username}
                                >
                                    @{showUserName(maker?.username, 4)}
                                    {/* @{maker?.username} */}
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item>
                        <Box className="title offer-price">
                            <Box component="span" display="inline-block" ml={0.5}>
                                <Box
                                    fontSize={20}
                                    fontWeight="bold"
                                    className="price-algo"
                                    style={{ padding: '20px' }}
                                >
                                    <img src={AlgoFont} alt="Algo" />
                                    <span>
                                        {isOffer
                                            ? Number(teal_context?.offer_amount / 1000000).toFixed(
                                                  3,
                                              )
                                            : Number(contract?.bid_amount).toFixed(3)}
                                    </span>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item>
                        <Box className="accept-btn-wrapper">
                            <Box style={{ padding: '20px' }} className="button-group">
                                <a
                                    href={`${algorandBaseUrl}/address/${contract?.compiled_teal_address}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <Button className="color-black" variant="outlined">
                                        {isOffer ? 'View Offer' : 'View Bid'}
                                    </Button>
                                </a>
                                {cancelMyBidLoading ||
                                closeMyBidAuctionLoading?.[contract?.auction?.guid] ? (
                                    <LottieContainer
                                        containerStyles={{
                                            height: '31px',
                                            width: '148px',
                                        }}
                                        lottieStyles={{ width: '31px' }}
                                    />
                                ) : (
                                    <Button
                                        className={isOffer ? 'color-error' : 'color-green'}
                                        variant="outlined"
                                        onClick={(e) => clickOnBidBtn(e, contract)}
                                    >
                                        {isOffer ? 'Cancel' : 'Claim'}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </ListItem>
            <Divider />
        </>
    );
};
