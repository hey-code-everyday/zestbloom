import React from 'react';
import { Box, Dialog } from '@material-ui/core';
import ContractOfferByEscrow from './draftedOfferByEscrowContracts';
import ContractSaleByEscrow from './draftedSaleByEscrowContracts';
import PropTypes from 'prop-types';

const DraftedContractsModal = ({
    openModal,
    onCloseModal,
    draftedContracts,
    type,
    currentAssetGuid,
}) => {
    const Contract = type === 'sale' ? ContractSaleByEscrow : ContractOfferByEscrow;
    return (
        <>
            <Dialog open={openModal} onClose={onCloseModal} scroll="body">
                <Box className="modal-body">
                    <Box style={{ padding: '20px' }}>
                        <Box component="ul" className="user-notifications-list">
                            {draftedContracts.map((contract) => (
                                <Contract
                                    contract={contract}
                                    key={contract?.guid}
                                    currentAssetGuid={currentAssetGuid}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Dialog>
        </>
    );
};

DraftedContractsModal.propTypes = {
    openModal: PropTypes.bool,
    onCloseModal: PropTypes.func,
    draftedContracts: PropTypes.array,
    type: PropTypes.string,
    currentAssetGuid: PropTypes.string,
};

export default DraftedContractsModal;
