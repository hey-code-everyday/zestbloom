import React from 'react';
import { Box, Typography } from '@material-ui/core';
import AssetImg from 'assets/img/asset-img.svg';

const UploadAssetType = ({ type, active, setIsSeries }) => {
    return (
        <Box
            className={`asset-type ${type ? type : 'single'} 
            ${active ? 'active' : ''}`}
            onClick={() => {
                setIsSeries((prev) => (type ? true : false));
            }}
        >
            <Box className="image">
                <img alt="lorem" src={AssetImg} />
            </Box>
            <Typography variant="h5" component="strong" className="notif-title">
                {type ? 'Multiple' : 'Single'} Asset
            </Typography>
            <Typography variant="body1" component="span" className="notif-message">
                Create {type ? 'Multiple' : 'Single'} asset
            </Typography>
        </Box>
    );
};

export default UploadAssetType;
