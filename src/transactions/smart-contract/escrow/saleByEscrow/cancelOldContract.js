import algosdk from 'algosdk';

import MyAlgo from '@randlabs/myalgo-connect';
import { assignGroupId, combineSignedTxs } from '../util/transactions';
import { getAlgodClient } from 'transactions/algorand';
import { confirmWrapper } from 'components/shared/signConfirmPanel';
import { SIGNATURE_MODAL_INFO } from 'configs';

import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { formatJsonRpcRequest } from '@json-rpc-tools/utils';

export const cancelOldContract = async (contract, assetId, account, walletFallback) => {
    try {
        console.log('Start canceling');
        if (!contract) {
            return { status: 'none' };
        }
        const myAlgoWallet = new MyAlgo();
        const algodClient = getAlgodClient();
        const approvalProgram = new Uint8Array(
            Buffer.from(contract.compiled_teal_result, 'base64'),
        );

        const params = await algodClient.getTransactionParams().do();
        params.fee = 1000;
        params.flatFee = true;

        const lSig = algosdk.makeLogicSig(approvalProgram);
        const LSigAddress = lSig.address();
        const info = await algodClient.accountInformation(LSigAddress).do();
        if (info?.amount === 0) {
            return { status: 'revoke' };
        }

        const asset = info?.assets?.find((asset) => asset['asset-id'] === assetId);
        let blob;

        if (asset) {
            // ---------------------------------------
            // My Algo
            // ---------------------------------------
            if (walletFallback === 'MyAlgoConnect') {
                const txnCloseOutAsset = {
                    ...params,
                    from: LSigAddress,
                    to: account.address,
                    assetIndex: assetId,
                    type: 'axfer',
                    amount: 0,
                    note: new Uint8Array(Buffer.from('...')),
                    closeRemainderTo: account.address,
                };
                const txnPayment = {
                    ...params,
                    from: account.address,
                    to: account.address,
                    assetIndex: assetId, // TODO detail check, does not look right
                    type: 'pay',
                    amount: 0,
                    note: new Uint8Array(Buffer.from('...')),
                };

                // TODO use algosdk
                const txnGroup = assignGroupId([txnCloseOutAsset, txnPayment]);

                const txObj = new algosdk.Transaction(txnGroup[0]);
                txObj.group = txnGroup[0].group;
                const signEscrowTx = algosdk.signLogicSigTransactionObject(txObj, lSig);

                const askToSign = await confirmWrapper(SIGNATURE_MODAL_INFO.cancelContract);
                if (!askToSign) throw new Error(SIGNATURE_MODAL_INFO.errorMessage);

                const signedTxn = await myAlgoWallet.signTransaction(txnGroup[1]);
                const combinedTxs = combineSignedTxs([signEscrowTx, signedTxn]);

                blob = btoa(String.fromCharCode.apply(null, combinedTxs));
            }
            // ---------------------------------------
            // Wallet Connect
            // ---------------------------------------
            else if (walletFallback === 'WalletConnect') {
                const connector = new WalletConnect({
                    bridge: 'https://bridge.walletconnect.org', // Required
                    qrcodeModal: QRCodeModal,
                });
                // Check if connection is already established
                if (!connector.connected) {
                    // create new session
                    connector.createSession();
                }
                const txns = [
                    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                        suggestedParams: {
                            ...params,
                        },
                        from: LSigAddress,
                        to: account.address,
                        assetIndex: assetId,
                        amount: 0,
                        closeRemainderTo: account.address,
                    }),
                    algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                        suggestedParams: {
                            ...params,
                        },
                        from: account.address,
                        to: account.address,
                        amount: 0,
                        assetId,
                    }),
                ];

                // TODO use algosdk
                const txnGroup = assignGroupId(txns);

                // sign lSig
                const signedLS = algosdk.signLogicSigTransaction(txnGroup[0], lSig);
                const lSignedTxn = Buffer.from(signedLS.blob).toString('base64');

                const askToSign = await confirmWrapper(SIGNATURE_MODAL_INFO.cancelContract);
                if (!askToSign) throw new Error(SIGNATURE_MODAL_INFO.errorMessage);

                const txnsToSign = [txnGroup[0], txnGroup[1]].map((txn) => {
                    const encodedTxn = btoa(
                        String.fromCharCode.apply(null, algosdk.encodeUnsignedTransaction(txn)),
                    );
                    return {
                        txn: encodedTxn,
                        message: 'Offer primary sale on Zestbloom',
                        // Note: if the transaction does not need to be signed (because it's part of an atomic group
                        // that will be signed by another party), specify an empty singers array like so:
                        // signers: [],
                    };
                });
                const requestParams = [txnsToSign];
                const request = formatJsonRpcRequest('algo_signTxn', requestParams);
                const [, iSignedTxn] = await connector.sendCustomRequest(request);
                const [blob1, blob2] = [lSignedTxn, iSignedTxn].map(
                    (el) => new Uint8Array(Buffer.from(el, 'base64')),
                );
                blob = btoa(String.fromCharCode.apply(null, [...blob1, ...blob2]));
            }
        }

        return { status: 'revoke', blob };
    } catch (err) {
        console.log(err);
        return { status: 'error', message: err.message };
    }
};
