import algosdk from 'algosdk';

import MyAlgo from '@randlabs/myalgo-connect';

import { getAlgodClient } from 'transactions/algorand';
import { checkAccountAmount } from 'transactions/algorand/validations';
import { assignGroupId, combineSignedTxs } from '../util/transactions';
import { confirmWrapper } from 'components/shared/signConfirmPanel';
import { SIGNATURE_MODAL_INFO } from 'configs';

import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { formatJsonRpcRequest } from '@json-rpc-tools/utils';

export async function createEscrowContract(
    hostAddress,
    contract,
    assetId,
    getAccountInfo,
    setContract,
    walletFallback,
) {
    try {
        console.log('Start creating SaleByEscrow Smart contract');
        if (!contract) {
            const message = 'Failed to create contract';
            throw new Error(message);
        }
        const myAlgoWallet = new MyAlgo();
        const algodClient = getAlgodClient();

        const amountForContract = getAmountForContract();

        const accountAmount = await checkAccountAmount(
            hostAddress,
            amountForContract,
            getAccountInfo,
        );
        if (!accountAmount) {
            const message = 'Your account balance is not enough for this transaction.';
            throw new Error(message);
        }
        const approvalProgram = new Uint8Array(
            Buffer.from(contract.compiled_teal_result, 'base64'),
        );

        const params = await algodClient.getTransactionParams().do();
        params.fee = 1000;
        params.flatFee = true;
        const lSig = algosdk.makeLogicSig(approvalProgram);

        let blob;
        // ---------------------------------------
        // My Algo
        // ---------------------------------------
        if (walletFallback === 'MyAlgoConnect') {
            // Pay 1 algo from seller to escrow for fee
            const paymentTxnForAsaTxn = {
                ...params,
                fee: 1000,
                flatFee: true,
                type: 'pay',
                from: hostAddress,
                to: lSig.address(),
                amount: 1000000,
                note: new Uint8Array(Buffer.from('...')),
            };

            // Opt-in escrow in asset
            const optEscrowTxn = {
                ...params,
                fee: 1000,
                type: 'axfer',
                from: lSig.address(),
                to: lSig.address(),
                assetIndex: assetId,
                amount: 0, // 1 Algo
                note: new Uint8Array(Buffer.from('')),
                revocationTarget: undefined,
                closeRemainderTo: undefined,
                appArgs: [],
            };
            // Send asset from seller to escrow
            const sendAssetToEscrowTxn = {
                ...params,
                type: 'axfer',
                from: hostAddress,
                to: lSig.address(),
                assetIndex: assetId,
                amount: 1, //asset.amount
                note: new Uint8Array(Buffer.from('')),
            };

            // TODO use algosdk
            const txnGroup = assignGroupId([
                paymentTxnForAsaTxn,
                optEscrowTxn,
                sendAssetToEscrowTxn,
            ]);

            // create transaction object for logicalSignature
            const txObjASA = new algosdk.Transaction(txnGroup[1]);
            txObjASA.group = txnGroup[1].group;

            // sign lSig
            const signedLS = algosdk.signLogicSigTransaction(txObjASA, lSig);

            const askToSign = await confirmWrapper(SIGNATURE_MODAL_INFO.createContract);
            if (!askToSign) throw new Error(SIGNATURE_MODAL_INFO.errorMessage);

            // Sign payment and asset transfer transactions
            const signedTxn = await myAlgoWallet.signTransaction([txnGroup[0], txnGroup[2]]);
            // combine transactions
            const combinedTxs = combineSignedTxs([signedTxn[0], signedLS, signedTxn[1]]);

            console.log(combinedTxs);
            blob = btoa(String.fromCharCode.apply(null, combinedTxs));
        }
        // ---------------------------------------
        // WalletConnect
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
            // ALGO ASA
            const txns = [
                // send escrow 1 ALGO
                algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                    suggestedParams: {
                        ...params,
                    },
                    from: hostAddress,
                    to: lSig.address(),
                    amount: 1000000, // 1 ALGO
                }),
                // optin escrow to asset
                algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                    suggestedParams: {
                        ...params,
                    },
                    from: lSig.address(),
                    to: lSig.address(),
                    assetIndex: assetId,
                    amount: 0,
                }),
                // send asset to escrow
                algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                    suggestedParams: {
                        ...params,
                    },
                    from: hostAddress,
                    to: lSig.address(),
                    assetIndex: assetId,
                    amount: 1,
                }),
            ];

            const txnGroup = assignGroupId(txns);

            // sign lSig
            const signedLS = algosdk.signLogicSigTransaction(txnGroup[1], lSig);
            const lSignedTxn = Buffer.from(signedLS.blob).toString('base64');

            const askToSign = await confirmWrapper(SIGNATURE_MODAL_INFO.createContract);
            if (!askToSign) throw new Error(SIGNATURE_MODAL_INFO.errorMessage);

            const txnsToSign = [txnGroup[0], txnGroup[1], txnGroup[2]].map((txn) => {
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
            const [iSignedTxn, , iSignedTxn2] = await connector.sendCustomRequest(request);
            const [blob1, blob2, blob3] = [iSignedTxn, lSignedTxn, iSignedTxn2].map(
                (el) => new Uint8Array(Buffer.from(el, 'base64')),
            );
            blob = btoa(String.fromCharCode.apply(null, [...blob1, ...blob2, ...blob3]));
        }
        await setContract(contract?.guid, blob);
        return { status: 'success' };
    } catch (err) {
        console.log(err);
        return { status: 'error', message: err.message };
    }
}

function getAmountForContract() {
    const oneAlgoToContract = 1000000;
    const fees = 3000;
    const amountForContract = 100000;
    const allAmount = oneAlgoToContract + fees + amountForContract;
    return allAmount;
}
