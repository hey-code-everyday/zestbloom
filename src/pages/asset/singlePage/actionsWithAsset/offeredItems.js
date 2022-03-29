import React, { useState, useMemo } from 'react';
import { Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import MakeAnOfferModal from 'components/elements/modal/offers';
import { isHaveAsset, checkIsHost } from 'helpers/checkQuantity';

const OfferedItems = ({ currentAsset }) => {
    const { user } = useSelector((state) => state.auth);
    const [openModal, setOpenModal] = useState(false);

    const isHolder = useMemo(() => {
        const currentUserHaveAsset = currentAsset?.nodes?.find(
            (node) => user?.username && node?.owner?.username === user?.username,
        );
        const isHost = isHaveAsset(currentUserHaveAsset, currentAsset, false);

        return isHost && currentUserHaveAsset;
    }, [currentAsset, user]);

    const offeredNodes = useMemo(() => {
        const hasNodeAsset = currentAsset?.nodes?.filter((node) => {
            const isHost = checkIsHost(node, currentAsset);
            return node.owner?.username === user?.username && isHost && node.offers.length > 0;
        });
        return hasNodeAsset;
    }, [currentAsset, user]);

    const offersForMe = offeredNodes.reduce((acc, curr) => {
        acc.push(...curr.offers);
        return acc;
    }, []);

    if (currentAsset?.offers && currentAsset?.offers?.length !== 0) {
        offersForMe.push(...currentAsset?.offers);
    }

    if (offersForMe.length === 0) {
        return null;
    }

    if (!isHolder) return null;

    const onSubmit = () => {
        setOpenModal(true);
    };

    const onCloseModal = () => {
        setOpenModal(false);
    };
    return (
        <>
            {isHolder ? (
                <>
                    <Button variant="contained" color="primary" size="large" onClick={onSubmit}>
                        Offers
                    </Button>
                    <MakeAnOfferModal
                        openModal={openModal}
                        onCloseModal={onCloseModal}
                        offersForMe={offersForMe}
                        nodeGuid={isHolder.guid}
                    />
                </>
            ) : null}
        </>
    );
};

export default OfferedItems;
