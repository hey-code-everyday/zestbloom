import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAlgorandAccountInfo, setContract } from 'redux/algorand/actions';
import { getMyCurrentAsset, updateAsset, emptyCurrentAsset } from 'redux/singleAsset/actions';
import { getAssetsTags } from 'redux/marketplace/actions';
import { createEscrowContract } from 'transactions/smart-contract/escrow/saleByEscrow/createContract';
import { cancelOldContract } from 'transactions/smart-contract/escrow/saleByEscrow/cancelOldContract';
import AssetEdit from './edit';
import { setNotification } from 'redux/profile/actions';
import { useUnsavedChangesWarning } from 'hooks';
import { NOTIFICATIONS } from 'configs';
import { getAssetInfo, checkQuantites } from 'transactions/algorand/validations';
import { deleteEscrowContract } from 'redux/algorand/actions';
import { isHaveAsset } from 'helpers/checkQuantity';
import LoadingNotFound from 'components/shared/LoadingNotFound';
import DeleteAsset from './deleteAsset';
import { create_app, setup_app, complete_app } from 'redux/auction/actions';
import { createAuction } from 'transactions/smart-contract/escrow/auctionByEscrow/createAuction';
import { withWalletFallback } from 'hoc/withWalletFallback';
import PropTypes from 'prop-types';

