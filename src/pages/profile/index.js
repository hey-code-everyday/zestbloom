import React, { useEffect, useCallback, useState, createContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box } from '@material-ui/core';
import { getProfileUser } from 'redux/profile/actions';
import { empty_user, changeProfileTabesType } from 'redux/profile/actions';
import LoadingNotFound from 'components/shared/LoadingNotFound';
import { getAssetsFromWallet } from 'transactions/algorand/validations';
import Banner from './Banner';
import Sidebar from './Sidebar';
import ProfileTabs from './ProfileTabs';
import ProfileTopMobile from './ProfileTopMobile';

export const AssetsFromWallet = createContext(null);

const Profile = () => {
    const dispatch = useDispatch();
    const { username } = useParams();
    const {
        user: profileUser,
        getUserLoading,
        profileTabesType,
    } = useSelector((state) => state.profile);
    const { user: authUser } = useSelector((state) => state.auth);
    const [assetsInWallet, setAssetsInWallet] = useState(null);

    const isAuthUser = useMemo(
        () => authUser?.username === username,
        [authUser?.username, username],
    );
    const user = useMemo(
        () => (isAuthUser ? authUser : profileUser),
        [authUser, isAuthUser, profileUser],
    );

    const banner = user?.banner;

    useEffect(() => {
        if (username && !isAuthUser) {
            dispatch(getProfileUser(username));
        }

        return () => {
            dispatch(empty_user());
            dispatch(changeProfileTabesType({ type: 'default', tabNumber: 0 }));
        };
    }, [username, dispatch, isAuthUser]);

    const getAccount = useCallback(async () => {
        if (isAuthUser && authUser?.wallets?.length) {
            const assets = await getAssetsFromWallet(authUser?.wallets);
            setAssetsInWallet(assets);
        }
    }, [isAuthUser, authUser?.wallets]);

    useEffect(() => {
        getAccount();
    }, [getAccount]);

    if (Object.keys(user).length === 0) {
        return <LoadingNotFound loading={getUserLoading} />;
    }

    return (
        <>
            <Banner banner={banner} />
            <Container maxWidth="xl">
                <Box display={{ xs: 'block', md: 'none' }}>
                    <ProfileTopMobile username={username} user={user} />
                </Box>
                <div className="profile-content">
                    <Sidebar username={username} user={user} />
                    <AssetsFromWallet.Provider value={assetsInWallet}>
                        <ProfileTabs
                            username={username}
                            type={profileTabesType?.type}
                            tabNumber={profileTabesType?.tabNumber}
                        />
                    </AssetsFromWallet.Provider>
                </div>
            </Container>
        </>
    );
};

export default Profile;
