import { signTxn } from 'transactions/auction';
import { confirmWrapper } from 'components/shared/signConfirmPanel';
import { NOTIFICATIONS, SIGNATURE_MODAL_INFO } from 'configs';

export const closeAuction = async (args) => {
    const {
        onCloseAppBlob,
        onCloseApp,
        throwError,
        auction_guid,
        giveNotification,
        setIsLoadingClose,
        reloadAsset,
    } = args;

    try {
        const unsignedTxn = await onCloseAppBlob();

        if (!unsignedTxn) return throwError();

        const close_txn = unsignedTxn?.close_txn;

        const askToSign = await confirmWrapper(SIGNATURE_MODAL_INFO.closeAuction);
        if (!askToSign) throw new Error(SIGNATURE_MODAL_INFO.errorMessage);

        const blob = await signTxn(close_txn);

        const data = { auction: auction_guid, blob };

        const closeAuction = await onCloseApp(data);

        if (!closeAuction) return throwError();
        // finishBid();
        // onCloseBidModal();
        setIsLoadingClose(false);
        reloadAsset();
        return giveNotification(NOTIFICATIONS.success.auctionClosed);
    } catch (err) {
        setIsLoadingClose(false);
        giveNotification({ status: 'error', message: err.message });
        // finishBid();
    }
};
