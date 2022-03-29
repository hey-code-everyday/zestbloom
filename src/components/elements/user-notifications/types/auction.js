import React from 'react';
import { Box, CardMedia } from '@material-ui/core';
import AlgoFont from 'assets/img/algo-font.svg';
import CardMenu from '../../cards/cardMenu';
import PropTypes from 'prop-types';

const AuctionNotification = ({ data }) => {
    return (
        <Box component="li" className="unread">
            <Box className="image">
                <CardMedia image={data?.sender?.avatar} style={{ borderRadius: '50%' }} />
            </Box>
            <Box className="info">
                <Box className="title">
                    Auction has ended. Price
                    <Box component="span" display="inline-block" ml={0.5}>
                        <Box fontSize={20} fontWeight="bold" className="price-algo">
                            <span>120.99</span>
                            <img src={AlgoFont} alt="Algo" />
                        </Box>
                    </Box>
                </Box>
                <Box className="time">50 min ago</Box>
            </Box>
            <Box className="user-notifications-actions">
                <CardMenu />
            </Box>
        </Box>
    );
};

AuctionNotification.propTypes = {
    data: PropTypes.object,
};

export default AuctionNotification;
