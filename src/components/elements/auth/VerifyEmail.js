import React from 'react';
import { Typography, Box, Dialog, DialogContent, DialogTitle, Button } from '@material-ui/core';
import checked from 'assets/img/checked.svg';
import PropTypes from 'prop-types';

const VerifyEmail = (props) => {
    const { verifyDialog, verifyDialogClose, isEmailVerification } = props;

    return (
        <Dialog
            open={verifyDialog}
            onClose={verifyDialogClose}
            scroll="body"
            maxWidth="xs"
            aria-labelledby="verify-title"
        >
            <DialogTitle id="verify-title" disableTypography>
                <Typography variant="h4">
                    {isEmailVerification ? 'Verification Completed ' : 'Activation Completed!'}
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Box textAlign="center" mt={2}>
                    <Box display="inline-block">
                        <img src={checked} alt="Envelope" width="95" />
                    </Box>
                    <Box fontSize={15} color="text.black50" mt={2} mb={5.5}>
                        {isEmailVerification
                            ? 'The email is verified'
                            : 'Your account has been activated.'}
                    </Box>
                    <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        onClick={verifyDialogClose}
                    >
                        Done
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

VerifyEmail.propTypes = {
    verifyDialog: PropTypes.bool,
    verifyDialogClose: PropTypes.func,
    isEmailVerification: PropTypes.bool,
};
export default VerifyEmail;
