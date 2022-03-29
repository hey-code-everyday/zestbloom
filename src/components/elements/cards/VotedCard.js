import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Box, CardMedia, Avatar } from '@material-ui/core';
import { Star, StarOutlined } from '@material-ui/icons';
import { Tag } from 'components/shared';
import { upvoteAsset, unUpvoteAsset } from 'redux/bestVotedAssets/actions';
import { useDispatch, useSelector } from 'react-redux';
import { PRIVATE } from 'configs';
import CardTags from 'components/shared/CardTags';

const VotedCard = ({ item, clickOnCard }) => {
    const pictureData = getPictureData(item?.asset);
    const dispatch = useDispatch();
    const history = useHistory();
    const { bestVotedAssets } = useSelector((state) => state.bestVotedAssets);
    const { user } = useSelector((state) => state.auth);
    const { isLoggedIn } = useSelector((state) => state.auth);

    const onUpvoted = (guid, username) => {
        if (isLoggedIn && user.username !== username) {
            dispatch(upvoteAsset(guid));
        }
    };
    const onUnUpvoted = (guid, username) => {
        if (isLoggedIn && user.username !== username) {
            dispatch(unUpvoteAsset(guid));
        }
    };

    const redirectToProfile = (e, username) => {
        e.stopPropagation();
        if (username !== PRIVATE) history.push(`/profile/${username}`);
    };

    if (bestVotedAssets?.length === 0) return null;

    return (
        <Box className="voted-card" m={'auto'}>
            <Link className="w-100 h-100" to={`/asset/${item?.asset?.asset_id}`}>
                <Box
                    className="w-100 h-100"
                    onClick={(e) => clickOnCard(e, item?.asset?.is_nsfw, item?.asset?.asset_id)}
                >
                    <Box p={1.5} className="card-img-wrap">
                        <div className={`card-img ${item?.asset?.is_nsfw ? 'card-img-blur' : ''}`}>
                            {pictureData && (
                                <CardMedia
                                    component={pictureData?.component}
                                    src={pictureData?.src}
                                    muted={pictureData?.muted}
                                    // controls
                                    loop
                                    autoPlay={pictureData?.autoplay}
                                    style={{
                                        height: 360,
                                        objectFit: 'cover',
                                    }}
                                />
                            )}
                            <CardTags
                                tags={[
                                    {
                                        icon: 'virtual-reality',
                                        color: 'green',
                                        type: 'virtual-reality',
                                        name: 'virtual-reality',
                                        slug: 'virtual-reality',
                                    },
                                    {
                                        icon: 'audio-books',
                                        color: 'yellow',
                                        type: 'audio-books',
                                        name: 'audio-books',
                                        slug: 'audio-books',
                                    },
                                    {
                                        icon: 'film',
                                        color: 'red',
                                        type: 'film',
                                        name: 'film',
                                        slug: 'film',
                                    },
                                ]}
                            />
                        </div>
                    </Box>

                    <Box display="flex" flexDirection="column" justifyContent="space-between">
                        <Box className="best-voted-content">
                            <Box className="best-voted-title" mb={1}>
                                {item?.title}
                            </Box>
                            <Box fontSize={16} display="flex" alignItems="center">
                                <Avatar
                                    alt={item?.creator?.username}
                                    src={item?.creator?.avatar}
                                    className={
                                        item?.creator?.username === PRIVATE
                                            ? 'private_user_icon sm'
                                            : 'sm'
                                    }
                                />
                                <Box
                                    fontWeight="bold"
                                    fontFamily="h1.fontFamily"
                                    className="best-voted-username link primary ellipsis"
                                    onClick={(e) => redirectToProfile(e, item?.creator?.username)}
                                >
                                    @{item?.creator?.username}
                                </Box>
                            </Box>
                        </Box>
                        <Box
                            textAlign="right"
                            display="flex"
                            alignItems="center"
                            className={`best-voted-voting ${item?.voted ? 'color-primary' : ''}`}
                            pb={2}
                            px={3}
                        >
                            {item?.voted ? (
                                <Star
                                    style={{ fontSize: 24 }}
                                    className="pointer hover-opacity"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onUnUpvoted(item?.guid, item?.creator?.username);
                                    }}
                                />
                            ) : (
                                <StarOutlined
                                    style={{ fontSize: 24 }}
                                    className="pointer hover-opacity"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onUpvoted(item?.guid, item?.creator?.username);
                                    }}
                                />
                            )}
                            <Box component="span" ml={1}>
                                {item?.vote_count}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Link>
            <Tag
                text="TOP"
                className="brand-red md bottom-right rotated"
                icon={<i className="icon-fire" style={{ fontSize: 16 }} />}
            />
        </Box>
    );
};

function getPictureData(data) {
    if (!data) return null;
    const { url, mimetype, ipfs_url } = data?.content ?? {};
    const content_url = url ?? ipfs_url;
    const type = mimetype?.split('/')[0];
    switch (type) {
        case 'image':
            return { component: 'img', src: content_url };
        case 'video':
            return { component: 'video', src: content_url, autoplay: 'autoPlay', muted: true };
        case 'audio':
        case 'text':
        case 'application':
            return { component: 'img', src: data?.thumbnail?.url };
        default:
            return { component: 'img', src: content_url };
    }
}

VotedCard.propTypes = {
    item: PropTypes.object.isRequired,
    clickOnCard: PropTypes.func.isRequired,
};

export default VotedCard;
