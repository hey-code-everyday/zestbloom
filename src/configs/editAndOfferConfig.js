const marketplaceFeeDescription = (percent) => `${percent} % marketplace fee`;
const totalAmountDescription = (percent) =>
    `Your offered amount + ${percent}%  fee + 1 Algo (refundable) for contract`;

const minRequiredBalanceDescription = `This amount reflects the minimum balance your wallet 
    requires to maintain your ASA's and Contracts`;

export const MAKE_AN_OFFER_CONFIG = {
    marketplaceFeeDescription,
    totalAmountDescription,
    minRequiredBalanceDescription,
};

const netAmount = (percent) => `Your amount - ${percent}% fee - royalty percent`;
const tagsConfig =
    'You can write a custom tag and hit enter to save it. You can select only one custom tag out of those that you have created';

export const EDIT_PAGE_CONFIG = {
    netAmount,
    tagsConfig,
};
