import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import AlgoFont from 'assets/img/algo-font.svg';
import AlgoFontWhite from 'assets/img/algo-font-white.svg';

import { useFormik, FormikProvider } from 'formik';

import ChangeWallet from '../../../components/elements/modal/changeWallet';
import Field from 'components/shared/fields/Field';
import FormControl from '@material-ui/core/FormControl';
import WalletCard from 'components/shared/WalletCard';
import AssetImage from '../assetImage';
import InfoPopUp from './infoPopUp';

import {
    Container,
    Box,
    Typography,
    Button,
    Link,
    FormControlLabel,
    Checkbox,
} from '@material-ui/core';

import { getCurrentAsset, emptyCurrentAsset } from 'redux/singleAsset/actions';
import {
    getAlgorandAccountInfo,
    getOfferByEsscrowContract,
    activateOfferByEscrowContract,
    broadcastOffer,
} from 'redux/algorand/actions';

import { createContract } from 'transactions/smart-contract/escrow/offerByEscrow/createContract';
import { makeAnOfferValidation } from 'services/yup-schemas/makeAnOfferValidation';

import LottieContainer from 'components/shared/LottieContainer';
import { CREATOR, MAKE_AN_OFFER_CONFIG, NOTIFICATIONS } from 'configs';

import { closeContract } from 'transactions/smart-contract/escrow/offerByEscrow/closeContract';
import { deleteOfferByEscrowContract } from 'redux/algorand/actions';
import { setNotification } from 'redux/profile/actions';
import { threeDecimals } from 'helpers/functions';
import { useUnsavedChangesWarning } from 'hooks';
import OfferNotifyModal from 'components/elements/modal/offerNotify';
import { OFFER_PLACED_INFO } from 'configs/offerPlaced';
import LoadingNotFound from 'components/shared/LoadingNotFound';
import { getHosts, isHaveAsset, checkIsHost } from 'helpers/checkQuantity';
import { withWalletFallback } from 'hoc/withWalletFallback';

import PropTypes from 'prop-types';

