import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Typography, Box, Container, Button } from '@material-ui/core';

import { getBestVoted, setValueBestVoted } from 'redux/bestVotedAssets/actions';
import Slider from 'components/shared/slider';
import ConfirmModal from 'components/elements/modal/confirmModal';
import { PRIVATE_OWNER, REDIRECT_TO_ASSET } from 'configs';
import VotedCard from 'components/elements/cards/VotedCard';
import { stopEvent } from 'helpers/functions';

const BestVoted = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { bestVotedAssets } = useSelector((state) => state.bestVotedAssets);
    const { isLoggedIn } = useSelector((state) => state.auth);
    const [openNsfwModal, setOpenNsfwModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        dispatch(getBestVoted());
    }, [dispatch, isLoggedIn]);

    const redirectToMarketplace = () => {
        dispatch(setValueBestVoted(true));
    };

    if (bestVotedAssets?.length === 0) return null;

    const onCloseNsfwModal = () => {
        setOpenNsfwModal(false);
    };
    const redirectToAsset = () => {
        history.push(`/asset/${selectedId}`);
    };

    const clickOnCard = (e, is_nsfw, assetId) => {
        if (is_nsfw) {
            stopEvent(e);
            setSelectedId(assetId);
            setOpenNsfwModal(true);
        }
    };

    const withPrivateUsers = bestVotedAssets?.map((item) => ({
        ...item,
        creator: item?.creator ?? PRIVATE_OWNER,
    }));

    return (
        <div className="home-best-voted">
            <div className="home-best-voted-bg"></div>
            <Container>
                <Box className="title-wrapper" mb={4} textAlign="center">
                    <Box className="text-h2 text-uppercase">Voted best creators & Collections</Box>
                    <Typography className="mobile-only text-white" variant="h2">
                        Voted Top
                    </Typography>
                    <Box className="view-all">
                        <Link to="/marketplace" color="primary">
                            <Button onClick={redirectToMarketplace} className="view-all-btn">
                                View All
                            </Button>
                        </Link>
                    </Box>
                </Box>
                <Box className="list-with-link">
                    <Slider
                        options={{
                            centerMode: true,
                            slidesToShow: 5,
                            slidesToScroll: 3,
                            infinite: true,
                        }}
                        showDots
                    >
                        {withPrivateUsers?.map((item, index) => (
                            <VotedCard
                                key={`${item?.guid}-${index}`}
                                item={item}
                                clickOnCard={clickOnCard}
                            />
                        ))}
                    </Slider>
                </Box>
            </Container>
            <ConfirmModal
                open={openNsfwModal}
                onClose={onCloseNsfwModal}
                onConfirm={redirectToAsset}
                info={REDIRECT_TO_ASSET}
            />
        </div>
    );
};

export default BestVoted;
