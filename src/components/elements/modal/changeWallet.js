import React, { useRef } from 'react';
import { Box, Dialog, Typography, RadioGroup, FormControl, Button } from '@material-ui/core';
import algoLogo from '../../../assets/img/algorand-logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import Wallet from 'components/shared/wallet';
import { selectWallet, dissconnectAllWallets } from 'redux/profile/actions';
import { ANONYMOUS } from 'configs';
import { useHistory } from 'react-router';
import { logout } from 'redux/auth/actions';
import PropTypes from 'prop-types';

const ChangeWallet = ({ changeWallet, onCloseChangeWallet }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    // TODO rename, purge myalgo
    const { selectedWallet, myAlgoAccounts } = useSelector((state) => state.profile);
    const { user } = useSelector((state) => state.auth);
    const defaultValue = useRef(selectedWallet?.address);

    const handleChange = (e) => {
        dispatch(selectWallet(e.target.value));
    };

    const handleLogout = () => {
        const refreshToken = localStorage.getItem('refresh');
        dispatch(logout(refreshToken)).then((response) => {
            history.push('/');
        });
    };

    const disconnect = () => {
        localStorage.removeItem('wallets');
        localStorage.removeItem('walletconnect');
        dispatch(dissconnectAllWallets());
        onCloseChangeWallet();
        if (user?.role === ANONYMOUS) {
            handleLogout();
        }
    };
    return (
        <>
            <Dialog
                open={changeWallet}
                onClose={onCloseChangeWallet}
                scroll="body"
                maxWidth="xs"
                className="change-wallet-modal"
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    className="change-wallet-modal-head"
                >
                    <Typography className="title">Select Wallet</Typography>
                    <img src={algoLogo} alt="Algorand" />
                </Box>
                <Box className="change-wallet-modal-body">
                    <FormControl component="fieldset" className="w-100">
                        <RadioGroup
                            aria-label="gender"
                            name="radio-buttons-group"
                            onChange={handleChange}
                            defaultValue={defaultValue.current}
                            value={selectedWallet?.address}
                        >
                            {myAlgoAccounts?.map((wallet) => (
                                <Wallet wallet={wallet} key={wallet.address} />
                            ))}
                        </RadioGroup>
                        <Box className="disconnect">
                            <Button onClick={disconnect}>Disconnect</Button>
                        </Box>
                    </FormControl>
                </Box>
            </Dialog>
        </>
    );
};

ChangeWallet.propTypes = {
    changeWallet: PropTypes.bool,
    onCloseChangeWallet: PropTypes.func,
};

export default ChangeWallet;
