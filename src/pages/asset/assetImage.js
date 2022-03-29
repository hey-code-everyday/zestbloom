import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Box, CardMedia } from '@material-ui/core';
import { Height } from '@material-ui/icons';

import { Tag } from 'components/shared';
import OpenPicturePopover from 'components/elements/cards/fullScreen';
import { showFullScrinBtn } from 'helpers/fullScreenBtn';
import FullScreenMobileIcon from 'assets/img/full_screen_mobile.svg';
import SlickSlider from '../upload-asset/Slider';

const AssetImage = ({ staticTag, currentAsset, customTag, dontShowFullScreen = false }) => {
    const [fullScreenPhoto, setFullScreenPhoto] = useState({ isOpen: false, src: '' });

    if (!currentAsset?.asset) return null;

    const { ipfs_url, mimetype } = currentAsset?.asset?.content ?? {};

    const pictureData = getPictureData(ipfs_url, mimetype);

    let height;
    if (pictureData?.component === 'iframe') height = '400px';
    if (pictureData?.component === 'audio') height = '135px';

    const toFullScreen = () =>
        setFullScreenPhoto({
            isOpen: true,
            src: ipfs_url,
        });

    return (
        <>
            <Box className="image">
                {/*Only one image case*/}
                {staticTag && (
                    <Tag text={staticTag.name} className="secondary sm top-left rotated" />
                )}
                {customTag && (
                    <Tag
                        text={customTag.name}
                        className={`secondary sm ${staticTag ? 'top-left-2' : 'top-left'} rotated`}
                    />
                )}
                {!dontShowFullScreen && showFullScrinBtn(currentAsset?.asset) && (
                    <Box
                        border={1}
                        borderColor="text.black20"
                        borderRadius={10}
                        bgcolor="text.white"
                        overflow="hidden"
                        height={48}
                        width={48}
                        style={{
                            backgroundColor: 'rgba(255,255,255,.5)',
                            position: 'absolute', // temprorary need to delete after create make an offer page
                            right: '15px',
                            top: '15px',
                            zIndex: '1',
                        }}
                        className="card-image-open desktop-only"
                        onClick={toFullScreen}
                    >
                        <button>
                            <Height style={{ fontSize: 30 }} />
                        </button>
                    </Box>
                )}
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
                {currentAsset?.series ? (
                    <SlickSlider />
                ) : (
                    pictureData && (
                        <CardMedia
                            component={pictureData?.component}
                            src={
                                pictureData?.component === 'iframe'
                                    ? pictureData?.src + '#toolbar=0'
                                    : pictureData?.src
                            }
                            muted={pictureData?.muted}
                            controls
                            style={
                                pictureData?.component === 'iframe' ||
                                pictureData?.component === 'audio'
                                    ? { height: height }
                                    : {}
                            }
                            sandbox=""
                        />
                    )
                )}
            </Box>
            {fullScreenPhoto.isOpen && (
                <OpenPicturePopover
                    fullScreenPhoto={fullScreenPhoto}
                    onClose={() => {
                        setFullScreenPhoto({ isOpen: false, src: '' });
                    }}
                    content_type={currentAsset?.asset?.content_type}
                />
            )}
        </>
    );
};

AssetImage.propTypes = {
    staticTag: PropTypes.object,
    currentAsset: PropTypes.object,
    customTag: PropTypes.object,
    dontShowFullScreen: PropTypes.bool,
};

export default AssetImage;

function getPictureData(ipfs_url, mimetype) {
    if (!ipfs_url) return null;
    const type = mimetype?.split('/')[0];
    switch (type) {
        case 'image':
            return { component: 'img', src: ipfs_url };
        case 'audio':
            return { component: 'audio', src: ipfs_url };
        case 'video':
            return { component: 'video', src: ipfs_url, autoplay: 'autoplay', muted: true };
        case 'text':
        case 'application':
            return { component: 'iframe', src: ipfs_url };
        default:
            return { component: 'img', src: ipfs_url };
    }
}
