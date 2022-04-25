import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FormikProvider, useFormik } from 'formik';
import {
    Typography,
    Button,
    DialogContent,
    DialogTitle,
    Link as LinkComponent,
    Dialog,
    InputAdornment,
    IconButton,
    Box,
} from '@material-ui/core';
import { VisibilityOutlined } from '@material-ui/icons';
import Field from 'components/shared/fields/Field';
import { login } from 'redux/auth/actions';
import { loginValidationSchema } from 'services/yup-schemas/loginValidationSchema';
import { setNotification } from 'redux/profile/actions';
import PropTypes from 'prop-types';

const Login = (props) => {
    const { loginDialog, onCloseLoginDialog, onOpenSignupDialog, onOpenForgotPasswordDialog } =
        props;
    const [showPassword, setShowPassword] = useState(false);
    const [, setLoading] = useState(false);
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginValidationSchema,
        onSubmit: (values) => {
            dispatch(login(values.email, values.password))
                .then(() => {
                    onCloseLoginDialog();
                })
                .catch((error) => {
                    console.log(error);
                    dispatch(
                        setNotification({ status: 'error', message: 'Wrong login credentials!' }),
                    );
                    setLoading(false);
                });
        },
    });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Dialog
            className="dark-modal"
            open={loginDialog}
            onClose={onCloseLoginDialog}
            scroll="body"
            aria-labelledby="form-login-title"
        >
            <DialogTitle id="form-signup-title" disableTypography>
                <Typography variant="h4">Sign In</Typography>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <FormikProvider value={formik}>
                        <Field
                            field="input"
                            type="email"
                            label="Email"
                            name="email"
                            {...formik.getFieldProps('email')}
                        />
                        <Field
                            field="input"
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            name="password"
                            className="no-margin"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="Toggle password visibility"
                                            onClick={handleClickShowPassword}
                                        >
                                            <VisibilityOutlined
                                                style={{ fontSize: 24 }}
                                                color={showPassword ? 'primary' : 'inherit'}
                                            />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            {...formik.getFieldProps('password')}
                        />

                        <Box textAlign="right" mt={2}>
                            <LinkComponent
                                onClick={onOpenForgotPasswordDialog}
                                color="primary"
                                className="fw-700"
                            >
                                Forgot Password
                            </LinkComponent>
                        </Box>

                        <Box textAlign="center" mt={6}>
                            <Button color="primary" variant="contained" type="submit" size="large">
                                Sign In
                            </Button>
                            <Box
                                display="flex"
                                justifyContent="center"
                                fontSize="1rem"
                                mt={3}
                                lineHeight="1.25rem"
                            >
                                <Typography variant="body2">
                                    Don’t have an account?&nbsp;
                                </Typography>
                                <LinkComponent
                                    onClick={onOpenSignupDialog}
                                    color="primary"
                                    className="fw-700"
                                >
                                    Sign Up
                                </LinkComponent>
                            </Box>
                        </Box>
                    </FormikProvider>
                </form>
            </DialogContent>
        </Dialog>
    );
};

Login.propTypes = {
    loginDialog: PropTypes.bool,
    onCloseLoginDialog: PropTypes.func,
    onOpenSignupDialog: PropTypes.func,
    onOpenForgotPasswordDialog: PropTypes.func,
};

export default Login;
