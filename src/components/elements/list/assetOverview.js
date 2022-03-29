import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import { Box } from '@material-ui/core';

import LottieContainer from 'components/shared/LottieContainer';
import ExpandIcon from 'assets/img/full_screen_mobile.svg';

const Loading = () => {
    return (
        <div className="card-lottie">
            <LottieContainer style={{ height: '50px', width: '153px' }} />
        </div>
    );
};
const LoadImage = React.lazy(() => import('../cards/assetCardImage'));

const AssetOverview = ({ content_type, img, thumbnail, title, total, toFullScreen }) => {
    return (
        <Box display="flex" className="list-overview">
            <Box
                className="list-img"
                position="relative"
                width="60px"
                height="80px"
                borderRadius={10}
                overflow="hidden"
                display="flex"
            >
                <Suspense fallback={<Loading />}>
                    <LoadImage
                        content_type={content_type}
                        img={img}
                        thumbnail={thumbnail}
                        style={{ borderRadius: '10px' }}
                    />
                </Suspense>
                <Box
                    borderRadius={10}
                    bgcolor="rgba(0,0,0,.2)"
                    overflow="hidden"
                    height={20}
                    width={20}
                    className="card-image-open"
                    onClick={(e) => toFullScreen(e, img, content_type)}
                    position="absolute"
                    top={5}
                    right={5}
                >
                    <button>
                        <img src={ExpandIcon} alt="expand-icon" />
                    </button>
                </Box>
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="center">
                <Box
                    my={1}
                    ml={1}
                    color="text.black"
                    fontWeight="bold"
                    className="mobile-color-white"
                >
                    {title}
                </Box>
                <Box
                    my={1}
                    ml={1}
                    color="text.black50"
                    fontWeight="bold"
                    className="mobile-color-white"
                >
                    Set of {total}
                </Box>
            </Box>
        </Box>
    );
};

AssetOverview.propTypes = {
    content_type: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    toFullScreen: PropTypes.func.isRequired,
};

export default AssetOverview;
