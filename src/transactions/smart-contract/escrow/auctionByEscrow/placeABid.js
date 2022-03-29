import { signTxn } from 'transactions/auction';
import { confirmWrapper } from 'components/shared/signConfirmPanel';
import { SIGNATURE_MODAL_INFO } from 'configs';
import { checkOptIn } from 'transactions/algorand/validations';
import { optIn } from './optinAsset';

export const placeABid = async (args) => {
    const {
        sendValues,
        totalAmount,
        buyerAddress,
        callApplication,
        throwError,
        giveNotification,
        finishBid,
        onOpenSubmittedBid,
        assetId,
    } = args;

    try {
        const checkIsOptIn = await checkOptIn(buyerAddress, assetId);

        if (!checkIsOptIn) {
            await optIn(buyerAddress, assetId);
        }

        const data = { wallet: buyerAddress, bid_amount: totalAmount };

        const response = await sendValues(data);

        if (!response) return throwError();

        const guid = response?.bid?.guid;
        const app_call_txn = response?.app_call_txn;
        const pay_txn = response?.pay_txn;

        const askToSign = await confirmWrapper(SIGNATURE_MODAL_INFO.placeABid);

        if (!askToSign) throw new Error(SIGNATURE_MODAL_INFO.errorMessage);

        const signAppCall = await signTxn(pay_txn, app_call_txn);

        const callApp = await callApplication({ blob: signAppCall }, guid);

        if (!callApp) return throwError();

        finishBid();
        onOpenSubmittedBid();
        return;
    } catch (err) {
        giveNotification({ status: 'error', message: err.message });
        finishBid();
    }
};
