import React, { useState } from 'react';
import { Box, Button } from '@material-ui/core';
import LottieContainer from 'components/shared/LottieContainer';
import { useDispatch } from 'react-redux';
import { deleteOfferByEscrowContract } from 'redux/algorand/actions';
import { deleteOfferFromAsset, getCurrentAsset } from 'redux/singleAsset/actions';
import { closeContract } from 'transactions/smart-contract/escrow/offerByEscrow/closeContract';
import DraftedContractsModal from 'components/elements/modal/draftedContracts';
import { algorandBaseUrl } from 'transactions/algorand/index';
import ConfirmModal from 'components/elements/modal/confirmModal';
import { CONTRACT_INFO, NOTIFICATIONS } from 'configs';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

// unused now
const OfferByEscrowBtns = ({ offerContract, giveNotification, setDirty, setPristine }) => {
    const dispatch = useDispatch();
    const { assetId } = useParams();
    const [loadingOpenOffer, setLoadingOpenOffer] = useState(false);
    const [loadingCancelOffer, setLoadingCancelOffer] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openCancelModal, setOpenCancelModal] = useState(false);

    const onOpenCancelModal = () => {
        setOpenCancelModal(true);
    };

    const onCloseCancelModal = () => {
        setOpenCancelModal(false);
    };

    const onSubmit = () => {
        setOpenModal(true);
    };

    const onCloseModal = () => {
        setOpenModal(false);
    };

    const startCanceling = () => {
        setDirty();
        setLoadingCancelOffer(true);
    };

    const endCanceling = () => {
        setLoadingCancelOffer(false);
        setPristine();
    };

    const draftedOffers = offerContract?.filter((offer) => offer.status === 'DRAFT');

    const activeOffer = offerContract?.find((offer) => offer.status === 'ACTIVE');

    const openEscrow = async () => {
        try {
            setLoadingOpenOffer(true);
            if (!activeOffer) {
                setLoadingOpenOffer(false);
                return giveNotification(NOTIFICATIONS.info.dontHaveContract);
            }
            const a = document.createElement('a');
            a.href = `${algorandBaseUrl}/address/${activeOffer?.compiled_teal_address}`;
            a.target = '_blank';
            a.click();
            setLoadingOpenOffer(false);
        } catch (err) {
            setLoadingOpenOffer(false);
            giveNotification({ status: 'info', message: err.message });
        }
    };

    const showResponseOfCanceling = (status, message) => {
        switch (status) {
            case 'none':
                return giveNotification(NOTIFICATIONS.info.dontHaveContract);
            case 'revoke': {
                return giveNotification(NOTIFICATIONS.success.terminatedContract);
            }
            case 'error':
                return giveNotification({ status: 'error', message });
            default:
                return giveNotification(NOTIFICATIONS.error.wentWrong);
        }
    };

    const deleteContract = async (guid) => {
        return await dispatch(deleteOfferByEscrowContract(guid)).then((res) => {
            dispatch(deleteOfferFromAsset(guid));
        });
    };

    const cancelOffer = async () => {
        onCloseCancelModal();
        if (!activeOffer) {
            return giveNotification(NOTIFICATIONS.info.dontHaveContract);
        }
        startCanceling();
        const response = await closeContract(activeOffer, deleteContract);
        endCanceling();
        showResponseOfCanceling(response?.status, response?.message);
        dispatch(getCurrentAsset(assetId));
    };
    return (
        <>
            {activeOffer && (
                <Box display="flex" className="escrow-buttons">
                    {loadingOpenOffer ? (
                        <LottieContainer
                            containerStyles={{ height: '50px', width: '100%' }}
                            lottieStyles={{ width: '50px' }}
                        />
                    ) : (
                        <Button variant="outlined" onClick={openEscrow} fullWidth>
                            View Offer
                        </Button>
                    )}
                    {loadingCancelOffer ? (
                        <LottieContainer
                            containerStyles={{ height: '50px', width: '100%' }}
                            lottieStyles={{ width: '50px' }}
                        />
                    ) : (
                        <Button variant="outlined" onClick={onOpenCancelModal} fullWidth>
                            Cancel Offer
                        </Button>
                    )}
                </Box>
            )}
            {draftedOffers?.length !== 0 && (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={onSubmit}
                        style={{ width: '100%', marginTop: '48px' }}
                    >
                        Drafted contracts
                    </Button>
                    <DraftedContractsModal
                        draftedContracts={draftedOffers}
                        openModal={openModal}
                        onCloseModal={onCloseModal}
                        type={'offer'}
                    />
                </>
            )}
            <ConfirmModal
                open={openCancelModal}
                onClose={onCloseCancelModal}
                onConfirm={cancelOffer}
                info={CONTRACT_INFO}
            />
        </>
    );
};

OfferByEscrowBtns.propTypes = {
    offerContract: PropTypes.array,
    giveNotification: PropTypes.func,
    setDirty: PropTypes.func,
    setPristine: PropTypes.func,
};

export default OfferByEscrowBtns;
