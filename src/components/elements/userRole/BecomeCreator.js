import React from 'react';
import { FormikProvider, useFormik } from 'formik';
import { Typography, DialogContent, DialogTitle, Dialog, Button, Box } from '@material-ui/core';
import Field from 'components/shared/fields/Field';
import { becomeCreator } from 'redux/auth/actions';
import { useDispatch } from 'react-redux';
import { becomeAnCreatorValidation } from 'services/yup-schemas/becomeAnCreatorValidation';
import PropTypes from 'prop-types';

const BecomeCreator = (props) => {
    const { creatorDialog, onCloseCreatorDialog, onOpenRequestSentDialog } = props;
    const dispatch = useDispatch();

    let didRequest = false;
    const formik = useFormik({
        initialValues: {
            artworks_url: '',
        },
        validationSchema: becomeAnCreatorValidation,
        onSubmit: (e) => {
            if (!didRequest) {
                didRequest = true;
                dispatch(becomeCreator(e.artworks_url)).then((response) => {
                    if (response?.status === 201) onOpenRequestSentDialog();
                    didRequest = false;
                });
            }
        },
    });

    return (
        <Dialog
            open={creatorDialog}
            onClose={onCloseCreatorDialog}
            scroll="body"
            aria-labelledby="form-login-title"
        >
            <DialogTitle id="form-signup-title" disableTypography>
                <Box mb={4}>
                    <Typography variant="h5">Request to Become an Artist</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <FormikProvider value={formik}>
                        <Field
                            field="input"
                            type="text"
                            label="Link to Your Artworks"
                            name="artworks_url"
                            {...formik.getFieldProps('artworks_url')}
                        />
                    </FormikProvider>

                    <Box display="flex" mt={3} justifyContent="flex-end" alignItems="center">
                        <Box pr={2}>
                            <Button color="secondary" size="large" onClick={onCloseCreatorDialog}>
                                Cancel
                            </Button>
                        </Box>
                        <Box>
                            <Button variant="contained" color="primary" size="large" type="submit">
                                Submit
                            </Button>
                        </Box>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
};

BecomeCreator.propTypes = {
    creatorDialog: PropTypes.bool,
    onCloseCreatorDialog: PropTypes.func,
    onOpenRequestSentDialog: PropTypes.func,
};

export default BecomeCreator;
