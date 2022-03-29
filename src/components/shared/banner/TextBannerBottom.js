import React, { useState } from 'react';
import { Box, Typography, Container } from '@material-ui/core';
import MiniInfoModal from '../../elements/modal/miniInfoModal';
const TextBannerBottom = () => {
    const [helpCenter, setHelpCenter] = useState(false);
    const onOpenHelpCenter = () => {
        setHelpCenter(true);
    };
    const onCloseHelpCenter = () => {
        setHelpCenter(false);
    };
    return (
        <>
            <Box textAlign="center" className="text-banner-bottom">
                <Container maxWidth="xl">
                    <Typography variant="h3" className="text-banner-bottom-title">
                        Looking For more information? <br /> Check out{' '}
                        <button onClick={onOpenHelpCenter}>Help Center</button>
                    </Typography>
                    <Typography className="text-banner-bottom-text">
                        Get direct access to ZestBloom{' '}
                        <button onClick={onOpenHelpCenter}>Help Center</button> experts who can help
                        with more specific questions. Here you can find more details about ZestBloom
                        product and services. <br />
                        <br />
                        Stay Connected With Us : <br /> Best Regards ZestBloom team.
                    </Typography>
                </Container>
            </Box>
            <MiniInfoModal
                open={helpCenter}
                close={onCloseHelpCenter}
                email="help@zestbloom.com"
                title="Get in touch with us"
            />
        </>
    );
};

export default TextBannerBottom;
