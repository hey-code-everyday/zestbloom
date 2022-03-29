import {
    assignGroupId,
    combineSignedTxs,
    decodeUnsignedTransaction,
    signTransaction,
    toBlob,
} from 'transactions/smart-contract/escrow/util/transactions';

export const signTxn = async (...unsignedTxns) => {
    try {
        if (unsignedTxns.length === 1) {
            const txn = decodeUnsignedTransaction(unsignedTxns[0]);

            const signOptBuyerTx = await signTransaction(txn.toByte());

            return toBlob(signOptBuyerTx.blob);
        }

        const decodedTxns = unsignedTxns.map((x) => decodeUnsignedTransaction(x));

        // TODO use algosdk
        const txnGroup = assignGroupId(decodedTxns);

        const signedTxn = await signTransaction(txnGroup.map((x) => x.toByte()));

        const combinedTxs = combineSignedTxs(signedTxn);

        return toBlob(combinedTxs);
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
};
