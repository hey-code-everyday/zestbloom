import React, { useState, useRef, Suspense, useCallback, useEffect } from 'react';
import { Avatar, Box, Button, Card, Typography } from '@material-ui/core';

import { Tag } from '../../shared';
import { ThumbUp, ThumbUpOutlined, Timer, Height } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import OpenPicturePopover from './fullScreen';
import LottieContainer from 'components/shared/LottieContainer';
import { PRIVATE_OWNER, PRIVATE } from 'configs';
import AlgoFont from '../../../assets/img/algo-font.svg';
import { stopEvent } from 'helpers/functions';
import { getTimeLeft } from 'helpers/intervalYears';
import { useDispatch, useSelector } from 'react-redux';
import { needToLoginAction } from 'redux/auth/actions';
import { close_app_blob, close_app } from 'redux/auction/actions';
import { setNotification } from 'redux/profile/actions';
import { COMPLETED, NOTIFICATIONS, CLOSE_AUCTION } from 'configs';
import { closeAuction } from 'transactions/smart-contract/escrow/auctionByEscrow/closeAuction';
import ConfirmModal from 'components/elements/modal/confirmModal';
import { dangerTime } from 'helpers/functions';
import FullScreenMobileIcon from 'assets/img/full_screen_mobile.svg';

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
const LoadImage = React.lazy(() => import('./assetCardImage'));

