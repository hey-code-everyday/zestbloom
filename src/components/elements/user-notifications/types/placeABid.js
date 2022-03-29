import React from 'react';
import { Box, CardMedia, Button } from '@material-ui/core';

const PlaceABid = () => {
    return (
        <Box component="li" className="unread">
            <Box className="image">
                <CardMedia image="https://via.placeholder.com/150" style={{ borderRadius: 10 }} />
            </Box>
            <Box className="info">
                <Box className="title">1 hour to finish the auction.</Box>
                <Button variant="contained" color="primary" className="bid-btn">
                    Place a Bid
                </Button>
                <Box className="time">2 haur ago</Box>
            </Box>
        </Box>
    );
};

export default PlaceABid;
