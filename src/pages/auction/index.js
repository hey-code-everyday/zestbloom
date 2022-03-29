import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, Grid } from '@material-ui/core';
import BreadcrumbsNav from '../../components/shared/Breadcrumbs';
// import TabSearch from '../../components/shared/TabSearch';

// import DropdownFilter from '../../components/shared/dropdown/dropdown-filter';
// import DropdownSortAsset from '../../components/shared/dropdown/dropdown-sort-asset';
import DropdownAuctions from '../../components/shared/dropdown/dropdown-auctions';
import { Link } from 'react-router-dom';

import BidModal from '../../components/elements/modal/placeBid';
import BidDoneModal from '../../components/elements/modal/bidDone';

import AuctionCard from 'components/elements/cards/auctionCard';
import Tags from 'pages/marketplace/items/Tags';
import { getAuctionAssets, loadMoreAuctionAssets } from 'redux/auction/actions';
import { useDispatch, useSelector } from 'react-redux';
import LottieContainer from 'components/shared/LottieContainer';

// import Notification from './notification';

/*Assets List*/

const Auction = () => {
    /*Bid Modal & Done Modal*/
    const dispatch = useDispatch();
    const [bidModal, setBidModal] = React.useState(false);
    const [submittedBid, setSubmittedBid] = React.useState(false);
    const [filterAssetsByTag, setFilterAssetsByTag] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    // const [activity, setActivity] = useState(false);
    const { auctionAssets, loadMoreAssets, loadMoreAssetsLoading, loadingItems } = useSelector(
        (state) => state.auction,
    );
    useEffect(() => {
        dispatch(getAuctionAssets());
    }, [dispatch]);

    // for auction
    // const openActivityMenu = (e) => {
    //     setActivity(!activity);
    // };
    const onOpenBidModal = () => {
        setBidModal(true);
    };

    const onCloseBidModal = () => {
        setBidModal(false);
        setSelectedAsset(null);
    };
    const onOpenSubmittedBid = () => {
        setBidModal(false);
        setSubmittedBid(true);
    };
    const onCloseSubmittedBid = () => {
        setSubmittedBid(false);
    };

    const loadMore = () => {
        dispatch(loadMoreAuctionAssets(loadMoreAssets));
    };

    /*My Auction Activity*/

    return (
        <>
            <Box className="auction">
                {/*My Auctions Activity*/}
                {/*  To Do  */}
                {/* <Notification
                    activity={activity}
                    openActivityMenu={openActivityMenu}
                    onOpenBidModal={onOpenBidModal}
                /> */}
                {/* for minimalize  cards */}
                {/* <Container maxWidth="xl" className={`auction-container ${activity ? 'collapsed' : ''}`}> */}
                <Container maxWidth="xl" className={'auction-container'}>
                    <BreadcrumbsNav />

                    <Box
                        className="auction-title"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant="h2">Auction</Typography>
                        <Link
                            className="post-auction-btn"
                            variant="contained"
                            color="primary"
                            to="/post-auction"
                        >
                            Post an Auction
                        </Link>
                    </Box>

                    {/*Search with tab*/}
                    {/* <TabSearch /> */}

                    <Box
                        display={{ sm: 'block', md: 'flex' }}
                        justifyContent="space-between"
                        mb={2}
                        className="filter-list"
                    >
                        {/*Tags*/}
                        <Box className="button-tag-list">
                            <Box
                                display="flex"
                                flexDirection="row"
                                alignItems="center"
                                flexWrap="wrap"
                            >
                                <Tags
                                    filterByTag={filterAssetsByTag}
                                    setFilterByTag={setFilterAssetsByTag}
                                    viewType={'assets'}
                                />
                            </Box>
                        </Box>

                        {/*Filter DropdownDate*/}
                        <Box className="filter-sort">
                            {/*Dropdown with checkboxes Auctions*/}
                            <DropdownAuctions />
                            {/*Dropdown with checkboxes*/}
                            {/*<DropdownFilter />*/}
                            {/*Dropdown with Radio Buttons for Assets*/}
                            {/* <DropdownSortAsset /> */}
                        </Box>
                    </Box>

                    <Box className="auction-result">
                        {loadingItems && auctionAssets?.length === 0 && (
                            <LottieContainer
                                containerStyles={{
                                    height: '49px',
                                    width: '100%',
                                    marginTop: '40px',
                                }}
                                lottieStyles={{ width: '49px' }}
                            />
                        )}
                        {auctionAssets?.length === 0 && !loadingItems && (
                            <div
                                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                            >
                                No Assets
                            </div>
                        )}
                        <Grid container spacing={3} className="list-with-link">
                            {auctionAssets.map((item) => (
                                <Grid item lg={3} md={4} sm={6} xs={12} key={item.guid}>
                                    <AuctionCard
                                        key={item.id}
                                        item={item}
                                        onOpenBidModal={onOpenBidModal}
                                        isLoggedIn={true}
                                        setSelectedAsset={setSelectedAsset}
                                        // upvoteAsset={() => {}}
                                        // unUpvoteAsset={() => {}}
                                        // toFavoritesAssets={() => {}}
                                        // removeFromFavoritesAssets={() => {}}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                    {/*Load More Button*/}
                    {loadMoreAssets &&
                        (loadMoreAssetsLoading ? (
                            <LottieContainer
                                containerStyles={{
                                    height: '49px',
                                    width: '100%',
                                    marginTop: '40px',
                                }}
                                lottieStyles={{ width: '49px' }}
                            />
                        ) : (
                            <Box textAlign="center" mt={5}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    size="large"
                                    onClick={loadMore}
                                >
                                    Load More
                                </Button>
                            </Box>
                        ))}
                    {/* ))} */}
                </Container>
            </Box>
            {selectedAsset && (
                <BidModal
                    bidModal={bidModal}
                    onCloseBidModal={onCloseBidModal}
                    onOpenSubmittedBid={onOpenSubmittedBid}
                    selectedAsset={selectedAsset}
                />
            )}
            <BidDoneModal submittedBid={submittedBid} onCloseSubmittedBid={onCloseSubmittedBid} />
        </>
    );
};

export default Auction;
