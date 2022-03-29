import MyAlgo from '@randlabs/myalgo-connect';
import { getAlgodClient } from 'transactions/algorand';
import algosdk from 'algosdk';
import { confirmWrapper } from 'components/shared/signConfirmPanel';
import { SIGNATURE_MODAL_INFO } from 'configs';

import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { formatJsonRpcRequest } from '@json-rpc-tools/utils';

export const destroyAsset = async (
    account,
    assetID,
    giveNotification,
    guid,
    destroy,
    setDeleteLoading,
    walletFallback,
    setPristine = () => {},
) => {
    try {
        const algodClient = getAlgodClient();
        const note = undefined;
        const params = await algodClient.getTransactionParams().do();
        const txn = algosdk.makeAssetDestroyTxnWithSuggestedParams(account, note, assetID, params);
        let data;
        // My Algo
        if (walletFallback === 'MyAlgoConnect') {
            const myAlgoWallet = new MyAlgo();
            const askToSign = await confirmWrapper(SIGNATURE_MODAL_INFO.destroyAsset);
            if (!askToSign) throw new Error(SIGNATURE_MODAL_INFO.errorMessage);
            const signTxn = await myAlgoWallet.signTransaction(txn.toByte());
            const blob = btoa(String.fromCharCode.apply(null, signTxn.blob));
            data = { blob };
        } else if (walletFallback === 'WalletConnect') {
            const connector = new WalletConnect({
                bridge: 'https://bridge.walletconnect.org', // Required
                qrcodeModal: QRCodeModal,
            });
            // Check if connection is already established
            if (!connector.connected) {
                // create new session
                connector.createSession();
            }
            // ALGO ASA
            const txns = [txn];
            const txnsToSign = txns.map((txn) => {
                const encodedTxn = btoa(
                    String.fromCharCode.apply(null, algosdk.encodeUnsignedTransaction(txn)),
                );
                return {
                    txn: encodedTxn,
                    message: 'Destroy asset on Zestbloom',
                };
            });
            const requestParams = [txnsToSign];
            const request = formatJsonRpcRequest('algo_signTxn', requestParams);
            console.log(request);
            const askToSign = await confirmWrapper(SIGNATURE_MODAL_INFO.destroyAsset);
            if (!askToSign) throw new Error(SIGNATURE_MODAL_INFO.errorMessage);
            const [signedTxn] = await connector.sendCustomRequest(request);
            data = { blob: signedTxn };
        } else {
            // unsupported wallet
        }
        await destroy(guid, data);
        console.log('Asset ID: ' + assetID);
    } catch (err) {
        console.log(err);
        setDeleteLoading(false);
        setPristine();
        giveNotification({ status: 'error', message: err.message });
    }
};
