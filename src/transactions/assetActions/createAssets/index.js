import MyAlgo from '@randlabs/myalgo-connect';
import { createHash } from 'crypto';
import { getAlgodClient } from 'transactions/algorand';
import { getAssetURL } from 'helpers/urls';
import { getAccount } from 'transactions/algorand/getAccount';
import { confirmWrapper } from 'components/shared/signConfirmPanel';
import { SIGNATURE_MODAL_INFO } from 'configs';

import algosdk from 'algosdk';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { formatJsonRpcRequest } from '@json-rpc-tools/utils';

export const createAsset = async ({
    file,
    gettingIPFSHash,
    formValues,
    user,
    account,
    visibility,
    addAssetToDB,
    getErrorMessage,
    zestBloomManagerAddress,
    getAccountInfo,
    walletFallback,
}) => {
    try {
        console.log(walletFallback);
        const algodClient = getAlgodClient();

        const checkingClawbackAddress = await checkAddress(formValues?.clawbackAddress, 'Clawback');
        if (checkingClawbackAddress?.status !== 'success') {
            throw new Error(checkingClawbackAddress.message);
        }
        const checkingFreezeAddress = await checkAddress(formValues?.freezeAddress, 'Freeze');
        if (checkingFreezeAddress?.status !== 'success') {
            throw new Error(checkingFreezeAddress.message);
        }

        const accountPositiveAmount = await checkAccountAmount(
            account.address,
            101000,
            getAccountInfo,
        );
        if (!accountPositiveAmount) {
            const message = 'Your account balance is not enough for this transaction.';
            throw new Error(message);
        }

        // MyAlgo
        const data = new FormData();
        data.append('file', file);

        const attributes = formValues?.assetAttributes?.map((attribute) => ({
            trait_type: attribute.trait_type,
            value: attribute.value,
        }));

        const metadata = {
            name: formValues.title,
            decimals: 0,
            unitName: formValues.unitName,
            description: formValues.description,
            properties: {
                creator: { name: user.username, description: user.bio, address: account.address },
                contributors: formValues.assetContributors
                    .filter(({ username }) => username)
                    .map(({ username, bio, type }) => ({
                        name: username,
                        description: bio,
                        type,
                    })),
                royalty: Number(formValues.royalties.replace(/%/, '')),
                keyWords: JSON.parse(formValues.tag),
                publisher: 'ZestBloom',
                itemListElement: 1,
                numberOfItems: 1,
                physicalAsset: formValues.physical_asset,
                is_nsfw: formValues.is_nsfw,
            },
        };

        if (attributes?.length !== 0) {
            const arc69 = {
                standard: 'arc69',
                attributes,
            };

            metadata.properties.arc69 = arc69;
        }

        data.append('metadata', toJson(metadata));

        const hashes = await gettingIPFSHash(data);
        if (hashes.status !== 201) {
            return getErrorMessage(hashes?.messages);
        }

        const { ipfsHashForFile, ipfsHashFormetaData, metaHash, specsData, specsVersion } = hashes;

        const noteData = {
            contenturl: `ipfs://${ipfsHashForFile}`,
            'specs-version': specsVersion,
            'specs-data': specsData,
        };

        const noteDataJson = toJson(noteData);

        const managerAddres = getAssetManager(
            // TODO rename
            account.address,
            zestBloomManagerAddress,
            formValues.assetManager,
        );

        // TODO fix hack
        const freezeAddress = formValues.freezeAddress || undefined;
        const clawbackAddress = formValues.clawbackAddress || undefined;

        const reserveAddress = account.address;

        const assetHashUrl = `ipfs://${ipfsHashFormetaData}`;
        const enc = new TextEncoder();
        const note = enc.encode(noteDataJson);
        const assetDefaultFrozen = false;
        const assetDecimals = 0;
        const assetTotal = parseInt(formValues.quantity);
        const assetUnitName = formValues.unitName;
        const assetName = formValues.title;
        const assetURL = getAssetURL(assetName, assetHashUrl);
        const assetMetadataHash = metaHash;
        const assetManager = managerAddres;
        const assetReserve = reserveAddress;
        const assetFreeze = freezeAddress;
        const assetClawback = clawbackAddress;

        const params = await algodClient.getTransactionParams().do();
        const lease = createHash('sha256').update(assetMetadataHash).digest('base64');

        let blob;
        // MyAlgo
        if (walletFallback === 'MyAlgoConnect') {
            // TODO use algosdk
            const txn = {
                ...params,
                fee: 1000,
                flatFee: true,
                type: 'acfg',
                from: account.address,
                assetDecimals,
                assetTotal,
                assetUnitName,
                assetName,
                assetFreeze,
                assetManager,
                assetReserve,
                assetClawback,
                assetDefaultFrozen,
                assetURL,
                note,
                lease,
            };
            const askToSign = await confirmWrapper(SIGNATURE_MODAL_INFO.createAsset);
            if (!askToSign) throw new Error(SIGNATURE_MODAL_INFO.errorMessage);
            const myAlgoWallet = new MyAlgo();
            const rawSignedTxn = await myAlgoWallet.signTransaction(txn);
            blob = btoa(String.fromCharCode.apply(null, rawSignedTxn.blob));
        }

        // WalletConnect
        if (walletFallback === 'WalletConnect') {
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
            const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
                suggestedParams: {
                    ...params,
                },
                from: account.address,
                decimals: assetDecimals,
                total: assetTotal,
                unitName: assetUnitName,
                manager: managerAddres,
                reserve: reserveAddress,
                clawback: clawbackAddress,
                freeze: account.address,
                defaultFrozen: assetDefaultFrozen,
                assetName,
                assetURL,
                note,
            });
            const txns = [txn];
            const txnsToSign = txns.map((txn) => {
                const encodedTxn = btoa(
                    String.fromCharCode.apply(null, algosdk.encodeUnsignedTransaction(txn)),
                );
                console.log({ encodedTxn });
                return {
                    txn: encodedTxn,
                    message: 'Create asset on Zestbloom',
                    // Note: if the transaction does not need to be signed (because it's part of an atomic group
                    // that will be signed by another party), specify an empty singers array like so:
                    //signers: [],
                };
            });
            const requestParams = [txnsToSign];
            const request = formatJsonRpcRequest('algo_signTxn', requestParams);
            const [rawSignedTxn] = await connector.sendCustomRequest(request);
            blob = rawSignedTxn;
        }
        const assetData = { blob, visibility };
        addAssetToDB(assetData);
    } catch (err) {
        console.log(err);
        getErrorMessage(err?.message);
    }
};

function toJson(data) {
    return JSON.stringify(data);
}

async function checkAccountAmount(account, transactionFee, getAccountInfo) {
    const accountInfo = await getAccountInfo(account);
    if (!accountInfo?.account) {
        const message = 'This address does not exist or your account balance is 0';
        throw new Error(message);
    }

    const minBalance = accountInfo.account['min-balance'];
    const amount = accountInfo.account.amount;

    const balanceAfterTransaction = amount - transactionFee;

    return balanceAfterTransaction >= minBalance;
}

function getAssetManager(creator, zestBloom, assetManager) {
    switch (assetManager) {
        case 'creator':
            return creator;
        case 'zestBloom':
            return zestBloom;
        case 'unmanaged':
            return undefined;
        default:
            return creator;
    }
}

async function checkAddress(address, addressName) {
    try {
        if (!address) return { status: 'success' };
        if (address.length !== 58) throw new Error();

        const account = await getAccount(address);
        if (account?.address) {
            return { status: 'success' };
        }

        throw new Error();
    } catch (err) {
        return { status: 'error', message: `${addressName} address seems malformed` };
    }
}
