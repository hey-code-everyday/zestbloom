import React from 'react';
import { Box, Dialog, Link as LinkComponent, Typography } from '@material-ui/core';

const CancelAuctionModal = ({ cancelAuction, onCloseCancelAuction }) => {
    return (
        <Dialog
            open={cancelAuction}
            onClose={onCloseCancelAuction}
            scroll="body"
            className="cancel-popup"
        >
            <Box className="cancel-popup-content">
                <Typography variant="body1" className="title">
                    Cancel Auction
                </Typography>
                <Typography className="desc">Do you want to cancel the auction?</Typography>
                <Box display="flex" alignItems="center" mt={5} justifyContent="flex-end">
                    <Box mr={6}>
                        <LinkComponent color="secondary" onClick={onCloseCancelAuction}>
                            Yes, Cancel
                        </LinkComponent>
                    </Box>
                    <Box>
                        <LinkComponent color="primary" onClick={onCloseCancelAuction}>
                            No, Keep
                        </LinkComponent>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};

export default CancelAuctionModal;
