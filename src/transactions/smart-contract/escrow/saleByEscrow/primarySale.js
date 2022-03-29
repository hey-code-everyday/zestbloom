import algosdk from 'algosdk';

import { assignGroupId, combineSignedTxs } from '../util/transactions';

import MyAlgo from '@randlabs/myalgo-connect';

import { getAlgodClient } from 'transactions/algorand';
import {
    checkAccountAmount,
    checkAssetAmount,
    checkOptIn,
} from 'transactions/algorand/validations';
import { waitForConfirmation } from 'transactions/algorand/waitConfirmation';
import { confirmWrapper } from 'components/shared/signConfirmPanel';
import { SIGNATURE_MODAL_INFO } from 'configs';

export async function buyWithPrimarySale(
    buyerAddress,
    contract,
    assetId,
    hostAddress,
    finishBuying,
    getAccountInfo,
    sendCollectedAsset,
) {
    try {
        console.log('Start buying an asset');
        if (!contract) {
            const message = 'This asset does not have contract';
            throw new Error(message);
        }
        const myAlgoWallet = new MyAlgo();
        const algodClient = getAlgodClient();
        const amountForContract = getAmountForBuyingAsset(
            contract.teal_context.sale_amount,
            contract.teal_context.commission_payment,
        );

        // need to chanched
        const accountAmount = await checkAccountAmount(
            buyerAddress,
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
        const LSigAddress = lSig.address();
        const assetAmount = await checkAssetAmount(LSigAddress, assetId);
        if (!assetAmount) {
            finishBuying('This asset has already been bought', 'info');
            return;
        }

        const checkIsOptIn = await checkOptIn(buyerAddress, assetId);

        if (!checkIsOptIn) {
            // Opt-in buyer in asset
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
        }

        // Start payments
        // Send asset from escrow to buyer
        const transferASA = {
            ...params,
            type: 'axfer',
            from: LSigAddress,
            to: buyerAddress,
            assetIndex: assetId,
            amount: 1, //contract.asset_amount,
            note: new Uint8Array(Buffer.from('')),
        };

        // Transfer payment from buyer to seller
        const paymentTxnForAsa = {
            ...params,
            fee: 1000,
            flatFee: true,
            type: 'pay',
            from: buyerAddress,
            to: hostAddress,
            amount: contract.teal_context.sale_amount,
            note: new Uint8Array(Buffer.from('...')),
        };

        // Transfer payment from buyer to zestBloom (4%)
        const paymentTxnToZestbloomFee = {
            ...params,
            fee: 1000,
            flatFee: true,
            type: 'pay',
            from: buyerAddress,
            to: contract.teal_context.zestbloom_account,
            amount: contract.teal_context.commission_payment,
            note: new Uint8Array(Buffer.from('...')),
        };

        // Create group
        // TODO use algosdk
        const txnGroup = assignGroupId([transferASA, paymentTxnForAsa, paymentTxnToZestbloomFee]);

        // create transaction object for logicalSignature
        const txObjASA = new algosdk.Transaction(txnGroup[0]);
        txObjASA.group = txnGroup[0].group;

        // sign lSig
        const signedASA = algosdk.signLogicSigTransaction(txObjASA, lSig);

        const askToSign = await confirmWrapper(SIGNATURE_MODAL_INFO.buyAsset);
        if (!askToSign) throw new Error(SIGNATURE_MODAL_INFO.errorMessage);

        // Sign payment transactions
        const signedTxn = await myAlgoWallet.signTransaction([txnGroup[1], txnGroup[2]]);
        // combine transactions
        const combinedTxs = combineSignedTxs([signedASA, ...signedTxn]);

        // create blob for send raw transaction
        const blob = btoa(String.fromCharCode.apply(null, combinedTxs));

        const collecterData = {
            blob,
            buyer_address: buyerAddress,
            contract: contract?.guid,
        };

        sendCollectedAsset(collecterData);
    } catch (err) {
        console.log(err);
        finishBuying(err.message, 'error');
        return { status: 400 };
    }
}

function getAmountForBuyingAsset(amount_to_pay_for_nft, zestbloom_percent_amount) {
    const payments = amount_to_pay_for_nft + zestbloom_percent_amount;
    const fees = 4000;
    const amountForContract = 1000000;
    const allAmount = payments + fees + amountForContract;
    return allAmount;
}
