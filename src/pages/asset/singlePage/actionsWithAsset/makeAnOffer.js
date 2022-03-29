import React, { useMemo, useState } from 'react';
import { Button, Box } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { checkIsHost, isHaveAsset } from 'helpers/checkQuantity';
import { setNonLoggedMyAlgoAccount, setMyAlgoAccount } from 'redux/profile/actions';
import { nonLoggedConnect, connectToMyAlgo } from 'transactions/algorand/connectWallet';
import MakeAnOfferModal from 'components/elements/modal/makeAnOfferModal';
const MakeAnOffer = ({
    currentAsset,
    hasOffer,
    isLoggedIn,
    showModal,
    oneNode,
    forBroadcast = false,
}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { assetId } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { user } = useSelector((state) => state.auth);
    const { selectedWallet } = useSelector((state) => state.profile);

    const { allNodes, base_node } = useMemo(() => {
        if (oneNode) return { allNodes: [oneNode], base_node: oneNode };

        return { allNodes: currentAsset?.nodes, base_node: currentAsset?.base_node };
    }, [oneNode, currentAsset]);

    const isHolder = useMemo(() => {
        const currentUserHaveAsset = allNodes?.find(
            (node) => user?.username && node?.owner?.username === user?.username,
        );
        return isHaveAsset(currentUserHaveAsset, currentUserHaveAsset, false);
    }, [allNodes, user]);

    const unknownUserIsHolder = useMemo(() => {
        const hasNodeAsset = allNodes?.find((node) => {
            const isHost = checkIsHost(node, currentAsset);

            const isOwner = !!isHost && node?.owner?.username !== 'unknown';
            return user ? isOwner && node?.owner?.username !== user?.username : isOwner;
        });

        return hasNodeAsset;
    }, [currentAsset, user, allNodes]);

    const bestSale = base_node?.sales?.find((contract) => contract.type === 'SaleByEscrow');
    const isMultipleAsset = currentAsset?.asset?.total > 1;

    const setWalletsToUser = async (getAccounts, loggedIn = true) => {
        return loggedIn
            ? dispatch(setMyAlgoAccount(getAccounts))
            : dispatch(setNonLoggedMyAlgoAccount(getAccounts));
    };

    const connectWallet = async () => {
        if (isLoggedIn) return connectToMyAlgo(setWalletsToUser);
        return nonLoggedConnect(setWalletsToUser);
    };
    const redirectToMakeAnOffer = async (event) => {
        if (!selectedWallet) {
            const isConnected = await connectWallet();
            if (!isConnected) return;
        }
        let search = '';

        if (isMultipleAsset) search = '?type=broadcast';

        history.push(`/asset/${assetId}/make-an-offer${search}`);
    };

    const displayModal = async (event) => {
        event.stopPropagation();
        if (!isLoggedIn) {
            const account = await nonLoggedConnect(setWalletsToUser);
            if (!account || account?.length === 0) return;
        }
        setIsModalOpen(true);
    };

    const onCloseOfferModal = async (event) => {
        event.stopPropagation();
        setIsModalOpen(false);
    };

    const checkBroadcast = forBroadcast && isMultipleAsset;
    const canOffer = () => !isHolder && (checkBroadcast || !bestSale) && unknownUserIsHolder;

    return canOffer() ? (
        <>
            <Box display="flex" alignItems="center" flexWrap="wrap">
                {/* <Box className="price-algo">
                    <Box component="span" className="bid-price">
                        {showedPrice}
                    </Box>
                    {<img src={AlgoFont} alt="Algo" />}
                </Box> */}
            </Box>
            {!showModal && isMultipleAsset ? (
                <Button
                    className="btn-offer"
                    variant="contained"
                    color="primary"
                    size="large"
                    id="broadcast"
                    onClick={redirectToMakeAnOffer}
                >
                    {hasOffer?.length !== 0 ? 'Change Offer' : 'Broadcast Offer'}
                </Button>
            ) : (
                <>
                    <Button
                        className="btn-offer"
                        variant="contained"
                        color="primary"
                        size="large"
                        id="offer"
                        onClick={showModal ? displayModal : redirectToMakeAnOffer}
                    >
                        {hasOffer?.length !== 0 ? 'Change Offer' : 'Make an Offer'}
                    </Button>
                    {isModalOpen && (
                        <MakeAnOfferModal
                            currentAsset={currentAsset}
                            isModalOpen={isModalOpen}
                            onCloseOfferModal={onCloseOfferModal}
                            base_node={base_node}
                        />
                    )}
                </>
            )}
        </>
    ) : null;
};

export default MakeAnOffer;
