import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Box, Fab, Drawer } from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';
import { loadMoreMarketplaceItems, loadMoreMarketplaceUsers } from 'redux/marketplace/actions';
import {
    setValueSearchFromHome,
    setFilterByTagFromSide,
    moveMarketplaceFromFeatured,
    getMinCardPeople,
    afterMakeAnOffer,
} from 'redux/marketplace/actions';
import { setValueBestVoted } from 'redux/bestVotedAssets/actions';
import { getObjectFromLocationSearch } from 'helpers/urls';
import { getAssetsFromWallet } from 'transactions/algorand/validations';
import { FILTER_CONFIG } from 'configs/marketplaceConfig';
import TabSearch from '../../components/shared/TabSearch';
import PeopleMinCard from '../../components/elements/cards/peopleMinCard';
import FeaturedArtworks from './items/FeaturedArtworks';
import Assets from './items/Assets';
import People from './items/People';
import DrawerList from './items/fIlters';
import useWindowDimensions from 'hooks/useWindowDimensions';
import DropdownSortAsset from '../../components/shared/dropdown/dropdown-sort-asset';
import DropdownSortPeople from '../../components/shared/dropdown/dropdown-sort-people';
import DropdownFilter from '../../components/shared/dropdown/dropdown-filter';
import DropdownFilterPeople from '../../components/shared/dropdown/dropdown-filter-people';
import SidePanel from 'components/shared/SidePanel';
import FilterTab from './filterTab/FilterTab';

