import React from 'react';
import { Button } from '@material-ui/core';
import { stopEvent } from 'helpers/functions';

const BuyNow = () => {
    const buyNow = (e) => {
        stopEvent(e);
    };
    return (
        <Button variant="contained" color="primary" className="asset-card-button" onClick={buyNow}>
            Buy Now
        </Button>
    );
};

export default BuyNow;
