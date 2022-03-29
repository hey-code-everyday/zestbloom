import React, { useState } from 'react';
import { Button, Box, Avatar } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import LottieContainer from 'components/shared/LottieContainer';
import { Link } from 'react-router-dom';
import { algorandBaseUrl } from 'transactions/algorand/index';
import { cancelOldContract } from 'transactions/smart-contract/escrow/saleByEscrow/cancelOldContract';
import { deleteEscrowContract } from 'redux/algorand/actions';
import { deleteContract } from 'redux/singleAsset/actions';
import { setNotification } from 'redux/profile/actions';
import { NOTIFICATIONS } from 'configs';
import { withWalletFallback } from 'hoc/withWalletFallback';
import PropTypes from 'prop-types';

const ContractSaleByEscrow = ({ contract, currentAssetGuid, walletFallback }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { selectedWallet } = useSelector((state) => state.profile);

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

    const showResponseOfCanceling = (status, message) => {
        switch (status) {
            case 'none':
                return giveNotification(NOTIFICATIONS.info.dontHaveContract);
            case 'revoke': {
                return giveNotification(NOTIFICATIONS.success.terminatedContract);
            }
            case 'error':
                return giveNotification({ status: 'error', message });
            default:
                return giveNotification(NOTIFICATIONS.error.wentWrong);
        }
    };

    const trowError = () => {
        showResponseOfCanceling(
            NOTIFICATIONS.error.wentWrong.status,
            NOTIFICATIONS.error.wentWrong.message,
        );
    };

    const endListing = async () => {
        try {
            if (!selectedWallet) {
                return giveNotification(NOTIFICATIONS.info.connectWallet);
            }
            if (!contract) {
                return giveNotification(NOTIFICATIONS.info.dontHaveContract);
            }
            const holder =
                contract?.teal_context?.new_seller || contract?.teal_context?.asset_creator;
            if (selectedWallet.address !== holder) {
                return giveNotification({
                    ...NOTIFICATIONS.warning.walletdoesntMatch,
                    message:
                        NOTIFICATIONS.warning.walletdoesntMatch.message +
                        ' : ' +
                        holder.slice(0, 6) +
                        '...',
                });
            }
            setLoading(true);
            const cancelResult = await cancelOldContract(
                contract,
                contract.teal_context.asset_id,
                selectedWallet,
                walletFallback,
            );

            // send end contract to backend, and hide this buttons
            if (cancelResult?.status !== 'revoke')
                return showResponseOfCanceling(cancelResult?.status, cancelResult?.message);

            dispatch(deleteEscrowContract(contract?.guid, cancelResult?.blob))
                .then((response) => {
                    setLoading(false);
                    if (response?.status === 204) {
                        dispatch(deleteContract(currentAssetGuid));
                        return showResponseOfCanceling(cancelResult?.status);
                    }
                    trowError();
                })
                .catch((err) => {
                    setLoading(false);
                    trowError();
                });
        } catch (err) {
            setLoading(false);
            trowError();
            console.log(err);
        }
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
                        onClick={endListing}
                    >
                        End Listing
                    </Button>
                )}
            </Box>
        </Box>
    );
};
ContractSaleByEscrow.propTypes = {
    contract: PropTypes.object,
    currentAssetGuid: PropTypes.string,
    walletFallback: PropTypes.string,
};

export default withWalletFallback(ContractSaleByEscrow);
