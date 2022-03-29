import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { FormikProvider, useFormik } from 'formik';
import Field from 'components/shared/fields/Field';
import Popover from '@material-ui/core/Popover';

import AlgoFont from 'assets/img/algo-font.svg';
import DropdownSaleType from 'components/shared/dropdown/dropdown-saleType';
import { threeDecimals } from 'helpers/functions';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from 'redux/profile/actions';
import { updateAsset } from 'redux/singleAsset/actions';
import { createEscrowContract } from 'transactions/smart-contract/escrow/saleByEscrow/createContract';
import { getAlgorandAccountInfo, setContract } from 'redux/algorand/actions';
import { useHistory } from 'react-router';
import LottieContainer from 'components/shared/LottieContainer';
import {
    assetCreateValidationStep4,
    assetCreateValidationStep4Offer,
} from 'services/yup-schemas/createAssetStep4';
import { useUnsavedChangesWarning } from 'hooks';
import { getNetAmount } from 'helpers/functions';
import { EDIT_PAGE_CONFIG, NOTIFICATIONS } from 'configs';
import { withWalletFallback } from 'hoc/withWalletFallback';
import PropTypes from 'prop-types';

const UploadAssetStep4 = ({ classes, createdAsset, handleNext, walletFallback }) => {
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const [loaderValue, setLoaderValue] = useState(false);
    const [popUpInfo, setpopUpInfo] = useState(null);
    const { selectedWallet } = useSelector((state) => state.profile);
    const { user } = useSelector((state) => state.auth);
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();
    const [netAmount, setNetAmount] = useState(0);
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            price: (10).toFixed(3),
            contractType: 'list-price-escrow',
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {
            onSubmitBtn(values);
        },
    });

    function validationSchema() {
        return formik?.values?.contractType === 'list-price-escrow'
            ? assetCreateValidationStep4
            : assetCreateValidationStep4Offer;
    }

    const getTotalAmount = useCallback(
        (price) => {
            const netValue = getNetAmount(true, price, createdAsset?.fees?.primary, 0);

            const decimalsCount = netValue?.toString()?.split('.')[1]?.length > 6;

            if (decimalsCount) {
                return setNetAmount(netValue.toFixed(6));
            }
            setNetAmount(netValue);
        },
        [createdAsset?.fees?.primary],
    );

    useEffect(() => {
        getTotalAmount(10);
    }, [getTotalAmount]);

    const endProcess = () => {
        setPristine();
        setLoaderValue(false);
    };

    const startProcess = () => {
        setDirty();
        setLoaderValue(true);
    };

    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };

    const getAccountInfo = (account) => {
        return dispatch(getAlgorandAccountInfo(account));
    };
    const sendCreatedContract = async (guid, blob) => {
        return dispatch(setContract(guid, blob));
    };

    const finishCreating = () => {
        endProcess();
        history.push(`/profile/${user?.username}`);
    };

    const createContract = async (contract) => {
        try {
            if (!contract) {
                return giveNotification({
                    status: NOTIFICATIONS.error.dontFoundTeal.status,
                    message: contract?.data?.error || NOTIFICATIONS.error.dontFoundTeal.message,
                });
            }
            const response = await createEscrowContract(
                selectedWallet?.address,
                contract,
                createdAsset?.asset?.asset_id,
                getAccountInfo,
                sendCreatedContract,
                walletFallback,
            );
            if (response.status === 'success') {
                giveNotification(NOTIFICATIONS.success.createContract);
                return finishCreating();
            }
            endProcess();
            return giveNotification({ status: 'error', message: response.message });
        } catch (err) {
            endProcess();
            return giveNotification({ status: 'error', message: err?.message });
        }
    };

    function onSubmitBtn(values) {
        switch (values.contractType) {
            case 'list-price-escrow':
                return addContract(values);
            case 'list-for-offer':
                return addMinOffer(values);
            case 'auction-escrow':
                return handleNext();
            default:
                return null;
        }
    }

    function addMinOffer(values) {
        startProcess();
        const data = {
            min_offer_price: Number(values.price),
        };
        const node = createdAsset?.nodes[0];
        dispatch(updateAsset(node?.guid, data)).then((response) => {
            if (response?.status === 200) {
                giveNotification(NOTIFICATIONS.success.minimumPriceAdded);
                endProcess();
                history.push(`/profile/${user?.username}`);
            }
        });
    }

    function addContract(values) {
        const data = {
            price_is_visible: true,
            price: Number(values?.price),
        };

        if (!selectedWallet) {
            return giveNotification(NOTIFICATIONS.info.connectWallet);
        }

        const node = createdAsset?.nodes[0];
        if (node?.holder !== selectedWallet?.address) {
            return giveNotification({
                ...NOTIFICATIONS.warning.walletdoesntMatch,
                message:
                    NOTIFICATIONS.warning.walletdoesntMatch.message +
                    ' : ' +
                    node?.holder.slice(0, 6) +
                    '...',
            });
        }
        startProcess();
        dispatch(updateAsset(node?.guid, data)).then((response) => {
            if (response?.status === 200) {
                createContract(response?.data?.contract);
            } else {
                endProcess();
                giveNotification(NOTIFICATIONS.error.update);
            }
        });
    }

    const setContractType = (value) => {
        formik.setFieldValue('contractType', value);
    };

    const skipSaleCreation = () => {
        history.push(`/profile/${user?.username}`);
    };
    const openPopover = Boolean(anchorEl);

    const changePrice = (e) => {
        const value = e.target.value;
        const lessThreeDecimal = threeDecimals(value);
        if (lessThreeDecimal) {
            formik.setFieldValue('price', value);
            getTotalAmount(value);
        }
    };

    const handlePopoverOpen = (event, info) => {
        setAnchorEl(event.currentTarget);
        setpopUpInfo(info);
    };

    const currentType = useMemo(() => {
        switch (formik.values.contractType) {
            case 'list-price-escrow':
                return {
                    disablePrice: false,
                    label: 'Price',
                };
            case 'list-for-offer':
                return {
                    disablePrice: false,
                    label: 'Minimum Price',
                };
            default:
                return {
                    disablePrice: true,
                    label: 'Price',
                };
        }
    }, [formik.values.contractType]);

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <FormikProvider value={formik}>
                    <Typography className={classes.instructions} component="span">
                        <Box className="asset-step-four">
                            <Box style={{ marginBottom: '30px' }}>
                                <Typography className="asset-item-title">
                                    Select Sale Type
                                </Typography>
                                <DropdownSaleType
                                    contractType={formik.values.contractType}
                                    setContractType={setContractType}
                                />
                            </Box>
                            {formik.values.contractType !== 'auction-escrow' && (
                                <>
                                    <Box className="price-field">
                                        <Field
                                            field="input"
                                            type="number"
                                            label={currentType.label}
                                            name="price"
                                            disabled={currentType.disablePrice}
                                            {...formik.getFieldProps('price')}
                                            onChange={changePrice}
                                        />
                                        <Box className="price-field-algo">
                                            <img src={AlgoFont} alt="Algo" />
                                        </Box>
                                    </Box>
                                    {formik.values.contractType === 'list-price-escrow' && (
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            className="total"
                                        >
                                            <Box className="total-title">
                                                Net amount you will receive
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
                                                            EDIT_PAGE_CONFIG.netAmount(
                                                                createdAsset?.fees?.primary,
                                                            ),
                                                        )
                                                    }
                                                    onMouseLeave={handlePopoverClose}
                                                    style={{ marginLeft: 5 }}
                                                />
                                            </Box>
                                            <Box className="total-price price-algo">
                                                <span>{netAmount}</span>
                                                <img src={AlgoFont} alt="Algo" />
                                            </Box>
                                        </Box>
                                    )}
                                </>
                            )}
                        </Box>
                    </Typography>
                    <Box display="flex" justifyContent="center" mt={5}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="large"
                            type="button"
                            onClick={skipSaleCreation}
                            className={classes.backButton}
                            disabled={loaderValue}
                        >
                            Skip
                        </Button>
                        {loaderValue ? (
                            <LottieContainer
                                containerStyles={{
                                    height: '46px',
                                    width: '154px',
                                }}
                                lottieStyles={{ width: '46px' }}
                            />
                        ) : (
                            <Button variant="contained" color="primary" size="large" type="submit">
                                Next
                            </Button>
                        )}
                    </Box>
                </FormikProvider>
            </form>
            <Popover
                className={`${classes.popover} info-popover`}
                classes={{
                    paper: classes.paper,
                }}
                open={openPopover}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={setAnchorEl}
                disableRestoreFocus
            >
                <Typography>{popUpInfo}</Typography>
            </Popover>
            {Prompt}
        </>
    );
};

UploadAssetStep4.propTypes = {
    handleNext: PropTypes.func,
    classes: PropTypes.object,
    createdAsset: PropTypes.string,
    walletFallback: PropTypes.string,
};

export default withWalletFallback(UploadAssetStep4);
