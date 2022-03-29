import React from 'react';
import { Box, CardMedia } from '@material-ui/core';
import { Link } from 'react-router-dom';

const ActionBySomeone = () => {
    return (
        <Box component="li">
            <Box className="image">
                <CardMedia
                    image="https://via.placeholder.com/150"
                    style={{ borderRadius: '50%' }}
                />
            </Box>
            <Box className="info">
                <Box className="title">
                    Your creation was put to auction by
                    <Box
                        fontWeight="bold"
                        fontFamily="h1.fontFamily"
                        className="link primary"
                        component={Link}
                        to="/"
                    >
                        @Roxanne
                    </Box>
                </Box>
                <Box className="time">2 days ago</Box>
            </Box>
        </Box>
    );
};

export default ActionBySomeone;
