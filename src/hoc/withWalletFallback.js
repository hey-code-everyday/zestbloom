export const withWalletFallback = (Component) => {
    return (props) => {
        const walletFallback = localStorage.getItem('walletFallback') || String('MyAlgoConnect');
        return <Component {...props} walletFallback={walletFallback} />;
    };
};
