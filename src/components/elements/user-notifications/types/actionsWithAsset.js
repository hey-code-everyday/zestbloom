import React, { useCallback, useEffect, useState, Suspense } from 'react';
import { Box, Avatar } from '@material-ui/core';
import { useHistory } from 'react-router';
import { timeSince } from 'helpers/intervalYears';
import { showDescription } from './util';
import { PRIVATE_OWNER, PRIVATE } from 'configs';
import LottieContainer from 'components/shared/LottieContainer';
import OfferNotification from './offer';
import PropTypes from 'prop-types';

const LoadImage = React.lazy(() => import('components/elements/cards/assetCardImage'));

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

const ActionsWithAsset = ({ data, setNotifications }) => {
    const history = useHistory();
    const [date, setDate] = useState('');

    const { is_unread, sent_at, activity } = data ?? {};
    let { target, description, sender } = activity ?? {};
    if (!sender) {
        sender = PRIVATE_OWNER;
    }

    const getTimeSince = useCallback(() => {
        const time = timeSince(sent_at);
        setDate(time);
        return time;
    }, [sent_at]);

    useEffect(() => {
        getTimeSince();
        const timerId = setInterval(() => {
            const time = getTimeSince();
            if (time.includes('years')) {
                return clearInterval(timerId);
            }
        }, 60000);
        return () => {
            clearInterval(timerId);
        };
    }, [getTimeSince]);

    const onClick = () => {
        if (target) {
            setNotifications(false);
            history.push(`/asset/${target?.asset_id}`);
        }
    };

    const isOffer = activity?.verb === 'offer';

    const { url, ipfs_url, mimetype } = target?.content ?? {};

    const isPrivate = sender?.username === PRIVATE;

    return (
        <Box
            component="li"
            className={is_unread ? 'unread' : ''}
            onClick={onClick}
            style={{ cursor: target ? 'pointer' : 'default' }}
        >
            <Box className="image">
                <Avatar
                    alt={sender?.username}
                    src={!!sender?.avatar ? sender?.avatar : './'}
                    className={isPrivate ? 'private_user_icon' : ''}
                />
            </Box>
            <Box className="info">
                <Box className="title">
                    <Box
                        fontWeight="bold"
                        fontFamily="h1.fontFamily"
                        className="link primary"
                        style={{ marginRight: '10px' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (sender?.username !== 'Private')
                                history.push(`/profile/${sender?.username}`);
                        }}
                    >
                        @{sender?.username}
                    </Box>
                    {showDescription(description, activity)}
                </Box>
                {target && (
                    <Box
                        className="asset-image"
                        display="flex"
                        justifyContent="space-between"
                        style={{ width: '100%' }}
                    >
                        <Suspense fallback={<Loading />}>
                            <div className="asset-image-card">
                                <LoadImage
                                    content_type={mimetype}
                                    img={url ?? ipfs_url}
                                    thumbnail={target?.thumbnail?.url}
                                />
                            </div>
                        </Suspense>
                        {isOffer && (
                            <Box display="flex" alignItems="center">
                                <OfferNotification data={data} />
                            </Box>
                        )}
                    </Box>
                )}
                <Box className="time">{date} ago</Box>
            </Box>
        </Box>
    );
};

ActionsWithAsset.propTypes = {
    data: PropTypes.object,
    setNotifications: PropTypes.func,
};

export default ActionsWithAsset;
