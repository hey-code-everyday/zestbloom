import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Button, Box, Typography, Dialog } from '@material-ui/core';
import PeopleMinCard from '../../elements/cards/peopleMinCard';
import { Tag } from '../../shared';
import ShowMoreText from '../../shared/ShowMoreText';
import { Timer } from '@material-ui/icons';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import AlgoFont from '../../../assets/img/algo-font.svg';
import AssetImage from 'pages/asset/assetImage';
import { useDispatch, useSelector } from 'react-redux';
import { getTimeLeft } from 'helpers/intervalYears';
import { useFormik, FormikProvider } from 'formik';
import Field from 'components/shared/fields/Field';
import { threeDecimals } from 'helpers/functions';
import { getAlgorandAccountInfo } from 'redux/algorand/actions';
import { setNotification } from 'redux/profile/actions';
import { placeABidAction, appCall } from 'redux/auction/actions';
import { NOTIFICATIONS } from 'configs';
import { placeABid } from 'transactions/smart-contract/escrow/auctionByEscrow/placeABid';
import { useUnsavedChangesWarning } from 'hooks';
import LottieContainer from 'components/shared/LottieContainer';
import { placeBidValidation } from 'services/yup-schemas/placeABid';
import { dangerTime } from 'helpers/functions';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },
}));

