import React from 'react';
import { Typography, Box, Dialog, DialogContent, DialogTitle, Button } from '@material-ui/core';
import checked from 'assets/img/checked.svg';
import PropTypes from 'prop-types';

const RequestSent = (props) => {
    const { requestSentDialog, onCloseRequestSentDialog } = props;

    return (
        <Dialog
            open={requestSentDialog}
            onClose={onCloseRequestSentDialog}
            scroll="body"
            maxWidth="xs"
            aria-labelledby="verify-title"
        >
            <DialogTitle id="verify-title" disableTypography>
                <Typography variant="h4">Your Request Sent</Typography>
            </DialogTitle>

            <DialogContent>
                <Box textAlign="center" mt={2}>
                    <Box display="inline-block">
                        <img src={checked} alt="Envelope" width="95" />
                    </Box>
                    <Box fontSize="1rem" lineHeight="1.5rem" color="text.black50" mt={2} mb={5.5}>
                        Your Request to become an artist has been sent.
                    </Box>
                    <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        onClick={onCloseRequestSentDialog}
                    >
                        Done
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

RequestSent.propTypes = {
    requestSentDialog: PropTypes.bool,
    onCloseRequestSentDialog: PropTypes.func,
};

export default RequestSent;
