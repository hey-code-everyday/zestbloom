import { ALLOWED_FILE_EXTENSIONS } from './assetsConfig';

const info = {
    connectWallet: { status: 'info', message: 'You need to connect your wallet' },
    dontHaveContract: { status: 'info', message: 'This asset does not have a contract' },
    dontChangeInfo: { status: 'info', message: 'You have not changed anything' },
    strCancelingSaleEscrow: {
        status: 'info',
        message: 'Start canceling "Sale by Escrow" contract',
    },
    strCancelingOfferEscrow: {
        status: 'info',
        message: 'Start canceling "Offer by Escrow" contract',
    },
    strDestroy: { status: 'info', message: 'Start destroying assets' },
    noBelongToYou: {
        status: 'info',
        message: 'This contract does not belong to you or this asset has already been bought',
    },
    inputTypes: {
        status: 'info',
        message: `Please input one of these types ${ALLOWED_FILE_EXTENSIONS.toString()}`,
    },
    fileSize: {
        status: 'info',
        message: 'Please input file less than',
    },
    lastBidMine: {
        status: 'info',
        message: 'The last bid is yours',
    },
    fillContributor: {
        status: 'info',
        message: 'Please fill last contributor to add more',
    },
    loginOrConnectWallet: {
        status: 'info',
        message: 'Login or connect your wallet.',
    },
    sameWallet: {
        status: 'info',
        message: 'This contract, created by your wallet, you cannot buy from  yourself',
    },
};

const success = {
    verified: { status: 'success', message: 'Wallet has been verified' },
    terminatedContract: {
        status: 'success',
        message: 'You have successfully terminated the contract',
    },
    finCancelingSaleEscrow: {
        status: 'success',
        message: 'Finish canceling "Sale by Escrow" contract',
    },
    finCancelingOfferEscrow: {
        status: 'success',
        message: 'Finish canceling "Offer by Escrow" contract',
    },
    offerRejected: { status: 'success', message: 'The offer was successfully declined' },
    sendReport: { status: 'success', message: 'Report sent successfully' },
    createContract: { status: 'success', message: 'The contract was created successfully!' },
    updated: {
        status: 'success',
        message: 'The asset was updated successfully! Start contract creation',
    },
    destroyed: { status: 'success', message: 'Asset successfully destroyed' },
    uploaded: { status: 'success', message: 'The asset was uploaded successfully!' },
    minimumPriceAdded: { status: 'success', message: 'Minimum offer price successfully added' },
    createdOffer: { status: 'success', message: 'You have created an Offer-by-Escrow contract' },
    offerComplated: { status: 'success', message: 'You have successfully accepted the offer' },
    auction_app_created: { status: 'success', message: 'Application created successfully' },
    sendAssetToApplication: {
        status: 'success',
        message: 'The asset was successfully sent to the application',
    },
    auctionCreated: {
        status: 'success',
        message: 'Auction created successfully',
    },
    auctionClosed: {
        status: 'success',
        message: 'Auction successfully closed',
    },
};

const error = {
    verificationFaild: { status: 'error', message: 'Verification failed. Wallet ' },
    wentWrong: { status: 'error', message: 'Something went wrong' },
    sendReport: { status: 'error', message: 'Report not sent, please try again' },
    missingContract: { status: 'error', message: 'Missing contract' },
    update: { status: 'error', message: 'Asset was not updated, please try again' },
    notFoundContract: { status: 'error', message: 'Contract not found' },
    dontMatchCreatorAddress: {
        status: 'error',
        message:
            'Your wallet address does not match the address of the asset creator, you cant edit asset',
    },
    cantUpload: { status: 'error', message: 'You can not upload an asset' },
    dontFoundTeal: { status: 'error', message: 'Missing contract TEAL' },
    offerDontComplate: {
        status: 'error',
        message: 'You could not accept the offers, please try again',
    },
    createdBid: {
        status: 'error',
        message: 'Somethink went wrong during creating bid',
    },
    notEnoughBalance: {
        status: 'error',
        message: 'You do not have enough amount',
    },
};

const warning = {
    walletdoesntMatch: {
        status: 'warning',
        message:
            'Your wallet address does not match the address where this asset is. Please select the correct wallet.',
    },
    alreadyBought: {
        status: 'warning',
        message: 'This asset has already been bought. You can not make changes',
    },
    assetManager: { status: 'warning', message: 'Only the Asset Manager can delete' },
    balanceLow: { status: 'warning', message: 'Wallet balance too low to create contract' },
    notEnoughBalance: {
        status: 'warning',
        message: 'Your account balance is not enough for this transaction',
    },
    dontHaveAsset: { status: 'warning', message: 'You dont have asset for sale' },
    auctionDontstarted: { status: 'warning', message: 'Auction does not started yet' },
    auctionFinished: { status: 'warning', message: 'Auction has already ended' },
    auctionNoEnded: { status: 'warning', message: 'Auction has not ended yet' },
    noAssetInNode: {
        status: 'warning',
        message: 'You do not have asset in this wallet, Please choose another wallet',
    },
};

export const NOTIFICATIONS = {
    info,
    success,
    warning,
    error,
};
