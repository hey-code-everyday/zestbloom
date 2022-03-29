import { getAlgodIndexer } from './index';
import { getAlgodClient } from './index';

export async function getAccountInfo(address) {
    try {
        const indexerClient = getAlgodIndexer();
        const accountInfo = await indexerClient.lookupAccountByID(address).do();
        return accountInfo;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export async function getAccount(address) {
    try {
        const algodClient = getAlgodClient();
        const account = await algodClient.accountInformation(address).do();
        return account;
    } catch (err) {
        console.log(err);
        return null;
    }
}
