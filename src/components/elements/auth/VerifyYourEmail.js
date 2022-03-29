import React from 'react';
import { Typography, Box, Dialog, DialogContent, DialogTitle, Link } from '@material-ui/core';
import verifyEmail from 'assets/img/verify-email.svg';
import { signup } from '../../../redux/auth/actions';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const VerifyYourEmail = (props) => {
    const { verifyDialog, onCloseVerifyDialog } = props;
    const dispatch = useDispatch();
    const { signUpFormValues } = useSelector(({ auth }) => auth);

    const resendSignUpForm = () => {
        dispatch(signup(signUpFormValues))
            .then(() => {})
            .catch(() => {});
    };

    return (
        <Dialog
            open={verifyDialog}
            onClose={onCloseVerifyDialog}
            scroll="body"
            maxWidth="xs"
            aria-labelledby="verify-title"
        >
            <DialogTitle id="verify-title" disableTypography>
                <Typography variant="h4">Verify your email address</Typography>
            </DialogTitle>

            <DialogContent>
                <Box textAlign="center" mt={2}>
                    <Box display="inline-block">
                        <img src={verifyEmail} alt="Envelope" width="125" />
                    </Box>
                    <Box fontSize={15} color="text.black50" my={4} px={5}>
                        We have sent an email to{' '}
                        <Box component="span" color="primary.main" fontWeight="500">
                            {signUpFormValues?.email}
                        </Box>{' '}
                        to confirm your email address.
                    </Box>
                    <Box fontSize={16} color="text.black70" fontWeight="500">
                        <span>Haven’t got any mail? </span>
                        <Link color="primary" className="fw-700" onClick={resendSignUpForm}>
                            Resend
                        </Link>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

VerifyYourEmail.propTypes = {
    verifyDialog: PropTypes.bool,
    onCloseVerifyDialog: PropTypes.func,
};

export default VerifyYourEmail;
