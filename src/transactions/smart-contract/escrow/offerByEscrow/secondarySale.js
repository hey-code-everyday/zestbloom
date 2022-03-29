import algosdk from 'algosdk';

import { assignGroupId, combineSignedTxs } from '../util/transactions';
import { getAlgodClient } from 'transactions/algorand';
import { checkAssetAmount } from 'transactions/algorand/validations';
import { confirmWrapper } from 'components/shared/signConfirmPanel';
import { NOTIFICATIONS, SIGNATURE_MODAL_INFO } from 'configs';

import MyAlgo from '@randlabs/myalgo-connect';
export async function secondarySale(
    contract,
    sellerAddress,
    sendCollectedAsset,
    endSale,
    giveNotification,
    holder,
) {
    try {
        console.log('Start sale with secondary sale');
        if (!contract) {
            endSale();
            console.log('Contract does not exists');
            return;
        }
        const buyer_address = contract?.teal_context?.asset_buyer;
        const asset_creator = contract?.teal_context?.asset_creator;
        const assetId = contract?.teal_context?.asset_id;
        const commission_amount = contract?.teal_context?.commission_amount_2_sell;
        const royalty_amount = contract?.teal_context?.royalty_amount;
        const offer_amount = contract?.teal_context?.offer_amount - royalty_amount;

        if (!contract) {
            endSale();
            const message = 'This asset does not have contract';
            throw new Error(message);
        }

        const assetAmount = await checkAssetAmount(sellerAddress, assetId);
        if (!assetAmount) {
            endSale();
            return giveNotification(NOTIFICATIONS.warning.dontHaveAsset);
        }
        const myAlgoWallet = new MyAlgo();
        const algodClient = getAlgodClient();

        const approvalProgram = new Uint8Array(
            Buffer.from(contract.compiled_teal_result, 'base64'),
        );

        const params = await algodClient.getTransactionParams().do();

        // call logical Signature
        const lSig = algosdk.makeLogicSig(approvalProgram);
        const LSigAddress = lSig.address();

        // Send asset from escrow to buyer
        const transferASA = {
            ...params,
            fee: 1000,
            flatFee: true,
            type: 'axfer',
            from: sellerAddress,
            to: buyer_address,
            assetIndex: assetId,
            amount: 1, //contract.asset_amount,
            note: new Uint8Array(Buffer.from('')),
        };

        // Transfer payment from contract to creator / royalties
        const paymentTxnForAsaRoyalty = {
            ...params,
            fee: 1000,
            flatFee: true,
            type: 'pay',
            from: LSigAddress,
            to: asset_creator,
            amount: royalty_amount,
            note: new Uint8Array(Buffer.from('...')),
        };

        // Transfer payment from buyer to zestBloom (4%)
        const paymentTxnToZestbloomFee = {
            ...params,
            fee: 1000,
            flatFee: true,
            type: 'pay',
            from: LSigAddress,
            to: contract.teal_context.zestbloom_account,
            amount: commission_amount,
            note: new Uint8Array(Buffer.from('...')),
        };

        // Transfer payment from buyer to seller
        const paymentTxnForAsa = {
            ...params,
            fee: 1000,
            flatFee: true,
            type: 'pay',
            from: LSigAddress,
            to: sellerAddress,
            amount: offer_amount,
            note: new Uint8Array(Buffer.from('...')),
        };

        // Create group
        // TODO use algosdk
        const txnGroup = assignGroupId([
            transferASA,
            paymentTxnForAsaRoyalty,
            paymentTxnToZestbloomFee,
            paymentTxnForAsa,
        ]);

        // create transaction object for royalties
        const txObjRoyalty = new algosdk.Transaction(txnGroup[1]);
        txObjRoyalty.group = txnGroup[1].group;

        // sign lSig
        const signedPaymentRoyalty = algosdk.signLogicSigTransaction(txObjRoyalty, lSig);

        // create transaction object for logicalSignature
        const txObjPayment = new algosdk.Transaction(txnGroup[2]);
        txObjPayment.group = txnGroup[2].group;

        // sign lSig
        const signedPayment = algosdk.signLogicSigTransaction(txObjPayment, lSig);

        // create transaction object for commission
        const txObjCommission = new algosdk.Transaction(txnGroup[3]);
        txObjCommission.group = txnGroup[3].group;

        // sign lSig
        const signedCommission = algosdk.signLogicSigTransaction(txObjCommission, lSig);

        const askToSign = await confirmWrapper(SIGNATURE_MODAL_INFO.sellAsset);
        if (!askToSign) throw new Error(SIGNATURE_MODAL_INFO.errorMessage);

        // Sign payment transactions
        const signedTxn = await myAlgoWallet.signTransaction(txnGroup[0]);
        // combine transactions
        const combinedTxs = combineSignedTxs([
            signedTxn,
            signedPaymentRoyalty,
            signedPayment,
            signedCommission,
        ]);
        // create blob for send raw transaction
        const blob = btoa(String.fromCharCode.apply(null, combinedTxs));

        const collecterData = {
            blob,
            seller_address: sellerAddress,
            contract: contract.guid,
        };

        await sendCollectedAsset(collecterData, holder?.guid, assetAmount?.amount);
    } catch (err) {
        // finishBuying(err.message, 'error');
        endSale();
        console.log(err);
        return { status: 400, message: err.message };
    }
}
