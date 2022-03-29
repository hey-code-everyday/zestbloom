import React, { useState } from 'react';
import { Box, Button } from '@material-ui/core';
import LottieContainer from 'components/shared/LottieContainer';
import { checkEscrowAccount } from 'transactions/smart-contract/escrow/saleByEscrow/checkEscrowAccount';
import { cancelOldContract } from 'transactions/smart-contract/escrow/saleByEscrow/cancelOldContract';
import { useDispatch } from 'react-redux';
import { deleteEscrowContract } from 'redux/algorand/actions';
import { deleteContract } from 'redux/singleAsset/actions';
import { algorandBaseUrl } from 'transactions/algorand/index';
import DraftedContractsModal from 'components/elements/modal/draftedContracts';
import ConfirmModal from 'components/elements/modal/confirmModal';
import { CONTRACT_INFO, NOTIFICATIONS } from 'configs';
import { withWalletFallback } from 'hoc/withWalletFallback';
import PropTypes from 'prop-types';

// unused now
const SaleByEcrowBtns = ({
    currentAsset,
    giveNotification,
    selectedWallet,
    setDirty,
    setPristine,
    currenContracts,
    ownNode,
    currentAssetGuid,
    walletFallback,
}) => {
    const [loadingOpenEscrow, setLoadingOpenEscrow] = useState(false);
    const [loadingEndListing, setLoadingEndListing] = useState(false);
    const dispatch = useDispatch();
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

    if (currenContracts?.length === 0) return null;

    const activeContract = currenContracts?.find((contract) => contract.status === 'ACTIVE');
    const draftedContract = currenContracts?.filter((contract) => contract.status === 'DRAFT');

    const openEscrow = async () => {
        try {
            setLoadingOpenEscrow(true);
            const teal = activeContract;

            if (!teal) {
                setLoadingOpenEscrow(false);
                return giveNotification(NOTIFICATIONS.info.dontHaveContract);
            }

            await checkEscrowAccount(teal, currentAsset?.asset?.asset_id);
            const a = document.createElement('a');
            a.href = `${algorandBaseUrl}/address/${teal?.compiled_teal_address}`;
            a.target = '_blank';
            a.click();
            setLoadingOpenEscrow(false);
        } catch (err) {
            setLoadingOpenEscrow(false);
            giveNotification({ status: 'info', message: err.message });
        }
    };

    const showResponseOfCanceling = (status, message) => {
        switch (status) {
            case 'none':
                return giveNotification(NOTIFICATIONS.info.dontHaveContract);
            case 'bought':
                return giveNotification(NOTIFICATIONS.info.noBelongToYou);
            case 'revoke':
                return giveNotification(NOTIFICATIONS.success.terminatedContract);
            case 'error':
                return giveNotification({ status: 'error', message });
            default:
                return giveNotification(NOTIFICATIONS.error.wentWrong);
        }
    };

    const startCanceling = () => {
        setDirty();
        setLoadingEndListing(true);
    };

    const endCanceling = () => {
        setLoadingEndListing(false);
        setPristine();
    };

    const trowError = () => {
        endCanceling();
        showResponseOfCanceling(
            NOTIFICATIONS.error.wentWrong.status,
            NOTIFICATIONS.error.wentWrong.message,
        );
    };

    const endListing = async () => {
        try {
            onCloseCancelModal();
            if (!selectedWallet) {
                return giveNotification(NOTIFICATIONS.info.connectWallet);
            }
            startCanceling();

            const teal = activeContract;

            if (!teal) {
                endCanceling();
                return giveNotification(NOTIFICATIONS.info.dontHaveContract);
            }

            const holder = teal?.teal_context?.new_seller || teal?.teal_context?.asset_creator;

            if (selectedWallet.address !== holder) {
                endCanceling();
                return giveNotification(NOTIFICATIONS.error.dontMatchCreatorAddress);
            }

            const cancelResult = await cancelOldContract(
                teal,
                currentAsset?.asset?.asset_id,
                selectedWallet,
                walletFallback,
            );
            if (cancelResult?.status === 'error') {
                endCanceling();
                return showResponseOfCanceling(cancelResult?.status, cancelResult?.message);
            }
            // send end contract to backend, and hide this buttons

            dispatch(deleteEscrowContract(teal?.guid, cancelResult?.blob))
                .then((response) => {
                    if (response?.status === 204) {
                        endCanceling();
                        showResponseOfCanceling(cancelResult?.status);
                        return dispatch(deleteContract(ownNode?.guid));
                    }
                    trowError();
                })
                .catch((err) => {
                    console.log(err);
                    trowError();
                });
        } catch (err) {
            trowError();
            console.log(err);
        }
    };

    return (
        <>
            {activeContract && (
                <Box display="flex" className="escrow-buttons">
                    {loadingOpenEscrow ? (
                        <LottieContainer
                            containerStyles={{ height: '50px', width: '100%' }}
                            lottieStyles={{ width: '50px' }}
                        />
                    ) : (
                        <Button variant="outlined" onClick={openEscrow} fullWidth>
                            View Escrow
                        </Button>
                    )}
                    {loadingEndListing ? (
                        <LottieContainer
                            containerStyles={{ height: '50px', width: '100%' }}
                            lottieStyles={{ width: '50px' }}
                        />
                    ) : (
                        <Button variant="outlined" onClick={onOpenCancelModal} fullWidth>
                            End Listing
                        </Button>
                    )}
                </Box>
            )}
            {draftedContract?.length !== 0 && (
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
                        draftedContracts={draftedContract}
                        openModal={openModal}
                        onCloseModal={onCloseModal}
                        currentAssetGuid={currentAssetGuid}
                        type={'sale'}
                    />
                </>
            )}
            <ConfirmModal
                open={openCancelModal}
                onClose={onCloseCancelModal}
                onConfirm={endListing}
                info={CONTRACT_INFO}
            />
        </>
    );
};

SaleByEcrowBtns.propTypes = {
    currentAsset: PropTypes.object,
    giveNotification: PropTypes.func,
    selectedWallet: PropTypes.object,
    setDirty: PropTypes.func,
    setPristine: PropTypes.func,
    currenContracts: PropTypes.array,
    ownNode: PropTypes.object,
    currentAssetGuid: PropTypes.string,
    walletFallback: PropTypes.string,
};

export default withWalletFallback(SaleByEcrowBtns);
