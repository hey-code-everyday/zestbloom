import React from 'react';
import { Box, Grid } from '@material-ui/core';
import PostCard from '../../components/elements/cards/postCard';

/*Auction List*/
const AUCTION_LIST = [
    {
        id: 1,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 2,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 3,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 4,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 5,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 6,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 7,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 8,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 9,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 10,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 11,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 12,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 13,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 14,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 15,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 16,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 17,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 18,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 19,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 20,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 21,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 22,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 23,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
    {
        id: 24,
        img: 'https://via.placeholder.com/150',
        tag: 'img',
    },
];

const Step1 = () => {
    return (
        <Box className="first-step">
            <Grid container spacing={3} className="list-with-link">
                {/*Asset card with checkbox*/}
                {AUCTION_LIST.map((auction) => (
                    <Grid item xs={6} sm={4} md={3} lg={2}>
                        <PostCard key={auction.id} tag={auction.tag} img={auction.img} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Step1;
