import React, { useMemo } from 'react';
import { Box } from '@material-ui/core';
import MakeAnOffer from './makeAnOffer';
import BuyNow from './buyNow';
import Auction from './auction';
import { getSaleAmount } from 'helpers/functions';

const PriceAndActions = ({
    currentAsset,
    giveNotification,
    hasOffer,
    isLoggedIn,
    isMultipleAsset,
}) => {
    const auction = currentAsset?.base_node?.auctions?.find((x) => x.status === 'STARTED');

    const bestSale = currentAsset?.base_node?.sales?.find(
        (contract) => contract.type === 'SaleByEscrow' && contract.status === 'ACTIVE',
    );
    const showedPrice = useMemo(() => {
        return getSaleAmount(bestSale);
    }, [bestSale]);

    if (Object.keys(currentAsset).length === 0) {
        return null;
    }

    return (
        <Box className="asset-right-center">
            <Box display="flex" justifyContent="space-between">
                <MakeAnOffer
                    currentAsset={currentAsset}
                    hasOffer={hasOffer}
                    isLoggedIn={isLoggedIn}
                    forBroadcast={true}
                />

                {!isMultipleAsset && auction && (
                    <Auction
                        auction={auction}
                        node={currentAsset?.base_node}
                        currentAsset={currentAsset}
                    />
                )}
                {!isMultipleAsset && !auction && (
                    <BuyNow
                        currentAsset={currentAsset}
                        giveNotification={giveNotification}
                        // setReloadAsset={setReloadAsset}
                        bestSale={bestSale}
                        showedPrice={showedPrice}
                        auction={auction}
                    />
                )}

                {/* <OfferedItems currentAsset={currentAsset} /> */}

                {/*Place a Bid Button*/}
                {/* {!createdByMe() && currentAsset?.auction && (
                    <Button variant="contained" color="primary" size="large">
                        Place a Bid
                    </Button>
                )} */}
            </Box>
        </Box>
    );
};

export default PriceAndActions;
