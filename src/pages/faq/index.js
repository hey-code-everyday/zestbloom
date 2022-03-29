import React from 'react';
import TextBannerTop from '../../components/shared/banner/TextBannerTop';
import TextBannerBottom from '../../components/shared/banner/TextBannerBottom';
import VerticalTabs from '../../components/shared/VerticalTabs';
import { Box } from '@material-ui/core';

const Faq = () => {
    return (
        <>
            <TextBannerTop
                bannerTitle="Questions about ZestBloom?"
                subtitle="We’re here to help you."
            />
            <Box className="info-pages">
                <VerticalTabs />
            </Box>
            <TextBannerBottom />
        </>
    );
};

export default Faq;
