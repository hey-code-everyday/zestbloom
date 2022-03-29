import React, { useState, useEffect, useCallback } from 'react';
import { Box, Dialog } from '@material-ui/core';
import algoLogo from '../../../assets/img/algorand-logo.svg';
import algoFont from '../../../assets/img/algo-font.svg';
import { getAlgorandAccountInfo } from 'redux/algorand/actions';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

const WalletInfoModal = ({ open, close, info, address }) => {
    const dispatch = useDispatch();
    const [accountInfo, setAccountInfo] = useState(info);

    const getWalletInformation = useCallback(() => {
        dispatch(getAlgorandAccountInfo(address))
            .then((response) => {
                setAccountInfo(response?.account);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [address, dispatch]);

    useEffect(() => {
        if (address && !info) {
            getWalletInformation();
            const getAccountInfoId = setInterval(getWalletInformation, 10000);
            return () => {
                clearInterval(getAccountInfoId);
            };
        }
    }, [address, getWalletInformation, info]);

    return (
        <>
            <Dialog open={open} onClose={close} scroll="body" maxWidth="xs" className="mini-modal">
                <Box className="modal-body">
                    <Box display="flex" justifyContent="center" mb={3}>
                        <img src={algoLogo} alt="Algo Logo" />
                    </Box>

                    <Box className="wallet-modal">
                        <Box
                            className="wallet-modal-item"
                            display="flex"
                            justifyContent="space-between"
                        >
                            <Box className="wallet-modal-item-title">Wallet Address:</Box>
                            <Box className="wallet-modal-item-result wallet-address">
                                {accountInfo?.address}
                            </Box>
                        </Box>
                        <Box
                            className="wallet-modal-item"
                            display="flex"
                            justifyContent="space-between"
                        >
                            <Box className="wallet-modal-item-title">Balance:</Box>
                            <Box display="flex" className="wallet-modal-item-result">
                                {accountInfo?.amount ? Number(accountInfo?.amount) / 1000000 : ''}
                                <img
                                    src={algoFont}
                                    style={{ width: '10px', marginLeft: '2px' }}
                                    alt="Algo Logo"
                                />
                            </Box>
                        </Box>
                        <Box
                            className="wallet-modal-item"
                            display="flex"
                            justifyContent="space-between"
                        >
                            <Box className="wallet-modal-item-title">Minimum Balance:</Box>
                            <Box display="flex" className="wallet-modal-item-result">
                                {accountInfo ? Number(accountInfo['min-balance']) / 1000000 : ''}
                                <img
                                    src={algoFont}
                                    style={{ width: '10px', marginLeft: '2px' }}
                                    alt="Algo Logo"
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Dialog>
        </>
    );
};
WalletInfoModal.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    info: PropTypes.object,
    address: PropTypes.string,
};

export default WalletInfoModal;