const AuctionCard = ({ item, isDisabled, onOpenBidModal, setSelectedAsset }) => {
    const [fullScreenPhoto, setFullScreenPhoto] = useState({ isOpen: false, src: '' });
    const [date, setDate] = useState('');
    const cardRef = useRef(null);
    const { user, isLoggedIn } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [openAuctionCloseModal, setOpenAuctionCloseModal] = useState(false);

    const img = item?.asset?.content_url;
    const title = item?.asset?.title;
    const thumbnail = item?.asset?.thumbnail?.url;
    const content_type = item?.asset?.content_type;
    const assetId = item?.asset?.asset_id;
    const {
        owner,
        isSeries,
        start_time,
        end_time,
        voted,
        last_bid,
        guid: auction_guid,
        status,
    } = item || {};

    const tag = item?.media_types?.find((x) => x.category === 'static')?.name;

    const customTag = item?.media_types?.find((x) => x.category === 'custom')?.name;

    const showedUser = owner || PRIVATE_OWNER;
    const isPrivate = showedUser?.username === PRIVATE;

    const getTimeSince = useCallback(() => {
        const time = getTimeLeft(start_time, end_time);
        setDate(time);
        return time;
    }, [start_time, end_time]);

    const openSignIn = () => dispatch(needToLoginAction(true));

    const onOpenAuctionCloseModal = (e) => {
        stopEvent(e);
        if (checkForClosing()) setOpenAuctionCloseModal(true);
    };

    const onCloseAuctionCloseModal = () => {
        setOpenAuctionCloseModal(false);
    };

    useEffect(() => {
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
    }, [getTimeSince]);

    const checkTime = () => {
        const now = new Date();
        const start = new Date(start_time * 1000);
        const end = new Date(end_time * 1000);

        if (start - now > 0) {
            giveNotification(NOTIFICATIONS.warning.auctionDontstarted);
            return false;
        }
        if (now - end > 0) {
            giveNotification(NOTIFICATIONS.warning.auctionFinished);
            return false;
        }
        return true;
    };

    const checkForClosing = () => {
        const now = new Date();
        const end = new Date(end_time * 1000);

        if (end - now > 0) {
            giveNotification(NOTIFICATIONS.warning.auctionNoEnded);
            return false;
        }

        return true;
    };

    const openPlaceABid = (e) => {
        stopEvent(e);
        if (!isLoggedIn) return openSignIn();
        if (checkTime()) {
            onOpenBidModal();
            setSelectedAsset(item);
        }
    };

    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };

    const throwError = () => {
        giveNotification(NOTIFICATIONS.error.wentWrong);
        // finishBid();
    };

    const onCloseAppBlob = async () => dispatch(close_app_blob(auction_guid));
    const onCloseApp = async (data) => dispatch(close_app(data));

    const onCloseAuction = async (e) => {
        try {
            onCloseAuctionCloseModal();
            const args = {
                onCloseAppBlob,
                onCloseApp,
                throwError,
                auction_guid,
                giveNotification,
            };
            closeAuction(args);
        } catch (err) {
            console.log(err);
        }
    };

    const toFullScreen = (e) => {
        stopEvent(e);
        setFullScreenPhoto({ isOpen: true, src: img });
    };

    const isMine = item?.owner?.username === user?.username;
    const isCompleted = status === COMPLETED;
    return (
        <>
            <Link className="w-100 h-100" to={`/asset/${assetId}`}>
                <Card
                    className={`card asset-card h-100 ${isDisabled ? 'card-disabled' : ''} ${
                        isSeries ? 'card-series' : ''
                    }`}
                    ref={cardRef}
                >
                    <Box className="asset-file-container">
                        <Suspense fallback={<Loading />}>
                            <LoadImage
                                content_type={content_type}
                                img={img}
                                thumbnail={thumbnail}
                            />
                        </Suspense>
                    </Box>
                    <Box className="card-header" style={{ height: 200 }}>
                        {tag && <Tag text={tag} className="secondary sm top-left rotated" />}
                        {customTag && (
                            <Tag
                                text={customTag}
                                className={`secondary sm ${
                                    tag ? 'top-left-2' : 'top-left'
                                }  rotated`}
                            />
                        )}
                        <Box
                            display="flex"
                            className="card-header-actions"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Box
                                border={1}
                                borderColor="text.black20"
                                borderRadius={10}
                                bgcolor="text.white"
                                overflow="hidden"
                                height={48}
                                width={48}
                                style={{ backgroundColor: 'rgba(255,255,255,.5)' }}
                                className="card-image-open desktop-only"
                                onClick={toFullScreen}
                            >
                                <button>
                                    <Height style={{ fontSize: 30 }} />
                                </button>
                            </Box>

                            <Box
                                height={16}
                                width={16}
                                className="card-image-open mobile-only"
                                onClick={toFullScreen}
                            >
                                <button>
                                    <img src={FullScreenMobileIcon} alt="Full Screen" />
                                </button>
                            </Box>

                            {/* {canFollowAndVoted && ( */}
                            {/* follow */}
                            {/* <Box
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
                                className="favorite-checkbox"
                                control={
                                    <Checkbox
                                        disableRipple
                                        checked={favorite}
                                        // onChange={handleChangeFavorites}
                                        icon={<StarBorder style={{ fontSize: 24 }} />}
                                        checkedIcon={
                                            <Star style={{ fontSize: 24 }} color="primary" />
                                        }
                                    />
                                }
                            /> 

                            {isEditable && (
                                <Button className="hover-bg-secondary h-100">
                                    <CreateIcon />
                                </Button>
                            )}
                        </Box> */}
                            {/* )} */}
                        </Box>
                        {/* <Tag
                        text="TOP"
                        className="brand-red md bottom-left rotated"
                        icon={<i className="icon-fire" style={{ fontSize: 16 }} />}
                    /> */}
                    </Box>

                    <Box pt={2} pb={1} px={3} className="card-footer auction-footer">
                        {/* auction time left */}
                        <Tag
                            text={isCompleted ? COMPLETED : date}
                            className={`${
                                dangerTime(date) && !isCompleted ? 'brand-red' : 'brand-gold'
                            } md top-right`}
                            icon={<Timer style={{ fontSize: 16 }} />}
                        />
                        <Typography gutterBottom variant="h5">
                            {title}
                        </Typography>

                        <Box fontSize={16} display="flex" alignItems="center">
                            {showedUser && (
                                <>
                                    <Avatar
                                        alt={showedUser?.username}
                                        src={showedUser?.avatar}
                                        className={`${isPrivate ? 'private_user_icon' : ''} sm`}
                                    />
                                    <Box
                                        fontWeight="bold"
                                        fontFamily="h1.fontFamily"
                                        ml={1}
                                        className={`${!isPrivate && 'link'} primary ellipsis`}
                                    >
                                        {isPrivate
                                            ? showedUser?.username
                                            : `@${showedUser?.username}`}
                                    </Box>
                                </>
                            )}
                        </Box>

                        <Box
                            display="flex"
                            justifyContent="space-between"
                            mt={3}
                            mb={2}
                            className="bid-row"
                        >
                            <Box>
                                {last_bid?.bid_amount && (
                                    <>
                                        <Box fontSize={12} color="text.black50">
                                            Current Bid
                                        </Box>
                                        <Box
                                            fontSize={20}
                                            mt={1}
                                            fontWeight="bold"
                                            className="price-algo"
                                        >
                                            <Box
                                                fontSize={20}
                                                fontWeight="bold"
                                                className="bid-price"
                                            >
                                                {last_bid?.bid_amount}
                                            </Box>
                                            <img src={AlgoFont} alt="Algo" />
                                        </Box>
                                    </>
                                )}
                            </Box>
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="flex-end"
                                fontWeight="bold"
                            >
                                <Box
                                    fontSize={14}
                                    color="text.black50"
                                    display="flex"
                                    alignItems="center"
                                    className="num-of-bids"
                                >
                                    Num of Bids:
                                    <Box color="text.black"> 500 </Box>
                                </Box>
                                <Box
                                    fontSize={16}
                                    mt={1}
                                    display="flex"
                                    alignItems="center"
                                    className={`voted ${voted ? 'color-primary' : ''}`}
                                >
                                    {voted ? (
                                        <ThumbUp
                                            style={{ fontSize: 24 }}
                                            className="pointer hover-opacity"
                                        />
                                    ) : (
                                        <ThumbUpOutlined
                                            style={{ fontSize: 24 }}
                                            className="pointer hover-opacity"
                                        />
                                    )}
                                    <Box component="span" ml={1}>
                                        {/* Voted */}0
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        {!isCompleted &&
                            (!isMine ? (
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    size="large"
                                    fullWidth
                                    onClick={openPlaceABid}
                                >
                                    Place a Bid
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    fullWidth
                                    onClick={onOpenAuctionCloseModal}
                                >
                                    Close Auction
                                </Button>
                            ))}
                    </Box>
                    {date && (
                        <Tag
                            text={isCompleted ? COMPLETED : date}
                            className={`${
                                dangerTime(date) && !isCompleted ? 'brand-red' : 'brand-gold'
                            } md bottom-right`}
                            icon={<Timer style={{ fontSize: 16 }} />}
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
            <ConfirmModal
                open={openAuctionCloseModal}
                onClose={onCloseAuctionCloseModal}
                onConfirm={onCloseAuction}
                info={CLOSE_AUCTION}
            />
        </>
    );
};

export default AuctionCard;
