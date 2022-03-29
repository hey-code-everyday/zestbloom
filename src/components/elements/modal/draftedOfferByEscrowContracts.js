import React, { useState } from 'react';
import { Button, Box, Avatar } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import LottieContainer from 'components/shared/LottieContainer';
import { Link } from 'react-router-dom';
import { closeContract } from 'transactions/smart-contract/escrow/offerByEscrow/closeContract';
import { deleteOfferByEscrowContract } from 'redux/algorand/actions';
import { deleteOfferFromAsset } from 'redux/singleAsset/actions';
import { algorandBaseUrl } from 'transactions/algorand/index';
import { setNotification } from 'redux/profile/actions';
import { NOTIFICATIONS } from 'configs';
import PropTypes from 'prop-types';

const ContractOfferByEscrow = ({ contract }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const giveNotification = (message) => {
        dispatch(setNotification(message));
    };

    const openEscrow = async () => {
        try {
            const a = document.createElement('a');
            a.href = `${algorandBaseUrl}/address/${contract?.compiled_teal_address}`;
            a.target = '_blank';
            a.click();
        } catch (err) {
            console.log(err);
            giveNotification({ status: 'info', message: err.message });
        }
    };

    const deleteContract = async (guid) => {
        return await dispatch(deleteOfferByEscrowContract(guid)).then((res) => {
            setLoading(false);
            dispatch(deleteOfferFromAsset(guid));
        });
    };
    const showResponseOfCanceling = (status, message) => {
        switch (status) {
            case 'none':
                return giveNotification(NOTIFICATIONS.info.connectWallet);
            case 'revoke': {
                return giveNotification(NOTIFICATIONS.success.terminatedContract);
            }
            case 'error':
                return giveNotification({ status: 'error', message });
            default:
                return giveNotification(NOTIFICATIONS.error.wentWrong);
        }
    };

    const cancelOffer = async () => {
        setLoading(true);
        const response = await closeContract(contract, deleteContract);

        showResponseOfCanceling(response?.status, response?.message);
    };

    return (
        <Box component="li">
            <Box className="image">
                <Avatar
                    alt={contract?.maker?.username}
                    src={!!contract?.maker?.avatar ? contract?.maker?.avatar : './'}
                    style={{ display: 'flex' }}
                />
            </Box>
            <Box className="info">
                <Box className="title">
                    <Box
                        fontWeight="bold"
                        fontFamily="h1.fontFamily"
                        className="link primary"
                        component={Link}
                        to="/"
                    >
                        Contract Address
                    </Box>{' '}
                    {contract?.compiled_teal_address}
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    className="bid-btn"
                    onClick={openEscrow}
                >
                    View Contract
                </Button>

                {loading ? (
                    <LottieContainer
                        containerStyles={{
                            height: '42px',
                            width: '116px',
                            marginLeft: '20px',
                            paddingTop: '12px',
                            display: 'inline-block',
                        }}
                        lottieStyles={{ width: '42px' }}
                    />
                ) : (
                    <Button
                        variant="outlined"
                        className="bid-btn"
                        style={{ color: 'black', marginLeft: '20px' }}
                        onClick={cancelOffer}
                    >
                        Cancel Contract
                    </Button>
                )}
            </Box>
        </Box>
    );
};

ContractOfferByEscrow.propTypes = {
    contract: PropTypes.object,
};

export default ContractOfferByEscrow;
