import React from 'react';
import DestroyAssetModal from 'components/elements/modal/destroyAssetModal';
import { DESTROY_ASSET, NOTIFICATIONS } from 'configs';
import { useDispatch, useSelector } from 'react-redux';
import { getAllContractsForAsset, deleteAsset } from 'redux/asset/actions';
import { cancelOldContract } from 'transactions/smart-contract/escrow/saleByEscrow/cancelOldContract';
import { setNotification } from 'redux/profile/actions';
import { useHistory } from 'react-router';
import { closeContract as closeOfferContracts } from 'transactions/smart-contract/escrow/offerByEscrow/closeContract';
import { deleteOfferByEscrowContract } from 'redux/algorand/actions';
import { deleteOfferFromAsset } from 'redux/singleAsset/actions';
import { destroyAsset } from 'transactions/assetActions/destroyAsset';
import { withWalletFallback } from 'hoc/withWalletFallback';
import PropTypes from 'prop-types';

const DeleteAsset = ({
    openModal,
    setDeleteLoading,
    onCloseConfirmModal,
    currentAsset,
    fromAssetCard = false,
    setDirty = () => {},
    setPristine = () => {},
    deleteAssetFromReducer = () => {},
    walletFallback,
}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { selectedWallet } = useSelector((state) => state.profile);

    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };

    const deleteContract = async (guid) => {
        return await dispatch(deleteOfferByEscrowContract(guid)).then((res) => {
            dispatch(deleteOfferFromAsset(guid));
        });
    };

    const destroy = async (guid, data) => {
        try {
            const response = await dispatch(deleteAsset(guid, data));
            setPristine();
            if (response?.status === 204) {
                giveNotification(NOTIFICATIONS.success.destroyed);
                if (!fromAssetCard) return history.push('/marketplace');
                return deleteAssetFromReducer(guid);
            }
        } catch (err) {
            setPristine();
            setDeleteLoading(false);
            console.log(err);
            giveNotification({ status: 'error', message: err.message });
        }
    };

    const cancelSaleByEscrow = async (saleByEscrowContracts) => {
        giveNotification(NOTIFICATIONS.info.strCancelingSaleEscrow);

        for (let i = 0; i < saleByEscrowContracts?.length; i++) {
            const response = await cancelOldContract(
                saleByEscrowContracts[i],
                currentAsset?.asset?.asset_id,
                selectedWallet,
                walletFallback,
            );
            if (response.status === 'error') throw new Error(response.message);
        }

        giveNotification(NOTIFICATIONS.success.finCancelingSaleEscrow);
        return { status: 'success' };
    };

    const cancelOfferByEscrow = async (offerByEscrowContracts) => {
        giveNotification(NOTIFICATIONS.info.strCancelingOfferEscrow);

        for (let i = 0; i < offerByEscrowContracts?.length; i++) {
            const response = await closeOfferContracts(offerByEscrowContracts[i], deleteContract);

            if (response.status === 'error') throw new Error(response.message);
        }
        giveNotification(NOTIFICATIONS.success.finCancelingOfferEscrow);
    };

    const onDelete = async () => {
        try {
            const contracts = await dispatch(getAllContractsForAsset(currentAsset?.guid));

            setDeleteLoading(true);
            setDirty();
            onCloseConfirmModal();

            if (contracts?.saleByEscrow?.length !== 0)
                await cancelSaleByEscrow(contracts?.saleByEscrow);

            if (contracts?.offerByEscrow?.length !== 0)
                await cancelOfferByEscrow(contracts?.offerByEscrow);

            giveNotification(NOTIFICATIONS.info.strDestroy);

            await destroyAsset(
                selectedWallet.address,
                currentAsset?.asset?.asset_id,
                giveNotification,
                currentAsset?.guid,
                destroy,
                setDeleteLoading,
                walletFallback,
                setPristine,
            );
        } catch (err) {
            console.log(err);
            setDeleteLoading(false);
            setPristine();
            giveNotification({ status: 'error', message: err.message });
        }
    };

    return (
        <DestroyAssetModal
            open={openModal}
            onClose={onCloseConfirmModal}
            onConfirm={onDelete}
            info={DESTROY_ASSET}
        />
    );
};

DeleteAsset.propTypes = {
    openModal: PropTypes.bool,
    setDeleteLoading: PropTypes.func,
    onCloseConfirmModal: PropTypes.func,
    currentAsset: PropTypes.object,
    fromAssetCard: PropTypes.bool,
    setDirty: PropTypes.func,
    setPristine: PropTypes.func,
    deleteAssetFromReducer: PropTypes.func,
};

export default withWalletFallback(DeleteAsset);
