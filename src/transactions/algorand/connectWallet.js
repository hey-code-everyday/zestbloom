import MyAlgoConnect from '@randlabs/myalgo-connect';
import WalletConnect from '@walletconnect/client';
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';

/*
 * initAlgorandConnection (MyAlgoConnect)
 * returns connect wallet addresses
 */
const getWalletMyAlgo = async () => {
    const connector = new MyAlgoConnect();
    return {
        provider: connector,
        connect: async () => {
            const accounts = await connector.connect();
            return accounts;
        },
        check: () => false,
        accounts: () => [],
    };
};
/*
 * initAlgorandConnection (WalletConnect)
 * returns connect wallet addresses
 */
const getWalletWalletConect = async () => {
    const connector = new WalletConnect({
        bridge: 'https://bridge.walletconnect.org',
        qrcodeModal: WalletConnectQRCodeModal,
    });
    return {
        provider: connector,
        connect: async () =>
            ((await connector.connect())?.accounts ?? []).map((address) => ({ address })),
        check: () => connector.connected,
        accounts: () =>
            connector.accounts.map((address) => ({
                address,
            })),
    };
};

/*
 * initAlgorandConnection
 * returns connect wallet addresses
 */
const getWallet = async () => {
    let wallet;
    switch (localStorage.getItem('walletFallback') || 'MyAlgoConnect') {
        default:
        case 'MyAlgoConnect':
            wallet = getWalletMyAlgo;
            break;
        case 'WalletConnect':
            wallet = getWalletWalletConect;
            break;
    }
    return wallet();
};

// TODO combine two function below into single function or rename it makes sense
// TODO rename, connect to wallet while signed in
export const connectToMyAlgo = async (
    setWalletsToUser,
    setConnectLoading = () => {},
    accountsPrior = [],
) => {
    try {
        const wallet = await getWallet();
        let accounts = wallet.check() ? wallet.accounts() : await wallet.connect();
        let accountsSelected = accounts.map(({ address }) => address);
        let accountsToAdd = ((accs) => accountsSelected.filter((el) => !accs.includes(el)))(
            accountsPrior.map(({ address }) => address),
        );
        setConnectLoading(true);
        let account;
        if (accountsToAdd.length > 0) {
            const accountsNew = [
                ...accountsPrior,
                ...accountsToAdd.map((address) => ({
                    name: wallet.provider.constructor.name,
                    address,
                    provider: wallet.provider.constructor.name,
                })),
            ];
            account = await setWalletsToUser(accountsNew);
        }
        return account?.[0];
    } catch (err) {
        console.error(err);
    } finally {
        setConnectLoading(false);
    }
};

// TODO rename, this function is called on connect wallet click
export const nonLoggedConnect = async (setWalletsToUser) => {
    try {
        const wallet = await getWallet();
        let accounts = wallet.check() ? wallet.accounts() : await wallet.connect();
        const account = await setWalletsToUser(accounts, false);
        return account;
    } catch (err) {
        console.log(err);
    }
};
