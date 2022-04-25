import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import { useOutsideClick } from 'hooks/useOutsideClick';

const SidePanel = ({ closeButtonLabel, open, handleClose, children }) => {
    const panelRef = useRef(null);
    useOutsideClick(panelRef, handleClose);

    return (
        <Box ref={panelRef} px={2} className={`sidePanel ${open ? 'open-panel' : 'hide-panel'}`}>
            <Box width="100%" display="flex" justifyContent="flex-end">
                <button
                    className="whiteBtnHoverGreen"
                    onClick={() => handleClose()}
                >{`<<< ${closeButtonLabel}`}</button>
            </Box>
            {children}
        </Box>
    );
};

SidePanel.propTypes = {
    closeButtonLabel: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    children: PropTypes.object.isRequired,
};

export default SidePanel;