const Marketplace = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const assetTagsParam = params.get('assetTags') ? params.get('assetTags').split(',') : [];

    const history = useHistory();
    const [viewType, setViewType] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const {
        loadMoreMarkURL,
        peopleFromFooter,
        fromFeaturedArtist,
        minCardPeople,
        searchFromHomePage,
        filterByTagFromSide,
    } = useSelector((state) => state.marketplace);
    const { user: authUser } = useSelector((state) => state.auth);
    const { fromBestVoted } = useSelector((state) => state.bestVotedAssets);
    const { isDarkMode } = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const [filterObj, setFilterObj] = useState(FILTER_CONFIG.assetFilter);

    const { isMobile } = useWindowDimensions();
    // FIXME: workaround for users uploading in bulk and flooding "recently"
    // filter is to always select most popular. Need to improve the filter
    // and display capabilities. Change setSearchAssets and setSearchPeople
    // in DrawerList once updated.
    const [sortAssets, setSortAssets] = useState(
        fromBestVoted ? FILTER_CONFIG.popular : FILTER_CONFIG.recently_listed,
    );
    const [filterAssetsByTag, setFilterAssetsByTag] = useState(assetTagsParam);

    const [sortPeople, setSortPeople] = useState(FILTER_CONFIG.mostFollowed);
    const [filterPeopleByTag, setFilterPeopleByTag] = useState([]);
    const [filterPeople, setFilterPeople] = useState('');

    const [searchValue, setSearchValue] = useState(searchFromHomePage || '');

    const [sortPeopleByRole, setSortPeopleByRole] = useState('');
    const [assetsInWallet, setAssetsInWallet] = useState(null);

    const getAccount = useCallback(async () => {
        if (authUser?.wallets?.length) {
            const assets = await getAssetsFromWallet(authUser?.wallets);
            setAssetsInWallet(assets);
        }
    }, [authUser?.wallets]);

    useEffect(() => getAccount(), [getAccount]);

    useEffect(() => {
        if (peopleFromFooter?.sort) {
            // setViewType(peopleFromFooter?.viewType);
            setSortPeopleByRole(peopleFromFooter?.sort);
        }
    }, [peopleFromFooter]);

    useEffect(() => {
        if (fromFeaturedArtist) {
            // setViewType('people');
            setFilterPeople(FILTER_CONFIG.featuredAtrist);
        }
        return () => {
            dispatch(moveMarketplaceFromFeatured(false));
        };
    }, [fromFeaturedArtist, dispatch]);

    useEffect(() => {
        if (filterByTagFromSide) setFilterAssetsByTag([filterByTagFromSide]);
    }, [filterByTagFromSide]);

    useEffect(() => {
        if (!viewType) {
            const currentRequest = axios.CancelToken.source();
            let filter = '';
            if (searchValue) filter = '&search=' + encodeURIComponent(searchValue);
            dispatch(getMinCardPeople(filter, currentRequest));

            return () => currentRequest?.cancel();
        }
    }, [dispatch, searchValue, searchFromHomePage, viewType]);

    useEffect(() => {
        return () => {
            dispatch(setValueSearchFromHome(null));
            dispatch(setValueBestVoted(false));
            dispatch(setFilterByTagFromSide(null));
        };
    }, [dispatch]);

    useEffect(() => {
        const objSearch = getObjectFromLocationSearch(history.location.search);
        if (objSearch?.type) {
            setViewType(objSearch?.type);
        } else {
            setViewType(null);
        }

        if (objSearch?.status) {
            const statuses = objSearch.status.split(',');

            setFilterObj({
                ...filterObj,
                status: statuses,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history.location.search]);

    const loadMoreAssets = (url, category) => {
        if (url && category) {
            dispatch(loadMoreMarketplaceItems(url, category));
        }
    };

    const loadMoreUsers = (url) => {
        if (url) {
            dispatch(loadMoreMarketplaceUsers(url));
        }
    };

    return (
        <div className="marketplace pt-16">
            {/*Marketplace Featured Artists*/}
            {/* <FeaturedArtworks assetsInWallet={assetsInWallet} afterMakeAnOffer={afterMakeAnOffer} /> */}
            {/* {!isMobile && (
                <Fab variant="extended" onClick={openDrawer} className="extend-filter-btn">
                    <ChevronRight sx={{ mr: 1 }} />
                </Fab>
            )} */}

            <div className="marketplace-content">
                <Container maxWidth="xl">
                    {/*Search with tab*/}
                    {/* <TabSearch
                        viewType={viewType}
                        setAssetsType={setViewType}
                        setSearchValue={setSearchValue}
                        searchValue={searchValue}
                    /> */}
                    <FilterTab
                        selectedAssetTags={['1', '2']}
                        assetTags={['1']}
                        viewMode={'grid'}
                        openFilterBtnLabel={'OpenFilter'}
                        isOpenFilter={drawerOpen}
                        handleOpenFilter={(e) => setDrawerOpen(e)}
                        handleSelectAssetTag={() => console.log('handleSelectAssetTag')}
                        handleViewMode={() => console.log('handleViewMode')}
                    />

                    {isMobile && (
                        <Box
                            display={{ sm: 'block', md: 'flex' }}
                            justifyContent="space-between"
                            className="filter-list"
                        >
                            <Box className="filter-sort">
                                {/*Dropdown with Radio Buttons for Assets*/}
                                {viewType === 'people' ? (
                                    <>
                                        <DropdownFilterPeople
                                            setFilterPeople={setFilterPeople}
                                            filterPeople={filterPeople}
                                        />
                                        <DropdownSortPeople
                                            sortPeople={sortPeople}
                                            setSortPeople={setSortPeople}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <DropdownFilter
                                            setFilterObj={setFilterObj}
                                            filterObj={filterObj}
                                        />
                                        <DropdownSortAsset
                                            setSortAssets={setSortAssets}
                                            sortAssets={sortAssets}
                                        />
                                    </>
                                )}
                            </Box>
                        </Box>
                    )}
                    {/*People mini cards*/}
                    {/* {!viewType && (
                        <Box display="flex" flexWrap="wrap" justifyContent="space-between" py={3}>
                            {minCardPeople?.map((item) => (
                                <PeopleMinCard
                                    key={`min-${item.username}`}
                                    sale_amount={item.sale_amount ?? item.sale_amount}
                                    tags={item.selected_tags}
                                    authorAvatar={item.avatar}
                                    author={item.username}
                                />
                            ))}
                        </Box>
                    )} */}

                    {/*Search result*/}
                    <div className="marketplace-result">
                        {viewType === 'people' && (
                            <People
                                sortPeople={sortPeople}
                                filterPeopleByTag={filterPeopleByTag}
                                searchValue={searchValue}
                                sortPeopleByRole={sortPeopleByRole}
                                filterPeople={filterPeople}
                                loadMoreUsers={loadMoreUsers}
                                displayVisibility={viewType === 'people'}
                            />
                        )}
                        {/* All Assets */}
                        {viewType !== 'people' && (
                            <Assets
                                title="All Assets"
                                searchValue={searchValue}
                                filterObj={filterObj}
                                sortAssets={sortAssets}
                                filterAssetsByTag={filterAssetsByTag}
                                loadMoreMarkURL={loadMoreMarkURL}
                                loadMoreAssets={loadMoreAssets}
                                displayVisibility={viewType !== 'people'}
                                searchFromHomePage={searchFromHomePage}
                                category={FILTER_CONFIG.all_assets}
                                assetsInWallet={assetsInWallet}
                                afterMakeAnOffer={afterMakeAnOffer}
                            />
                        )}
                        {/* )} */}
                    </div>
                </Container>
            </div>
            <SidePanel
                open={drawerOpen}
                handleClose={() => setDrawerOpen(false)}
                closeButtonLabel="Filters"
            >
                <DrawerList
                    setFilterObj={setFilterObj}
                    filterObj={filterObj}
                    setSortAssets={setSortAssets}
                    sortAssets={sortAssets}
                    setSortPeople={setSortPeople}
                    sortPeople={sortPeople}
                    setSortPeopleByRole={setSortPeopleByRole}
                    sortPeopleByRole={sortPeopleByRole}
                    filterAssetsByTag={filterAssetsByTag}
                    setFilterAssetsByTag={setFilterAssetsByTag}
                    filterPeopleByTag={filterPeopleByTag}
                    setFilterPeopleByTag={setFilterPeopleByTag}
                    viewType={viewType}
                    setSearchValueAsset={setSearchValue}
                    setSearchValuePeople={setSearchValue}
                    setSearchValue={viewType === 'people' ? setSearchValue : setSearchValue}
                />
            </SidePanel>
            {/* <Drawer
                open={drawerOpen}
                onClose={closeDrawer}
                className={isDarkMode ? 'custom-drawer-dark' : 'custom-drawer'}
            ></Drawer> */}
        </div>
    );
};

export default Marketplace;
