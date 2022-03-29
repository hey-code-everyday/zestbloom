import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { Box, Container } from '@material-ui/core';

import { AboutAnchorContext } from 'components/elements/MainRoute';
import Logo from 'assets/img/zb-new/logo-ZB.svg';
import AssetTypeVR from 'assets/img/zb-new/type-vr.svg';
import AssetTypeAudioBooks from 'assets/img/zb-new/type-audio-book.svg';
import AssetTypeArt from 'assets/img/zb-new/type-art.svg';
import AssetTypeFilm from 'assets/img/zb-new/type-film.svg';
import AssetTypeMusic from 'assets/img/zb-new/type-music.svg';
import AssetTypeLiterature from 'assets/img/zb-new/type-literature.svg';

const assetTags = [
    {
        icon: AssetTypeVR,
        link: 'virtual-reality',
        color: 'green',
        top: '45%',
        right: '10px',
        size: '45px',
    },
    {
        icon: AssetTypeAudioBooks,
        link: 'audio',
        color: 'yellow',
        top: '25%',
        right: '75%',
        size: '65px',
    },
    {
        icon: AssetTypeArt,
        link: 'graphic',
        color: 'blue',
        top: '72%',
        right: '30%',
        size: '60px',
    },
    {
        icon: AssetTypeFilm,
        link: 'video',
        color: 'red',
        top: '70%',
        right: '70%',
        size: '45px',
    },
    {
        icon: AssetTypeMusic,
        link: 'audio',
        color: 'orange',
        top: '5%',
        right: '60%',
        size: '35px',
    },
    {
        icon: AssetTypeLiterature,
        link: 'literature',
        color: 'gray',
        top: '20%',
        right: '15%',
        size: '65px',
    },
];

const AssetTagBtn = ({ src, link, color, size, top, right }) => {
    return (
        <Link to={`/marketplace?assetTags=${link}`}>
            <img
                src={src}
                alt={link}
                className={`absolute bg-${color} rounded p-1 about-btn-img`}
                style={{
                    top,
                    right,
                }}
                width={size}
                height={size}
            />
        </Link>
    );
};

const About = () => {
    const anchorRef = useContext(AboutAnchorContext);

    return (
        <div className="home-about relative desktop-only" ref={anchorRef}>
            <div className="home-about-bg"></div>
            <div className="home-about-bg"></div>
            <Container maxWidth="xl" className="text-center">
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mt={8}
                    className="home-about-grid"
                >
                    <Box display="flex" justifyContent="center" mb={1} px={3}>
                        <Box className="about-btn-container">
                            <img src={Logo} alt="zestbloom" className="about-logo" />
                            {assetTags.map((tag, index) => (
                                <AssetTagBtn
                                    key={tag.link + index}
                                    src={tag.icon}
                                    link={tag.link}
                                    color={tag.color}
                                    top={tag.top}
                                    right={tag.right}
                                    size={tag.size}
                                />
                            ))}
                        </Box>
                    </Box>
                    <Box px={3}>
                        <Box
                            fontWeight="bolder"
                            fontSize="3rem"
                            textAlign="left"
                            mb={6}
                            lineHeight="3rem"
                            className="font-primary"
                        >
                            What is Zestbloom?
                        </Box>
                        <Box className="about-text font-primary">
                            ZestBloom is a next generation Digital Media marketplace seeking to
                            offer a brand new way of experiencing Crypto Art while simultaneously
                            supporting and promoting artists for their contributions. We are built
                            on the Algorand, one of the fastest and most efficient blockchains to
                            date allowing us to facilitate purchases and track ownership of assets,
                            with significantly reduced fees and a smaller carbon footprint.
                        </Box>
                    </Box>
                </Box>
            </Container>
        </div>
    );
};

export default About;
