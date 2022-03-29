import React, { useState, useMemo } from 'react';
import { Button, Box, Typography } from '@material-ui/core';
import LottieContainer from 'components/shared/LottieContainer';

import { buyWithPrimarySale } from 'transactions/smart-contract/escrow/saleByEscrow/primarySale';
import { buyWithSecondarySale } from 'transactions/smart-contract/escrow/saleByEscrow/secondarySale';
import { useDispatch, useSelector } from 'react-redux';
import { collectAsset } from 'redux/collectedAssets/actions';
import { getAlgorandAccountInfo } from 'redux/algorand/actions';
import { useUnsavedChangesWarning } from 'hooks';
import { NOTIFICATIONS } from 'configs';
import { setReloadAsset } from 'redux/singleAsset/actions';
import { COLLECTOR } from 'configs';
import { getHosts } from 'helpers/checkQuantity';
import { stopEvent } from 'helpers/functions';
import { setNonLoggedMyAlgoAccount, setMyAlgoAccount } from 'redux/profile/actions';
import { nonLoggedConnect, connectToMyAlgo } from 'transactions/algorand/connectWallet';
import { useAlgoFont } from 'hooks/assets';

const BuyNow = ({
    currentAsset,
    giveNotification,
    bestSale,
    oneNode,
    showedPrice,
    auction,
    assetCardButton,
    onOpenSubmittedBuyNow,
}) => {
    const [toLoadBuyerProccess, setToLoadBuyerProccess] = useState(false);
    const { selectedWallet } = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const { user, isLoggedIn } = useSelector((state) => state.auth);
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();

    const owners = useMemo(() => getHosts(currentAsset), [currentAsset]);

    const node = oneNode || currentAsset?.base_node;

    const AlgoFont = useAlgoFont();

    const isHolder = useMemo(() => {
        const base_node_owner = node?.owner;

        if (user?.username && base_node_owner?.username === user?.username) return true;

        const haveNode = owners?.find((node) => user?.username && node?.owner === user?.username);
        return !!haveNode;
    }, [user, owners, node]);

    const userWhichHaveAsset = useMemo(() => {
        const owner = node?.owner;
        if (
            (owner?.username !== 'unknown' &&
                user?.username &&
                owner?.username !== user?.username) ||
            !isLoggedIn
        ) {
            return true;
        }
        return false;
    }, [node, user, isLoggedIn]);

    const canBuy = () => {
        return !isHolder && bestSale && userWhichHaveAsset;
    };

    const startBuy = () => {
        setToLoadBuyerProccess(true);
        setDirty();
    };
    const endBuying = () => {
        setToLoadBuyerProccess(false);
        setPristine();
    };
    const finishBuying = (message, status) => {
        endBuying();
        giveNotification({ status, message });
    };

    const sendCollectedAsset = (response) => {
        dispatch(collectAsset(node?.guid, response)).then((response) => {
            if (response?.status === 201) {
                finishBuying('The Asset was successfully bought', 'success');
                return !assetCardButton ? dispatch(setReloadAsset()) : onOpenSubmittedBuyNow(); // need to reload asset
            }
            return finishBuying('You can not buy this asset', 'error');
        });
    };

    const getAccountInfo = (account) => {
        return dispatch(getAlgorandAccountInfo(account));
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

    const buyNow = async (e) => {
        stopEvent(e);
        try {
            let wallet = null;

            const contract = node?.sales[0];
            if (!selectedWallet) {
                const account = await connectWallet();
                if (!account) return;
                wallet = account;

                if (node?.holder === wallet?.address)
                    return giveNotification(NOTIFICATIONS.info.sameWallet);
            } else {
                wallet = selectedWallet;
            }

            if (!wallet) {
                giveNotification(NOTIFICATIONS.info.connectWallet);
                return;
            }

            startBuy();
            if (!contract) {
                endBuying();
                giveNotification(NOTIFICATIONS.info.dontHaveContract);
                return;
            }
            if (node?.user_type === COLLECTOR) {
                await buyWithSecondarySale(
                    wallet.address,
                    contract,
                    currentAsset?.asset?.asset_id,
                    finishBuying,
                    getAccountInfo,
                    sendCollectedAsset,
                );
            } else {
                await buyWithPrimarySale(
                    wallet.address,
                    contract,
                    currentAsset?.asset?.asset_id,
                    currentAsset?.asset?.creator,
                    finishBuying,
                    getAccountInfo,
                    sendCollectedAsset,
                );
            }
        } catch (err) {
            endBuying();
            console.log(err);
        }
    };

    return (
        !auction && (
            <>
                {showedPrice && (
                    <Box display="flex" alignItems="center" flexWrap="wrap">
                        <Box className="price-algo">
                            <Box className="bid-price">
                                <Typography variant="h3">{showedPrice}</Typography>
                            </Box>
                            {<img src={AlgoFont} alt="Algo" />}
                        </Box>
                    </Box>
                )}
                {canBuy() &&
                    (toLoadBuyerProccess ? (
                        <LottieContainer
                            containerStyles={
                                assetCardButton
                                    ? { height: '34px', width: '100px' }
                                    : { height: '50px', width: '153px' }
                            }
                            lottieStyles={assetCardButton ? { width: '34px' } : { width: '50px' }}
                        />
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            size={!assetCardButton ? 'large' : 'medium'}
                            id="offer"
                            className={assetCardButton ? assetCardButton : ''}
                            onClick={buyNow}
                        >
                            Buy Now
                        </Button>
                    ))}
                {Prompt}
            </>
        )
    );
};

export default BuyNow;
