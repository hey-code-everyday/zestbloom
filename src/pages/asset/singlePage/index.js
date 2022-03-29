import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { setFilterByTagFromSide } from 'redux/marketplace/actions';
import {
    getCurrentAsset,
    getAssetsWithSameTag,
    upvoteAssetWithSameTag,
    unUpvoteAssetWithSameTag,
    toFavoriteAssetWithSameTag,
    removeFromFavoritesAssetWithSameTag,
    changeAssetVisibility,
    emptyCurrentAsset,
    getActivities,
    ubdateAssetWithTaskId,
    placeABidAction,
    buyNowSuccess,
    afterMakeAnOffer,
    removeAsset,
} from 'redux/singleAsset/actions';
import { setValueBestVoted } from 'redux/bestVotedAssets/actions';
import PeopleMinCard from '../../../components/elements/cards/peopleMinCard';
import ShowMoreText from '../../../components/shared/ShowMoreText';
import PreviewTabs from '../../upload-asset/PreviewTabs';
import ReportAnIssueModal from '../../../components/elements/modal/reportAnIssue';
import AssetCard from '../../../components/elements/cards/assetCard';
import SeeMoreBtn from '../../../components/shared/SeeMoreBtn';

import { Box, Typography, Container, Link as LinkComponent, Grid } from '@material-ui/core';
import { ChevronRight, KeyboardArrowDown } from '@material-ui/icons';

import CardMenu from 'components/elements/cards/cardMenu';
import AssetImage from '../assetImage';
import Upvote from './upvote';
import ToFavorite from './favorite';
import GoToMyContracts from './contractBtns/goToMyContracts';
import PriceAndActions from './actionsWithAsset';
import { algorandBaseUrl } from 'transactions/algorand/index';
import { onShowDeleteBtn } from 'transactions/algorand/validations';
import { setNotification } from 'redux/profile/actions';
import { useUnsavedChangesWarning } from 'hooks';
import MultiplePeopleCard from 'components/elements/cards/multiplePeopleCard';
import ActivityTable from 'components/shared/activityTable';
import { checkContract, checkAuction } from 'helpers/functions';
import OwnersList from 'components/shared/ownersList';
import LoadingNotFound from 'components/shared/LoadingNotFound';
import Slider from 'components/shared/slider';
import { CREATOR, PRIVATE_OWNER, NOTIFICATIONS } from 'configs';
import { getAssetsFromWallet } from 'transactions/algorand/validations';
import { checkIsHost, isHaveAsset } from 'helpers/checkQuantity';
import useWindowDimensions from 'hooks/useWindowDimensions';
import DeleteAsset from '../editAsset/deleteAsset';

