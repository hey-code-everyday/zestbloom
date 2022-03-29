import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

import { THEME_CONFIG, PUBLIC_ROUTE_CONFIG, PROTECTED_ROUTE_CONFIG } from 'configs';
import { Auth, MainRoute } from 'components/elements';
import WebSocketContainer from 'components/elements/webSocket';
import NotFound from 'components/shared/notFound';
import PageLoading from 'components/shared/PageLoading';

function App() {
    const { isLoggedIn } = useSelector((state) => state.auth);
    const { initBannerPlaceholderState, initFeaturedArtistState } = useSelector(
        (state) => state.marketplace,
    );
    const { isDarkMode } = useSelector((state) => state.profile);
    const { initTopBidStore } = useSelector((state) => state.topBidAssets);

    return (
        <ThemeProvider theme={THEME_CONFIG}>
            <CssBaseline />
            <PageLoading
                loading={
                    !(initBannerPlaceholderState && initFeaturedArtistState && initTopBidStore)
                }
            />
            <main
                className={`main ${
                    initBannerPlaceholderState && initFeaturedArtistState && initTopBidStore
                        ? ''
                        : 'display-none'
                } ${isDarkMode ? 'dark-mode' : ''}`}
            >
                <Auth />
                <WebSocketContainer isLoggedIn={isLoggedIn} />
                <Switch>
                    {isLoggedIn &&
                        PROTECTED_ROUTE_CONFIG.map((route, i) => <MainRoute key={i} {...route} />)}
                    {PUBLIC_ROUTE_CONFIG.map((route, i) => (
                        <MainRoute key={i} {...route} />
                    ))}
                    <Route render={(props) => <NotFound />} />
                </Switch>
            </main>
        </ThemeProvider>
    );
}

export default App;
