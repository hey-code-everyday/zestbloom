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
import { useDispatch } from 'react-redux';
import { changeEmail } from 'redux/profile-settings/actions';
import { changeEmailValidation } from 'services/yup-schemas/changeEmailValidation';
import PropTypes from 'prop-types';

const ChangeEmail = (props) => {
    const { emailDialog, onCloseEmailDialog } = props;
    const [, setSuccess] = useState(false);
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: changeEmailValidation,
        onSubmit: (values) => {
            dispatch(changeEmail(values.email))
                .then(() => {
                    onCloseEmailDialog();
                    setSuccess(true);
                })
                .catch(() => setSuccess(false));
        },
    });

    return (
        <Dialog
            open={emailDialog}
            onClose={onCloseEmailDialog}
            scroll="body"
            aria-labelledby="form-login-title"
        >
            <DialogTitle id="form-signup-title" disableTypography>
                <Box mb={2}>
                    <Typography variant="h5" className="text-left">
                        Change Email
                    </Typography>
                </Box>
            </DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <FormikProvider value={formik}>
                        <Field
                            field="input"
                            type="email"
                            placeholder="Email"
                            name="email"
                            {...formik.getFieldProps('email')}
                        />
                    </FormikProvider>
                    <Box display="flex" alignItems="center" mt={3} justifyContent="flex-end">
                        <Box px={3}>
                            <LinkComponent color="secondary" onClick={onCloseEmailDialog}>
                                Cancel
                            </LinkComponent>
                        </Box>
                        <Box>
                            <Button variant="contained" color="primary" type="submit" size="large">
                                Change
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </form>
        </Dialog>
    );
};

ChangeEmail.propTypes = {
    emailDialog: PropTypes.bool,
    onCloseEmailDialog: PropTypes.func,
};

export default ChangeEmail;
