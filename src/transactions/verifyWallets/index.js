import algosdk from 'algosdk';

// TODO unused, destroy
export const signTxn = async (myAlgoWallet, wallet) => {
    try {
        const unsignedTxn = wallet?.txn;
        const txn = algosdk.decodeUnsignedTransaction(
            new Uint8Array(Buffer.from(unsignedTxn, 'base64')),
        );

        const signOptBuyerTx = await myAlgoWallet.signTransaction(txn.toByte());
        const blob = btoa(String.fromCharCode.apply(null, signOptBuyerTx.blob));

        const walletResponse = { address: wallet.address, blob };
        return walletResponse;
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
};
