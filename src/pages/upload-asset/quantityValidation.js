import React from 'react';
import { Typography, DialogContent, DialogTitle, Dialog, Button, Box } from '@material-ui/core';
import PropTypes from 'prop-types';

const QuantityValidation = (props) => {
    const { openQuantityDialog, onCloseDialog, quantityNoRequiredValue, confirmQuantityValue } =
        props;

    return (
        <Dialog
            open={openQuantityDialog}
            onClose={onCloseDialog}
            scroll="body"
            aria-labelledby="form-login-title"
        >
            <DialogTitle id="form-signup-title" disableTypography>
                <Box mb={4}>
                    <Typography variant="h5">
                        Are you sure you want to upload {quantityNoRequiredValue} assets?
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box mb={4}>
                    <Typography variant="p">
                        Please be informed that in case of uploading more than 1 asset, we might not
                        be able to track your royalties as expected.
                    </Typography>
                </Box>
                <Box display="flex" mt={3} justifyContent="flex-end" alignItems="center">
                    <Box pr={2}>
                        <Button color="secondary" size="large" onClick={onCloseDialog}>
                            No
                        </Button>
                    </Box>
                    <Box>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => confirmQuantityValue(quantityNoRequiredValue)}
                        >
                            Yes
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

QuantityValidation.propTypes = {
    openQuantityDialog: PropTypes.bool,
    onCloseDialog: PropTypes.func,
    quantityNoRequiredValue: PropTypes.string,
    confirmQuantityValue: PropTypes.func,
};

export default QuantityValidation;
