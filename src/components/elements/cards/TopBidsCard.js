import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import { Box, Grid, Card, CardMedia, Avatar } from '@material-ui/core';
import { Star, ChevronRight } from '@material-ui/icons';

import { Tag } from 'components/shared';
import AlgoFont from 'assets/img/algo-font.svg';
import OpenPicturePopover from './fullScreen';
import Slider from 'components/shared/slider';
import { getTopBidAssets } from 'redux/topBidAssets/actions';
import useWindowDimensions from 'hooks/useWindowDimensions';

const TopBidsCard = () => {
    const [fullScreenPhoto, setFullScreenPhoto] = useState({ isOpen: false, src: '' });
    const dispatch = useDispatch();
    const history = useHistory();
    const { topBidAssets } = useSelector((state) => state.topBidAssets);
    const { isMobile } = useWindowDimensions();

    useEffect(() => {
        dispatch(getTopBidAssets());
    }, [dispatch]);

    const showAsset = (assetId) => {
        history.push(`asset/${assetId}`);
    };

    return (
        <>
            {isMobile ? (
                <Slider
                    options={{
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: true,
                    }}
                >
                    {topBidAssets?.map((item) => {
                        const pictureData = getPictureData(item?.asset);
                        return (
                            <Box p={1} key={item?.guid}>
                                <Card
                                    className="card asset-card h-100"
                                    style={{
                                        cursor: 'pointer',
                                        margin: '12px',
                                    }}
                                >
                                    <Box p={1.5} className="card-img-wrap">
                                        <div className="card-img">
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
                                            <Tag
                                                text="TOP"
                                                className="brand-red md bottom-right rotated"
                                                icon={
                                                    <i
                                                        className="icon-fire"
                                                        style={{ fontSize: 16 }}
                                                    />
                                                }
                                            />
                                        </div>
                                    </Box>

                                    <Box
                                        pt={1}
                                        pb={3}
                                        px={3}
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <div>
                                            <Box fontSize={16} mb={1}>
                                                {item?.asset?.title}
                                            </Box>
                                            <Box fontSize={16} display="flex" alignItems="center">
                                                <Avatar
                                                    alt={item?.owner?.username}
                                                    src={item?.owner?.avatar}
                                                    className="sm"
                                                />
                                                <Box
                                                    fontWeight="bold"
                                                    fontFamily="h1.fontFamily"
                                                    ml={1}
                                                    className="link primary ellipsis"
                                                    component={Link}
                                                    to="/"
                                                >
                                                    @{item?.owner?.username}
                                                </Box>
                                            </Box>
                                        </div>
                                    </Box>
                                    {item?.last_bid?.bid_amount && (
                                        <Box
                                            px={1}
                                            fontSize={20}
                                            fontWeight="bold"
                                            className="price-algo"
                                        >
                                            <Star
                                                style={{ fontSize: 24 }}
                                                className="pointer hover-opacity"
                                            />
                                            <img src={AlgoFont} alt="Algo" />
                                            <span style={{ marginLeft: '5px' }}>
                                                {item?.last_bid?.bid_amount}
                                            </span>
                                        </Box>
                                    )}
                                </Card>
                            </Box>
                        );
                    })}
                </Slider>
            ) : (
                <Grid container spacing={3} className="list-with-link desktop-only">
                    {topBidAssets?.map((item) => {
                        const pictureData = getPictureData(item?.asset);
                        return (
                            <Grid
                                item
                                lg={3}
                                md={6}
                                sm={6}
                                xs={12}
                                key={item?.guid}
                                onClick={() => showAsset(item?.asset?.asset_id)}
                            >
                                <Card
                                    className="h-100"
                                    style={{
                                        cursor: 'pointer',
                                        margin: '12px',
                                    }}
                                >
                                    <Box p={1.5} className="card-img-wrap">
                                        <div className="card-img">
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
                                            <Tag
                                                text="TOP"
                                                className="brand-red md bottom-right rotated"
                                                icon={
                                                    <i
                                                        className="icon-fire"
                                                        style={{ fontSize: 16 }}
                                                    />
                                                }
                                            />
                                        </div>
                                    </Box>

                                    <Box
                                        pt={1}
                                        pb={3}
                                        px={3}
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <div>
                                            <Box fontSize={16} mb={1}>
                                                {item?.asset?.title}
                                            </Box>
                                            <Box fontSize={16} display="flex" alignItems="center">
                                                <Avatar
                                                    alt={item?.owner?.username}
                                                    src={item?.owner?.avatar}
                                                    className="sm"
                                                />
                                                <Box
                                                    fontWeight="bold"
                                                    fontFamily="h1.fontFamily"
                                                    ml={1}
                                                    className="link primary ellipsis"
                                                    component={Link}
                                                    to="/"
                                                >
                                                    @{item?.owner?.username}
                                                </Box>
                                            </Box>
                                        </div>
                                    </Box>

                                    {item?.last_bid?.bid_amount && (
                                        <Box
                                            px={3}
                                            fontSize={20}
                                            fontWeight="bold"
                                            className="price-algo"
                                        >
                                            <Star
                                                style={{ fontSize: 24 }}
                                                className="pointer hover-opacity"
                                            />
                                            <img src={AlgoFont} alt="Algo" />
                                            <span style={{ marginLeft: '5px' }}>
                                                {item?.last_bid?.bid_amount}
                                            </span>
                                        </Box>
                                    )}
                                </Card>
                            </Grid>
                        );
                    })}
                    {/*Desktop "see more" button (blue round with arrow)*/}
                    <Box display={{ xs: 'none', sm: 'block' }}>
                        <Link to="/auction" className="list-link">
                            <ChevronRight style={{ fontSize: 56 }} />
                        </Link>
                    </Box>
                </Grid>
            )}

            <OpenPicturePopover
                fullScreenPhoto={fullScreenPhoto}
                onClose={() => {
                    setFullScreenPhoto({ isOpen: false, src: '' });
                }}
            />
        </>
    );
};

export default TopBidsCard;

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
