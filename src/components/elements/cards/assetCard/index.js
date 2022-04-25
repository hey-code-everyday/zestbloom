import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
    Avatar,
    Box,
    Button,
    Card,
    Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    Typography,
} from '@material-ui/core';
import {
    CheckCircle,
    CheckCircleOutline,
    Height,
    Star,
    StarBorder,
    ThumbUp,
    ThumbUpOutlined,
    Timer,
} from '@material-ui/icons';
import CreateIcon from '@material-ui/icons/Create';

import OfferIcon from 'assets/img/offer-icon.svg';
import OpenPicturePopover from '../fullScreen';
import { needToLoginAction } from 'redux/auth/actions';
import CardMenu from '../cardMenu';
import LottieContainer from 'components/shared/LottieContainer';
import {
    checkAuction,
    checkContract,
    dangerTime,
    getSaleAmountAssetCard,
    stopEvent,
} from 'helpers/functions';
import {
    ANONYMOUS,
    COMPLETED,
    NOTIFICATIONS,
    PRIVATE,
    PRIVATE_OWNER,
    REDIRECT_TO_ASSET,
} from 'configs';
import AssetCardPrice from '../assetCardPrice';
import AssetCardButton from '../assetCardButton';
import { getTimeLeft } from 'helpers/intervalYears';
import CardButton from './cardButtons';
import BidDoneModal from 'components/elements/modal/bidDone';
import BuyNowDoneModal from 'components/elements/modal/buyDone';
import BidModal from 'components/elements/modal/placeBid';
import MakeAnOfferModal from 'components/elements/modal/makeAnOfferModal';
import FullScreenMobileIcon from 'assets/img/full_screen_mobile.svg';
import { Tag } from '../../../shared';
import { setNotification } from 'redux/profile/actions';
import DeleteAsset from 'pages/asset/editAsset/deleteAsset';
import { onShowDeleteBtn } from 'transactions/algorand/validations';
import ConfirmModal from 'components/elements/modal/confirmModal';
import PropTypes from 'prop-types';
import CardTags from 'components/shared/CardTags';
import clsx from 'clsx';

const Loading = () => {
    return (
        <div className="card-lottie">
            <LottieContainer
                containerStyles={{
                    height: '50px',
                    width: '153px',
                }}
                lottieStyles={{ width: '50px' }}
            />
        </div>
    );
};
const LoadImage = React.lazy(() => import('../assetCardImage'));

