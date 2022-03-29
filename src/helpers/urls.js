const ipfsCacher = window.__RUNTIME_CONFIG__.REACT_APP_IPFS_IMAGE_CACHER;

export const getAssetURL = (assetName, hash) => {
    const assetNameToLowerCase = assetName.toLowerCase();
    const splitName = assetNameToLowerCase.split('@');
    const checkedName = splitName.pop();
    if (checkedName === 'arc3') {
        return hash;
    }
    return `${hash}#arc3`;
};

export const getObjectFromLocationSearch = (search) => {
    if (!search) return null;
    const withoutSymbol = search.replace('?', '');
    const toArray = withoutSymbol.split('&');
    const keyValue = toArray.reduce((acc, curr) => {
        const keyAndValue = curr.split('=');
        const key = keyAndValue[0];
        const value = keyAndValue[1];
        return { ...acc, [key]: value };
    }, {});
    return keyValue;
};

export const getCachedURL = (url, size) => {
    if (ipfsCacher !== undefined) {
        return `${ipfsCacher}/images?url=${encodeURIComponent(url)}&size=${size}`;
    } else {
        return url;
    }
};
