import MyAlgoConnect from '@randlabs/myalgo-connect';
import WalletConnect from '@walletconnect/client';
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';
import { signTxn } from 'transactions/verifyWallets';
import { confirmWrapper } from 'components/shared/signConfirmPanel';
import { SIGNATURE_MODAL_INFO, NOTIFICATIONS } from 'configs';

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
const getWalletWalletConnect = async () => {
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
            wallet = getWalletWalletConnect;
            break;
    }
    return wallet();
};

// TODO combine two function below into single function or rename it makes sense
// TODO rename, connect to wallet while signed in
// now it is verifying wallet sign transaction
export const connectToMyAlgo = async (
    setWalletsToUser,
    setConnectLoading = () => {},
    accountsPrior = [],
    toVerifyWallets,
    giveNotification = () => {},
) => {
    try {
        const wallet = await getWallet();
        let accounts = wallet.check() ? wallet.accounts() : await wallet.connect();
        let accountsToAdd = ((accs) => accounts.filter((el) => !accs.includes(el.address)))(
            accountsPrior.map(({ address }) => address),
        );
        setConnectLoading(true);

        let verifyRequiredAccounts;
        if (accountsToAdd.length > 0) {
            const accountsNew = [
                ...accountsPrior,
                ...accountsToAdd.map((acc) => ({
                    name: acc.name,
                    address: acc.address,
                    provider: wallet.provider.constructor.name,
                })),
            ];
            verifyRequiredAccounts = await setWalletsToUser(accountsNew);

            await verifyWallets(
                wallet.provider,
                verifyRequiredAccounts,
                accountsNew,
                toVerifyWallets,
                giveNotification,
            );
        }
        return verifyRequiredAccounts?.[0];
    } catch (err) {
        console.error(err);
    } finally {
        setConnectLoading(false);
    }
};

async function verifyWallets(
    walletProvider,
    verifyRequiredAccounts,
    accounts,
    toVerifyWallets,
    giveNotification,
) {
    try {
        if (verifyRequiredAccounts.length === 0) return;

        const currentWallet = verifyRequiredAccounts[0];
        const accountInfo = accounts.find((account) => account?.address === currentWallet?.address);
        // if wallet is verified, do not need to verify again
        if (!currentWallet?.txn) return;

        // show modal to confirm the verify wallet
        const askToSign = await confirmWrapper(SIGNATURE_MODAL_INFO.verifyWallet);
        if (!askToSign) {
            return giveNotification({
                status: NOTIFICATIONS.error.verificationFailed.status,
                message: NOTIFICATIONS.error.verificationFailed.message + ` "${accountInfo?.name}"`,
            });
        }

        // if user clicks verify wallet, sign in transaction using user wallet
        const res = await signTxn(walletProvider, currentWallet);
        console.log(res, 'res');

        if (!res) return;

        const verify = await toVerifyWallets(res);
        console.log(verify, 'verify');
        if (verify?.status === 200) {
            console.log(verify, 'success');
            giveNotification({
                status: NOTIFICATIONS.success.verified.status,
                message: ` "${accountInfo?.name}" ` + NOTIFICATIONS.success.verified.message,
            });
        } else {
            console.log(verify, 'failed');
            giveNotification({
                status: NOTIFICATIONS.error.verificationFailed.status,
                message: NOTIFICATIONS.error.verificationFailed.message + ` "${accountInfo?.name}"`,
            });
        }

        // pop out verified wallet from array and repeat the wallet verify operation
        verifyRequiredAccounts.shift();
        if (verifyRequiredAccounts.length === 0) return;

        verifyWallets(
            walletProvider,
            verifyRequiredAccounts,
            accounts,
            toVerifyWallets,
            giveNotification,
        );
    } catch (err) {
        giveNotification({
            status: NOTIFICATIONS.error.verificationFailed.status,
            message: 'Wallet verify failed',
        });
        console.log(err);
    }
}

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
