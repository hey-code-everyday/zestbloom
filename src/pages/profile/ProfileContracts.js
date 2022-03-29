import React, { useEffect, useMemo, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core';
import ProfileContractsMain from './contracts/Main';
import ProfileContractsOffers from './contracts/Offers';
import ProfileContractsAuctions from './contracts/Auctions';
import ProfileContractsListings from './contracts/Listings';
import ProfileContractsBids from './contracts/Bids';
import { getOffers, getAuctions, getBids, getListings } from 'redux/contracts/actions';
import { AssetsFromWallet } from '.';
import LottieContainer from 'components/shared/LottieContainer';
import axios from 'axios';
const ITEMS = [
    {
        id: 'offers',
        label: 'OFFERS',
    },
    {
        id: 'listings',
        label: 'LISTINGS',
    },
    {
        id: 'auctions',
        label: 'AUCTIONS',
    },
    {
        id: 'bids',
        label: 'BIDS',
    },
];

const ProfileContracts = () => {
    const dispatch = useDispatch();
    const { username, type } = useParams();
    const { isLoggedIn } = useSelector((state) => state.auth);

    const contracts = useSelector(({ contracts }) => contracts);
    const { offers, auctions, bids, listings } = contracts;
    const loading = offers.loading || auctions.loading || bids.loading || listings.loading;
    const assetsInWallet = useContext(AssetsFromWallet);

    const items = useMemo(
        () =>
            ITEMS.map((i) => {
                const { content, thumbnail } =
                    contracts[i.id]?.data?.find((c) => !!c.asset?.content)?.asset ?? {};

                const response = {
                    ...i,
                    visible: !!contracts[i.id]?.data?.length,
                    thumbnail: thumbnail?.url,
                };

                if (content) {
                    const { url, ipfs_url, mimetype } = content;

                    response.content_url = url ?? ipfs_url;
                    response.content_type = mimetype;
                }

                return response;
            }),
        [contracts],
    );
    useEffect(() => {
        const currentRequest = axios.CancelToken.source();
        if (isLoggedIn && username) {
            dispatch(getOffers(currentRequest));
            dispatch(getAuctions(currentRequest));
            dispatch(getBids(currentRequest));
            dispatch(getListings(currentRequest));
        }
        return () => currentRequest?.cancel();
    }, [dispatch, username, isLoggedIn]);

    if (loading) {
        return (
            <LottieContainer
                containerStyles={{
                    height: '49px',
                    width: '100%',
                    marginTop: '40px',
                }}
                lottieStyles={{ width: '50px' }}
            />
        );
    }

    return (
        <Grid className="profile-contracts" container>
            {!type && <ProfileContractsMain items={items} />}
            {type === 'offers' && (
                <ProfileContractsOffers
                    offers={offers?.data ?? []}
                    next={offers?.next}
                    assetsInWallet={assetsInWallet}
                />
            )}
            {type === 'listings' && (
                <ProfileContractsListings listings={listings?.data ?? []} next={listings?.next} />
            )}
            {type === 'auctions' && (
                <ProfileContractsAuctions auctions={auctions?.data ?? []} next={auctions?.next} />
            )}
            {type === 'bids' && <ProfileContractsBids bids={bids?.data ?? []} next={bids?.next} />}
        </Grid>
    );
};

export default ProfileContracts;
