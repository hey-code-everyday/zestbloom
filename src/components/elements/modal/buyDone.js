import React from 'react';
import { Box, Button, Dialog, Typography } from '@material-ui/core';
import checked from '../../../assets/img/checked.svg';
import AssetImage from 'pages/asset/assetImage';
import PropTypes from 'prop-types';

const BuyNowDoneModal = ({ submittedBuyNow, onCloseSubmittedBuyNow, selectedAsset }) => {
    return (
        <>
            <Dialog
                open={submittedBuyNow}
                onClose={onCloseSubmittedBuyNow}
                scroll="body"
                maxWidth="xs"
                className="bid-modal-done"
            >
                <Box className="modal-body">
                    <Typography variant="h4">Thank You For Your Purchase</Typography>
                    <Box className="bid-image">
                        <Box className="image">
                            <AssetImage currentAsset={selectedAsset} dontShowFullScreen={true} />
                        </Box>
                        <Box className="icon">
                            <img src={checked} alt="Envelope" width="55" />
                        </Box>
                    </Box>
                    <Typography variant="subtitle2">
                        You have successfully purchased an asset
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        size="large"
                        onClick={onCloseSubmittedBuyNow}
                    >
                        Done
                    </Button>
                </Box>
            </Dialog>
        </>
    );
};

BuyNowDoneModal.propTypes = {
    submittedBuyNow: PropTypes.bool,
    onCloseSubmittedBuyNow: PropTypes.func,
    selectedAsset: PropTypes.object,
};
export default BuyNowDoneModal;