const MakeAnOffer = ({ walletFallback }) => {
    const dispatch = useDispatch();
    const { assetId } = useParams();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const [changeWallet, setChangeWallet] = useState(false);
    const { currentAsset, getAssetLoading } = useSelector((state) => state.singleAsset);
    const { selectedWallet } = useSelector((state) => state.profile);
    const [totalAmount, setTotalAmount] = useState(0);
    const [accountInfo, setAccountInfo] = useState(null);
    const [popUpInfo, setpopUpInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();
    const [openOfferPlacedModal, setOpenOfferPlacedModal] = useState(false);
    const [zestBloomPercent, setZestBloomPercent] = useState(0);
    const [checked, setChecked] = React.useState(false);
    const { search } = useLocation();

    const type = useMemo(() => {
        const query = new URLSearchParams(search);

        return query.get('type');
    }, [search]);

    const staticTag = currentAsset?.media_types?.find((tag) => tag.category === 'static');
    const customTag = currentAsset?.media_types?.find((tag) => tag.category === 'custom');

    const isMultipleAsset = currentAsset?.asset?.total > 1;

    const isHolder = useMemo(() => {
        const currentUserHaveAsset = currentAsset?.nodes?.find(
            (node) => user?.username && node?.owner?.username === user?.username,
        );
        return isHaveAsset(currentUserHaveAsset, currentAsset, false);
    }, [currentAsset, user]);

    const assetHost = useMemo(() => getHosts(currentAsset)?.[0], [currentAsset]);

    const offerContract = useMemo(() => {
        if (isMultipleAsset) {
            return currentAsset?.offers?.find((offer) => offer?.maker?.username === user?.username);
        }
        const globalOffers = currentAsset?.offers ?? [];
        const mineOffers = assetHost?.offers ?? [];

        const allOffers = [...globalOffers, ...mineOffers];
        return allOffers?.find((offer) => offer?.maker?.username === user?.username);
    }, [assetHost, isMultipleAsset, currentAsset, user]);

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
        if (assetHost) {
            if (assetHost?.user_type === CREATOR || type === 'broadcast') {
                setZestBloomPercent(currentAsset?.fees?.primary);
            } else {
                setZestBloomPercent(currentAsset?.fees?.secondary);
            }
        }
    }, [assetHost, currentAsset, type]);

    const unknownUserIsHolder = useMemo(() => {
        const hasNodeAsset = currentAsset?.nodes?.find((node) => {
            const isHost = checkIsHost(node, currentAsset);

            return (
                !!isHost &&
                node?.owner?.username !== 'unknown' &&
                user?.username &&
                node?.owner?.username !== user?.username
            );
        });

        return hasNodeAsset;
    }, [currentAsset, user]);

    const bestSale = currentAsset?.base_node?.sales?.find(
        (contract) => contract.type === 'SaleByEscrow',
    );

    const onOpenOfferPlacedModal = () => {
        setOpenOfferPlacedModal(true);
    };

    const onCloseOfferPlacedModal = () => {
        setOpenOfferPlacedModal(false);
        history.push(`/asset/${assetId}`);
    };

    const cantOffer = () =>
        Object.keys(currentAsset).length === 0 || isHolder || bestSale || !unknownUserIsHolder;

    const canBroadcast = () => type === 'broadcast';

    useEffect(() => {
        getTotalAmount(10);
    }, [getTotalAmount]);

    useEffect(() => {
        if (assetId) {
            dispatch(getCurrentAsset(assetId));
        }
        return () => {
            dispatch(emptyCurrentAsset());
        };
    }, [assetId, dispatch]);

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

    if (cantOffer() && !canBroadcast()) return <LoadingNotFound loading={getAssetLoading} />;

    const toActivateContract = async (guid, blob) => {
        return await dispatch(activateOfferByEscrowContract(guid, blob));
    };

    const getAccountInfo = (account) => {
        return dispatch(getAlgorandAccountInfo(account));
    };
    const giveNotification = (message) => {
        dispatch(setNotification(message));
        endMaking();
    };

    const deleteContract = async (guid) => {
        return await dispatch(deleteOfferByEscrowContract(guid));
    };

    const handleChange = (event) => {
        setChecked(event.target.checked);
        formik.setFieldValue('is_private', event.target.checked);
    };

    const sendOffer = async (values) => {
        try {
            if (!selectedWallet) {
                return giveNotification(NOTIFICATIONS.info.connectWallet);
            }
            startMaking();

            const checkMinimum = checkMinimumPrice(values.price, assetHost?.min_offer_price);
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
                node: assetHost?.guid,
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

    const goBack = () => {
        history.push(`/asset/${assetId}`);
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

    const AlgoFontComp = (
        <>
            <img className="desktop-only" src={AlgoFont} alt="Algo" />
            <img className="mobile-only" src={AlgoFontWhite} alt="Algo" />
        </>
    );

    const openPopover = Boolean(anchorEl);
    return (
        <>
            <Container maxWidth="md" className="asset-mini-content">
                {isMultipleAsset && type === 'broadcast' ? (
                    <Typography className="asset-mini-content-title">Broadcast an Offer</Typography>
                ) : (
                    <Typography className="asset-mini-content-title">Make an Offer</Typography>
                )}
                <Box display="flex" className="asset-mini-content-body">
                    <Box className="left">
                        <Box className="image">
                            <AssetImage
                                staticTag={staticTag}
                                customTag={customTag}
                                currentAsset={currentAsset}
                            />
                        </Box>
                        <Typography className="title-of-artwork">{currentAsset?.title}</Typography>
                        <Typography style={{ fontWeight: 'bold' }}>
                            Editions: {currentAsset?.asset?.total}
                        </Typography>
                    </Box>
                    <Box className="right">
                        <Box
                            display={{ xs: 'block', sm: 'flex' }}
                            className="wallet"
                            alignItems="center"
                        >
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
                                    {assetHost?.min_offer_price
                                        ? Number(assetHost?.min_offer_price).toFixed(3)
                                        : '-'}
                                </span>
                                {AlgoFontComp}
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
                                    aria-owns={openPopover ? 'mouse-over-popover' : undefined}
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
                                        ? accountInfo.assets
                                            ? (accountInfo.assets.length * 0.1 + 0.1).toFixed(3)
                                            : '0.1'
                                        : '0.1'}
                                </span>
                                {AlgoFontComp}
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
                                {AlgoFontComp}
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
                                    aria-owns={openPopover ? 'mouse-over-popover' : undefined}
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
                                                    inputProps={{ 'aria-label': 'controlled' }}
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
                                        <Box className="price-field-algo">{AlgoFontComp}</Box>
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
                                                openPopover ? 'mouse-over-popover' : undefined
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
                                        {AlgoFontComp}
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
                                        onClick={goBack}
                                    >
                                        Cancel
                                    </Button>
                                    {loading ? (
                                        <LottieContainer
                                            containerStyles={{
                                                height: '50px',
                                                width: '153px',
                                            }}
                                            lottieStyles={{ width: '50px' }}
                                        />
                                    ) : (
                                        <Button variant="contained" color="primary" type="submit">
                                            {isMultipleAsset && type === 'broadcast'
                                                ? 'Broadcast offer'
                                                : 'Make an offer'}
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
    );
};

MakeAnOffer.propTypes = {
    walletFallback: PropTypes.string,
};

export default withWalletFallback(MakeAnOffer);

function checkAmount(accountInfo, total) {
    const fees = 2000;
    const balance = accountInfo['amount'];
    //const minBalance = accountInfo['min-balance'];
    const minBalance = accountInfo.assets ? accountInfo.assets.length * 0.1 + 0.1 : 0.1;
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