const BidModal = ({
    bidModal,
    onCloseBidModal,
    onOpenSubmittedBid,
    selectedAsset,
    title,
    description,
    assetId,
    owner,
    updateAsset,
    asset_guid,
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [date, setDate] = useState('');
    const [accountInfo, setAccountInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const { selectedWallet } = useSelector((state) => state.profile);
    const { user } = useSelector((state) => state.auth);
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();
    const [totalAmount, setTotalAmount] = useState(0);

    const {
        start_time,
        end_time,
        last_bid,
        min_bid_increment,
        commission_percent,
        reserve_price,
        guid: auction_guid,
    } = selectedAsset || {};
    const minBid = useMemo(
        () => (last_bid?.bid_amount ? last_bid?.bid_amount + min_bid_increment : reserve_price),
        [last_bid?.bid_amount, min_bid_increment, reserve_price],
    );

    const formik = useFormik({
        initialValues: {
            min_bid: minBid || 0,
            price: minBid.toFixed(3) || (0).toFixed(3),
        },
        enableReinitialize: true,
        validationSchema: placeBidValidation,
        onSubmit: (values) => {
            createBid(values);
        },
    });
    const getTotalAmount = useCallback(
        (price) => {
            const zestBloomAmount = (price * commission_percent) / 100;
            if (!price) {
                return setTotalAmount(0);
            }
            const total = +price + zestBloomAmount;
            const decimalsCount = total?.toString()?.split('.')[1]?.length > 6;
            if (decimalsCount) {
                return setTotalAmount(total.toFixed(6));
            }
            setTotalAmount(total);
        },
        [commission_percent],
    );

    useEffect(() => {
        getTotalAmount(minBid ?? 0);
    }, [minBid, getTotalAmount]);

    const openPopover = Boolean(anchorEl);

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

    const getTimeSince = useCallback(() => {
        const time = getTimeLeft(start_time, end_time);
        setDate(time);
        return time;
    }, [start_time, end_time]);

    useEffect(() => {
        getTimeSince();
        const timerId = setInterval(() => {
            const time = getTimeSince();
            if (time.includes('years') || time === 'Ended') {
                return clearInterval(timerId);
            }
        }, 60000);
        return () => {
            clearInterval(timerId);
        };
    }, [getTimeSince]);

    // marjetplace Fee Popover
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };

    const changePrice = (e) => {
        const value = e.target.value;
        const lessThreeDecimal = threeDecimals(value);
        if (lessThreeDecimal) {
            formik.setFieldValue('price', value);
            getTotalAmount(value);
        }
    };

    const startBid = () => {
        setLoading(true);
        setDirty();
    };
    const finishBid = () => {
        setLoading(false);
        setPristine();
    };

    const throwError = () => {
        giveNotification(NOTIFICATIONS.error.wentWrong);
        finishBid();
    };

    const sendValues = async (data) => dispatch(placeABidAction(auction_guid, data));

    const callApplication = async (data, guid) =>
        dispatch(appCall(auction_guid, data, guid, asset_guid, updateAsset));

    const createBid = async (values) => {
        if (user?.username && last_bid?.maker?.username === user?.username)
            return giveNotification(NOTIFICATIONS.info.lastBidMine);
        if (!selectedWallet) {
            return giveNotification(NOTIFICATIONS.info.connectWallet);
        }
        startBid();
        const args = {
            sendValues,
            totalAmount,
            buyerAddress: selectedWallet?.address,
            callApplication,
            throwError,
            giveNotification,
            finishBid,
            onOpenSubmittedBid,
            assetId,
        };

        placeABid(args);
    };
    const onClose = () => {
        if (!loading) onCloseBidModal();
    };

    return (
        <>
            <Dialog
                open={bidModal}
                className="bid-modal"
                onClose={onClose}
                scroll="body"
                maxWidth="md"
            >
                <Box className="modal-body">
                    <Box className="left">
                        <Typography variant="h4">{title}</Typography>
                        {/*Only one image case*/}
                        <Box className="image">
                            <AssetImage currentAsset={selectedAsset} />
                        </Box>
                        {/*More then one image, Slider*/}
                        {/*<SlickSlider />*/}

                        <Box mt={2}>
                            <ShowMoreText text={description ?? ''} max={150} />
                        </Box>
                    </Box>
                    <Box className="right">
                        <Box className="time">
                            <Tag
                                text={date}
                                // className="brand-gold md"
                                className={`${dangerTime(date) ? 'brand-red' : 'brand-gold'} md `}
                                icon={<Timer style={{ fontSize: 16 }} />}
                            />
                        </Box>
                        <Box display="flex">
                            {last_bid?.bid_amount && (
                                <Box className="last-bid">
                                    <Box component="p">Last Bid</Box>
                                    <Box fontSize={20} fontWeight="bold" className="price-algo">
                                        <span>{last_bid?.bid_amount}</span>
                                        <img src={AlgoFont} alt="Algo" />
                                    </Box>
                                </Box>
                            )}
                            {last_bid?.maker && (
                                <Box>
                                    <PeopleMinCard
                                        tags={last_bid?.maker?.selected_tags}
                                        author={last_bid?.maker?.username}
                                        authorAvatar={last_bid?.maker?.avatar}
                                    />
                                </Box>
                            )}
                        </Box>
                        <Box className="bid-info" component="ul" mt={4} mb={2}>
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                component="li"
                            >
                                <Box component="span">Min bid</Box>
                                <Box fontSize={20} fontWeight="bold" className="price-algo">
                                    <Box component="b">{minBid}</Box>
                                    <img src={AlgoFont} alt="Algo" />
                                </Box>
                            </Box>
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                component="li"
                            >
                                <Box component="span">Your balance</Box>
                                <Box fontSize={20} fontWeight="bold" className="price-algo">
                                    <Box component="b">
                                        {accountInfo
                                            ? (accountInfo['amount'] / 1000000).toFixed(3)
                                            : '-'}
                                    </Box>
                                    <img src={AlgoFont} alt="Algo" />
                                </Box>
                            </Box>
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                component="li"
                            >
                                <Box component="span" display="flex" alignItems="center">
                                    Marketplace Fee
                                    <i
                                        className="icon-information-outline"
                                        aria-owns={openPopover ? 'mouse-over-popover' : undefined}
                                        aria-haspopup="true"
                                        onMouseEnter={handlePopoverOpen}
                                        onMouseLeave={handlePopoverClose}
                                        style={{ marginLeft: 5 }}
                                    />
                                </Box>
                                <Box component="b">{commission_percent}%</Box>
                            </Box>
                        </Box>
                        <form onSubmit={formik.handleSubmit}>
                            <FormikProvider value={formik}>
                                <Box className="your-offer" mb={2}>
                                    <Box component="p" mb={1}>
                                        Your offer
                                    </Box>
                                    <Field
                                        field="input"
                                        type="number"
                                        name="price"
                                        step="any"
                                        {...formik.getFieldProps('price')}
                                        onChange={changePrice}
                                    />
                                </Box>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    mb={3}
                                    className="bid-total"
                                >
                                    <Box component="span">Total</Box>
                                    <Box fontSize={20} fontWeight="bold" className="price-algo">
                                        <Box component="b">{totalAmount}</Box>
                                        <img src={AlgoFont} alt="Algo" />
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center" justifyContent="flex-end">
                                    <Box>
                                        <Button
                                            color="secondary"
                                            onClick={onClose}
                                            className="cancel-btn"
                                            disabled={loading}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                    <Box>
                                        {loading ? (
                                            <LottieContainer
                                                containerStyles={{
                                                    height: '46px',
                                                    width: '154px',
                                                }}
                                                lottieStyles={{ width: '46px' }}
                                            />
                                        ) : (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                size="large"
                                            >
                                                Submit
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            </FormikProvider>
                        </form>
                    </Box>
                </Box>
            </Dialog>
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
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography>
                    Your algo, including the marketplace fee, will be escrowed in the smart contract
                    until the auction is closed or another bid is made.
                </Typography>
            </Popover>
            {Prompt}
        </>
    );
};

BidModal.propTypes = {
    bidModal: PropTypes.bool,
    onCloseBidModal: PropTypes.func,
    onOpenSubmittedBid: PropTypes.func,
    selectedAsset: PropTypes.object,
    title: PropTypes.string,
    description: PropTypes.string,
    assetId: PropTypes.number,
    owner: PropTypes.string,
    updateAsset: PropTypes.func,
    asset_guid: PropTypes.string,
};

export default BidModal;
