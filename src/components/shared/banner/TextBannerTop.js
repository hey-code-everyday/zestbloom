import React from 'react';
import { Box, Typography, Container } from '@material-ui/core';
import PropTypes from 'prop-types';

const TextBannerTop = ({ bannerTitle, subtitle }) => {
    return (
        <>
            <Box textAlign="center" className="text-banner-top">
                <Container maxWidth="xl">
                    <Typography className="text-banner-top-title">{bannerTitle}</Typography>
                    <Typography className="text-banner-top-subtitle">{subtitle}</Typography>
                </Container>
            </Box>
        </>
    );
};

TextBannerTop.propTypes = {
    bannerTitle: PropTypes.string,
    subtitle: PropTypes.string,
};

export default TextBannerTop;
