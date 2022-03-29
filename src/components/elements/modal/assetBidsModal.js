import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, List } from '@material-ui/core';
import { Bids } from 'components/elements/modal/bids';
import { useUnsavedChangesWarning } from 'hooks';
import PropTypes from 'prop-types';

const AssetBidsModal = ({
    open,
    onClose,
    selectedItem,
    closeMyBidAuctionLoading,
    closeOutbyBids,
}) => {
    const [acceptOne, setAcceptOne] = useState(false);
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();

    const offersAndBids = useMemo(() => {
        const offers = selectedItem?.offers;
        const bids = selectedItem?.bids;
        return [...offers, ...bids];
    }, [selectedItem]);

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
                        {offersAndBids.map((offer, index) => (
                            <Bids
                                nodeGuid={offer?.guid}
                                key={offer.guid}
                                contract={offer}
                                acceptOne={acceptOne}
                                setAcceptOne={setAcceptOne}
                                setDirty={setDirty}
                                setPristine={setPristine}
                                inTableMode
                                number={index}
                                closeOutbyBids={closeOutbyBids}
                                selectedItem={selectedItem}
                                closeMyBidAuctionLoading={closeMyBidAuctionLoading}
                            />
                        ))}
                    </List>
                </DialogContent>

                {/* <DialogActions className="actions">
                    <Button
                        variant="outlined"
                        color="secondary"
                        className="reject-btn"
                        // onClick={declineAll}
                    >
                        Decline All
                    </Button>
                </DialogActions> */}
            </Dialog>
            {Prompt}
        </>
    );
};

AssetBidsModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    selectedItem: PropTypes.object,
    closeMyBidAuctionLoading: PropTypes.object,
    closeOutbyBids: PropTypes.func,
};

export default AssetBidsModal;
