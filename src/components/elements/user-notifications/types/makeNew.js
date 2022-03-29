import React from 'react';
import { Box, CardMedia } from '@material-ui/core';
import AlgoFont from 'assets/img/algo-font.svg';
import { Link } from 'react-router-dom';

const MakeNew = () => {
    return (
        <Box component="li" className="unread">
            <Box className="image">
                <CardMedia image="https://via.placeholder.com/150" style={{ borderRadius: 10 }} />
            </Box>
            <Box className="info">
                <Box className="title">
                    <Box
                        fontWeight="bold"
                        fontFamily="h1.fontFamily"
                        className="link primary"
                        component={Link}
                        to="/"
                    >
                        @Roxanne
                    </Box>
                    makes a new bid
                    <Box component="span" display="inline-block" ml={0.5}>
                        <Box fontSize={20} fontWeight="bold" className="price-algo">
                            <span>120.99</span>
                            <img src={AlgoFont} alt="Algo" />
                        </Box>
                    </Box>
                </Box>
                <Box className="asset-image">
                    <CardMedia
                        image="https://via.placeholder.com/150"
                        style={{ borderRadius: 10 }}
                    />
                </Box>
                <Box className="time">1 day ago</Box>
            </Box>
        </Box>
    );
};

export default MakeNew;
