import React from 'react';
import { Radio, FormControlLabel, Box, Link } from '@material-ui/core';
import { algorandBaseUrl } from 'transactions/algorand/index';
import PropTypes from 'prop-types';

const Wallet = ({ wallet }) => {
    const label = (
        <Box className="wallet">
            <Box className="wallet-name">{wallet.name}</Box>
            <Box className="wallet-address">
                <Link
                    href={`${algorandBaseUrl}/address/${wallet?.address}`}
                    color="primary"
                    target="_blank"
                >
                    ({wallet?.address})
                </Link>
            </Box>
        </Box>
    );
    return (
        <FormControlLabel
            className="radio-label"
            value={wallet.address}
            control={<Radio className="radio-button" />}
            label={label}
            key={wallet.address}
        />
    );
};

Wallet.propTypes = {
    wallet: PropTypes.object,
};

export default Wallet;
