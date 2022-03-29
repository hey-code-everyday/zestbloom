import React from 'react';
import { Button, Box, Typography, CardMedia, Dialog } from '@material-ui/core';
import PeopleMinCard from '../../elements/cards/peopleMinCard';
import { Tag } from '../../shared';
import ShowMoreText from '../../shared/ShowMoreText';
import PreviewTabs from '../../../pages/upload-asset/PreviewTabs';
import { StarOutline, ThumbUpOutlined } from '@material-ui/icons';
// import SlickSlider from '../../../pages/upload-asset/Slider';
import AlgoFont from '../../../assets/img/algo-font.svg';
import PropTypes from 'prop-types';

const PublishAssetModal = ({ open, handleClose }) => {
    return (
        <Dialog
            open={open}
            className="publish-asset-modal"
            onClose={handleClose}
            scroll="body"
            maxWidth="lg"
        >
            <Box className="modal-content">
                <Box className="modal-head">
                    <button className="cancel-btn">Cancel Auction</button>
                    <Box>
                        <button className="continue-editing-btn">Continue Editing</button>
                        <Button variant="contained" color="primary" className="publish-btn">
                            Publish
                        </Button>
                    </Box>
                </Box>
                <Box className="modal-body">
                    <Box className="left">
                        {/*Only one image case*/}
                        <Box className="image">
                            <Tag text="img" className="secondary sm top-left rotated" />
                            <CardMedia
                                image="https://via.placeholder.com/600"
                                style={{ height: 490 }}
                                fullWidth
                            />
                        </Box>
                        {/*More then one image, Slider*/}
                        {/*<SlickSlider />*/}

                        <Box display="flex" justifyContent="flex-end" mt={6}>
                            <button className="report-btn hover-opacity">
                                <i className="icon-exclamation-triangle" />
                                Report
                            </button>
                        </Box>
                    </Box>
                    <Box className="right">
                        <Box className="right-top">
                            <Typography variant="h4">Title of Artwork</Typography>
                            <Box display="flex" alignItems="center" mb={2.5} className="like-fav">
                                <Box fontSize={16} display="flex" alignItems="center" mr={4}>
                                    <ThumbUpOutlined
                                        style={{ fontSize: 18 }}
                                        className="pointer hover-opacity"
                                    />
                                    <Box component="span" ml={1}>
                                        0
                                    </Box>
                                </Box>
                                <Box fontSize={16} display="flex" alignItems="center">
                                    <StarOutline
                                        style={{ fontSize: 20 }}
                                        className="pointer hover-opacity"
                                    />
                                    <Box component="span" ml={1}>
                                        0
                                    </Box>
                                </Box>
                            </Box>
                            <Box className="creator">
                                <Typography variant="h6">Creator</Typography>
                                <PeopleMinCard
                                    tag="illustrator"
                                    author="@Peach Plum"
                                    authorAvatar="https://via.placeholder.com/150"
                                />
                            </Box>
                        </Box>
                        <Box className="right-center">
                            <Tag text="05d   23h  43m  left" className="brand-gold md" />
                            <Box display="flex" alignItems="center">
                                <p>Starting bid</p>
                                <Box fontSize={20} fontWeight="bold" className="price-algo">
                                    <span className="start-bid">120.99</span>
                                    <img src={AlgoFont} alt="Algo" />
                                </Box>
                            </Box>
                        </Box>
                        <Box className="right-bottom">
                            <ShowMoreText
                                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam nim ad minim Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam nim ad minim."
                                max={150}
                            />
                            <PreviewTabs />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};

PublishAssetModal.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
};

export default PublishAssetModal;
