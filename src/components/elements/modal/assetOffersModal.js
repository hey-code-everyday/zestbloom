import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Dialog, DialogContent, DialogActions, List } from '@material-ui/core';
import { Offer } from 'components/elements/modal/offers';
import { useUnsavedChangesWarning } from 'hooks';
import { deleteOfferByEscrowContract } from 'redux/algorand/actions';
import { deleteOfferFromAsset } from 'redux/singleAsset/actions';
import { closeContract } from 'transactions/smart-contract/escrow/offerByEscrow/closeContract';
import PropTypes from 'prop-types';

const AssetOffersModal = ({ open, onClose, selectedItem }) => {
    const dispatch = useDispatch();
    const [acceptOne, setAcceptOne] = useState(false);
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();

    const deleteContract = async (guid) => {
        return await dispatch(deleteOfferByEscrowContract(guid)).then((res) => {
            dispatch(deleteOfferFromAsset(guid));
        });
    };
    const offers = selectedItem?.offers ?? [];

    const declineAll = async () => {
        offers.map((offer) => {
            return closeContract(offer, deleteContract);
        });
        onClose();
    };

    return (
        <>
            <Dialog
                className="asset-offers-modal"
                open={open}
                maxWidth="md"
                fullWidth
                onClose={onClose}
                scroll="body"
            >
                <DialogContent>
                    <List>
                        {offers.map((offer, index) => (
                            <Offer
                                nodeGuid={offer?.guid}
                                key={offer.guid}
                                contract={offer}
                                acceptOne={acceptOne}
                                setAcceptOne={setAcceptOne}
                                setDirty={setDirty}
                                setPristine={setPristine}
                                inTableMode
                                number={index}
                                selectedItem={selectedItem}
                            />
                        ))}
                    </List>
                </DialogContent>

                <DialogActions className="actions">
                    <Button
                        variant="outlined"
                        color="secondary"
                        className="reject-btn"
                        onClick={declineAll}
                    >
                        Decline All
                    </Button>
                </DialogActions>
            </Dialog>
            {Prompt}
        </>
    );
};

AssetOffersModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    selectedItem: PropTypes.object,
};

export default AssetOffersModal;
