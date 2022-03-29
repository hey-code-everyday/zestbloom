import React from 'react';
import { Box, Dialog, Link as LinkComponent, Typography } from '@material-ui/core';

const CancelBidModal = ({ cancelBid, onCloseCancelBid }) => {
    return (
        <Dialog open={cancelBid} onClose={onCloseCancelBid} scroll="body" className="cancel-popup">
            <Box className="cancel-popup-content">
                <Typography variant="body1" className="title">
                    Cancel Bid
                </Typography>
                <Typography className="desc">Do you want to cancel the bid?</Typography>
                <Box display="flex" alignItems="center" mt={5} justifyContent="flex-end">
                    <Box mr={6}>
                        <LinkComponent color="secondary" onClick={onCloseCancelBid}>
                            Yes, Cancel
                        </LinkComponent>
                    </Box>
                    <Box>
                        <LinkComponent color="primary" onClick={onCloseCancelBid}>
                            No, Keep
                        </LinkComponent>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};

export default CancelBidModal;
