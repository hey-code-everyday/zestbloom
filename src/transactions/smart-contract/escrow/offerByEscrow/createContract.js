import algosdk from 'algosdk';

import MyAlgo from '@randlabs/myalgo-connect';

import { getAlgodClient } from 'transactions/algorand';
import { checkAccountAmount, checkOptIn } from 'transactions/algorand/validations';
import { assignGroupId, combineSignedTxs } from '../util/transactions';
import { confirmWrapper } from 'components/shared/signConfirmPanel';
import { NOTIFICATIONS, SIGNATURE_MODAL_INFO } from 'configs';

import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { formatJsonRpcRequest } from '@json-rpc-tools/utils';

export async function createContract(
    contract,
    toActivateContract,
    giveNotification,
    getAccountInfo,
    walletFallback,
) {
    try {
        console.log('Start creating offer-by-escrow contract');
        if (!contract) {
            console.log('Does not found teal for contract');
            return giveNotification(NOTIFICATIONS.error.notFoundContract);
        }
        const buyerAddress = contract.teal_context.asset_buyer;
        const assetId = contract.teal_context.asset_id;
        const fund_amount =
            1_000_000 +
            contract?.teal_context?.offer_amount +
            contract?.teal_context?.commission_amount_1_sell;

        // MyAlgo
        const myAlgoWallet = new MyAlgo();
        const algodClient = getAlgodClient();

        const amountForContract = getAmountForContract(fund_amount);
        // TODO fix wrong calculate
        const accountAmount = await checkAccountAmount(
            buyerAddress,
            amountForContract,
            getAccountInfo,
        );

        if (!accountAmount) {
            return giveNotification(NOTIFICATIONS.warning.notEnoughBalance);
        }
        const approvalProgram = new Uint8Array(
            Buffer.from(contract.compiled_teal_result, 'base64'),
        );

        const checkIsOptIn = await checkOptIn(buyerAddress, assetId);

        const params = await algodClient.getTransactionParams().do();
        params.fee = 1000;
        params.flatFee = true;
        const lSig = algosdk.makeLogicSig(approvalProgram);

        let signedTxns;

        if (walletFallback === 'MyAlgoConnect') {
            // Pay 1 algo from buyer to escrow for fee
            const paymentTxnForAsaTxn = {
                ...params,
                type: 'pay',
                from: buyerAddress,
                to: lSig.address(),
                amount: fund_amount,
                note: new Uint8Array(Buffer.from('...')),
            };
            if (!checkIsOptIn) {
                // Opt-in buyer to asset
                const optBuyerTxn = {
                    ...params,
                    type: 'axfer',
                    from: buyerAddress,
                    to: buyerAddress,
                    assetIndex: assetId,
                    amount: 0,
                    note: new Uint8Array(Buffer.from('')),
                    revocationTarget: undefined,
                    closeRemainderTo: undefined,
                    appArgs: [],
                };
                // TODO use algosdk
                const txnGroup = assignGroupId([optBuyerTxn, paymentTxnForAsaTxn]);

                const askToSign = await confirmWrapper(SIGNATURE_MODAL_INFO.optInTransaction);
                if (!askToSign) throw new Error(SIGNATURE_MODAL_INFO.errorMessage);

                const signOptBuyerTx = await myAlgoWallet.signTransaction(txnGroup);
                const combinedTxs = combineSignedTxs(signOptBuyerTx);

                signedTxns = btoa(String.fromCharCode.apply(null, combinedTxs));
            } else {
                const askToSign = await confirmWrapper(SIGNATURE_MODAL_INFO.makeAnOffer);
                if (!askToSign) throw new Error(SIGNATURE_MODAL_INFO.errorMessage);

                const signPayAsaAmountTx = await myAlgoWallet.signTransaction(paymentTxnForAsaTxn);
                signedTxns = btoa(String.fromCharCode.apply(null, signPayAsaAmountTx.blob));
            }
        }
        // Wallet Connect
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
            // ALGO token
            let txns = [
                algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                    suggestedParams: {
                        ...params,
                    },
                    from: buyerAddress,
                    to: lSig.address(),
                    amount: fund_amount,
                }),
            ];
            if (!checkIsOptIn) {
                txns.push(
                    algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                        suggestedParams: {
                            ...params,
                        },
                        from: buyerAddress,
                        to: buyerAddress,
                        assetIndex: assetId,
                        amount: 0,
                    }),
                );
            }
            const txnsToSign = txns.map((txn) => {
                const encodedTxn = btoa(
                    String.fromCharCode.apply(null, algosdk.encodeUnsignedTransaction(txn)),
                );
                return {
                    txn: encodedTxn,
                    message: 'Create offer on Zestbloom',
                    // Note: if the transaction does not need to be signed (because it's part of an atomic group
                    // that will be signed by another party), specify an empty singers array like so:
                    // signers: [],
                };
            });
            const requestParams = [txnsToSign];
            const request = formatJsonRpcRequest('algo_signTxn', requestParams);
            const askToSign = await confirmWrapper(SIGNATURE_MODAL_INFO.makeAnOffer);
            if (!askToSign) throw new Error(SIGNATURE_MODAL_INFO.errorMessage);
            let [iSignedTxn] = await connector.sendCustomRequest(request);
            signedTxns = iSignedTxn;
        } else {
            throw new Error('Unsupported wallet');
        }

        await toActivateContract(contract.guid, signedTxns);
        giveNotification(NOTIFICATIONS.success.createContract);
        console.log('Done');
        return { status: 'success' };
    } catch (err) {
        giveNotification({ status: 'error', message: err?.message });
        console.log(err);
    }
}

export function getAmountForContract(saleAmount) {
    const fees = 2000;
    const allAmount = fees + saleAmount;
    return allAmount;
}
