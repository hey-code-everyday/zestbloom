import React, { useState } from 'react';
import {
    Typography,
    Box,
    Button,
    IconButton,
    Dialog,
    DialogContent,
    DialogTitle,
} from '@material-ui/core';
import { ChevronLeft } from '@material-ui/icons';
import Field from 'components/shared/fields/Field';
import { FormikProvider, useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { forgotPassword } from 'redux/auth/actions';
import LottieContainer from 'components/shared/LottieContainer';
import { forgotPasswordValidation } from 'services/yup-schemas/forgotPasswordValidation';
import PropTypes from 'prop-types';

const ForgotPassword = (props) => {
    const {
        forgotPasswordDialog,
        onCloseForgotPasswordDialog,
        onOpenLoginDialog,
        onOpenVerifyForgotPasswordDialog,
        setEmailFromForgotPassword,
    } = props;
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: forgotPasswordValidation,
        onSubmit: (values) => {
            setIsLoading(true);
            dispatch(forgotPassword(values.email))
                .then((res) => {
                    setEmailFromForgotPassword(values.email);
                    onCloseForgotPasswordDialog();
                    onOpenVerifyForgotPasswordDialog();
                    setIsLoading(false);
                })
                .catch((err) => {
                    setIsLoading(false);
                });
        },
    });

    const handleBackToLogin = () => {
        onCloseForgotPasswordDialog();
        onOpenLoginDialog();
    };

    return (
        <Dialog
            className="dark-modal"
            open={forgotPasswordDialog}
            onClose={onCloseForgotPasswordDialog}
            scroll="body"
            aria-labelledby="form-forgot-password-title"
        >
            <DialogTitle
                id="form-forgot-password-title"
                className="with-back-btn"
                disableTypography
            >
                <IconButton
                    className="back-btn icon-btn md containedSecondary rect"
                    disableRipple
                    disableFocusRipple
                    onClick={handleBackToLogin}
                >
                    <ChevronLeft style={{ fontSize: 26 }} />
                </IconButton>
                <Typography variant="h4">Forgot Password</Typography>
            </DialogTitle>

            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <FormikProvider value={formik}>
                        <Field
                            field="input"
                            type="email"
                            label="Email"
                            name="email"
                            className="no-margin"
                            {...formik.getFieldProps('email')}
                        />
                    </FormikProvider>
                    <Box textAlign="center" mt={4}>
                        {isLoading ? (
                            <LottieContainer
                                containerStyles={{
                                    height: '46px',
                                    width: '100%',
                                }}
                                lottieStyles={{ width: '50px' }}
                            />
                        ) : (
                            <Button color="primary" variant="contained" type="submit" size="large">
                                Send
                            </Button>
                        )}
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
};

ForgotPassword.propTypes = {
    forgotPasswordDialog: PropTypes.bool,
    onCloseForgotPasswordDialog: PropTypes.func,
    onOpenLoginDialog: PropTypes.func,
    onOpenVerifyForgotPasswordDialog: PropTypes.func,
    setEmailFromForgotPassword: PropTypes.func,
};

export default ForgotPassword;
