import algosdk from 'algosdk';
import { getAlgodClient } from 'transactions/algorand';

export const checkEscrowAccount = async (contract, assetId) => {
    const algodClient = getAlgodClient();

    const approvalProgram = new Uint8Array(Buffer.from(contract.compiled_teal_result, 'base64'));
    const lSig = algosdk.makeLogicSig(approvalProgram);
    const LSigAddress = lSig.address();
    const info = await algodClient.accountInformation(LSigAddress).do();
    const asset = info?.assets?.find((asset) => asset['asset-id'] === assetId);
    if (!asset) {
        const message =
            'This contract does not belong to you or this asset has already been bought';
        throw new Error(message);
    }
    return asset;
};
