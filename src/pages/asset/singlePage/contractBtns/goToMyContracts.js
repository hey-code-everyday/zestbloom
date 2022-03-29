import React, { useState } from 'react';
import { Box, Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DraftedContractsModal from 'components/elements/modal/draftedContracts';
import PropTypes from 'prop-types';

const GoToMyContracts = ({ currentAsset, currentAssetGuid }) => {
    const [openModal, setOpenModal] = useState(false);

    const { user, isLoggedIn } = useSelector((state) => state.auth);

    const onSubmit = () => {
        setOpenModal(true);
    };

    const onCloseModal = () => {
        setOpenModal(false);
    };

    const myNodes = currentAsset?.nodes?.filter(
        (node) => user?.username && node?.owner?.username === user?.username,
    );
    const salesAndAuctions = myNodes?.find(
        (node) => node.sales?.length !== 0 || node.auctions?.length !== 0,
    );

    const getGlobalOffers = currentAsset?.offers?.find(
        (offer) => user?.username && user?.username === offer?.maker?.username,
    );

    const offersInNode = currentAsset?.nodes?.filter((node) =>
        node?.offers?.find((offer) => user?.username && user?.username === offer?.maker?.username),
    );

    const allAuctions = currentAsset?.nodes
        ?.filter((node) => node?.auctions?.length !== 0)
        ?.flatMap((node) => node?.auctions);

    const bidedByMe = allAuctions?.find(
        (auction) => user?.username && auction?.last_bid?.maker?.username === user?.username,
    );

    const showBtn =
        isLoggedIn &&
        (salesAndAuctions || getGlobalOffers || bidedByMe || offersInNode?.length !== 0);

    const mySales = myNodes?.flatMap((nodes) => nodes?.sales);
    const draftedSales = mySales?.filter((contract) => contract.status === 'DRAFT');

    const currentOdders = currentAsset?.offers ?? [];
    const myOffers = [...offersInNode, ...currentOdders];
    const draftedOffers = myOffers?.filter((contract) => contract.status === 'DRAFT');

    const showDraftedBtn = draftedSales?.length
        ? draftedSales
        : draftedOffers?.length
        ? draftedOffers
        : null;
    return (
        showBtn && (
            <>
                <Box
                    display="flex"
                    justifyContent="center"
                    className={showDraftedBtn ? 'escrow-buttons' : ''}
                >
                    <Link
                        to={`/profile/${user?.username}/contracts`}
                        style={{ width: '50%', marginTop: '48px' }}
                    >
                        <Button
                            variant="outlined"
                            size="large"
                            style={{ width: '100%' }}
                            className="first-btn"
                        >
                            Go To My Contracts
                        </Button>
                    </Link>
                    {showDraftedBtn && (
                        <>
                            <Button
                                variant="outlined"
                                size="large"
                                style={{ width: '50%', marginTop: '48px' }}
                                onClick={onSubmit}
                                className="second-btn"
                            >
                                Drafted
                            </Button>
                            <DraftedContractsModal
                                draftedContracts={showDraftedBtn}
                                openModal={openModal}
                                currentAssetGuid={currentAssetGuid}
                                onCloseModal={onCloseModal}
                                type={draftedSales?.length ? 'sale' : 'offer'}
                            />
                        </>
                    )}
                </Box>
            </>
        )
    );
};

GoToMyContracts.propTypes = {
    currentAsset: PropTypes.object,
    currentAssetGuid: PropTypes.string,
};

export default GoToMyContracts;