const Asset = () => {
    const dispatch = useDispatch();
    const { assetId } = useParams();
    // const [showList, setShowList] = useState(false);
    const { currentAsset, assetsWithSameTag, activities, reloadAsset, timeoutId, getAssetLoading } =
        useSelector((state) => state.singleAsset);
    const { user: authUser, isLoggedIn } = useSelector((state) => state.auth);
    const { selectedWallet } = useSelector((state) => state.profile);
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();
    const [reportIssue, setReportIssue] = useState(false);
    const [assetsInWallet, setAssetsInWallet] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const isFirstCall = useRef(true);
    const { isMobile } = useWindowDimensions();

    const staticTag = useMemo(
        () => currentAsset?.media_types?.find((tag) => tag.category === 'static'),
        [currentAsset],
    );
    const customTag = useMemo(
        () => currentAsset?.media_types?.find((tag) => tag.category === 'custom'),
        [currentAsset],
    );

    const canFollowAndVoted = () => {
        return isLoggedIn && authUser?.username !== currenUserHaveNodes?.[0]?.creator?.username;
    };

    useEffect(() => {
        if (assetId) {
            dispatch(getCurrentAsset(assetId));
        }
    }, [assetId, dispatch, reloadAsset]);

    useEffect(() => {
        return () => {
            clearTimeout(timeoutId);
        };
    }, [timeoutId, assetId]);

    useEffect(() => {
        return () => {
            dispatch(emptyCurrentAsset());
            isFirstCall.current = true;
        };
    }, [dispatch, assetId]);

    const task_id = useMemo(() => currentAsset?.updating_task?.task_id, [currentAsset]);

    useEffect(() => {
        if (isFirstCall.current && task_id) {
            dispatch(ubdateAssetWithTaskId(task_id));
            isFirstCall.current = false;
        }
    }, [task_id, dispatch]);

    useEffect(() => {
        if (staticTag) {
            dispatch(getAssetsWithSameTag(staticTag.slug));
        }
    }, [staticTag, dispatch]);

    useEffect(() => {
        if (isLoggedIn && currentAsset?.guid) {
            dispatch(getActivities(currentAsset?.guid));
        }
    }, [dispatch, currentAsset?.guid, isLoggedIn]);

    const getAccount = useCallback(async () => {
        if (authUser?.wallets?.length) {
            const assets = await getAssetsFromWallet(authUser?.wallets);
            setAssetsInWallet(assets);
        }
    }, [authUser?.wallets]);

    useEffect(() => {
        getAccount();
    }, [getAccount]);

    const isCreator = useMemo(
        () => (authUser?.username ? currentAsset?.creator?.username === authUser?.username : null),
        [currentAsset?.creator?.username, authUser?.username],
    );

    const currenUserHaveNodes = currentAsset?.nodes?.filter(
        (node) => authUser?.username && node?.owner?.username === authUser?.username,
    );

    const haveAssetsInMyWallets = useMemo(() => {
        const haveAsset = currenUserHaveNodes?.filter((x) =>
            isHaveAsset(x, currentAsset, true, false),
        );

        return haveAsset;
    }, [currenUserHaveNodes, currentAsset]);

    const fillPrivateUsers = currentAsset?.nodes?.map((collector) =>
        collector.owner ? collector : { ...collector, owner: PRIVATE_OWNER },
    );

    const collectors = fillPrivateUsers?.filter((collector) => collector.user_type !== CREATOR);
    const creator = fillPrivateUsers?.find((collector) => collector.user_type === CREATOR);

    const canEdit = useMemo(() => !!haveAssetsInMyWallets?.[0], [haveAssetsInMyWallets]);

    const haveAuction = useMemo(() => {
        const auctions = currenUserHaveNodes?.filter((x) => checkAuction(x));
        return !!auctions?.length;
    }, [currenUserHaveNodes]);

    const holderCollector = useMemo(() => {
        const hasNodeAsset = collectors?.filter((node) => {
            const isHost = checkIsHost(node, currentAsset);
            return !!(isHost || checkContract(node) || checkAuction(node));
        });

        return hasNodeAsset;
    }, [currentAsset, collectors]);

    const owners = useMemo(() => (holderCollector ? [...holderCollector] : []), [holderCollector]);

    const isCreatorHolder = useMemo(
        () => isHaveAsset(creator, currentAsset),
        [creator, currentAsset],
    );

    if (isCreatorHolder) owners.push(creator);

    const isMultipleAsset = currentAsset?.asset?.total > 1;

    const offerContract = useMemo(() => {
        if (isMultipleAsset) {
            return (
                currentAsset?.offers?.filter(
                    (offer) => offer.maker?.username === authUser?.username,
                ) ?? []
            );
        }
        const globalOffers = currentAsset?.offers ?? [];
        const ownerOffers = owners?.flatMap((x) => x.offers);

        const allOffers = [...globalOffers, ...ownerOffers];
        return allOffers?.filter((offer) => offer?.maker?.username === authUser?.username);
    }, [isMultipleAsset, owners, currentAsset, authUser]);

    const showDeletebutton = useCallback(
        async () => await onShowDeleteBtn(currentAsset, authUser, assetsInWallet, setCanDelete),
        [currentAsset, authUser, assetsInWallet],
    );

    useEffect(() => showDeletebutton(), [showDeletebutton]);

    if (!currentAsset || Object.keys(currentAsset).length === 0)
        return <LoadingNotFound loading={getAssetLoading} />;

    const createdByMe = () =>
        authUser?.username && authUser?.username === currentAsset?.creator?.owner?.username;

    const onOpenReportIssue = () => {
        setReportIssue(true);
    };
    const onCloseReportIssue = () => {
        setReportIssue(false);
    };

    const redirectToMarketplace = () => {
        dispatch(setValueBestVoted(true));
        if (staticTag) {
            dispatch(setFilterByTagFromSide(staticTag.slug));
        }
    };

    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };

    const deleteAssetFromReducer = (guid) => {
        dispatch(removeAsset(guid));
    };

    // const
    const onOpenDeleteModal = () => {
        if (!selectedWallet) return giveNotification(NOTIFICATIONS.info.connectWallet);
        if (selectedWallet?.address !== currentAsset?.asset?.manager)
            return giveNotification({
                ...NOTIFICATIONS.warning.walletdoesntMatch,
                message:
                    NOTIFICATIONS.warning.walletdoesntMatch.message +
                    ' : ' +
                    currentAsset?.asset?.manager?.slice(0, 6) +
                    '...',
            });
        setOpenModal(true);
    };

    const onCloseConfirmModal = () => {
        setOpenModal(false);
    };

    // const arrowDown = () => {
    //     setShowList(false);
    // };

    // const showTabs = () => (isLoggedIn && !isMultipleAsset()) || owners.length === 1;

    // const currenContracts = currentUserHaveAsset?.sales;

    return (
        <>
            <Box className="single-asset">
                <Container maxWidth="xl" className="single-asset-container">
                    <Box display="flex" className="asset">
                        <Box className="asset-left">
                            <AssetImage
                                staticTag={staticTag}
                                customTag={customTag}
                                currentAsset={{ ...currentAsset }}
                            />
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mt={3}
                                className="asset-left-bottom desktop-only"
                            >
                                <Box>
                                    View asset information in&nbsp;
                                    <LinkComponent
                                        href={`${algorandBaseUrl}/asset/${currentAsset?.asset?.asset_id}`}
                                        color="primary"
                                        target="_blank"
                                    >
                                        AlgoExplorer
                                    </LinkComponent>
                                </Box>
                                {isLoggedIn && (
                                    <button
                                        className="report-btn hover-opacity"
                                        onClick={onOpenReportIssue}
                                    >
                                        <i className="icon-exclamation-triangle" />
                                        Report an Issue
                                    </button>
                                )}
                            </Box>
                            {/* Escrow Status */}
                            {isLoggedIn && (
                                <GoToMyContracts
                                    currentAsset={currentAsset}
                                    currentAssetGuid={currentAsset?.guid}
                                />
                            )}
                        </Box>
                        <Box className="asset-right">
                            <Box className="asset-right-top">
                                <Box
                                    display={{ xs: 'flex', sm: 'block' }}
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        className="top-head"
                                    >
                                        <Box>
                                            <Typography variant="h4">
                                                {currentAsset?.title}
                                            </Typography>
                                            <Typography
                                                variant="subtitle1"
                                                style={{ fontWeight: 'bold' }}
                                            >
                                                Editions: {currentAsset?.asset.total}
                                            </Typography>
                                        </Box>
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            // className="card-header-actions"
                                        >
                                            {(canEdit || isCreator) && (
                                                <Box
                                                    border={1}
                                                    borderColor="text.black20"
                                                    borderRadius={10}
                                                    bgcolor="text.white"
                                                    overflow="hidden"
                                                    height={48}
                                                    width={48}
                                                    ml={1.5}
                                                    className="top-action"
                                                >
                                                    <CardMenu
                                                        currentAsset={currentAsset}
                                                        changeAssetVisibility={
                                                            changeAssetVisibility
                                                        }
                                                        nodes={currenUserHaveNodes}
                                                        haveAuction={haveAuction}
                                                        canEdit={canEdit}
                                                        onOpenDeleteModal={onOpenDeleteModal}
                                                        canDelete={canDelete}
                                                        deleteLoading={deleteLoading}
                                                    />
                                                </Box>
                                            )}
                                            {/* share information */}
                                            {/* <button className="share-btn hover-opacity">
                                            <i className="icon-share-2" style={{ fontSize: 24 }} />
                                        </button> */}
                                        </Box>
                                    </Box>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        mb={2.5}
                                        className="like-fav"
                                    >
                                        <Upvote
                                            currentAsset={{ ...currentAsset }}
                                            canFollowAndVoted={canFollowAndVoted()}
                                        />
                                        {!createdByMe() &&
                                            Object.keys(currentAsset).length !== 0 && (
                                                <ToFavorite
                                                    currentAsset={{ ...currentAsset }}
                                                    canFollowAndVoted={canFollowAndVoted()}
                                                />
                                            )}
                                    </Box>
                                </Box>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    className="creator-collector"
                                >
                                    <Box>
                                        <Typography className="desktop-only" variant="h6">
                                            Creator
                                        </Typography>
                                        <PeopleMinCard
                                            tags={creator?.owner?.selected_tags}
                                            author={creator?.owner?.username}
                                            authorAvatar={creator?.owner?.avatar}
                                        />
                                    </Box>
                                    {holderCollector[0] && (
                                        <div>
                                            {holderCollector.length === 1 ? (
                                                <Box>
                                                    <Typography variant="h6">
                                                        {currentAsset?.auction
                                                            ? 'Auctioned by '
                                                            : 'Collector'}
                                                    </Typography>
                                                    <PeopleMinCard
                                                        key={holderCollector[0]?.owner?.username}
                                                        tags={
                                                            holderCollector[0]?.owner?.selected_tags
                                                        }
                                                        author={holderCollector[0]?.owner?.username}
                                                        authorAvatar={
                                                            holderCollector[0]?.owner?.avatar
                                                        }
                                                    />
                                                </Box>
                                            ) : (
                                                <Box>
                                                    <Typography variant="h6">Collector</Typography>
                                                    <MultiplePeopleCard
                                                        owners={holderCollector}
                                                        // setShowList={setShowList}
                                                    />
                                                </Box>
                                            )}
                                        </div>
                                    )}
                                </Box>
                            </Box>
                            <PriceAndActions
                                currentAsset={currentAsset}
                                giveNotification={giveNotification}
                                hasOffer={offerContract}
                                isLoggedIn={isLoggedIn}
                                isMultipleAsset={isMultipleAsset}
                            />
                            <Box className="asset-right-bottom">
                                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                                    Description:
                                </Typography>
                                <ShowMoreText
                                    text={
                                        currentAsset?.description ? currentAsset?.description : ''
                                    }
                                    max={150}
                                />
                                {/*Tabs*/}
                                {/* {showTabs() && ( */}
                                <PreviewTabs
                                    collectors={collectors}
                                    activities={activities}
                                    fromSinglePage={true}
                                />
                                {/* )} */}
                            </Box>
                        </Box>
                    </Box>
                </Container>
                <Container maxWidth="xl">
                    <Box className="more-items">
                        {isMultipleAsset && (
                            <Box className="owners-list">
                                {/* {showList && owners.length > 1 && ( */}
                                <div style={{ paddingBottom: '2.5rem' }}>
                                    <KeyboardArrowDown
                                        style={{ float: 'right' }}
                                        // onClick={arrowDown}
                                    />
                                    <OwnersList
                                        owners={owners}
                                        currentAsset={currentAsset}
                                        giveNotification={giveNotification}
                                        holders={currentAsset?.holders}
                                    />
                                </div>
                                {/* )} */}
                                {isMultipleAsset && activities?.length > 0 && (
                                    <ActivityTable activities={activities}></ActivityTable>
                                )}
                            </Box>
                        )}
                        <Typography variant="h3">More Items</Typography>
                        {assetsWithSameTag.length !== 0 &&
                            (isMobile ? (
                                <Slider>
                                    {assetsWithSameTag?.map((item) => (
                                        <Box p={1} key={item?.guid}>
                                            <AssetCard
                                                item={item}
                                                upvoteAsset={upvoteAssetWithSameTag}
                                                unUpvoteAsset={unUpvoteAssetWithSameTag}
                                                toFavoritesAssets={toFavoriteAssetWithSameTag}
                                                removeFromFavoritesAssets={
                                                    removeFromFavoritesAssetWithSameTag
                                                }
                                                isLoggedIn={isLoggedIn}
                                                deleteAssetFromReducer={deleteAssetFromReducer}
                                            />
                                        </Box>
                                    ))}
                                </Slider>
                            ) : (
                                <Grid container spacing={3} className="list-with-link">
                                    {assetsWithSameTag?.map((item) => (
                                        <Grid item lg={3} md={6} sm={6} xs={12} key={item?.guid}>
                                            <AssetCard
                                                item={item}
                                                upvoteAsset={upvoteAssetWithSameTag}
                                                unUpvoteAsset={unUpvoteAssetWithSameTag}
                                                toFavoritesAssets={toFavoriteAssetWithSameTag}
                                                removeFromFavoritesAssets={
                                                    removeFromFavoritesAssetWithSameTag
                                                }
                                                isLoggedIn={isLoggedIn}
                                                assetsInWallet={assetsInWallet}
                                                updateAsset={placeABidAction}
                                                buyNowSuccess={buyNowSuccess}
                                                afterMakeAnOffer={afterMakeAnOffer}
                                                deleteAssetFromReducer={deleteAssetFromReducer}
                                            />
                                        </Grid>
                                    ))}
                                    <Box display={{ xs: 'none', sm: 'block' }}>
                                        <Link
                                            to="/marketplace"
                                            className="list-link"
                                            onClick={redirectToMarketplace}
                                        >
                                            <ChevronRight style={{ fontSize: 56 }} />
                                        </Link>
                                    </Box>

                                    {/*Mobile "see more" button*/}
                                    <Box
                                        display={{ xs: 'flex', sm: 'none' }}
                                        justifyContent="center"
                                        style={{ width: '100%' }}
                                    >
                                        <SeeMoreBtn />
                                    </Box>
                                </Grid>
                            ))}
                    </Box>
                </Container>
            </Box>
            {isLoggedIn && (
                <ReportAnIssueModal
                    reportIssue={reportIssue}
                    onCloseReportIssue={onCloseReportIssue}
                    assetId={currentAsset?.guid}
                    giveNotification={giveNotification}
                />
            )}
            <DeleteAsset
                currentAsset={currentAsset}
                openModal={openModal}
                setDeleteLoading={setDeleteLoading}
                onCloseConfirmModal={onCloseConfirmModal}
                setDirty={setDirty}
                setPristine={setPristine}
            />
            {Prompt}
        </>
    );
};

export default Asset;
