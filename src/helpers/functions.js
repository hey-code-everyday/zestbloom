export const toRem = (number) => `${number / 16}rem`;

export const threeDecimals = (value) => Number.isInteger(Number(value * 10 ** 3));

export const maxAssetSize = (limit) => limit * Math.pow(1024, 2);

export const getSaleAmountEditPage = (contract) => {
    let price =
        (contract?.teal_context?.sale_amount + contract?.teal_context?.commission_payment) /
        1000000;
    if (contract?.teal_context?.royalty_percent) {
        price += contract?.teal_context?.royalty_percent / 1000000;
    }
    return price;
};

export const getSaleAmount = (contract) => {
    const price = getSaleAmountEditPage(contract);
    return contract ? price.toFixed(3) : '';
};

export const getSaleAmountAssetCard = (contract) => {
    const price = getSaleAmountEditPage(contract);
    return contract ? price.toFixed(3) : '';
};

export const getOfferAmount = (offer) => {
    if (!offer) return 0;
    const price = (offer.teal_context?.offer_amount || 0) / 1000000;
    return price;
};

export const getNetAmount = (isCreator, totalAmount, zestbloomPercent, royalties) => {
    if (isCreator) {
        const netAmount = (totalAmount * (100 - zestbloomPercent)) / 100;
        return netAmount;
    } else {
        const netAmount = (totalAmount * (100 - (zestbloomPercent + royalties))) / 100;
        return netAmount;
    }
};

export const checkContract = (node) => {
    const contract = node?.sales?.find((x) => x.status === 'ACTIVE' && x.type === 'SaleByEscrow');

    return !!contract;
};

export const checkAuction = (node) => {
    const auction = node?.auctions?.find((x) => x.status === 'STARTED');

    return !!auction;
};

export const stopEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
};

export const dangerTime = (date) => {
    return (
        !date.includes('years') &&
        !date.includes('year') &&
        !date.includes('days') &&
        !date.includes('day') &&
        !date.includes('hours')
    );
};

export const showUserName = (username, count = 8) => {
    if (username?.length < count + 2) return username;

    return `${username?.slice(0, count)}...`;
};
