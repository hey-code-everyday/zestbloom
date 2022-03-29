import React, { useState } from 'react';
import { FormikProvider, useFormik } from 'formik';
import {
    Typography,
    DialogContent,
    DialogTitle,
    Dialog,
    Box,
    Button,
    Link as LinkComponent,
} from '@material-ui/core';
import Field from 'components/shared/fields/Field';
import { changePassword } from 'redux/profile-settings/actions';
import { useDispatch } from 'react-redux';
import { changePasswordValidation } from 'services/yup-schemas/changePasswordValidation';
import PropTypes from 'prop-types';

const ChangePassword = (props) => {
    const { passwordDialog, onClosePasswordDialog } = props;
    const [, setSuccess] = useState(false);
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            repeatPassword: '',
        },
        validationSchema: changePasswordValidation,
        onSubmit: (values) => {
            dispatch(changePassword(values.oldPassword, values.newPassword))
                .then(() => {
                    onClosePasswordDialog();
                    setSuccess(true);
                })
                .catch(() => setSuccess(false));
        },
    });

    return (
        <Dialog
            open={passwordDialog}
            onClose={onClosePasswordDialog}
            scroll="body"
            aria-labelledby="form-login-title"
        >
            <DialogTitle id="form-signup-title" disableTypography>
                <Box mb={2}>
                    <Typography variant="h5" className="text-left">
                        Change Password
                    </Typography>
                </Box>
            </DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit}>
                        <FormikProvider value={formik}>
                            <Field
                                field="input"
                                type="password"
                                placeholder="Old Password"
                                name="oldPassword"
                                {...formik.getFieldProps('oldPassword')}
                            />
                            <Field
                                field="input"
                                type="password"
                                placeholder="New Password"
                                name="newPassword"
                                {...formik.getFieldProps('newPassword')}
                            />
                            <Field
                                field="input"
                                type="password"
                                placeholder="Repeat Password"
                                name="repeatPassword"
                                {...formik.getFieldProps('repeatPassword')}
                            />
                        </FormikProvider>
                    </form>
                    <Box display="flex" alignItems="center" mt={3} justifyContent="flex-end">
                        <Box px={3}>
                            <LinkComponent color="secondary" onClick={onClosePasswordDialog}>
                                Cancel
                            </LinkComponent>
                        </Box>
                        <Box>
                            <Button variant="contained" color="primary" type="submit" size="large">
                                Save
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </form>
        </Dialog>
    );
};

ChangePassword.propTypes = {
    passwordDialog: PropTypes.bool,
    onClosePasswordDialog: PropTypes.func,
};

export default ChangePassword;
