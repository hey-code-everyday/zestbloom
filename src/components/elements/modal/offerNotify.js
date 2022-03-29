import React from 'react';
import { Button, Box, Dialog, Typography } from '@material-ui/core';
import LoadImage from '../cards/assetCardImage';
import PropTypes from 'prop-types';

const OfferNotifyModal = (props) => {
    const { open, onClose, onConfirm, info, currentAsset } = props;

    const { url, ipfs_url, mimetype } = currentAsset?.asset?.content ?? {};
    const img = url ?? ipfs_url;
    const thumbnail = currentAsset?.asset?.thumbnail?.url;
    return (
        <Dialog open={open} onClose={onClose} scroll="body" className="offerNotify-popup">
            <Box className="offerNotify-popup-content" alignItems="center">
                <Typography variant="body1" className="title">
                    {info.title}
                </Typography>
                <Box className="image">
                    <LoadImage content_type={mimetype} img={img} thumbnail={thumbnail} />
                </Box>
                <Typography className="desc">{info.description}</Typography>
                <Box display="flex" alignItems="center" mt={5} justifyContent="center">
                    <Button variant="contained" color="primary" size="large" onClick={onConfirm}>
                        Done
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};
OfferNotifyModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
    info: PropTypes.object,
    currentAsset: PropTypes.object,
};

export default OfferNotifyModal;