const AssetEditContainer = ({ walletFallback }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { assetId } = useParams();
    const { currentAsset, getAssetLoading } = useSelector((state) => state.singleAsset);
    const { selectedWallet } = useSelector((state) => state.profile);
    const [loaderValue, setLoaderValue] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const [openModal, setOpenModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteBtn, setShowDeleteBtn] = useState(false);
    const [assetInfo, setAssetInfo] = useState(null);

    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();

    const nodesOfAsset = currentAsset?.nodes?.filter(
        (node) => user?.username && node?.owner?.username === user?.username,
    );
    console.log(currentAsset, nodesOfAsset);
    const haveAssetsInMyWallets = useMemo(() => {
        const haveAsset = nodesOfAsset?.filter((x) => isHaveAsset(x, currentAsset, true, false));

        return haveAsset;
    }, [nodesOfAsset, currentAsset]);

    useEffect(() => {
        const isCreator = haveAssetsInMyWallets?.find((x) => x?.user_type === 'creator');
        if (isCreator) {
            dispatch(getAssetsTags());
        }
    }, [dispatch, haveAssetsInMyWallets]);

    useEffect(() => {
        if (assetId) {
            dispatch(getMyCurrentAsset(assetId));
        }
        return () => {
            dispatch(emptyCurrentAsset());
        };
    }, [assetId, dispatch]);

    const getAssetInformation = useCallback(async () => {
        const info = await getAssetInfo(assetId);
        setAssetInfo(info);
    }, [assetId]);

    useEffect(() => getAssetInformation(), [getAssetInformation]);

    const canEdit = useMemo(() => !!haveAssetsInMyWallets?.[0], [haveAssetsInMyWallets]);
    const selectedNode = useMemo(
        () =>
            selectedWallet
                ? haveAssetsInMyWallets?.find((node) => node.holder === selectedWallet?.address)
                : haveAssetsInMyWallets?.[0],
        [selectedWallet, haveAssetsInMyWallets],
    );

    const onShowDeleteBtn = useCallback(async () => {
        if (Object.keys(currentAsset).length === 0) return;
        const assetManager = currentAsset?.asset?.manager;

        const myManagerAddress = user?.wallets?.find((x) => x === assetManager);

        const auctionsOrSales = currentAsset?.nodes?.filter(
            (node) => node.auctions?.length !== 0 || node?.sales?.length !== 0,
        );
        if (!myManagerAddress || auctionsOrSales?.length !== 0) {
            return;
        }
        const response = checkQuantites(assetInfo, myManagerAddress);
        if (response) return setShowDeleteBtn(true);

        return setShowDeleteBtn(false);
    }, [currentAsset, assetInfo, user]);

    useEffect(() => onShowDeleteBtn(), [onShowDeleteBtn]);
    if (!canEdit) return <LoadingNotFound loading={getAssetLoading} />;

    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };

    const startUpdating = () => {
        setLoaderValue(true);
        setDirty();
    };
    const endUpdating = () => {
        setLoaderValue(false);
        setPristine();
    };

    const finishUpdate = () => {
        endUpdating();
        history.push(`/asset/${currentAsset?.asset?.asset_id}`);
    };

    const checkIsChange = (newValues) => {
        const myNode = currentAsset?.nodes?.find(
            (x) => user?.username && x?.owner?.username === user?.username,
        );
        if (myNode) {
            return (
                newValues.price_is_visible !== myNode.price_is_visible ||
                newValues.price !== myNode.price ||
                newValues.royalties !== currentAsset.royalties ||
                JSON.stringify(newValues.media_types) !==
                    JSON.stringify(currentAsset.media_types.map((x) => x.slug)) ||
                newValues.visibility !== myNode?.visibility
            );
        }
        return false;
    };

    const changeContract = (newValues) => {
        const myNode = currentAsset?.nodes?.find(
            (x) => user?.username && x?.owner?.username === user?.username,
        );

        if (myNode) {
            return (
                (newValues.price_is_visible !== myNode.price_is_visible ||
                    newValues.price !== myNode.price ||
                    newValues.royalties !== currentAsset.royalties) &&
                newValues.price_is_visible &&
                newValues.price > 0
            );
        }
        return false;
    };

    const sendCreatedContract = async (guid, blob) => {
        return await dispatch(setContract(guid, blob));
    };

    const getAccountInfo = (account) => {
        return dispatch(getAlgorandAccountInfo(account));
    };

    const createContract = async (contract) => {
        try {
            if (!contract) {
                return giveNotification({
                    status: NOTIFICATIONS.error.missingContract.status,
                    message: contract?.data?.error || NOTIFICATIONS.error.missingContract.message,
                });
            }
            const response = await createEscrowContract(
                selectedWallet?.address,
                contract,
                currentAsset?.asset?.asset_id,
                getAccountInfo,
                sendCreatedContract,
                walletFallback,
            );
            if (response.status === 'success') {
                finishUpdate();
                return giveNotification(NOTIFICATIONS.success.createContract);
            }
            endUpdating();
            return giveNotification({ status: 'error', message: response.message });
        } catch (err) {
            endUpdating();
            return giveNotification({ status: 'error', message: err?.message });
        }
    };

    const updateRequest = (guid, values) => dispatch(updateAsset(guid, values));

    const noAssetInNode = () => giveNotification(NOTIFICATIONS.warning.noAssetInNode);

    // minimum offer price
    function addMinOffer(values) {
        if (!selectedNode) return noAssetInNode();
        startUpdating();
        const data = {
            min_offer_price: Number(values.price),
            media_types: JSON.parse(values.tags),
            visibility: values.visibility,
            physical_asset: values.physical_asset,
        };

        updateRequest(selectedNode?.guid, data).then((response) => {
            if (response?.status === 200) {
                giveNotification(NOTIFICATIONS.success.minimumPriceAdded);
                finishUpdate();
            }
        });
    }

    // sale by escrow
    const updateSaleByEscrow = async (values) => {
        const data = {
            price_is_visible: values.price_is_visible,
            price: values?.price,
            media_types: JSON.parse(values.tags),
            visibility: values.visibility,
            physical_asset: values.physical_asset,
        };
        try {
            if (!checkIsChange(data)) {
                return giveNotification(NOTIFICATIONS.info.dontChangeInfo);
            }

            startUpdating();
            if (changeContract(data)) {
                if (!selectedWallet) {
                    endUpdating();
                    return giveNotification(NOTIFICATIONS.info.connectWallet);
                }

                if (!selectedNode) {
                    endUpdating();
                    return noAssetInNode();
                }

                if (selectedNode?.holder !== selectedWallet?.address) {
                    endUpdating();
                    return giveNotification({
                        ...NOTIFICATIONS.warning.walletdoesntMatch,
                        message:
                            NOTIFICATIONS.warning.walletdoesntMatch.message +
                            ' : ' +
                            selectedNode?.holder.slice(0, 6) +
                            '...',
                    });
                }

                const oldContract = selectedNode.sales[0];
                const actionsWithOldContract = await cancelOldContract(
                    oldContract,
                    currentAsset?.asset?.asset_id,
                    selectedWallet,
                    walletFallback,
                );
                if (actionsWithOldContract.status === 'error') {
                    endUpdating();
                    return giveNotification({
                        status: 'error',
                        message: actionsWithOldContract.message,
                    });
                }
                if (actionsWithOldContract?.status === 'revoke') {
                    const response = await dispatch(
                        deleteEscrowContract(oldContract?.guid, actionsWithOldContract?.blob),
                    );
                    if (response?.status !== 204) throw new Error('Can not delete old contract');
                }
            }
            updateRequest(selectedNode.guid, data).then((response) => {
                if (response?.status === 200) {
                    if (changeContract(data)) {
                        giveNotification(NOTIFICATIONS.success.updated);
                        createContract(response?.data?.contract);
                    } else {
                        finishUpdate();
                    }
                } else {
                    endUpdating();
                    giveNotification(NOTIFICATIONS.error.update);
                }
            });
        } catch (err) {
            endUpdating();
            giveNotification({ status: 'error', message: err.message });
        }
    };

    // auction
    const throwError = () => {
        giveNotification(NOTIFICATIONS.error.wentWrong);
        finishUpdate();
    };

    const onCreateApp = async (data) => dispatch(create_app(data));
    const onSetupApp = async (data) => dispatch(setup_app(data));
    const onComplateApp = async (data) => dispatch(complete_app(data));

    const onCreateAuction = async (values) => {
        startUpdating();
        if (!selectedWallet) {
            endUpdating();
            return giveNotification(NOTIFICATIONS.info.connectWallet);
        }

        if (!selectedNode) {
            endUpdating();
            return noAssetInNode();
        }

        if (selectedNode?.holder !== selectedWallet?.address) {
            endUpdating();
            return giveNotification(NOTIFICATIONS.warning.walletdoesntMatch);
        }
        const oldContract = selectedNode.sales[0];
        const actionsWithOldContract = await cancelOldContract(
            oldContract,
            currentAsset?.asset?.asset_id,
            selectedWallet,
            walletFallback,
        );
        if (actionsWithOldContract.status === 'error') {
            endUpdating();
            return giveNotification({
                status: 'error',
                message: actionsWithOldContract.message,
            });
        }
        if (actionsWithOldContract?.status === 'revoke') {
            const response = await dispatch(
                deleteEscrowContract(oldContract?.guid, actionsWithOldContract?.blob),
            );
            if (response?.status !== 204) throw new Error('Can not delete old contract');
        }

        const data = {
            media_types: JSON.parse(values.tags),
            visibility: values.visibility,
            physical_asset: values.physical_asset,
        };
        updateRequest(selectedNode?.guid, data)
            .then(() => {
                giveNotification(NOTIFICATIONS.success.updated);

                const dateForCreat = {
                    node: selectedNode.guid,
                    start_time: values.start_time,
                    end_time: values.end_time,
                    reserve_price: values.reserve_price,
                    min_bid_increment: values.min_bid_increment,
                    snipe_trigger_window: values.snipe_trigger_window,
                    snipe_extension_time: values.snipe_extension_time,
                };
                const args = {
                    throwError,
                    onCreateApp,
                    dateForCreat,
                    onSetupApp,
                    giveNotification,
                    onComplateApp,
                    finishCreatingAuction: endUpdating,
                    redirectToProfile: finishUpdate,
                };
                createAuction(args);
            })
            .catch((err) => {
                finishUpdate();
                console.log(err);
            });
    };

    const onOpenConfirmModal = () => {
        if (!selectedWallet) return giveNotification(NOTIFICATIONS.info.connectWallet);
        if (selectedWallet?.address !== currentAsset?.asset?.manager)
            return giveNotification({
                ...NOTIFICATIONS.warning.walletdoesntMatch,
                message:
                    NOTIFICATIONS.warning.walletdoesntMatch.message +
                    ' : ' +
                    currentAsset?.asset?.manager?.slice(0, 6) +
                    '...',
            });
        setOpenModal(true);
    };

    const onCloseConfirmModal = () => {
        setOpenModal(false);
    };
    return (
        <>
            <AssetEdit
                updateSaleByEscrow={updateSaleByEscrow}
                loaderValue={loaderValue}
                onOpenConfirmModal={onOpenConfirmModal}
                deleteLoading={deleteLoading}
                showDeleteBtn={showDeleteBtn}
                addMinOffer={addMinOffer}
                onCreateAuction={onCreateAuction}
                selectedNode={selectedNode}
            />
            {Prompt}
            <DeleteAsset
                currentAsset={currentAsset}
                openModal={openModal}
                setDeleteLoading={setDeleteLoading}
                onCloseConfirmModal={onCloseConfirmModal}
            />
        </>
    );
};

AssetEditContainer.propTypes = {
    walletFallback: PropTypes.string,
};

export default withWalletFallback(AssetEditContainer);
