import React from 'react';
import { Box } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

const Step2 = () => {
    return (
        <Box className="second-step">
            <Box className="second-step-fields" display="flex" flexWrap="wrap">
                <Box display="flex" flexDirection="column" justifyContent="space-between">
                    <div className="info">
                        <i className="icon-post-icon1" />
                        Will be on sale until you transfer this item or cancel it.
                    </div>
                    <div>
                        <label>Escrowed amount</label>
                        <TextField fullWidth variant="outlined" />
                    </div>
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="space-between">
                    <div className="info">
                        <i className="icon-post-icon2" />
                        Set a starting bid that will set the price for your item.
                    </div>
                    <div>
                        <label>Starting Price</label>
                        <TextField fullWidth variant="outlined" />
                    </div>
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="space-between">
                    <div className="info">
                        <i className="icon-post-icon3" />
                        Adding an ending price will allow this listing to expire, or for the price
                        to be reduced until a buyer is found.
                    </div>
                    <div>
                        <label>Ending Price</label>
                        <TextField fullWidth variant="outlined" />
                    </div>
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="space-between">
                    <div className="info">
                        <i className="icon-post-icon4" />
                        Reserve a price during Auction, if you don’t get a bid eqaul or more to your
                        reserve price, item doesn’t sell.
                    </div>
                    <div>
                        <label>Reserve Price</label>
                        <TextField fullWidth variant="outlined" />
                    </div>
                </Box>
            </Box>
        </Box>
    );
};

export default Step2;
