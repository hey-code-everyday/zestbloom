import React from 'react';
import { Box, Typography } from '@material-ui/core';
import LoadMoreBtn from '../../../components/shared/LoadMoreBtn';
import { Link } from 'react-router-dom';

const ActivityAll = () => {
    return (
        <>
            <Box className="activity">
                <Typography variant="h4" style={{ marginBottom: 24 }}>
                    Activity
                </Typography>
                {/*Activity Example List*/}
                <Box component="ul" className="activity-list">
                    <Box
                        component="li"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box display="flex" alignItems="center" flexWrap="wrap">
                            <Box className="image">
                                <img src="https://via.placeholder.com/150" alt="" />
                            </Box>
                            <Box component="p">you upvoted artwork</Box>
                            <Box
                                fontWeight="bold"
                                fontFamily="h1.fontFamily"
                                className="link primary"
                                component={Link}
                                to="/"
                            >
                                The Yellow Ranger - Power Ranger Series
                            </Box>
                        </Box>
                        <Box className="time">1 min ago</Box>
                    </Box>
                    <Box
                        component="li"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box display="flex" alignItems="center" flexWrap="wrap">
                            <Box className="image">
                                <img src="https://via.placeholder.com/150" alt="" />
                            </Box>
                            <Box component="p">you upvoted artwork</Box>
                        </Box>
                        <Box className="time">17 Apr 2021</Box>
                    </Box>
                    <Box
                        component="li"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box display="flex" alignItems="center" flexWrap="wrap">
                            <Box className="image">
                                <img src="https://via.placeholder.com/150" alt="" />
                            </Box>
                            <Box
                                fontWeight="bold"
                                fontFamily="h1.fontFamily"
                                className="link primary"
                                component={Link}
                                to="/"
                            >
                                @djones
                            </Box>
                            <Box component="p">started following you</Box>
                            <Box className="image">
                                <img src="https://via.placeholder.com/150" alt="" />
                            </Box>
                            <Box
                                fontWeight="bold"
                                fontFamily="h1.fontFamily"
                                className="link primary"
                                component={Link}
                                to="/"
                            >
                                @violet
                            </Box>
                        </Box>
                        <Box className="time">10 May 2020</Box>
                    </Box>
                    <Box
                        component="li"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box display="flex" alignItems="center" flexWrap="wrap">
                            <Box className="image">
                                <img src="https://via.placeholder.com/150" alt="" />
                            </Box>
                            <Box component="p">you upvoted artwork</Box>
                            <Box
                                fontWeight="bold"
                                fontFamily="h1.fontFamily"
                                className="link primary"
                                component={Link}
                                to="/"
                            >
                                The Yellow Ranger - Power Ranger Series
                            </Box>
                        </Box>
                        <Box className="time">1 min ago</Box>
                    </Box>
                    <Box
                        component="li"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box display="flex" alignItems="center" flexWrap="wrap">
                            <Box className="image">
                                <img src="https://via.placeholder.com/150" alt="" />
                            </Box>
                            <Box component="p">you upvoted artwork</Box>
                        </Box>
                        <Box className="time">17 Apr 2021</Box>
                    </Box>
                    <Box
                        component="li"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box display="flex" alignItems="center" flexWrap="wrap">
                            <Box className="image">
                                <img src="https://via.placeholder.com/150" alt="" />
                            </Box>
                            <Box
                                fontWeight="bold"
                                fontFamily="h1.fontFamily"
                                className="link primary"
                                component={Link}
                                to="/"
                            >
                                @djones
                            </Box>
                            <Box component="p">started following you</Box>
                            <Box className="image">
                                <img src="https://via.placeholder.com/150" alt="" />
                            </Box>
                            <Box
                                fontWeight="bold"
                                fontFamily="h1.fontFamily"
                                className="link primary"
                                component={Link}
                                to="/"
                            >
                                @violet
                            </Box>
                        </Box>
                        <Box className="time">10 May 2020</Box>
                    </Box>
                </Box>
                <LoadMoreBtn />
            </Box>
        </>
    );
};

export default ActivityAll;
