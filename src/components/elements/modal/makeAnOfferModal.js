import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
    Box,
    Button,
    Modal,
    Container,
    Typography,
    Link,
    FormControl,
    FormControlLabel,
    Checkbox,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import AssetImage from 'pages/asset/assetImage';
import ChangeWallet from 'components/elements/modal/changeWallet';
import WalletCard from 'components/shared/WalletCard';
import { useUnsavedChangesWarning } from 'hooks';
import { setNotification } from 'redux/profile/actions';
import { threeDecimals } from 'helpers/functions';
import { createContract } from 'transactions/smart-contract/escrow/offerByEscrow/createContract';
import { closeContract } from 'transactions/smart-contract/escrow/offerByEscrow/closeContract';
import { deleteOfferByEscrowContract } from 'redux/algorand/actions';
import { makeAnOfferValidation } from 'services/yup-schemas/makeAnOfferValidation';
import LottieContainer from 'components/shared/LottieContainer';
import OfferNotifyModal from 'components/elements/modal/offerNotify';
import InfoPopUp from 'pages/asset/makeAnOffer/infoPopUp';
import { OFFER_PLACED_INFO } from 'configs/offerPlaced';
import Field from 'components/shared/fields/Field';

import { useFormik, FormikProvider } from 'formik';
import { CREATOR, MAKE_AN_OFFER_CONFIG, NOTIFICATIONS } from 'configs';
import {
    getAlgorandAccountInfo,
    getOfferByEsscrowContract,
    activateOfferByEscrowContract,
    broadcastOffer,
} from 'redux/algorand/actions';
import { getCurrentAsset } from 'redux/singleAsset/actions';
import { useAlgoFont } from 'hooks/assets';
import { withWalletFallback } from 'hoc/withWalletFallback';
import PropTypes from 'prop-types';

