import * as React from 'react';
import { Box, Modal } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';

const OpenPicturePopover = ({ fullScreenPhoto, onClose, content_type }) => {
    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                open={fullScreenPhoto.isOpen}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="image-modal"
            >
                <Box className="image-modal-body">
                    {getDataOfFile(content_type, fullScreenPhoto.src)}{' '}
                    <CloseIcon className="image-close-icon" onClick={onClose} />
                </Box>
            </Modal>
        </div>
    );
};

OpenPicturePopover.propTypes = {
    fullScreenPhoto: PropTypes.object,
    onClose: PropTypes.func,
    content_type: PropTypes.string,
};

export default OpenPicturePopover;

function getDataOfFile(content_type, data) {
    const type = content_type?.split('/')[0];
    switch (type) {
        case 'audio':
            return (
                <audio
                    controls
                    style={{ height: '50%', minHeight: '100px' }}
                    className="image-modal-img"
                >
                    <source src={data} type={data.type} />
                </audio>
            );
        case 'image':
            return <img src={data} alt="asset-file" className="image-modal-img" />;
        case 'video':
            return (
                <video autoPlay="autoplay" muted controls className="image-modal-img">
                    <source src={data} type={content_type} />
                </video>
            );
        case 'text':
        case 'application':
            return (
                <iframe
                    src={data}
                    type={content_type}
                    title="asset-image"
                    style={{ background: 'white', width: '80%', height: '100%' }}
                    className="image-modal-img"
                    sandbox=""
                />
            );
        default:
            return <img src={data} alt="asset-file" className="image-modal-img" />;
    }
}
