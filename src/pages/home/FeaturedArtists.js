import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { Typography, Box, Container, Button } from '@material-ui/core';

import PeopleCard from 'components/elements/cards/peopleCardFollowers';
import Slider from 'components/shared/slider';
import { moveMarketplaceFromFeatured } from 'redux/marketplace/actions';

const FeaturedArtists = ({ className }) => {
    const dispatch = useDispatch();
    const { featuredArtist } = useSelector((state) => state.marketplace);

    const data = useMemo(() => {
        return (featuredArtist ?? [])
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    }, [featuredArtist]);

    const showAllPeoples = () => {
        dispatch(moveMarketplaceFromFeatured(true));
    };

    if (featuredArtist?.length === 0) return null;

    return (
        <div className="home-featured-artists">
            <div className="home-featured-artists-bg"></div>
            <Container className="home-featured-artists-container" style={{ padding: 0 }}>
                <Box mb={4} textAlign="center" className="desktop-only">
                    <Box className="text-h2 text-uppercase">Featured Artists</Box>
                    {className === 'home' && (
                        <Box className="view-all">
                            <Link to="/marketplace?type=people" color="primary">
                                <Button onClick={showAllPeoples} className="view-all-btn">
                                    View All
                                </Button>
                            </Link>
                        </Box>
                    )}
                </Box>

                <Box className="mobile-only">
                    <Box mb={2} display="flex" alignItems="flex-end" justifyContent="space-between">
                        <Typography variant="h2">Featured Artists</Typography>
                        {className === 'home' && (
                            <Box className="view-all">
                                <Link to="/marketplace?type=people" color="primary">
                                    <Button onClick={showAllPeoples} className="view-all-btn">
                                        View All
                                    </Button>
                                </Link>
                            </Box>
                        )}
                    </Box>
                </Box>

                <Box className="list-with-link centered-card-wrapper">
                    <Slider
                        options={{
                            centerMode: true,
                            slidesToScroll: 1,
                            infinite: true,
                        }}
                        applyOpacity
                        showDots
                    >
                        {data?.slice(0, 10).map((item, index) => (
                            <PeopleCard
                                key={item?.username + index}
                                tags={item?.selected_tags}
                                img={item?.banner}
                                author={item?.username}
                                firstName={item?.first_name}
                                lastName={item?.last_name}
                                authorAvatar={item?.avatar}
                                authorName={item?.authorName}
                                bio={item?.bio}
                            />
                        ))}
                    </Slider>
                </Box>
            </Container>
        </div>
    );
};

export default FeaturedArtists;
