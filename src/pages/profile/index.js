import React, { useEffect, useCallback, useState, createContext, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from '@material-ui/core';
import { getProfileUser } from 'redux/profile/actions';
import { empty_user, changeProfileTabesType } from 'redux/profile/actions';
import LoadingNotFound from 'components/shared/LoadingNotFound';
import FilterTab from '../marketplace/filterTab/FilterTab';
import { getAssetsFromWallet } from 'transactions/algorand/validations';
import Banner from './Banner';
import ProfileAvatar from './ProfileAvatar';
import ProfileCollections from './ProfileCollections';
import DrawerList from '../marketplace/items/fIlters';
import SidePanel from '../../components/shared/SidePanel';
import { FILTER_CONFIG } from '../../configs';

export const AssetsFromWallet = createContext(null);

const Profile = () => {
    const dispatch = useDispatch();
    const { username } = useParams();
    const { search } = useLocation();
    const { user: profileUser, getUserLoading } = useSelector((state) => state.profile);
    const { user: authUser } = useSelector((state) => state.auth);
    const [assetsInWallet, setAssetsInWallet] = useState(null);
    const [viewMode, setViewMode] = useState('tile');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [filterObj, setFilterObj] = useState({
        ...FILTER_CONFIG.assetFilter,
        media_type: [],
    });
    const isMyProfile = authUser?.username === username;

    const isAuthUser = useMemo(
        () => authUser?.username === username,
        [authUser?.username, username],
    );
    const user = useMemo(
        () => (isAuthUser ? authUser : profileUser),
        [authUser, isAuthUser, profileUser],
    );

    useEffect(() => {
        const params = new URLSearchParams(search);
        const assetTagsParam = params.get('assetTags') ? params.get('assetTags').split(',') : [];
        setFilterObj((prev) => ({
            ...prev,
            media_type: assetTagsParam,
        }));
    }, [search]);

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
            <div className="profile-page">
                <Container maxWidth="lg" className="profile-page-container">
                    <div className="profile-content">
                        <ProfileAvatar username={username} user={user} />
                    </div>
                    <AssetsFromWallet.Provider value={assetsInWallet}>
                        <div className="filter-collection">
                            <FilterTab
                                viewMode={viewMode}
                                openFilterBtnLabel="Filter"
                                isOpenFilter={drawerOpen}
                                handleOpenFilter={(e) => setDrawerOpen(e)}
                                handleViewMode={setViewMode}
                                hasListView={isMyProfile}
                                dashboardPage
                            />
                        </div>
                        <ProfileCollections viewMode={viewMode} filters={filterObj} />
                        <SidePanel
                            open={drawerOpen}
                            handleClose={() => setDrawerOpen(false)}
                            closeButtonLabel="Filters"
                        >
                            <DrawerList
                                setFilterObj={setFilterObj}
                                filterObj={filterObj}
                                dashboardPage
                            />
                        </SidePanel>
                    </AssetsFromWallet.Provider>
                    {/*<Box display={{ xs: 'block', md: 'none' }}>*/}
                    {/*    <ProfileTopMobile username={username} user={user} />*/}
                    {/*</Box>*/}
                    {/*<div className="profile-content">*/}
                    {/*    <Sidebar username={username} user={user} />*/}
                    {/*    <AssetsFromWallet.Provider value={assetsInWallet}>*/}
                    {/*        <ProfileTabs*/}
                    {/*            username={username}*/}
                    {/*            type={profileTabesType?.type}*/}
                    {/*            tabNumber={profileTabesType?.tabNumber}*/}
                    {/*        />*/}
                    {/*    </AssetsFromWallet.Provider>*/}
                    {/*</div>*/}
                </Container>
            </div>
        </>
    );
};

export default Profile;
