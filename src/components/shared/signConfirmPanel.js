import React from 'react';
import { confirmable, createConfirmation } from 'react-confirm';
import { Dialog, Box } from '@material-ui/core';
import PropTypes from 'prop-types';

const YourDialog = ({ show, proceed, text }) => {
    return (
        <Dialog open={show} onClose={() => proceed(false)} scroll="body" className="cancel-popup">
            <Box className="cancel-popup-content">
                <Box className="title sign">{text}</Box>
                <Box display="flex" alignItems="center" mt={2} justifyContent="flex-end">
                    <Box>
                        <button onClick={() => proceed(true)} style={{ color: '#485AFD' }}>
                            Continue to sign transaction?
                        </button>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};

YourDialog.propTypes = {
    show: PropTypes.bool,
    proceed: PropTypes.func,
    text: PropTypes.string,
};

// create confirm function
const confirm = createConfirmation(confirmable(YourDialog));

export function confirmWrapper(text) {
    return confirm({ text });
}
