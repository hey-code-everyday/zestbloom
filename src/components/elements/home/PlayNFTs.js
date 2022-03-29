import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Box } from '@material-ui/core';

import OpenPicturePopover from '../cards/fullScreen';

import LogoPlay from 'assets/img/zb-new/logo-play.svg';
import bannerImg1 from 'assets/img/zb-new/cover-images/1.png';
import bannerImg2 from 'assets/img/zb-new/cover-images/2.png';
import bannerImg3 from 'assets/img/zb-new/cover-images/3.png';

const PlayNFTs = ({ nfts }) => {
    const [fullScreenPhoto, setFullScreenPhoto] = useState({
        isOpen: false,
        src: '',
        content_type: '',
    });

    return (
        <Box className="banner-play-container" m="auto">
            <Link to="/marketplace">
                <img src={LogoPlay} alt="logoPlay" className="banner-play" />
            </Link>
            <div className="banner-img-1">
                <img
                    className="masked-img-1"
                    src={nfts[0]?.content ?? bannerImg1}
                    alt="logoPlay"
                    onClick={() =>
                        setFullScreenPhoto({
                            isOpen: true,
                            src: nfts[0]?.content ?? bannerImg1,
                            content_type: 'image',
                        })
                    }
                />
            </div>
            <div className="banner-img-2">
                <img
                    className="masked-img-2 banner-img"
                    src={nfts[1]?.content ?? bannerImg2}
                    alt="logoPlay"
                    onClick={() =>
                        setFullScreenPhoto({
                            isOpen: true,
                            src: nfts[1]?.content ?? bannerImg2,
                            content_type: 'image',
                        })
                    }
                />
            </div>
            <div className="banner-img-3">
                <img
                    className="masked-img-3 banner-img"
                    src={nfts[2]?.content ?? bannerImg3}
                    alt="logoPlay"
                    onClick={() =>
                        setFullScreenPhoto({
                            isOpen: true,
                            src: nfts[2]?.content ?? bannerImg3,
                            content_type: 'image',
                        })
                    }
                />
            </div>
            {fullScreenPhoto.isOpen && (
                <OpenPicturePopover
                    fullScreenPhoto={fullScreenPhoto}
                    onClose={() => {
                        setFullScreenPhoto({ isOpen: false, src: '', content_type: '' });
                    }}
                    content_type={fullScreenPhoto.content_type}
                />
            )}
        </Box>
    );
};

PlayNFTs.defaultProps = {
    nfts: [],
};

PlayNFTs.propTypes = {
    nfts: PropTypes.arrayOf(
        PropTypes.shape({
            asset_id: PropTypes.number,
            content: PropTypes.string,
            size: PropTypes.string,
        }),
    ),
};

export default PlayNFTs;
