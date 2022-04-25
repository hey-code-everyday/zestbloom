import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Banner from './Banner';
import Products from './Products';
import About from './About';
import FeaturedArtists from './FeaturedArtists';
import BestVoted from './BestVoted';

import { VerifyEmail } from 'components/elements';
import { verifyForgotPassword, verifySignup, verifyEmail } from 'redux/auth/actions';

const Home = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const path = location.pathname.split('/');
    const code = path.pop();
    const serviceType = path.join('_');
    const [verifyDialog, setVerifyDialog] = useState(false);
    let isEmailVerification = path.indexOf('email') > -1;

    const verifyCases = () => {
        if (code && !verifyDialog) {
            switch (serviceType) {
                case '_verify':
                    dispatch(verifySignup(code))
                        .then(() => setVerifyDialog(true))
                        .catch(() => {});
                    break;
                case '_reset_verify':
                    dispatch(verifyForgotPassword(code))
                        .then(() => history.push('/reset'))
                        .catch(() => history.push('/'));
                    break;
                case '_email_verify':
                    dispatch(verifyEmail(code))
                        .then(() => {
                            setVerifyDialog(true);
                            history.push('/');
                        })
                        .catch(() => {
                            history.push('/');
                        });
                    break;
                default:
            }
        }
    };

    useEffect(verifyCases, [code, serviceType, verifyDialog, dispatch, history]);

    const verifyDialogClose = () => {
        setVerifyDialog(false);
    };

    return (
        <section className="homepage">
            <Banner />
            <Products />
            <About />
            <FeaturedArtists />
            <BestVoted />
            <VerifyEmail
                verifyDialog={verifyDialog}
                verifyDialogClose={verifyDialogClose}
                isEmailVerification={isEmailVerification}
            />
        </section>
    );
};

export default Home;