const AssetCard = ({
    item,
    isOffer = false,
    isListing = false,
    isAuction = false,
    isBid = false,
    button,
    isSeries,
    isDisabled,
    isEditable,
    upvoteAsset,
    unUpvoteAsset,
    toFavoritesAssets,
    removeFromFavoritesAssets,
    isLoggedIn,
    changeAssetVisibility,
    cancelLoading = false,
    closeAuctionLoading = false,
    onViewOffer = () => {},
    onCancelListing = () => {},
    onCloseAuction = () => {},
    onViewBids = () => {},
    closeOutbyBids = () => {},
    collected = false,
    assetsInWallet,
    updateAsset,
    buyNowSuccess,
    afterMakeAnOffer,
    closeMyBidAuctionLoading,
    selectable = false,
    selected = false,
    selectAsset = () => {},
    deleteAssetFromReducer,
    isMyProfile,
    galleryMode,
}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { user } = useSelector((state) => state.auth);
    const { selectedWallet } = useSelector((state) => state.profile);
    const [fullScreenPhoto, setFullScreenPhoto] = useState({ isOpen: false, src: '' });
    const [disableVoted, setDisableVoted] = useState(false);
    const [disableFollowing, setDisableFollowing] = useState(false);
    const [date, setDate] = useState('');
    const [bidModal, setBidModal] = useState(false);
    const [submittedBid, setSubmittedBid] = useState(false);
    const [submittedBuyNow, setSubmittedBuyNow] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEndedAuction, setIsEndedAuction] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isStartedAuction, setIsStartedAuction] = useState(false);
    const [openNsfwModal, setOpenNsfwModal] = useState(false);

    // console.log(
    //     // button,
    //     // changeAssetVisibility,
    //     // updateAsset,
    //     // buyNowSuccess,
    //     // afterMakeAnOffer,
    //     // closeMyBidAuctionLoading,
    //     // deleteAssetFromReducer,
    // );
    // const tag = item?.media_types?.find((x) => x.category === 'static')?.name;

    // const customTag = item?.media_types?.find((x) => x.category === 'custom')?.name;

    const { url: iamge_url, ipfs_url, mimetype } = item?.asset?.content ?? {};
    const img = iamge_url ?? ipfs_url;
    const content_type = mimetype;
    const thumbnail = item?.asset?.thumbnail?.url;
    const assetId = item?.asset?.asset_id;
    const is_nsfw = item?.asset?.is_nsfw;
    // const managerAddress = item?.asset?.manager;
    // For multiple assets
    // const assetTotal = item?.asset?.total;

    const {
        favorite,
        title,
        voted,
        vote_count,
        guid,
        nodes,
        base_node,
        creator,
        description,
        offers = [],
    } = item || {};
    const openSignIn = () => dispatch(needToLoginAction(true));

    const currentUserHaveNodes = nodes?.filter(
        (node) => user?.username && node?.owner?.username === user?.username,
    );

    const haveSaleByEscrow = useMemo(() => {
        const contract = currentUserHaveNodes?.find((node) => checkContract(node));
        return !!contract;
    }, [currentUserHaveNodes]);

    const isCreator = useMemo(
        () => (user?.username ? creator?.username === user?.username : null),
        [creator?.username, user?.username],
    );
    const haveAmount = assetsInWallet?.find((asset) => asset['asset-id'] === assetId);

    const canEdit = (currentUserHaveNodes?.[0] && haveAmount) || haveSaleByEscrow || collected;

    const haveAuction = useMemo(() => {
        return currentUserHaveNodes?.find((node) => checkAuction(node));
    }, [currentUserHaveNodes]);

    const canFollowAndVoted = isLoggedIn && user?.username !== creator?.username;
    const showedUsers = useMemo(
        () => (isOffer ? offers.map(({ maker }) => maker ?? PRIVATE_OWNER) : null),
        [isOffer, offers],
    );

    const showedUser = showedUsers?.length ? showedUsers[0] : creator || PRIVATE_OWNER;
    const isPrivate = showedUser?.username === PRIVATE;
    const activeContract = base_node?.sales?.find((x) => x.status === 'ACTIVE');
    const auction = isAuction
        ? item?.auction
        : base_node?.auctions?.find((x) => x.status === 'STARTED');

    const showedPrice = getSaleAmountAssetCard(activeContract);
    // const offerPrice = getOfferAmount(offers?.[0]);
    const cardRef = useRef(null);

    const checkIsStarted = useCallback(
        (start_time) => {
            if (isAuction && !isStartedAuction) {
                const now = new Date();
                const start = new Date(start_time * 1000);

                if (now >= start) return setIsStartedAuction(true);
            }
        },
        [isAuction, isStartedAuction],
    );

    const getTimeSince = useCallback(() => {
        const time = getTimeLeft(auction?.start_time, auction?.end_time);
        setDate(time);
        checkIsStarted(auction?.start_time);
        if (isAuction && time === 'Ended') {
            setIsEndedAuction(true);
        }
        return time;
    }, [auction, isAuction, checkIsStarted]);

    useEffect(() => {
        if (auction) {
            getTimeSince();
            const timerId = setInterval(() => {
                const time = getTimeSince();
                if (time.includes('years') || time === 'Ended') {
                    return clearInterval(timerId);
                }
            }, 60000);
            return () => {
                clearInterval(timerId);
            };
        }
    }, [getTimeSince, auction]);

    const showDeletebutton = useCallback(
        async () => onShowDeleteBtn(item, user, assetsInWallet, setCanDelete),
        [item, user, assetsInWallet],
    );

    useEffect(() => showDeletebutton(), [showDeletebutton]);

    const upvote = (e) => {
        stopEvent(e);

        if (canFollowAndVoted && !disableVoted && user?.role !== ANONYMOUS) {
            setDisableVoted(true);
            return dispatch(upvoteAsset(guid)).then(() => {
                setDisableVoted(false);
            });
        }
        if (!isLoggedIn) {
            openSignIn();
        }
    };

    const unUpvote = (e) => {
        stopEvent(e);

        if (canFollowAndVoted && !disableVoted && user?.role !== ANONYMOUS) {
            setDisableVoted(true);
            return dispatch(unUpvoteAsset(guid)).then(() => {
                setDisableVoted(false);
            });
        }
    };

    const toFavorites = () => {
        if (canFollowAndVoted && !disableFollowing) {
            setDisableFollowing(true);
            return dispatch(toFavoritesAssets(guid)).then(() => {
                setDisableFollowing(false);
            });
        }
        if (!isLoggedIn) {
            openSignIn();
        }
    };

    const removeFromFavorites = () => {
        if (canFollowAndVoted && !disableFollowing) {
            setDisableFollowing(true);
            return dispatch(removeFromFavoritesAssets(guid)).then(() => {
                setDisableFollowing(false);
            });
        }
        if (!isLoggedIn) {
            openSignIn();
        }
    };

    const handleChangeFavorites = (e) => {
        stopEvent(e);

        if (favorite) {
            removeFromFavorites();
        } else {
            toFavorites();
        }
    };

    const onCloseBidModal = () => {
        setBidModal(false);
        if (cardRef) {
            const element = cardRef.current;
            element.classList.remove('openCardMenu');
        }
    };

    const onOpenSubmittedBid = () => {
        setBidModal(false);
        setSubmittedBid(true);
    };

    const onCloseSubmittedBid = () => {
        setSubmittedBid(false);
        if (cardRef) {
            const element = cardRef.current;
            element.classList.remove('openCardMenu');
        }
    };

    const onOpenSubmittedBuyNow = () => {
        setSubmittedBuyNow(true);
        dispatch(buyNowSuccess(guid));
    };

    const onCloseSubmittedBuyNow = () => {
        setSubmittedBuyNow(false);
        if (cardRef) {
            const element = cardRef.current;
            element.classList.remove('openCardMenu');
        }
    };

    const onOpenBidModal = () => {
        setBidModal(true);
        if (cardRef) {
            const element = cardRef.current;
            element.classList.add('openCardMenu');
        }
    };

    const onOpenOfferModal = () => {
        setIsModalOpen(true);
        if (cardRef) {
            const element = cardRef.current;
            element.classList.add('openCardMenu');
        }
    };

    const onCloseOfferModal = () => {
        setIsModalOpen(false);
        if (cardRef) {
            const element = cardRef.current;
            element.classList.remove('openCardMenu');
        }
    };

    const showPriceInHeader = isOffer || isListing || isAuction || isBid;
    const withoutAuction = isOffer || isListing || isBid;

    const onClickUsername = (e) => {
        stopEvent(e);
        if (showedUser?.username && !isPrivate)
            return history.push(`/profile/${showedUser?.username}`);
    };

    const toFullScreen = (e) => {
        stopEvent(e);
        setFullScreenPhoto({ isOpen: true, src: img });
    };

    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };

    const onOpenDeleteModal = () => {
        if (!selectedWallet) return giveNotification(NOTIFICATIONS.info.connectWallet);
        if (selectedWallet?.address !== item?.asset?.manager)
            return giveNotification({
                ...NOTIFICATIONS.warning.walletdoesntMatch,
                message:
                    NOTIFICATIONS.warning.walletdoesntMatch.message +
                    ' : ' +
                    item?.asset?.manager?.slice(0, 6) +
                    '...',
            });
        setOpenModal(true);
    };

    const onCloseConfirmModal = () => {
        setOpenModal(false);
    };

    const isCompleted = auction?.status === COMPLETED;

    const onCloseNsfwModal = () => {
        setOpenNsfwModal(false);
    };
    const redirectToAsset = () => {
        history.push(`/asset/${assetId}`);
    };
    const clickOnCard = (e) => {
        if (is_nsfw) {
            stopEvent(e);
            setOpenNsfwModal(true);
        }
    };

    return (
        <>
            <Link className={clsx('w-100', { 'h-100': !galleryMode })} to={`/asset/${assetId}`}>
                <Card
                    className={`card asset-card ${galleryMode ? '' : 'h-100'} ${
                        isDisabled ? 'card-disabled' : ''
                    } ${isSeries ? 'card-series' : ''}`}
                    ref={cardRef}
                    onClick={clickOnCard}
                >
                    <Box
                        position="relative"
                        className={`asset-file-container ${galleryMode ? '' : 'h-100'} ${
                            is_nsfw ? 'asset-img-blur' : ''
                        }`}
                    >
                        <CardTags
                            tags={[
                                {
                                    icon: 'music',
                                    color: 'orange',
                                    type: 'Music',
                                    name: 'Music',
                                    slug: 'music',
                                },
                            ]}
                        />
                        <Suspense fallback={<Loading />}>
                            <LoadImage
                                content_type={content_type}
                                img={img}
                                thumbnail={thumbnail}
                            />
                        </Suspense>
                    </Box>
                    <Box
                        className={`${
                            selected ? 'card-header-selected' : 'card-header'
                        } desktop-only`}
                        style={{ height: 200 }}
                    >
                        {/* {tag && <Tag text={tag} className="secondary sm top-left rotated" />}
                        {customTag && (
                            <Tag
                                text={customTag}
                                className={`secondary sm ${
                                    tag ? 'top-left-2' : 'top-left'
                                }  rotated`}
                            />
                        )} */}
                        <Box display="flex" className="card-header-actions" onClick={stopEvent}>
                            <Box
                                border={1}
                                borderColor="text.black20"
                                borderRadius={10}
                                bgcolor="text.white"
                                overflow="hidden"
                                height={48}
                                width={48}
                                style={{ backgroundColor: 'rgba(255,255,255,.5)' }}
                                className="card-image-open"
                                onClick={toFullScreen}
                            >
                                <button>
                                    <Height style={{ fontSize: 30 }} />
                                </button>
                            </Box>
                            {(canEdit || isCreator) && (
                                <Box
                                    border={1}
                                    borderColor="text.black20"
                                    borderRadius={10}
                                    bgcolor="text.white"
                                    overflow="hidden"
                                    height={48}
                                    width={48}
                                    style={{ backgroundColor: 'rgba(255,255,255,.5)' }}
                                    className="card-top-action"
                                    onClick={stopEvent}
                                >
                                    <CardMenu
                                        currentAsset={item}
                                        changeAssetVisibility={changeAssetVisibility}
                                        nodes={currentUserHaveNodes}
                                        cardRef={cardRef}
                                        canEdit={canEdit}
                                        haveAuction={haveAuction}
                                        onOpenDeleteModal={onOpenDeleteModal}
                                        canDelete={!showPriceInHeader && canDelete}
                                        deleteLoading={deleteLoading}
                                    />
                                </Box>
                            )}
                            {canFollowAndVoted && (
                                <Box
                                    border={1}
                                    borderColor="text.black20"
                                    borderRadius={10}
                                    bgcolor="text.white"
                                    overflow="hidden"
                                    height={48}
                                    width={48}
                                    style={{ backgroundColor: 'rgba(255,255,255,.5)' }}
                                    className="card-top-action"
                                >
                                    <FormControlLabel
                                        label=""
                                        className="favorite-checkbox"
                                        control={
                                            <Checkbox
                                                disableRipple
                                                checked={favorite}
                                                onChange={handleChangeFavorites}
                                                icon={<StarBorder style={{ fontSize: '1.5rem' }} />}
                                                checkedIcon={
                                                    <Star
                                                        style={{ fontSize: '1.5rem' }}
                                                        color="primary"
                                                    />
                                                }
                                            />
                                        }
                                    />

                                    {isEditable && (
                                        <Button className="hover-bg-secondary h-100">
                                            <CreateIcon />
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </Box>

                        {isMyProfile && selectable && (
                            <Box className="card-select">
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        selectAsset(!selected, [assetId]);
                                    }}
                                >
                                    {selected ? (
                                        <CheckCircle color="primary" style={{ fontSize: '70px' }} />
                                    ) : (
                                        <CheckCircleOutline
                                            color="secondary"
                                            style={{ fontSize: '70px' }}
                                        />
                                    )}
                                </IconButton>
                            </Box>
                        )}
                    </Box>

                    <Box
                        className={`${
                            selected ? 'card-header-selected' : 'card-header'
                        } mobile-only`}
                        style={{ height: 180 }}
                    >
                        <Box display="flex" className="card-header-actions" onClick={stopEvent}>
                            <Box
                                height={16}
                                width={16}
                                className="card-image-open"
                                onClick={toFullScreen}
                            >
                                <button>
                                    <img src={FullScreenMobileIcon} alt="Full Screen" />
                                </button>
                            </Box>
                        </Box>
                    </Box>

                    <Box
                        pt={2}
                        pb={1}
                        px={3}
                        // className={`card-footer ${auction ? 'auction-footer' : ''}`}
                        className={`bg-gray-gradient ${
                            selected ? 'card-footer-selected' : 'card-footer'
                        }`}
                    >
                        {isOffer && (
                            <Box className="ribbon">
                                <img src={OfferIcon} alt="Offer Icon" />
                                <span>OFFER</span>
                            </Box>
                        )}
                        {auction && !withoutAuction && (
                            <Tag
                                text={isCompleted ? COMPLETED : date}
                                className={`${
                                    dangerTime(date) && !isCompleted ? 'brand-red' : 'brand-gold'
                                } md top-right`}
                                icon={<Timer style={{ fontSize: '1rem' }} />}
                            />
                        )}

                        <Grid
                            container
                            justifyContent="space-between"
                            alignItems="center"
                            className="asset-footer-title-container"
                        >
                            <Grid item>
                                {title && (
                                    <Typography
                                        className="asset-footer-title"
                                        gutterBottom
                                        variant="h5"
                                    >
                                        {title}
                                    </Typography>
                                )}
                            </Grid>
                            {/*  For Multiple */}
                            {/* {assetTotal > 1 && (
                            <Box className="asset-footer-multiple">
                                <img src={multipleIcon} alt="multipleIcon" />
                                <Box>3 of {assetTotal} </Box>
                            </Box>
                        )} */}
                            <AssetCardPrice
                                isOffer={isOffer}
                                isAuction={isAuction}
                                isListing={isListing}
                                isBid={isBid}
                                price={showedPrice}
                                item={item}
                            />
                        </Grid>

                        {showedUsers?.length > 1 ? (
                            <Box fontSize="1rem" display="flex" alignItems="center">
                                <Box className="avatar-group">
                                    {showedUsers?.slice(0, 3)?.map(({ username, avatar }) => (
                                        <Avatar
                                            key={username}
                                            alt={username}
                                            src={avatar}
                                            className={`${
                                                username === PRIVATE ? 'private_user_icon' : ''
                                            } sm`}
                                        />
                                    ))}
                                </Box>
                                {showedUsers.length > 3 && (
                                    <Box
                                        fontWeight="bold"
                                        fontFamily="h1.fontFamily"
                                        ml="0.5rem"
                                        className="link primary ellipsis"
                                        component={Link}
                                        to="/"
                                    >
                                        +&nbsp;
                                        {showedUsers.length - 3}
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            <Box display="flex" justifyContent="space-between">
                                <Box
                                    className="username"
                                    display="flex"
                                    alignItems="center"
                                    onClick={onClickUsername}
                                >
                                    <Avatar
                                        alt={showedUser?.username}
                                        src={showedUser?.avatar}
                                        className={`${isPrivate ? 'private_user_icon' : ''} sm`}
                                    />
                                    <Box
                                        fontWeight="bold"
                                        fontFamily="h1.fontFamily"
                                        ml="0.5rem"
                                        className={`${!isPrivate && 'link'} font-primary ellipsis`}
                                    >
                                        {isPrivate
                                            ? showedUser?.username
                                            : `@${showedUser?.username}`}
                                    </Box>
                                </Box>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="flex-end"
                                    fontWeight="bold"
                                >
                                    {/* {numberOfBids && ( */}
                                    {!showPriceInHeader && (
                                        <>
                                            {auction && (
                                                <Box
                                                    fontSize="0.875rem"
                                                    color="text.black50"
                                                    display="flex"
                                                    alignItems="center"
                                                    className="num-of-bids"
                                                >
                                                    <Box className="desktop-only">Num of Bids:</Box>
                                                    <Box className="mobile-only">Bids:</Box>
                                                    <Box className="bids-count" ml={1}>
                                                        {auction?.bid_count}
                                                    </Box>
                                                </Box>
                                            )}
                                            <Box
                                                fontSize="1rem"
                                                mt={{ xs: 0, sm: 1 }}
                                                display="flex"
                                                alignItems="center"
                                                className={`voted ${voted ? 'color-primary' : ''}`}
                                            >
                                                {voted ? (
                                                    <ThumbUp
                                                        className="pointer hover-opacity"
                                                        onClick={unUpvote}
                                                    />
                                                ) : (
                                                    <ThumbUpOutlined
                                                        className="pointer hover-opacity"
                                                        onClick={upvote}
                                                    />
                                                )}
                                                <Box
                                                    className="vote-count font-primary"
                                                    component="span"
                                                    ml={1}
                                                >
                                                    {vote_count}
                                                </Box>
                                            </Box>
                                        </>
                                    )}
                                </Box>
                            </Box>
                        )}

                        {!isMyProfile && !showPriceInHeader && (
                            <>
                                <Box
                                    justifyContent="space-between"
                                    mt={3}
                                    mb={2}
                                    className="bid-row"
                                >
                                    <CardButton
                                        auction={auction}
                                        showedPrice={showedPrice}
                                        activeContract={activeContract}
                                        onOpenBidModal={onOpenBidModal}
                                        onOpenOfferModal={onOpenOfferModal}
                                        currentAsset={item}
                                        base_node={base_node}
                                        onOpenSubmittedBuyNow={onOpenSubmittedBuyNow}
                                        creator={creator}
                                        assetsInWallet={assetsInWallet}
                                    />
                                </Box>
                            </>
                        )}

                        <AssetCardButton
                            button={button}
                            isOffer={isOffer}
                            isAuction={isAuction}
                            isBid={isBid}
                            isListing={isListing}
                            item={item}
                            offers={offers}
                            cancelLoading={cancelLoading}
                            onViewOffer={onViewOffer}
                            onCancelListing={onCancelListing}
                            onCloseAuction={onCloseAuction}
                            haveAmount={haveAmount}
                            assetId={assetId}
                            closeAuctionLoading={closeAuctionLoading}
                            onViewBids={onViewBids}
                            closeOutbyBids={closeOutbyBids}
                            closeMyBidAuctionLoading={closeMyBidAuctionLoading}
                            isEndedAuction={isEndedAuction}
                            isStartedAuction={isStartedAuction}
                        />
                    </Box>

                    {auction && !withoutAuction && (
                        <Tag
                            text={isCompleted ? COMPLETED : date}
                            className={`${
                                dangerTime(date) && !isCompleted ? 'brand-red' : 'brand-gold'
                            } md bottom-right`}
                            icon={<Timer style={{ fontSize: '1rem' }} />}
                        />
                    )}
                    {fullScreenPhoto.isOpen && (
                        <OpenPicturePopover
                            fullScreenPhoto={fullScreenPhoto}
                            onClose={() => {
                                setFullScreenPhoto({ isOpen: false, src: '' });
                            }}
                            content_type={content_type}
                        />
                    )}
                </Card>
            </Link>
            {bidModal && (
                <BidModal
                    bidModal={bidModal}
                    onCloseBidModal={onCloseBidModal}
                    onOpenSubmittedBid={onOpenSubmittedBid}
                    selectedAsset={{ ...auction, asset: { ...item?.asset } }}
                    owner={base_node?.owner}
                    title={title}
                    description={description}
                    assetId={assetId}
                    asset_guid={guid}
                    updateAsset={updateAsset}
                />
            )}
            {submittedBid && (
                <BidDoneModal
                    submittedBid={submittedBid}
                    onCloseSubmittedBid={onCloseSubmittedBid}
                    selectedAsset={{ asset: { ...item?.asset } }}
                />
            )}
            {isModalOpen && (
                <MakeAnOfferModal
                    currentAsset={item}
                    onCloseOfferModal={onCloseOfferModal}
                    isModalOpen={isModalOpen}
                    base_node={base_node}
                    type="broadcast"
                    afterMakeAnOffer={afterMakeAnOffer}
                />
            )}
            {submittedBuyNow && (
                <BuyNowDoneModal
                    submittedBuyNow={submittedBuyNow}
                    onCloseSubmittedBuyNow={onCloseSubmittedBuyNow}
                    selectedAsset={{ asset: { ...item?.asset } }}
                />
            )}
            <DeleteAsset
                currentAsset={item}
                openModal={openModal}
                setDeleteLoading={setDeleteLoading}
                onCloseConfirmModal={onCloseConfirmModal}
                fromAssetCard
                deleteAssetFromReducer={deleteAssetFromReducer}
            />
            <ConfirmModal
                open={openNsfwModal}
                onClose={onCloseNsfwModal}
                onConfirm={redirectToAsset}
                info={REDIRECT_TO_ASSET}
            />
        </>
    );
};

AssetCard.propTypes = {
    isOffer: PropTypes.bool,
    isListing: PropTypes.bool,
    isAuction: PropTypes.bool,
    isBid: PropTypes.bool,
    cancelLoading: PropTypes.bool,
    collected: PropTypes.bool,
    selectable: PropTypes.bool,
    selected: PropTypes.bool,
    isSeries: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isEditable: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    isMyProfile: PropTypes.bool,
    closeAuctionLoading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    item: PropTypes.object,
    closeMyBidAuctionLoading: PropTypes.object,
    onViewOffer: PropTypes.func,
    onCancelListing: PropTypes.func,
    onCloseAuction: PropTypes.func,
    onViewBids: PropTypes.func,
    closeOutbyBids: PropTypes.func,
    selectAsset: PropTypes.func,
    upvoteAsset: PropTypes.func,
    unUpvoteAsset: PropTypes.func,
    toFavoritesAssets: PropTypes.func,
    removeFromFavoritesAssets: PropTypes.func,
    assetsInWallet: PropTypes.array,
    changeAssetVisibility: PropTypes.func,
    buyNowSuccess: PropTypes.func,
    updateAsset: PropTypes.func,
    afterMakeAnOffer: PropTypes.func,
    deleteAssetFromReducer: PropTypes.func,
    galleryMode: PropTypes.bool,
};

export default AssetCard;
