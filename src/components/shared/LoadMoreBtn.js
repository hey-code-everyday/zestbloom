import React from 'react';
import { Box, Button } from '@material-ui/core';
import PropTypes from 'prop-types';

const LoadMoreBtn = ({ loadMoreAssets }) => {
    return (
        <Box textAlign="center" mt={5}>
            <Button
                className="btn-load-more"
                variant="outlined"
                size="large"
                onClick={loadMoreAssets}
            >
                Load More
            </Button>
        </Box>
    );
};

LoadMoreBtn.propTypes = {
    loadMoreAssets: PropTypes.func,
};

export default LoadMoreBtn;
