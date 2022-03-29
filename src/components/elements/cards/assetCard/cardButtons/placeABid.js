import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { COMPLETED, NOTIFICATIONS } from 'configs';
import { stopEvent } from 'helpers/functions';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from 'redux/profile/actions';
import { setNonLoggedMyAlgoAccount, setMyAlgoAccount } from 'redux/profile/actions';
import { nonLoggedConnect, connectToMyAlgo } from 'transactions/algorand/connectWallet';
import PropTypes from 'prop-types';

const PlaceABid = ({ auction, onOpenBidModal, base_node }) => {
    const dispatch = useDispatch();
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const { selectedWallet } = useSelector((state) => state.profile);
    const [isEnded, setIsEnded] = useState(false);
    const isCompleted = auction?.status === COMPLETED;
    const isMine = user?.username && base_node?.owner?.username === user?.username;
    console.log(auction, onOpenBidModal, base_node);
    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };

    const checkEndTime = useCallback(
        (timer) => {
            const end = new Date(auction?.end_time * 1000);
            const now = new Date();
            if (now - end > 0) {
                setIsEnded(true);
                clearInterval(timer);
            }
        },
        [auction],
    );

    useEffect(() => {
        const timer = setInterval(() => {
            checkEndTime(timer);
        }, 30000);
        checkEndTime(timer);

        return () => clearInterval(timer);
    }, [checkEndTime]);

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
        stopEvent(e);
        if (!selectedWallet) {
            const isConnected = await connectWallet();

            if (!isConnected) return;
        }
        if (checkTime()) {
            onOpenBidModal();
        }
    };

    const showBtn = !isEnded && !isCompleted && !isMine;
    return (
        <>
            {showBtn && (
                <Button
                    variant="contained"
                    color="primary"
                    className="asset-card-button"
                    onClick={openPlaceABid}
                >
                    Place a bid
                </Button>
            )}
            {/* // <Button
                    //     variant="contained"
                    //     color="primary"
                    //     className="asset-card-button"
                    //     onClick={onOpenAuctionCloseModal}
                    // >
                    //     Close An Auction
                    // </Button> */}
        </>
    );
};

PlaceABid.propTypes = {
    auction: PropTypes.object,
    onOpenBidModal: PropTypes.func,
    base_node: PropTypes.object,
};

export default PlaceABid;
