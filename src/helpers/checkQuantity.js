import { checkContract, checkAuction } from './functions';

export const checkIsHost = (node, asset) => {
    const isHost = asset?.holders?.find(
        (wallet) => wallet.address === node?.holder && wallet.amount > 0,
    );

    return !!isHost;
};

export const getHosts = (asset) => {
    const hasNodeAsset = asset?.nodes?.filter((node) => {
        return checkIsHost(node, asset);
    });

    return hasNodeAsset;
};

export const isHaveAsset = (node, asset, contract = true, auction = true) => {
    if (!node) return false;
    const isHost = checkIsHost(node, asset);

    return !!(isHost || (contract && checkContract(node)) || (auction && checkAuction(node)));
};
