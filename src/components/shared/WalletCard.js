import React, { useState } from 'react';
import { Box, Typography, Link } from '@material-ui/core';
import { setMyAlgoAccount } from 'redux/profile/actions';
import { useDispatch } from 'react-redux';
import { Logo } from '.';
import algorandLogo from 'assets/img/algorand-logo.svg';
import WalletInfoModal from '../elements/modal/miniWalletInfoModal';
import { useHistory } from 'react-router';
// import { useReach } from 'hooks/useReach';
import { connectToMyAlgo } from 'transactions/algorand/connectWallet';
import PropTypes from 'prop-types';

const WalletCard = ({ id, label, connected, address, infoFromMkOff, accounts }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [openModal, setOpenModal] = useState(false);

    // TODO use getWallet
    const onSubmit = async (e) => {
        try {
            e.stopPropagation();
            if (!connected) {
                connectToMyAlgo(
                    (getAccounts) => dispatch(setMyAlgoAccount(getAccounts)),
                    () => {},
                    accounts,
                );
            } else {
                dispatch(
                    setMyAlgoAccount(accounts.filter(({ address: addr }) => addr !== address)),
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const openInfo = async () => {
        if (connected) {
            setOpenModal(true);
        }
    };

    const onCloseModal = () => {
        setOpenModal(false);
    };
    return (
        <>
            <Box
                className="wallet-card"
                key={id}
                style={{ cursor: connected ? 'pointer' : 'default', marginTop: '10px' }}
                component="li"
                mx={0}
                onClick={openInfo}
            >
                {connected ? (
                    <img src={algorandLogo} alt="Algorand" style={{ margin: '21px auto' }} />
                ) : (
                    <Logo type="logoIconGray" width="53" />
                )}

                <Typography variant="body2" component="strong" className="name">
                    <div>{label}</div>
                    {address && (
                        <Typography style={{ marginTop: '10px' }}>
                            {address.slice(0, 4).concat('...').concat(address.slice(-4))}
                        </Typography>
                    )}
                </Typography>
                <Link
                    to={history.location.pathname}
                    color={connected ? 'error' : 'primary'}
                    onClick={onSubmit}
                >
                    {connected ? 'Disconnect' : 'Connect'}
                </Link>
            </Box>
            {openModal && (
                <WalletInfoModal
                    open={openModal}
                    close={onCloseModal}
                    info={infoFromMkOff}
                    address={address}
                />
            )}
        </>
    );
};

WalletCard.propTypes = {
    id: PropTypes.number,
    label: PropTypes.string,
    connected: PropTypes.bool,
    address: PropTypes.string,
    infoFromMkOff: PropTypes.object,
};

export default WalletCard;
