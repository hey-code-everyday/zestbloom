import React, { createContext, useRef } from 'react';
import { Route } from 'react-router-dom';
import { Header, Footer } from 'components/elements';
import {
    FAQ,
    POST_AUCTION,
    UPLOADASSET,
    USER_PROFILE,
    USER_PROFILE_TAB,
    USER_PROFILE_TAB_DETAILS,
} from '../../configs/routes';

export const AboutAnchorContext = createContext(null);

function MainRoute(route) {
    const { path, exact, hasSearch } = route;
    const anchorRef = useRef(null);

    return (
        <AboutAnchorContext.Provider value={anchorRef}>
            <Header hasSearch={hasSearch} />
            <Route exact={exact} path={path} render={(props) => <route.component {...props} />} />
            {path !== POST_AUCTION &&
                path !== UPLOADASSET &&
                path !== FAQ &&
                !path.includes(USER_PROFILE) &&
                !path.includes(USER_PROFILE_TAB) &&
                !path.includes(USER_PROFILE_TAB_DETAILS) && <Footer />}
        </AboutAnchorContext.Provider>
    );
}

export default MainRoute;
