import { confirmWrapper } from 'components/shared/signConfirmPanel';
import { signTxn } from 'transactions/auction';
import { SIGNATURE_MODAL_INFO, NOTIFICATIONS } from 'configs';

export const createAuction = async (args) => {
    const {
        throwError,
        onCreateApp,
        dateForCreat,
        onSetupApp,
        giveNotification,
        onComplateApp,
        finishCreatingAuction,
        redirectToProfile,
    } = args;
    try {
        const _create_app = await onCreateApp(dateForCreat);

        if (!_create_app) return throwError();

        const auction_guid = _create_app?.auction?.guid;
        const unSignedTxn = _create_app?.app_txn;

        const askToSignForCreateApp = await confirmWrapper(SIGNATURE_MODAL_INFO.createApplication);
        if (!askToSignForCreateApp) throw new Error(SIGNATURE_MODAL_INFO.errorMessage);

        const signedTxn = await signTxn(unSignedTxn);

        const dateForSetup = {
            auction: auction_guid,
            blob: signedTxn,
        };

        const _setup_app = await onSetupApp(dateForSetup);

        if (!_setup_app) return throwError();
        giveNotification(NOTIFICATIONS.success.auction_app_created);

        const askToSignForSendAsset = await confirmWrapper(
            SIGNATURE_MODAL_INFO.sendAssetToApplication,
        );

        if (!askToSignForSendAsset) throw new Error(SIGNATURE_MODAL_INFO.errorMessage);
        const signedTxnSetup = await signTxn(..._setup_app);

        const dataForComplate = {
            auction: auction_guid,
            blob: signedTxnSetup,
        };

        const _complete_app = await onComplateApp(dataForComplate);

        if (!_complete_app) return throwError();

        finishCreatingAuction();
        giveNotification(NOTIFICATIONS.success.auctionCreated);
        redirectToProfile();
    } catch (err) {
        giveNotification({ status: 'error', message: err.message });
        finishCreatingAuction();
    }
};
