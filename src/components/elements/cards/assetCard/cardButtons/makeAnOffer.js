import React, { useMemo } from 'react';
import { Button } from '@material-ui/core';
import { stopEvent } from 'helpers/functions';
import { useDispatch, useSelector } from 'react-redux';
import { setNonLoggedMyAlgoAccount, setMyAlgoAccount } from 'redux/profile/actions';
import { nonLoggedConnect, connectToMyAlgo } from 'transactions/algorand/connectWallet';
import PropTypes from 'prop-types';

const MakeAnOffer = ({ onOpenOfferModal, currentAsset, assetsInWallet }) => {
    const { user, isLoggedIn } = useSelector((state) => state.auth);
    const { selectedWallet } = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const { total, asset_id } = currentAsset?.asset ?? {};

    const showBtn = useMemo(() => {
        const getMyAssetAmount =
            assetsInWallet?.reduce((acc, curr) => {
                if (curr['asset-id'] === asset_id) return acc + curr['amount'];
                return acc;
            }, 0) ?? 0;

        return total > getMyAssetAmount;
    }, [asset_id, assetsInWallet, total]);

    const setWalletsToUser = async (getAccounts, loggedIn = true) => {
        return loggedIn
            ? dispatch(setMyAlgoAccount(getAccounts))
            : dispatch(setNonLoggedMyAlgoAccount(getAccounts));
    };

    const connectWallet = async () => {
        if (isLoggedIn) return connectToMyAlgo(setWalletsToUser);
        return nonLoggedConnect(setWalletsToUser);
    };

    const makeOffer = async (e) => {
        try {
            stopEvent(e);
            if (!selectedWallet) {
                const isConnected = await connectWallet();

                if (!isConnected) return;
            }
            onOpenOfferModal();
        } catch (err) {
            console.log(err);
        }
    };
    const hasOffer = currentAsset?.offers?.find(
        (offer) => user?.username && offer?.maker?.username === user?.username,
    );

    return (
        showBtn && (
            <Button
                variant="contained"
                color="primary"
                className="asset-card-button"
                onClick={makeOffer}
            >
                {hasOffer ? 'Change offer' : 'Make An Offer'}
            </Button>
        )
    );
};

MakeAnOffer.propTypes = {
    onOpenOfferModal: PropTypes.func,
    currentAsset: PropTypes.object,
    assetsInWallet: PropTypes.array,
};

export default MakeAnOffer;
