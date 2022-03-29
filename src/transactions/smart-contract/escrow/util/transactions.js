import { cloneDeep } from 'lodash';
import algosdk from 'algosdk';
import { base64ToUint8Array } from './encoding';
import MyAlgo from '@randlabs/myalgo-connect';

export function assignGroupId(txns) {
    const groupId = algosdk.computeGroupID(cloneDeep(txns));
    for (const txn of txns) {
        txn.group = groupId;
    }
    return txns;
}

export function combineSignedTxs(txs) {
    const decodedTxs = txs.map((tx) => {
        if (tx.blob instanceof Uint8Array) {
            return tx.blob;
        } else {
            return base64ToUint8Array(tx.blob);
        }
    });
    const totalLength = decodedTxs.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.byteLength;
    }, 0);
    const combinedTxs = new Uint8Array(totalLength);
    let byteLength = 0;
    for (let tx = 0; tx < decodedTxs.length; tx++) {
        combinedTxs.set(new Uint8Array(decodedTxs[tx]), byteLength);
        byteLength += decodedTxs[tx].byteLength;
    }
    return combinedTxs;
}

export function decodeUnsignedTransaction(unsignedTxn) {
    return algosdk.decodeUnsignedTransaction(new Uint8Array(Buffer.from(unsignedTxn, 'base64')));
}

// TODO scrap or move to provider
export async function signTransaction(txn) {
    const myAlgoWallet = new MyAlgo();
    return await myAlgoWallet.signTransaction(txn);
}

export function toBlob(blob) {
    return btoa(String.fromCharCode.apply(null, blob));
}
