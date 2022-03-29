import React, { useState, useContext } from 'react';
import { Button, Box, Dialog, Avatar, ListItem, Grid, Divider } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { collectAssetOfferByEscrow } from 'redux/collectedAssets/actions';
import { primarySale } from 'transactions/smart-contract/escrow/offerByEscrow/primarySale';
import { secondarySale } from 'transactions/smart-contract/escrow/offerByEscrow/secondarySale';

import LottieContainer from 'components/shared/LottieContainer';
import { Link } from 'react-router-dom';
import AlgoFont from 'assets/img/algo-font.svg';
import { deleteOfferByEscrowContract } from 'redux/algorand/actions';
import { deleteOfferFromAsset } from 'redux/singleAsset/actions';
import { setNotification } from 'redux/profile/actions';
import { useUnsavedChangesWarning } from 'hooks';
import { closeContract } from 'transactions/smart-contract/escrow/offerByEscrow/closeContract';
import { NOTIFICATIONS, PRIVATE_OWNER, PRIVATE } from 'configs';
import { getAssetInfo } from 'transactions/algorand/validations';
import { AssetsFromWallet } from 'pages/profile';
import { removeOffer } from 'redux/contracts/actions';
import PropTypes from 'prop-types';

export const Offer = ({
    contract,
    nodeGuid,
    acceptOne,
    setAcceptOne,
    setDirty,
    setPristine,
    inTableMode = false,
    number,
    selectedItem,
}) => {
    const dispatch = useDispatch();
    const { selectedWallet } = useSelector((state) => state.profile);
    const [loading, setLoading] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);

    const assetId = selectedItem?.asset?.asset_id;
    const assetsInWallet = useContext(AssetsFromWallet);
    const haveAmount = assetsInWallet?.find((asset) => asset['asset-id'] === assetId);

    const deleteContract = async (guid) => {
        return await dispatch(deleteOfferByEscrowContract(guid)).then((res) => {
            setLoading(false);
            setLoadingReject(false);
            endReject();
            dispatch(deleteOfferFromAsset(guid));
        });
    };

    const startAction = () => {
        setAcceptOne(true);
        setDirty();
    };

    const endAction = () => {
        setAcceptOne(false);
        setPristine();
    };
    const endSale = () => {
        setLoading(false);
        endAction();
    };
    const startSale = () => {
        setLoading(true);
        startAction();
    };

    const startReject = () => {
        setLoadingReject(true);
        startAction();
    };

    const endReject = () => {
        setLoadingReject(false);
        endAction();
    };

    const sendCollectedAsset = async (data, holderGuid, assetAmount) => {
        dispatch(collectAssetOfferByEscrow(holderGuid, data))
            .then((response) => {
                endSale();
                if (response?.status === 201) {
                    giveNotification(NOTIFICATIONS.success.offerComplated);
                    return dispatch(removeOffer(selectedItem?.guid, data?.contract, assetAmount));
                }
                giveNotification(NOTIFICATIONS.error.offerDontComplate);
            })
            .catch((err) => {
                giveNotification({ status: 'error', message: err?.message });
                endSale();
            });
    };

    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };
    const acceptContract = async (contract) => {
        try {
            let holder;
            const offer_guid = contract?.guid;
            const getHolderNode = selectedItem?.nodes?.find((node) =>
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
                holder = selectedItem.nodes?.find(
                    (node) =>
                        node?.holder === selectedWallet?.address &&
                        assetInfo?.balances?.find(
                            (wallet) => wallet?.address === node?.holder && wallet.amount > 0,
                        ),
                );
            }
            if (!holder) return giveNotification(NOTIFICATIONS.warning.walletdoesntMatch);
            if (!selectedWallet) {
                return giveNotification(NOTIFICATIONS.info.connectWallet);
            }
            startSale();
            if (selectedWallet?.address === contract?.teal_context?.asset_creator) {
                const response = await primarySale(
                    contract,
                    sendCollectedAsset,
                    endSale,
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
                    endSale,
                    giveNotification,
                    holder,
                );
                if (response?.status === 400) {
                    return giveNotification({ status: 'error', message: response?.message });
                }
            }
        } catch (err) {
            endSale();
            console.log(err);
        }
    };

    const rejectOffer = async (contract) => {
        startReject();
        await closeContract(contract, deleteContract);
        giveNotification(NOTIFICATIONS.success.offerRejected);
    };

    let { maker, teal_context } = contract;
    maker = maker ?? PRIVATE_OWNER;
    if (inTableMode) {
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
                                            className={`${
                                                maker?.username === PRIVATE
                                                    ? 'private_user_icon'
                                                    : ''
                                            }`}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Box
                                        fontWeight="bold"
                                        fontFamily="h1.fontFamily"
                                        className="link primary offer-list-item-username"
                                        component={Link}
                                        to={
                                            maker?.username === PRIVATE
                                                ? '#'
                                                : `/profile/${maker?.username}`
                                        }
                                        pl={2}
                                    >
                                        @{maker?.username}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Box className="title offer-price">
                                <Box component="span" display="inline-block" ml={0.5}>
                                    <Box fontSize={20} fontWeight="bold" className="price-algo">
                                        <img src={AlgoFont} alt="Algo" />
                                        <span>
                                            {Number(teal_context?.offer_amount / 1000000).toFixed(
                                                3,
                                            )}
                                        </span>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item>
                            <Box className="accept-btn-wrapper">
                                {loading ? (
                                    <LottieContainer
                                        containerStyles={{
                                            height: '42px',
                                            width: '116px',
                                            marginBottom: '12px',
                                        }}
                                        lottieStyles={{ width: '42px' }}
                                    />
                                ) : (
                                    <Button
                                        className="accept-btn"
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => acceptContract(contract)}
                                        disabled={acceptOne || loadingReject}
                                    >
                                        Accept
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </ListItem>
                <Divider />
            </>
        );
    }

    return (
        <Box component="li">
            <Box className="image">
                <Avatar
                    alt={maker?.username}
                    src={!!maker?.avatar ? maker?.avatar : './'}
                    style={{ display: 'flex' }}
                    className={`${maker?.username === PRIVATE ? 'private_user_icon' : ''}`}
                />
            </Box>
            <Box className="info">
                <Box className="title">
                    <Box
                        fontWeight="bold"
                        fontFamily="h1.fontFamily"
                        className="link primary"
                        component={Link}
                        to={maker?.username === PRIVATE ? '#' : `/profile/${maker?.username}`}
                    >
                        @{maker?.username}
                    </Box>
                    &nbsp; made an offer for your artwork
                    <Box component="span" display="inline-block" ml={0.5}>
                        <Box fontSize={20} fontWeight="bold" className="price-algo">
                            <span>
                                {Number(contract?.teal_context?.offer_amount / 1000000).toFixed(3)}
                            </span>
                            <img src={AlgoFont} alt="Algo" />
                        </Box>
                    </Box>
                </Box>
                <Box className="offerBtns">
                    {loading ? (
                        <LottieContainer
                            containerStyles={{
                                height: '42px',
                                width: '116px',
                                marginBottom: '12px',
                            }}
                            lottieStyles={{ width: '42px' }}
                        />
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            className="accept-btn"
                            onClick={() => acceptContract(contract)}
                            disabled={acceptOne || loadingReject}
                        >
                            Accept
                        </Button>
                    )}
                    {loadingReject ? (
                        <LottieContainer
                            containerStyles={{
                                height: '42px',
                                width: '116px',
                                marginBottom: '12px',
                            }}
                            lottieStyles={{ width: '42px' }}
                        />
                    ) : (
                        <Button
                            variant="outlined"
                            color="secondary"
                            className="reject-btn"
                            onClick={() => rejectOffer(contract)}
                            disabled={acceptOne || loading}
                        >
                            Reject
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

const MakeAnOfferModal = ({ openModal, onCloseModal, offersForMe, nodeGuid }) => {
    const [acceptOne, setAcceptOne] = useState(false);
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();
    return (
        <>
            <Dialog open={openModal} onClose={onCloseModal} scroll="body">
                <Box className="modal-body">
                    <Box style={{ padding: '20px' }}>
                        <Box component="ul" className="user-notifications-list">
                            {offersForMe?.map((contract) => (
                                <Offer
                                    contract={contract}
                                    key={contract?.guid}
                                    nodeGuid={nodeGuid}
                                    setAcceptOne={setAcceptOne}
                                    acceptOne={acceptOne}
                                    setDirty={setDirty}
                                    setPristine={setPristine}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Dialog>
            {Prompt}
        </>
    );
};

Offer.propTypes = {
    contract: PropTypes.object,
    nodeGuid: PropTypes.string,
    acceptOne: PropTypes.bool,
    setAcceptOne: PropTypes.func,
    setDirty: PropTypes.func,
    setPristine: PropTypes.func,
    inTableMode: PropTypes.bool,
    number: PropTypes.number,
    selectedItem: PropTypes.object,
};
MakeAnOfferModal.propTypes = {
    openModal: PropTypes.bool,
    onCloseModal: PropTypes.func,
    offersForMe: PropTypes.array,
    nodeGuid: PropTypes.string,
};

export default MakeAnOfferModal;
