import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import { Container } from '@material-ui/core';

import { loadMoreMarketplaceItems } from 'redux/marketplace/actions';
import {
    setValueSearchFromHome,
    getMinCardPeople,
    afterMakeAnOffer,
    removeMarketplaceSearchResult,
} from 'redux/marketplace/actions';
import { setValueBestVoted } from 'redux/bestVotedAssets/actions';
import { getObjectFromLocationSearch } from 'helpers/urls';
import { getAssetsFromWallet } from 'transactions/algorand/validations';
import { FILTER_CONFIG } from 'configs/marketplaceConfig';
import Assets from './items/Assets';
import DrawerList from './items/fIlters';
import SidePanel from 'components/shared/SidePanel';
import FilterTab from './filterTab/FilterTab';

const Marketplace = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { search } = useLocation();

    const { loadMoreMarkURL, searchFromHomePage } = useSelector((state) => state.marketplace);
    const { user: authUser } = useSelector((state) => state.auth);
    const { fromBestVoted } = useSelector((state) => state.bestVotedAssets);

    // FIXME: workaround for users uploading in bulk and flooding "recently"
    // filter is to always select most popular. Need to improve the filter
    // and display capabilities. Change setSearchAssets and setSearchPeople
    // in DrawerList once updated.
    const [sortAssets] = useState(
        fromBestVoted ? FILTER_CONFIG.popular : FILTER_CONFIG.recently_listed,
    );
    const [viewType, setViewType] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [filterObj, setFilterObj] = useState(FILTER_CONFIG.assetFilter);
    const [filterAssetsByTag, setFilterAssetsByTag] = useState([]);
    const [searchValue] = useState(searchFromHomePage || '');
    const [assetsInWallet, setAssetsInWallet] = useState(null);
    const [viewMode, setViewMode] = useState('tile');

    const getAccount = useCallback(async () => {
        if (authUser?.wallets?.length) {
            const assets = await getAssetsFromWallet(authUser?.wallets);
            setAssetsInWallet(assets);
        }
    }, [authUser?.wallets]);

    useEffect(() => {
        const params = new URLSearchParams(search);
        const assetTagsParam = params.get('assetTags') ? params.get('assetTags').split(',') : [];
        setFilterAssetsByTag(assetTagsParam);
    }, [search]);

    useEffect(() => getAccount(), [getAccount]);

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
            dispatch(removeMarketplaceSearchResult());
            dispatch(setValueSearchFromHome(null));
            dispatch(setValueBestVoted(false));
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

    return (
        <div className="marketplace pt-16">
            <div className="marketplace-content">
                <Container maxWidth="xl">
                    <FilterTab
                        viewMode={viewMode}
                        openFilterBtnLabel="Filters"
                        isOpenFilter={drawerOpen}
                        handleOpenFilter={(e) => setDrawerOpen(e)}
                        handleViewMode={setViewMode}
                    />

                    <div className="marketplace-result">
                        {/* All Assets */}
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
                            viewMode={viewMode}
                        />
                    </div>
                </Container>
            </div>
            <SidePanel
                open={drawerOpen}
                handleClose={() => setDrawerOpen(false)}
                closeButtonLabel="Filters"
            >
                <DrawerList setFilterObj={setFilterObj} filterObj={filterObj} />
            </SidePanel>
        </div>
    );
};

export default Marketplace;