const MakeAnOfferModal = ({
    currentAsset,
    isModalOpen,
    base_node,
    onCloseOfferModal,
    type = 'one',
    afterMakeAnOffer,
    walletFallback,
}) => {
    const { user } = useSelector((state) => state.auth);
    const { selectedWallet } = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const { assetId } = useParams();
    const [anchorEl, setAnchorEl] = useState(null);
    const [changeWallet, setChangeWallet] = useState(false);
    const [loading, setLoading] = useState(false);
    const [popUpInfo, setpopUpInfo] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [zestBloomPercent, setZestBloomPercent] = useState(0);
    const [openOfferPlacedModal, setOpenOfferPlacedModal] = useState(false);
    const [checked, setChecked] = React.useState(false);
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();
    const isMultipleAsset = currentAsset?.asset?.total > 1;
    const staticTag = currentAsset?.media_types?.find((tag) => tag.category === 'static');
    const customTag = currentAsset?.media_types?.find((tag) => tag.category === 'custom');
    const AlgoFont = useAlgoFont();

    const offerContract = useMemo(() => {
        if (type === 'broadcast') {
            const offer = isMultipleAsset
                ? currentAsset?.offers?.find(
                      (x) => !x.node_guid && user?.username && x.maker.username === user?.username,
                  )
                : currentAsset?.offers?.find(
                      (x) => user?.username && x.maker.username === user?.username,
                  );
            return offer;
        }
        const offer = base_node?.offers?.find((offer) => offer.maker?.username === user?.username);
        return offer;
    }, [currentAsset, base_node, type, user, isMultipleAsset]);

    const [accountInfo, setAccountInfo] = useState(null);

    const startMaking = () => {
        setLoading(true);
        setDirty();
    };

    const endMaking = () => {
        setLoading(false);
        setPristine();
    };

    const getWalletInformation = useCallback(() => {
        dispatch(getAlgorandAccountInfo(selectedWallet?.address))
            .then((response) => {
                setAccountInfo(response?.account);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [selectedWallet?.address, dispatch]);

    const getTotalAmount = useCallback(
        (offeredPrice) => {
            const zestBloomAmount = (offeredPrice * zestBloomPercent) / 100;
            if (!offeredPrice) {
                return setTotalAmount(0);
            }
            const total = +offeredPrice + zestBloomAmount + 1;
            const decimalsCount = total?.toString()?.split('.')[1]?.length > 6;
            if (decimalsCount) {
                return setTotalAmount(total.toFixed(6));
            }
            setTotalAmount(total);
        },
        [zestBloomPercent],
    );

    useEffect(() => {
        if (base_node) {
            if (base_node?.user_type === CREATOR || type === 'broadcast') {
                setZestBloomPercent(currentAsset?.fees?.primary);
            } else {
                setZestBloomPercent(currentAsset?.fees?.secondary);
            }
        }
    }, [currentAsset, base_node, type]);

    const onCloseModal = (event) => {
        event.stopPropagation();
        onCloseOfferModal(event);
    };

    const toActivateContract = async (guid, blob) => {
        const response = await dispatch(activateOfferByEscrowContract(guid, blob));
        if (!response) return;
        if (afterMakeAnOffer)
            dispatch(
                afterMakeAnOffer({
                    asset_guid: currentAsset?.guid,
                    old_offer_guid: offerContract?.guid,
                    new_offer: response,
                }),
            );
    };

    const getAccountInfo = (account) => {
        return dispatch(getAlgorandAccountInfo(account));
    };
    const giveNotification = (message) => {
        dispatch(setNotification(message));
        endMaking();
    };

    const onOpenOfferPlacedModal = () => {
        setOpenOfferPlacedModal(true);
    };

    const onCloseOfferPlacedModal = (e) => {
        setOpenOfferPlacedModal(false);
        if (type !== 'broadcast') dispatch(getCurrentAsset(assetId));
        onCloseOfferModal(e);
    };

    const deleteContract = async (guid) => {
        return await dispatch(deleteOfferByEscrowContract(guid));
    };

    const sendOffer = async (values) => {
        try {
            if (!selectedWallet) {
                return giveNotification(NOTIFICATIONS.info.connectWallet);
            }
            startMaking();

            const checkMinimum = checkMinimumPrice(values.price, base_node?.min_offer_price);
            if (checkMinimum) {
                return giveNotification({ status: 'warning', message: checkMinimum });
            }

            const addressAmount = checkAmount(accountInfo, totalAmount);
            if (!addressAmount) {
                return giveNotification(NOTIFICATIONS.warning.balanceLow);
            }
            if (offerContract) {
                await closeContract(offerContract, deleteContract);
                console.log('Cancel old contract');
            }
            const data = {
                entity: currentAsset?.guid,
                offer_maker: selectedWallet?.address,
                offer_amount: values?.price,
                is_private: values?.is_private,
                requested_qty: 1,
                node: base_node?.guid,
            };

            let response = null;
            if (type === 'broadcast') {
                delete data.node;
                response = await dispatch(broadcastOffer(data));
            } else {
                response = await dispatch(getOfferByEsscrowContract(data));
            }

            if (response?.status !== 201) {
                const errorObj = response?.data;
                if (typeof errorObj === 'object') {
                    for (let key in errorObj) {
                        giveNotification({ status: 'error', message: errorObj[key] });
                    }
                    return;
                }
                endMaking();
                return giveNotification(NOTIFICATIONS.error.notFoundContract);
            }

            const contract = response?.data;
            let val = await createContract(
                contract,
                toActivateContract,
                giveNotification,
                getAccountInfo,
                walletFallback,
            );
            setPristine();
            if (val) {
                onOpenOfferPlacedModal();
            }
        } catch (err) {
            console.log(err.message);
            endMaking();
        }
    };

    const onOpenChangeWallet = () => {
        setChangeWallet(true);
    };
    const onCloseChangeWallet = () => {
        setChangeWallet(false);
    };

    const handlePopoverOpen = (event, info) => {
        setAnchorEl(event.currentTarget);
        setpopUpInfo(info);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const changePrice = (e) => {
        const value = e.target.value;
        const lessThreeDecimal = threeDecimals(value);
        if (lessThreeDecimal) {
            formik.setFieldValue('price', value);
            getTotalAmount(value);
        }
    };

    useEffect(() => {
        const address = selectedWallet?.address;
        if (address) {
            getWalletInformation();
            const getAccountInfoId = setInterval(getWalletInformation, 10000);
            return () => {
                clearInterval(getAccountInfoId);
            };
        }
    }, [selectedWallet?.address, getWalletInformation]);

    const formik = useFormik({
        initialValues: {
            price: (10).toFixed(3),
            is_private: false,
        },
        validationSchema: makeAnOfferValidation,
        onSubmit: (values) => {
            sendOffer(values);
        },
    });

    const handleChange = (event) => {
        setChecked(event.target.checked);
        formik.setFieldValue('is_private', event.target.checked);
    };

    const openPopover = Boolean(anchorEl);

    return (
        <Modal
            open={isModalOpen}
            onClose={onCloseModal}
            className="offer-modal dark-modal"
            BackdropProps={{
                className: 'offer-modal-backdrop',
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="offer-modal-body">
                <>
                    <Container maxWidth="md" className="asset-mini-content">
                        <Typography className="asset-mini-content-title">Make an Offer</Typography>
                        <Box display="flex" className="asset-mini-content-body">
                            <Box className="left">
                                <Box className="image">
                                    <AssetImage
                                        staticTag={staticTag}
                                        customTag={customTag}
                                        currentAsset={{ ...currentAsset }}
                                    />
                                </Box>
                                <Typography className="title-of-artwork">
                                    {currentAsset?.title}
                                </Typography>
                                {isMultipleAsset && (
                                    <Typography style={{ fontWeight: 'bold' }}>
                                        Editions: {currentAsset.asset.total}
                                    </Typography>
                                )}
                            </Box>
                            <Box className="right">
                                <Box display="flex" className="wallet" alignItems="center">
                                    <Box className="checked-wallet">
                                        <Box component="ul" display="flex">
                                            {selectedWallet && (
                                                <WalletCard
                                                    label={selectedWallet?.name}
                                                    key={selectedWallet?.address}
                                                    connected={true}
                                                    address={selectedWallet?.address}
                                                    infoFromMkOff={accountInfo}
                                                />
                                            )}
                                            <WalletCard label="Wallet Name" connected={false} />
                                        </Box>
                                    </Box>
                                    {selectedWallet && (
                                        <Link
                                            to="#"
                                            className="color-secondary hover-opacity change-wallet-button"
                                            onClick={onOpenChangeWallet}
                                        >
                                            Change Wallet
                                        </Link>
                                    )}
                                </Box>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    className="your-balance"
                                >
                                    <Box component="span" className="mini-title">
                                        Minimum Price
                                    </Box>
                                    <Box className="mini-data price-algo">
                                        <span>
                                            {base_node?.min_offer_price
                                                ? Number(base_node?.min_offer_price).toFixed(3)
                                                : '-'}
                                        </span>
                                        <img src={AlgoFont} alt="Algo" />
                                    </Box>
                                </Box>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    className="your-balance"
                                >
                                    <Box component="span" className="mini-title">
                                        Min. Required Balance
                                        <i
                                            className="icon-information-outline"
                                            aria-owns={
                                                openPopover ? 'mouse-over-popover' : undefined
                                            }
                                            aria-haspopup="true"
                                            onMouseEnter={(e) =>
                                                handlePopoverOpen(
                                                    e,
                                                    MAKE_AN_OFFER_CONFIG.minRequiredBalanceDescription,
                                                )
                                            }
                                            onMouseLeave={handlePopoverClose}
                                            style={{ marginLeft: 5 }}
                                        />
                                    </Box>
                                    <Box className="mini-data price-algo">
                                        <span>
                                            {accountInfo
                                                ? (accountInfo['min-balance'] / 1000000).toFixed(3)
                                                : '-'}
                                        </span>
                                        <img src={AlgoFont} alt="Algo" />
                                    </Box>
                                </Box>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    className="your-balance"
                                >
                                    <Box component="span" className="mini-title">
                                        Total balance
                                    </Box>
                                    <Box className="mini-data price-algo">
                                        <span>
                                            {accountInfo
                                                ? (accountInfo['amount'] / 1000000).toFixed(3)
                                                : '-'}
                                        </span>
                                        <img src={AlgoFont} alt="Algo" />
                                    </Box>
                                </Box>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    className="marketplace-fee"
                                >
                                    <Box component="span" className="mini-title">
                                        Marketplace Fee
                                        <i
                                            className="icon-information-outline"
                                            aria-owns={
                                                openPopover ? 'mouse-over-popover' : undefined
                                            }
                                            aria-haspopup="true"
                                            onMouseEnter={(e) =>
                                                handlePopoverOpen(
                                                    e,
                                                    MAKE_AN_OFFER_CONFIG.marketplaceFeeDescription(
                                                        zestBloomPercent,
                                                    ),
                                                )
                                            }
                                            onMouseLeave={handlePopoverClose}
                                            style={{ marginLeft: 5 }}
                                        />
                                    </Box>
                                    <Box component="span" className="mini-data">
                                        {zestBloomPercent}%
                                    </Box>
                                </Box>
                                <form onSubmit={formik.handleSubmit}>
                                    <FormikProvider value={formik}>
                                        <Box mb={2}>
                                            <FormControl>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={checked}
                                                            onChange={handleChange}
                                                            inputProps={{
                                                                'aria-label': 'controlled',
                                                            }}
                                                        />
                                                    }
                                                    label="Make Private Offer"
                                                />
                                            </FormControl>
                                        </Box>
                                        <Box mb={2} className="your-price">
                                            <Box className="price-field">
                                                <FormControl fullWidth variant="outlined">
                                                    <Field
                                                        field="input"
                                                        type="number"
                                                        label="Your Price"
                                                        name="price"
                                                        step="any"
                                                        {...formik.getFieldProps('price')}
                                                        onChange={changePrice}
                                                    />
                                                </FormControl>
                                                <Box className="price-field-algo">
                                                    <img src={AlgoFont} alt="Algo" />
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            className="total"
                                        >
                                            <Box className="total-title">
                                                Total
                                                <i
                                                    className="icon-information-outline"
                                                    aria-owns={
                                                        openPopover
                                                            ? 'mouse-over-popover'
                                                            : undefined
                                                    }
                                                    aria-haspopup="true"
                                                    onMouseEnter={(e) =>
                                                        handlePopoverOpen(
                                                            e,
                                                            MAKE_AN_OFFER_CONFIG.totalAmountDescription(
                                                                zestBloomPercent,
                                                            ),
                                                        )
                                                    }
                                                    onMouseLeave={handlePopoverClose}
                                                    style={{ marginLeft: 5 }}
                                                />
                                            </Box>
                                            <Box className="total-price price-algo">
                                                <span>{totalAmount}</span>
                                                <img src={AlgoFont} alt="Algo" />
                                            </Box>
                                        </Box>
                                        <Box
                                            className="asset-mini-content-buttons"
                                            display="flex"
                                            justifyContent="flex-end"
                                            alignItems="center"
                                        >
                                            <Button
                                                variant="text"
                                                className="cancel-btn no-hover"
                                                onClick={onCloseModal}
                                            >
                                                Cancel
                                            </Button>
                                            {loading ? (
                                                <LottieContainer
                                                    containerStyles={{
                                                        height: '50px',
                                                        width: '130px',
                                                    }}
                                                    lottieStyles={{ width: '50px' }}
                                                />
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    type="submit"
                                                >
                                                    Make an Offer
                                                </Button>
                                            )}
                                        </Box>
                                    </FormikProvider>
                                </form>
                            </Box>
                        </Box>
                    </Container>
                    {selectedWallet && (
                        <ChangeWallet
                            changeWallet={changeWallet}
                            onCloseChangeWallet={onCloseChangeWallet}
                        />
                    )}
                    <OfferNotifyModal
                        open={openOfferPlacedModal}
                        onConfirm={onCloseOfferPlacedModal}
                        info={OFFER_PLACED_INFO}
                        staticTag={staticTag}
                        currentAsset={currentAsset}
                    />
                    <InfoPopUp
                        openPopover={openPopover}
                        anchorEl={anchorEl}
                        handlePopoverClose={handlePopoverClose}
                        info={popUpInfo}
                    />
                    {Prompt}
                </>
            </Box>
        </Modal>
    );
};
MakeAnOfferModal.propTypes = {
    currentAsset: PropTypes.object,
    isModalOpen: PropTypes.bool,
    base_node: PropTypes.object,
    onCloseOfferModal: PropTypes.func,
    type: PropTypes.string,
    afterMakeAnOffer: PropTypes.func,
    walletFallback: PropTypes.string,
};
export default withWalletFallback(MakeAnOfferModal);

function checkAmount(accountInfo, total) {
    const fees = 2000;
    const balance = accountInfo['amount'];
    const minBalance = accountInfo['min-balance'];
    const neededBalance = fees + total * 1000000 + minBalance;
    const result = balance - neededBalance;
    return result >= 0;
}

function checkMinimumPrice(amount, minimum) {
    if (!!minimum && amount < minimum) {
        return 'The offer amount is not sufficient.';
    }
    return null;
}
