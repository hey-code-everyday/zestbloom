import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Box, Container } from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';

import { setFilterByTagFromSide } from 'redux/marketplace/actions';
import AssetTypeVR from 'assets/img/zb-new/type-vr.svg';
import AssetTypeAudioBooks from 'assets/img/zb-new/type-audio-book.svg';
import AssetTypeArt from 'assets/img/zb-new/type-art.svg';
import AssetTypeFilm from 'assets/img/zb-new/type-film.svg';
import AssetTypeMusic from 'assets/img/zb-new/type-music.svg';
import AssetTypeLiterature from 'assets/img/zb-new/type-literature.svg';

const assetTags = [
    { text: 'Virtual Reality', icon: AssetTypeVR, link: 'virtual-reality', color: 'green' },
    { text: 'Audio books', icon: AssetTypeAudioBooks, link: 'audio', color: 'yellow' },
    { text: 'Art', icon: AssetTypeArt, link: 'graphic', color: 'blue' },
    { text: 'Film', icon: AssetTypeFilm, link: 'video', color: 'red' },
    { text: 'Music', icon: AssetTypeMusic, link: 'audio', color: 'orange' },
    { text: 'Literature', icon: AssetTypeLiterature, link: 'literature', color: 'gray' },
];

const Products = () => {
    // const { assetsStaticTags } = useSelector((state) => state.marketplace);
    const dispatch = useDispatch();

    const onSubmit = (slug) => {
        dispatch(setFilterByTagFromSide(slug));
    };

    return (
        <Container maxWidth="xl" className="home-products">
            <Box
                display="flex"
                position="relative"
                alignItems="center"
                justifyContent="center"
                flexWrap="wrap"
            >
                {assetTags?.map((item, index) => (
                    <Box
                        key={`${item.link}-${index}`}
                        className={`hover-shadow animation-down-top bg-shadow home-product bg-${item.color} rounded-1 z-index-top`}
                        onClick={() => onSubmit(item.slug)}
                        m={2}
                    >
                        <Link to={`/marketplace?assetTags=${item.link}`} style={{ width: '100%' }}>
                            <Box textAlign="right" px={1} pt={1} className="home-product-arrow">
                                <ChevronRight style={{ fontSize: 32, color: 'white' }} />
                            </Box>
                            <Box textAlign="center">
                                <Box
                                    className="img-wrapper"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <img src={item.icon} alt={item.text} />
                                </Box>
                                <Box
                                    fontSize={14}
                                    className="text-uppercase text-white product-title"
                                >
                                    {item.text}
                                </Box>
                            </Box>
                        </Link>
                    </Box>
                ))}
            </Box>
        </Container>
    );
};

export default Products;
