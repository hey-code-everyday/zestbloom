import React from 'react';
import { Button, Box, Dialog, Typography } from '@material-ui/core';
import delete_icon from 'assets/img/delete_icon.svg';
import PropTypes from 'prop-types';

const DestroyAssetModal = (props) => {
    const { open, onClose, onConfirm } = props;
    return (
        <Dialog open={open} onClose={onClose} scroll="body" className="delete-popup">
            <Box className="delete-popup-content">
                <Typography variant="body1" className="title">
                    WARNING
                </Typography>
                <Typography className="desc">
                    This will permanrtly destroy the asset on chain!
                </Typography>
                <Box display="flex" justifyContent="center">
                    <img src={delete_icon} alt="delete" />
                </Box>
                <Box mt={5} className="delete-popup-content-btns">
                    <Box mr={1}>
                        <Button color="secondary" variant="outlined" onClick={onClose}>
                            Cancel
                        </Button>
                    </Box>
                    <Box>
                        <Button className="delete-btn" variant="outlined" onClick={onConfirm}>
                            Destroy
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};

DestroyAssetModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
};

export default DestroyAssetModal;
