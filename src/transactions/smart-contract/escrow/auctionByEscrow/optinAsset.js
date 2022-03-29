import { getAlgodClient } from 'transactions/algorand';
import MyAlgo from '@randlabs/myalgo-connect';
import { waitForConfirmation } from 'transactions/algorand/waitConfirmation';
import { confirmWrapper } from 'components/shared/signConfirmPanel';
import { SIGNATURE_MODAL_INFO } from 'configs';

export const optIn = async (buyerAddress, assetId) => {
    // Opt-in buyer in asset
    const myAlgoWallet = new MyAlgo();

    const algodClient = getAlgodClient();
    const params = await algodClient.getTransactionParams().do();
    params.fee = 1000;
    params.flatFee = true;

    const optBuyertxn = {
        ...params,
        type: 'axfer',
        from: buyerAddress,
        to: buyerAddress,
        assetIndex: assetId,
        amount: 0, // 1 Algo
        note: new Uint8Array(Buffer.from('')),
        revocationTarget: undefined,
        closeRemainderTo: undefined,
        appArgs: [],
    };

    const askToSignForOptIn = await confirmWrapper(SIGNATURE_MODAL_INFO.optInTransaction);
    if (!askToSignForOptIn) throw new Error(SIGNATURE_MODAL_INFO.errorMessage);

    const rawSignedTxn = await myAlgoWallet.signTransaction(optBuyertxn);
    let opttx = await algodClient.sendRawTransaction(rawSignedTxn.blob).do();

    // wait for transaction to be confirmed
    await waitForConfirmation(algodClient, opttx.txId);
};
