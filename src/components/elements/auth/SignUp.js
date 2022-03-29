import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useFormik, FormikProvider } from 'formik';
import {
    Typography,
    Button,
    Checkbox,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Link as LinkComponent,
    Dialog,
    InputAdornment,
    IconButton,
    Box,
} from '@material-ui/core';
import { VisibilityOutlined } from '@material-ui/icons';
import Field from 'components/shared/fields/Field';
import { signup } from 'redux/auth/actions';
import { signUpValidation } from 'services/yup-schemas/signUpValidation';
import { setNotification } from 'redux/profile/actions';
import PropTypes from 'prop-types';

const SignUp = (props) => {
    const { signupDialog, onCloseSignupDialog, onOpenLoginDialog, onOpenVerifyDialog } = props;
    const dispatch = useDispatch();
    const [, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            termsAndPrivacy: '',
        },
        validationSchema: signUpValidation,
        onSubmit: (values) => {
            const data = {
                first_name: values.firstName,
                last_name: values.lastName,
                username: values.username,
                email: values.email,
                password: values.password,
                is_agree: values.termsAndPrivacy,
            };

            dispatch(signup(data))
                .then(() => {
                    onCloseSignupDialog();
                    setSuccess(true);
                    onOpenVerifyDialog();
                    formik.resetForm();
                })
                .catch((error) => {
                    if (error?.response?.data?.email) {
                        const errorEmail = error?.response?.data?.email[0];
                        dispatch(setNotification({ status: 'error', message: errorEmail }));
                    } else {
                        dispatch(
                            setNotification({ status: 'error', message: 'Something went wrong' }),
                        );
                    }
                    setSuccess(false);
                });
        },
    });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Dialog
            className="dark-modal"
            open={signupDialog}
            onClose={onCloseSignupDialog}
            scroll="body"
            aria-labelledby="form-signup-title"
        >
            <DialogTitle id="form-signup-title" disableTypography>
                <Typography variant="h4">Sign Up</Typography>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <FormikProvider value={formik}>
                        <Field
                            field="input"
                            type="text"
                            label="Name"
                            name="firstName"
                            {...formik.getFieldProps('firstName')}
                        />
                        <Field
                            field="input"
                            type="text"
                            label="Surname"
                            name="lastName"
                            {...formik.getFieldProps('lastName')}
                        />
                        <Field
                            field="input"
                            type="text"
                            label="Username"
                            name="username"
                            {...formik.getFieldProps('username')}
                        />
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
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="Toggle password visibility"
                                            edge="end"
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
                        <Field
                            field="input"
                            type={showPassword ? 'text' : 'password'}
                            label="Confirm Password"
                            name="confirmPassword"
                            className="no-margin"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="Toggle password visibility"
                                            edge="end"
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
                            {...formik.getFieldProps('confirmPassword')}
                        />

                        <Box mt={3}>
                            <FormControlLabel
                                className="form-checkbox"
                                control={
                                    <Checkbox
                                        name="termsAndPrivacy"
                                        color="primary"
                                        checked={Boolean(formik.values.termsAndPrivacy)}
                                        onChange={formik.handleChange}
                                    />
                                }
                                label={
                                    <Box fontSize={'1rem'} lineHeight={'1.5rem'}>
                                        <span>By signing up, you agree to our </span>
                                        <LinkComponent
                                            to="/terms_of_service"
                                            component={Link}
                                            color="primary"
                                            className="fw-700"
                                            onClick={onCloseSignupDialog}
                                        >
                                            Terms of Service
                                        </LinkComponent>
                                        <span> and </span>
                                        <LinkComponent
                                            to="/privacy_policy"
                                            component={Link}
                                            color="primary"
                                            className="fw-700"
                                            onClick={onCloseSignupDialog}
                                        >
                                            Privacy Policy
                                        </LinkComponent>
                                    </Box>
                                }
                            />
                        </Box>

                        <Box textAlign="center" mt={3}>
                            <Button color="primary" variant="contained" type="submit" size="large">
                                Sign Up
                            </Button>
                            <Box
                                display="flex"
                                justifyContent="center"
                                fontSize="1rem"
                                lineHeight="1.25rem"
                                mt={3}
                            >
                                <Typography variant="body2">
                                    Already have an account?&nbsp;
                                </Typography>
                                <LinkComponent
                                    onClick={onOpenLoginDialog}
                                    color="primary"
                                    className="fw-700"
                                >
                                    Sign In
                                </LinkComponent>
                            </Box>
                        </Box>
                    </FormikProvider>
                </form>
            </DialogContent>
        </Dialog>
    );
};

SignUp.propTypes = {
    signupDialog: PropTypes.bool,
    onCloseSignupDialog: PropTypes.func,
    onOpenLoginDialog: PropTypes.func,
    onOpenVerifyDialog: PropTypes.func,
};

export default SignUp;
