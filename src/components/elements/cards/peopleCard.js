import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { Typography, Box, Card, CardMedia, Avatar, Button } from '@material-ui/core';
import { getCachedURL } from 'helpers/urls';
import defaultBg from 'assets/img/defaultBg.png';
import PropTypes from 'prop-types';

const PeopleCard = ({ user, handleFollow }) => {
    const history = useHistory();
    const [inAction, setInAction] = useState(false);

    const {
        selected_tags: tags,
        banner,
        username,
        avatar,
        authorName,
        followers_count: followers,
        follow,
        full_name,
        assets,
        assets_count,
    } = user;

    const onSubmit = () => history.push(`/profile/${username}`);
    const onClickFollow = (e) => {
        setInAction(true);
        e.stopPropagation();
        handleFollow(user, setInAction);
    };
    const staticTag = tags?.find((tag) => tag.type === 'static');
    const customTag = tags?.find((tag) => tag.type === 'custom');

    const addDefaultImg = useMemo(() => {
        const defaultImg = [];
        if (assets?.length < 3) {
            const length = 3 - assets?.length;
            for (let i = 0; i < length; i++) {
                defaultImg.push({ url: defaultBg });
            }
        }
        return defaultImg;
    }, [assets]);

    const allImg = [...assets, ...addDefaultImg];

    if (!user) return null;

    return (
        <Card
            className="h-100"
            onClick={onSubmit}
            onMouseOver={(e) => {
                e.target.style.cursor = 'pointer';
            }}
        >
            <Box className="featured-artist-img-wrap">
                <Box style={{ borderRadius: '10px 10px 0 0' }} overflow="hidden">
                    <CardMedia image={banner || defaultBg} style={{ height: 162 }} />
                </Box>
                <div className="featured-artist-img-bg" />
                <div className="featured-artist-img-main">
                    <div className="featured-artist-img circle">
                        <Avatar alt={authorName} src={avatar} className="xl" />
                    </div>
                    <Box className="featured-artist-tags">
                        {staticTag?.name && <span>{staticTag.name}</span>}
                        {customTag?.name && <span>{customTag.name}</span>}
                    </Box>
                </div>
            </Box>

            <Box pb={4} px={3} display="flex" justifyContent="space-between">
                <Box>
                    <Typography gutterBottom variant="h5">
                        {full_name}
                    </Typography>

                    <Box
                        fontSize={16}
                        fontWeight="bold"
                        fontFamily="h1.fontFamily"
                        className="link primary ellipsis"
                    >
                        @{username}
                    </Box>
                </Box>
                <Box>
                    <Box className="followers-info" textAlign="center">
                        Followers: <span>{followers}</span>
                    </Box>
                    {follow !== null && (
                        <Box pt={1.25}>
                            <Button
                                className={`btn-small ${follow ? 'btn-following' : 'btn-follow'}`}
                                color={follow ? 'primary' : 'secondary'}
                                style={{ whiteSpace: 'nowrap' }}
                                variant={follow ? 'contained' : 'outlined'}
                                onClick={onClickFollow}
                                disabled={inAction}
                            >
                                {follow ? 'Following' : 'Follow'}
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>

            <div className="card-images">
                <ul className="image-list">
                    {allImg?.map((asset, i) => (
                        <li key={i}>
                            <img src={getCachedURL(asset?.url, '100x80')} alt="asset-img" />
                        </li>
                    ))}
                </ul>
                <span className="image-count">+{assets_count}</span>
            </div>
        </Card>
    );
};

PeopleCard.propTypes = {
    user: PropTypes.shape({
        selected_tags: PropTypes.array,
        banner: PropTypes.string,
        username: PropTypes.string,
        avatar: PropTypes.string,
        authorName: PropTypes.string,
        followers_count: PropTypes.number,
        follow: PropTypes.bool,
        full_name: PropTypes.string,
        assets: PropTypes.array,
        assets_count: PropTypes.number,
    }),
    handleFollow: PropTypes.func,
};
export default PeopleCard;
