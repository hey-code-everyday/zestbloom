import React from 'react';
import { Box, Button } from '@material-ui/core';

const SeeMoreBtn = () => {
    return (
        <Box textAlign="center" mt={{ xs: 2.5, sm: 5 }} className="see-more-btn">
            <Button variant="outlined" color="secondary" size="large">
                See More
            </Button>
        </Box>
    );
};

export default SeeMoreBtn;
