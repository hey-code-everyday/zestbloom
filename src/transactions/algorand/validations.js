import { getAccountInfo } from './getAccount';
import { getAlgodIndexer } from './index';

export async function checkAssetAmount(hostAddress, assetIndex) {
    try {
        const indexerClient = getAlgodIndexer();

        // show address which have asset
        const assetInfo = await indexerClient.lookupAssetBalances(assetIndex).do();
        const haveAsset = assetInfo?.balances?.find(
            (account) => account.address === hostAddress && account.amount !== 0,
        );
        return haveAsset;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export async function checkOptIn(address, assetIndex) {
    try {
        const indexerClient = getAlgodIndexer();

        // show address which have asset
        const assetInfo = await indexerClient.lookupAssetBalances(assetIndex).do();
        const optIn = assetInfo?.balances?.find((account) => account.address === address);
        return optIn ? true : false;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export async function checkAccountAmount(account, transactionFee, getAccountInfo) {
    try {
        const accountInfo = await getAccountInfo(account);
        if (!accountInfo?.account) {
            const message = 'This address does not exists or your account balance is 0';
            throw new Error(message);
        }

        const minBalance = accountInfo.account['min-balance'];
        const amount = accountInfo.account.amount;

        const balanceAfterTransaction = amount - transactionFee;

        return balanceAfterTransaction >= minBalance;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export async function getAssetInfo(assetIndex) {
    try {
        const indexerClient = getAlgodIndexer();
        const assetInfo = await indexerClient.lookupAssetBalances(assetIndex).do();
        return assetInfo;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export function checkQuantites(assetInfo, selectAddress) {
    if (!assetInfo || assetInfo?.balances?.length === 0) return false;

    const hostWallets = assetInfo?.balances?.filter((x) => x.amount > 0);

    if (hostWallets?.length !== 1) return false;

    const hostAddress = hostWallets[0].address;

    if (hostAddress !== selectAddress) return false;

    return true;
}

export function checkQuantitesWithWallet(asset, assetInWallet) {
    const { total, asset_id } = asset ?? {};

    const assetinMyWallets = assetInWallet?.filter(
        (asset) => asset['asset-id'] === asset_id && asset['amount'] > 0,
    );

    if (assetinMyWallets?.[0]?.amount === total) return true;

    return false;
}

export async function onShowDeleteBtn(currentAsset, user, assetsInWallet, setCanDelete) {
    if (Object.keys(currentAsset).length === 0) return;
    const assetManager = currentAsset?.asset?.manager;

    const myManagerAddress = user?.wallets?.find((x) => x === assetManager);

    const auctionsOrSales = currentAsset?.nodes?.filter(
        (node) => node?.auctions?.length !== 0 || node?.sales?.length !== 0,
    );
    if (!myManagerAddress || auctionsOrSales?.length !== 0) {
        return;
    }

    const response = checkQuantitesWithWallet(currentAsset?.asset, assetsInWallet);

    if (response) return setCanDelete(true);

    return setCanDelete(false);
}

export async function getAssetsFromWallet(wallets) {
    try {
        let allAssets = [];
        for (let i = 0; i < wallets?.length; i++) {
            const accountInfo = await getAccountInfo(wallets[i]);
            if (!accountInfo?.account) continue;
            const existsAssets = accountInfo?.account?.assets?.filter((asset) => asset.amount > 0);
            allAssets.push(...existsAssets);
        }

        return allAssets;
    } catch (err) {
        console.log(err);
        return [];
    }
}
