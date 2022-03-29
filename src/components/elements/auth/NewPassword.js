import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Box, Button, Container, IconButton, InputAdornment } from '@material-ui/core';
import { VisibilityOutlined } from '@material-ui/icons';
import { FormikProvider, useFormik } from 'formik';
import Field from 'components/shared/fields/Field';
import { verifiedForgotPassword } from 'redux/auth/actions';
import { Redirect } from 'react-router-dom';
import { passwordValidationSchema } from 'services/yup-schemas/passwordValidationSchema';

export const NewPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { forgotPasswordCode } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: passwordValidationSchema,
        onSubmit: (values) => {
            dispatch(verifiedForgotPassword(forgotPasswordCode, values.password)).then(() => {
                console.log('Success');
            });
        },
    });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    if (!forgotPasswordCode) {
        return <Redirect to="/" />;
    }

    return (
        <Container maxWidth="sm">
            <Box my={12} px={1.5}>
                <Box mb={4} textAlign="center">
                    <Typography variant="h4">Create New Password</Typography>
                </Box>

                <form onClick={formik.handleSubmit}>
                    <FormikProvider value={formik}>
                        <Field
                            field="input"
                            type={showPassword ? 'text' : 'password'}
                            label="New Password"
                            name="password"
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
                        <Field
                            field="input"
                            type={showPassword ? 'text' : 'password'}
                            label="Confirm New Password"
                            name="confirmPassword"
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
                            {...formik.getFieldProps('confirmPassword')}
                        />

                        <Box mt={4} textAlign="center">
                            <Button color="primary" variant="contained" type="submit" size="large">
                                Save
                            </Button>
                        </Box>
                    </FormikProvider>
                </form>
            </Box>
        </Container>
    );
};

export default NewPassword;
