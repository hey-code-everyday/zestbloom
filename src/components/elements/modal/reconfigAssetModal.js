import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Box, Button, ButtonGroup, Dialog, Typography, Paper, TextField } from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import SimpleTable from '../../shared/Table';
import PropTypes from 'prop-types';

const ReconfigAssetModal = ({
    open,
    close,
    defaultFrozen,
    assetAttributes,
    setAttributes,
    assetManager,
    clawbackAddress,
    setClawbackAddress,
    freezeAddress,
    setFreezeAddress,
    onSave,
}) => {
    const [mode, setMode] = useState('');

    const openAddAtributes = () => {
        setMode('Attributes');
        if (!assetAttributes.length || assetAttributes[assetAttributes.length - 1]?.trait_type) {
            const emptyFields = { guid: uuid(), trait_type: '', value: '' };
            setAttributes([...assetAttributes, emptyFields]);
        }
    };

    const openAddNote = () => {
        setMode('Note');
    };

    const updateAttributes = (guid, value, key) => {
        const newValue = assetAttributes.map((attribute) =>
            attribute.guid === guid ? { ...attribute, [key]: value } : attribute,
        );
        setAttributes(newValue);
    };

    const deleteAttributes = (guid) => {
        const newValue = assetAttributes.filter((attribute) => attribute.guid !== guid);
        setAttributes(newValue);
    };

    const onClose = () => {
        setMode('');
        close();
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                scroll="body"
                maxWidth="md"
                className="mini-modal"
            >
                <Box className="modal-body reconfig-asset">
                    <Typography className="reconfig-asset-title">
                        Reconfigure Asset
                        {mode ? ` for ${mode}` : ''}
                    </Typography>
                    {mode !== 'Note' && (
                        <SimpleTable
                            defaultFrozen={defaultFrozen}
                            assetAttributes={assetAttributes}
                            assetManager={assetManager}
                            changeExistsAttributes={updateAttributes}
                            deleteAttributes={deleteAttributes}
                            clawbackAddress={clawbackAddress}
                            setClawbackAddress={setClawbackAddress}
                            freezeAddress={freezeAddress}
                            setFreezeAddress={setFreezeAddress}
                        />
                    )}

                    {mode === 'Note' && (
                        <Paper className="asset-note-container">
                            <Box>
                                <Typography variant="h5" align="left">
                                    Transaction Note (limit 1000 characters):
                                </Typography>
                            </Box>
                            <TextField
                                className="textarea-asset-note"
                                fullWidth
                                multiline
                                minRows={10}
                                maxRows={10}
                                variant="outlined"
                            />
                        </Paper>
                    )}

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                        {mode ? (
                            <Box textAlign="center" width="100%">
                                <ButtonGroup>
                                    <Button
                                        color={mode === 'Attributes' ? 'primary' : 'secondary'}
                                        variant={mode === 'Attributes' ? 'contained' : 'outlined'}
                                        onClick={openAddAtributes}
                                    >
                                        Attributes
                                    </Button>
                                    <Button
                                        color={mode === 'Note' ? 'primary' : 'secondary'}
                                        variant={mode === 'Note' ? 'contained' : 'outlined'}
                                        onClick={openAddNote}
                                    >
                                        Note
                                    </Button>
                                </ButtonGroup>
                            </Box>
                        ) : (
                            <>
                                <Box flex={1} textAlign="center">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="large"
                                        onClick={onSave}
                                    >
                                        Save
                                    </Button>
                                </Box>

                                <Box display="flex" flexDirection="column" alignItems="flex-start">
                                    <Button variant="text" onClick={openAddAtributes}>
                                        <AddCircleOutlineOutlinedIcon />
                                        Add Attributes
                                    </Button>
                                    <Button variant="text" onClick={openAddNote}>
                                        <AddCircleOutlineOutlinedIcon />
                                        Add Note
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </Dialog>
        </>
    );
};

ReconfigAssetModal.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    defaultFrozen: PropTypes.bool,
    assetAttributes: PropTypes.array,
    setAttributes: PropTypes.func,
    assetManager: PropTypes.string,
    clawbackAddress: PropTypes.string,
    setClawbackAddress: PropTypes.func,
    freezeAddress: PropTypes.string,
    setFreezeAddress: PropTypes.func,
    onSave: PropTypes.func,
};

export default ReconfigAssetModal;
