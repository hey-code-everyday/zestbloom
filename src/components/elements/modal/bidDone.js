import React from 'react';
import { Box, Button, Dialog, Typography } from '@material-ui/core';
import checked from '../../../assets/img/checked.svg';
import AssetImage from 'pages/asset/assetImage';
import PropTypes from 'prop-types';

const BidDoneModal = ({ submittedBid, onCloseSubmittedBid, selectedAsset }) => {
    return (
        <>
            <Dialog
                open={submittedBid}
                onClose={onCloseSubmittedBid}
                scroll="body"
                maxWidth="xs"
                className="bid-modal-done"
            >
                <Box className="modal-body">
                    <Typography variant="h4">Thank You For Your Bid</Typography>
                    <Box className="bid-image">
                        <Box className="image">
                            <AssetImage currentAsset={selectedAsset} dontShowFullScreen={true} />
                        </Box>
                        <Box className="icon">
                            <img src={checked} alt="Envelope" width="55" />
                        </Box>
                    </Box>
                    <Typography variant="subtitle2">Bid submitted.</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        size="large"
                        onClick={onCloseSubmittedBid}
                    >
                        Done
                    </Button>
                </Box>
            </Dialog>
        </>
    );
};

BidDoneModal.propTypes = {
    submittedBid: PropTypes.bool,
    onCloseSubmittedBid: PropTypes.func,
    selectedAsset: PropTypes.object,
};

export default BidDoneModal;
