import React from 'react';
import { Box, Typography, Button } from '@material-ui/core';
import AlgoFont from 'assets/img/algo-font.svg';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

const Notification = ({ activity, openActivityMenu, onOpenBidModal }) => {
    return (
        <Box className={`auctions-activity ${activity ? 'open' : ''}`}>
            <Typography variant="h6" className="auctions-activity-title">
                My Auctions Activity
            </Typography>
            {/*My Auctions Activity List (Examples) all cases*/}
            <Box component="ul" className="auctions-activity-list">
                <Box component="li">
                    <Box className="image">
                        <img src="https://via.placeholder.com/150" alt="" />
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
                </Box>
                <Box component="li">
                    <Box className="image">
                        <img src="https://via.placeholder.com/150" alt="" />
                    </Box>
                    <Box className="info">
                        <Box className="title">1 hour to finish the auction.</Box>
                        <Button
                            variant="contained"
                            color="primary"
                            className="bid-btn"
                            onClick={onOpenBidModal}
                        >
                            Place a Bid
                        </Button>
                        <Box className="time">2 haur ago</Box>
                    </Box>
                </Box>
                <Box component="li">
                    <Box className="image">
                        <img src="https://via.placeholder.com/150" alt="" />
                    </Box>
                    <Box className="info">
                        <Box className="title">
                            <Box
                                fontWeight="bold"
                                fontFamily="h1.fontFamily"
                                className="link primary"
                                // component={Link}
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
                            <img src="https://via.placeholder.com/150" alt="" />
                        </Box>
                        <Box className="time">1 day ago</Box>
                    </Box>
                </Box>
                <Box component="li">
                    <Box className="image">
                        <img src="https://via.placeholder.com/150" alt="" />
                    </Box>
                    <Box className="info">
                        <Box className="title">
                            Your creation was put to auction by
                            <Box
                                fontWeight="bold"
                                fontFamily="h1.fontFamily"
                                className="link primary"
                                // component={Link}
                                to="/"
                            >
                                @Roxanne
                            </Box>
                        </Box>
                        <Box className="time">2 days ago</Box>
                    </Box>
                </Box>
                <Box component="li">
                    <Box className="image">
                        <img src="https://via.placeholder.com/150" alt="" />
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
                        <Box className="time">2 haur ago</Box>
                    </Box>
                </Box>
                <Box component="li">
                    <Box className="image">
                        <img src="https://via.placeholder.com/150" alt="" />
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
                        <Box className="time">2 haur ago</Box>
                    </Box>
                </Box>
                <Box component="li">
                    <Box className="image">
                        <img src="https://via.placeholder.com/150" alt="" />
                    </Box>
                    <Box className="info">
                        <Box className="title">1 hour to finish the auction.</Box>
                        <Button
                            variant="contained"
                            color="primary"
                            className="bid-btn"
                            onClick={onOpenBidModal}
                        >
                            Place a Bid
                        </Button>
                        <Box className="time">2 haur ago</Box>
                    </Box>
                </Box>
                <Box component="li">
                    <Box className="image">
                        <img src="https://via.placeholder.com/150" alt="" />
                    </Box>
                    <Box className="info">
                        <Box className="title">
                            Your creation was put to auction by
                            <Box
                                fontWeight="bold"
                                fontFamily="h1.fontFamily"
                                className="link primary"
                                // component={Link}
                                to="/"
                            >
                                @Roxanne
                            </Box>
                        </Box>
                        <Box className="time">2 days ago</Box>
                    </Box>
                </Box>
                <Box component="li">
                    <Box className="image">
                        <img src="https://via.placeholder.com/150" alt="" />
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
                        <Box className="time">2 haur ago</Box>
                    </Box>
                </Box>
            </Box>
            <Button
                className="auctions-activity-navigate"
                variant="contained"
                color="primary"
                onClick={openActivityMenu}
            >
                {activity ? (
                    <ChevronLeftIcon style={{ color: '#fff' }} />
                ) : (
                    <ChevronRightIcon style={{ color: '#fff' }} />
                )}
            </Button>
        </Box>
    );
};

export default Notification;
