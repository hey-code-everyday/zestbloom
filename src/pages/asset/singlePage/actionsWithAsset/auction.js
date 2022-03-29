import React, { useState, useEffect, useCallback } from 'react';
import { Button, Box } from '@material-ui/core';
import AlgoFont from 'assets/img/algo-font.svg';
import { dangerTime } from 'helpers/functions';
import { getTimeLeft } from 'helpers/intervalYears';
import { COMPLETED, NOTIFICATIONS, CLOSE_AUCTION } from 'configs';
import { Tag } from 'components/shared';
import { Timer } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from 'redux/profile/actions';
import BidModal from 'components/elements/modal/placeBid';
import BidDoneModal from 'components/elements/modal/bidDone';
import ConfirmModal from 'components/elements/modal/confirmModal';
import { close_app_blob, close_app } from 'redux/auction/actions';
import { closeAuction } from 'transactions/smart-contract/escrow/auctionByEscrow/closeAuction';
import { setReloadAsset } from 'redux/singleAsset/actions';
import LottieContainer from 'components/shared/LottieContainer';
import { nonLoggedConnect, connectToMyAlgo } from 'transactions/algorand/connectWallet';
import { setNonLoggedMyAlgoAccount, setMyAlgoAccount } from 'redux/profile/actions';

const Auction = ({ auction, node, currentAsset, mini }) => {
    const [date, setDate] = useState('');
    const [bidModal, setBidModal] = useState(false);
    const [submittedBid, setSubmittedBid] = useState(false);
    const [openAuctionCloseModal, setOpenAuctionCloseModal] = useState(false);
    const [isLoadingClose, setIsLoadingClose] = useState(false);
    const [isEnded, setIsEnded] = useState(false);
    const [isStartedAuction, setIsStartedAuction] = useState(false);

    const { user, isLoggedIn } = useSelector((state) => state.auth);
    const { selectedWallet } = useSelector((state) => state.profile);
    const dispatch = useDispatch();

    const isMine = user?.username && node?.owner?.username === user?.username;

    const checkIsStarted = useCallback(
        (start_time) => {
            if (!isStartedAuction) {
                const now = new Date();
                const start = new Date(start_time * 1000);

                if (now >= start) return setIsStartedAuction(true);
            }
        },
        [isStartedAuction],
    );

    const getTimeSince = useCallback(() => {
        const time = getTimeLeft(auction?.start_time, auction?.end_time);
        checkIsStarted(auction?.start_time);
        if (time === 'Ended') {
            setIsEnded(true);
        }
        setDate(time);
        return time;
    }, [auction, checkIsStarted]);

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

    const isCompleted = auction?.status === COMPLETED;

    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };

    const onOpenBidModal = () => {
        setBidModal(true);
    };

    const onCloseBidModal = () => {
        setBidModal(false);
    };

    const onOpenSubmittedBid = () => {
        setBidModal(false);
        setSubmittedBid(true);
    };

    const onCloseSubmittedBid = () => {
        setSubmittedBid(false);
    };

    const checkTime = () => {
        const now = new Date();
        const start = new Date(auction?.start_time * 1000);
        const end = new Date(auction?.end_time * 1000);

        if (start - now > 0) {
            giveNotification(NOTIFICATIONS.warning.auctionDontstarted);
            return false;
        }
        if (now - end > 0) {
            giveNotification(NOTIFICATIONS.warning.auctionFinished);
            return false;
        }
        return true;
    };

    const checkForClosing = () => {
        const now = new Date();
        const end = new Date(auction?.end_time * 1000);
        const start = new Date(auction?.start_time * 1000);

        if (end - now > 0 && now > start) {
            giveNotification(NOTIFICATIONS.warning.auctionNoEnded);
            return false;
        }

        return true;
    };

    const setWalletsToUser = async (getAccounts, loggedIn = true) => {
        return loggedIn
            ? dispatch(setMyAlgoAccount(getAccounts))
            : dispatch(setNonLoggedMyAlgoAccount(getAccounts));
    };

    const connectWallet = async () => {
        if (isLoggedIn) return connectToMyAlgo(setWalletsToUser);
        return nonLoggedConnect(setWalletsToUser);
    };

    const openPlaceABid = async (e) => {
        if (!selectedWallet) {
            const isConnected = await connectWallet();
            if (!isConnected) return;
        }
        if (checkTime()) {
            onOpenBidModal();
        }
    };

    const onOpenAuctionCloseModal = (e) => {
        if (checkForClosing()) setOpenAuctionCloseModal(true);
    };

    const onCloseAuctionCloseModal = () => {
        setOpenAuctionCloseModal(false);
    };
    const throwError = () => {
        giveNotification(NOTIFICATIONS.error.wentWrong);
        // finishBid();
    };

    const reloadAsset = () => {
        dispatch(setReloadAsset());
    };
    const onCloseAppBlob = async () => dispatch(close_app_blob(auction?.guid));
    const onCloseApp = async (data) => dispatch(close_app(data));

    const onCloseAuction = async (e) => {
        try {
            onCloseAuctionCloseModal();
            setIsLoadingClose(true);
            const args = {
                onCloseAppBlob,
                onCloseApp,
                throwError,
                auction_guid: auction?.guid,
                giveNotification,
                setIsLoadingClose,
                reloadAsset,
            };
            closeAuction(args);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            {!mini && (
                <>
                    {(isMine || !isEnded) && (
                        <Tag
                            text={isCompleted ? COMPLETED : date}
                            className={`${
                                dangerTime(date) && !isCompleted ? 'brand-red' : 'brand-gold'
                            } md `}
                            icon={<Timer style={{ fontSize: 16 }} />}
                        />
                    )}
                    <Box>
                        {auction?.last_bid?.bid_amount && (
                            <>
                                <Box component="p">Current bid</Box>
                                <Box className="price-algo">
                                    <Box component="span" className="bid-price">
                                        {auction?.last_bid?.bid_amount}
                                    </Box>
                                    <img src={AlgoFont} alt="Algo" />
                                </Box>
                            </>
                        )}
                    </Box>
                </>
            )}
            {!isMine ? (
                !isEnded && (
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        id="offer"
                        onClick={openPlaceABid}
                    >
                        Place a Bid
                    </Button>
                )
            ) : (
                <>
                    {' '}
                    {(isEnded || !isStartedAuction) &&
                        (isLoadingClose ? (
                            <LottieContainer
                                containerStyles={{
                                    height: '46px',
                                    width: '100%',
                                }}
                                lottieStyles={{ width: '46px' }}
                            />
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                id="offer"
                                onClick={onOpenAuctionCloseModal}
                            >
                                Close An Auction
                            </Button>
                        ))}
                </>
            )}
            {bidModal && (
                <BidModal
                    bidModal={bidModal}
                    onCloseBidModal={onCloseBidModal}
                    onOpenSubmittedBid={onOpenSubmittedBid}
                    selectedAsset={{ ...auction, asset: { ...currentAsset?.asset } }}
                    owner={node?.owner}
                    title={currentAsset?.title}
                    description={currentAsset?.description}
                    assetId={currentAsset?.asset?.asset_id}
                    updateAsset={setReloadAsset}
                />
            )}
            <BidDoneModal
                submittedBid={submittedBid}
                onCloseSubmittedBid={onCloseSubmittedBid}
                selectedAsset={{ ...auction, asset: { ...currentAsset?.asset } }}
            />
            <ConfirmModal
                open={openAuctionCloseModal}
                onClose={onCloseAuctionCloseModal}
                onConfirm={onCloseAuction}
                info={CLOSE_AUCTION}
            />
        </>
    );
};

export default Auction;
