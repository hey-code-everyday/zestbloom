import { loadStdlib } from '@reach-sh/stdlib';
import MyAlgoConnect from '@reach-sh/stdlib/ALGO_MyAlgoConnect';
import WalletConnect from '@reach-sh/stdlib/ALGO_WalletConnect';

let reach;

function getCurrentNetwork() {
    const { REACT_APP_NETWORK } = process.env;
    const networkEnv = REACT_APP_NETWORK || 'ALGO';
    return networkEnv;
}

function getCurrentProvider() {
    const { REACT_APP_NETWORK_PROVIDER } = process.env;
    const providerEnv = REACT_APP_NETWORK_PROVIDER || 'TestNet';
    return providerEnv;
}

function getCurrentWallet() {
    return localStorage.getItem('walletFallback') || 'MyAlgoConnect';
}

function reloadStdlib() {
    const networkEnv = getCurrentNetwork();
    const providerEnv = getCurrentProvider();
    const wallet = getCurrentWallet();
    let stdlib = loadStdlib({
        REACH_CONNECTOR_MODE: getCurrentNetwork(),
    });
    if (networkEnv === 'ALGO') {
        switch (wallet) {
            default:
            case 'MyAlgoConnect':
                stdlib.setWalletFallback(
                    stdlib.walletFallback({
                        providerEnv,
                        MyAlgoConnect,
                    }),
                );
                break;
            case 'WalletConnect':
                stdlib.setWalletFallback(
                    stdlib.walletFallback({
                        providerEnv,
                        WalletConnect,
                    }),
                );
                break;
            case 'Mnemonic':
                stdlib.setWalletFallback(
                    stdlib.walletFallback({
                        providerEnv,
                    }),
                );
                break;
        }
    }
    return stdlib;
}

/** Global default reach object */
export function useReach() {
    if (!reach) {
        reach = reloadStdlib();
    }
    return reach;
}
