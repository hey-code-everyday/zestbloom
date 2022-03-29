import React from 'react';
import { Typography, Box, Dialog, DialogContent, DialogTitle, Link } from '@material-ui/core';
import verifyEmail from 'assets/img/verify-email.svg';
import { forgotPassword } from 'redux/auth/actions';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';

const VerifyForgotPasswordEmail = (props) => {
    const history = useHistory();
    const {
        verifyForgotPasswordDialog,
        onCloseVerifyForgotPasswordDialog,
        emailFromForgotPassword,
    } = props;
    const dispatch = useDispatch();

    const resend = () => {
        dispatch(forgotPassword(emailFromForgotPassword));
    };

    return (
        <Dialog
            className="dark-modal"
            open={verifyForgotPasswordDialog}
            onClose={onCloseVerifyForgotPasswordDialog}
            scroll="body"
            maxWidth="xs"
            aria-labelledby="verify-title"
        >
            <DialogTitle id="verify-title" disableTypography>
                <Typography variant="h4">Forgot Password</Typography>
            </DialogTitle>

            <DialogContent>
                <Box textAlign="center" mt={2}>
                    <Box display="inline-block">
                        <img src={verifyEmail} alt="Envelope" width="125" />
                    </Box>
                    <Box fontSize={15} color="text.black50" my={4} px={{ sm: 5, xs: 0 }}>
                        <Typography component="span" variant="body1">
                            We have sent an email to&nbsp;
                        </Typography>
                        <Box component="span" color="primary.main" fontWeight="500">
                            <Typography
                                component="span"
                                variant="body1"
                                style={{ fontWeight: 'bold', color: 'rgb(72, 90, 253)' }}
                            >
                                {emailFromForgotPassword}
                            </Typography>
                        </Box>
                        <Typography component="span" variant="body1">
                            &nbsp;to change your password.
                        </Typography>
                    </Box>
                    <Box fontSize={16} color="text.black70" fontWeight="500">
                        <Typography component="span" variant="body1">
                            Haven’t got any email?&nbsp;&nbsp;
                        </Typography>
                        <Link
                            to={history.location.pathname}
                            color="primary"
                            className="fw-700"
                            onClick={resend}
                        >
                            Resend
                        </Link>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};
VerifyForgotPasswordEmail.propTypes = {
    verifyForgotPasswordDialog: PropTypes.bool,
    onCloseVerifyForgotPasswordDialog: PropTypes.func,
    emailFromForgotPassword: PropTypes.bool,
};

export default VerifyForgotPasswordEmail;
