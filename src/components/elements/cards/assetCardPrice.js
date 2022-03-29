import React from 'react';
import { Box, Grid } from '@material-ui/core';
import AlgoFont from '../../../assets/img/algo-font.svg';
import { getOfferAmount, getSaleAmount } from 'helpers/functions';
import PropTypes from 'prop-types';

const AssetCardPrice = ({
    item = {},
    isOffer = false,
    isListing = false,
    isAuction = false,
    isBid = false,
}) => {
    const { offers = [] } = item;
    const showPrice = isOffer || isListing || isAuction || isBid;

    let price = 0;

    if (isOffer || isBid) {
        price = getOfferAmount(offers?.[0]);
    } else if (isListing) {
        price = getSaleAmount(item?.sale);
    } else if (isAuction) {
        price = item?.auction?.last_bid?.bid_amount;
    }

    if (!showPrice) {
        return null;
    }

    return (
        <Grid item>
            {isOffer && offers.length > 1 ? (
                <Box fontSize={20} fontWeight="bold" className="price-algo">
                    {offers.length}&nbsp;New
                </Box>
            ) : (
                price && (
                    <Box fontSize={20} fontWeight="bold" className="price-algo">
                        <img src={AlgoFont} alt="Algo" />
                        <span style={{ marginLeft: '5px' }}>{price}</span>
                    </Box>
                )
            )}
        </Grid>
    );
};

AssetCardPrice.propTypes = {
    item: PropTypes.object,
    isOffer: PropTypes.bool,
    isListing: PropTypes.bool,
    isAuction: PropTypes.bool,
    isBid: PropTypes.bool,
};

export default AssetCardPrice;
