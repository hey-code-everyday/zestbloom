import React, { useState } from 'react';
import { Button, ButtonGroup } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { NOTIFICATIONS } from 'configs';
import { setNotification } from 'redux/profile/actions';
import { actionOfferFromNotification } from 'redux/notifications/actions';
import LottieContainer from 'components/shared/LottieContainer';
import { stopEvent } from 'helpers/functions';
import { collectAssetOfferByEscrow } from 'redux/collectedAssets/actions';
import { primarySale } from 'transactions/smart-contract/escrow/offerByEscrow/primarySale';
import { secondarySale } from 'transactions/smart-contract/escrow/offerByEscrow/secondarySale';
import { closeContract } from 'transactions/smart-contract/escrow/offerByEscrow/closeContract';
import { deleteOfferByEscrowContract } from 'redux/algorand/actions';
import PropTypes from 'prop-types';

const OfferNotification = ({ data }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { selectedWallet } = useSelector((state) => state.profile);
    const { guid } = data;
    const { teal_context, status, node_guid } = data?.activity?.action_object ?? {};
    const isActive = status === 'ACTIVE' && node_guid; // check node guid for broadcast

    const endSale = () => {
        setLoading(false);
    };
    const startSale = () => {
        setLoading(true);
    };
    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };

    const sendCollectedAsset = async (data, holderGuid, assetAmount) => {
        dispatch(collectAssetOfferByEscrow(holderGuid, data))
            .then((response) => {
                endSale();
                if (response?.status === 201) {
                    giveNotification(NOTIFICATIONS.success.offerComplated);
                    return dispatch(actionOfferFromNotification(guid, 'CLOSE'));
                    // Change asset
                }
                giveNotification(NOTIFICATIONS.error.offerDontComplate);
            })
            .catch((err) => {
                giveNotification({ status: 'error', message: err?.message });
                endSale();
            });
    };

    const deleteOffer = async (contract_guid) =>
        dispatch(deleteOfferByEscrowContract(contract_guid)).then((res) => {
            return dispatch(actionOfferFromNotification(guid, 'DELETE'));
        });

    const rejectOffer = async (e) => {
        stopEvent(e);
        startSale();
        const response = await closeContract(data?.activity?.action_object, deleteOffer);
        showResponseOfCanceling(response?.status, response?.message);
    };

    const showResponseOfCanceling = (status, message) => {
        endSale();
        endSale();
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

    const acceptContract = async (e) => {
        try {
            stopEvent(e);
            const holder = { guid: node_guid };

            if (!selectedWallet) {
                return giveNotification(NOTIFICATIONS.info.connectWallet);
            }
            startSale();
            if (selectedWallet?.address === teal_context?.asset_creator) {
                const response = await primarySale(
                    data?.activity?.action_object,
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
                    data?.activity?.action_object,
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

    return (
        isActive &&
        (loading ? (
            <LottieContainer
                containerStyles={{
                    height: '30px',
                    width: '79px',
                }}
                lottieStyles={{ width: '30px' }}
            />
        ) : (
            <ButtonGroup>
                <Button className="color-error" variant="outlined" onClick={rejectOffer}>
                    Decline
                </Button>
                <Button className="color-green" variant="outlined" onClick={acceptContract}>
                    Accept
                </Button>
            </ButtonGroup>
        ))
    );
};

OfferNotification.propTypes = {
    data: PropTypes.object,
};

export default OfferNotification;
