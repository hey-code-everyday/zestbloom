import React, { useCallback, useState, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDebounce } from 'react-use';

import {
    InputAdornment,
    Avatar,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Paper,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Search } from '@material-ui/icons';
import { getUsers } from 'redux/marketplace/actions';
import AuthService from 'redux/auth/services';
import PropTypes from 'prop-types';

const SimpleTable = ({
    defaultFrozen,
    assetAttributes,
    changeExistsAttributes,
    deleteAttributes,
    assetContributors,
    changeExistsContributor,
    deleteContributor,
    assetManager,
    clawbackAddress,
    setClawbackAddress,
    freezeAddress,
    setFreezeAddress,
}) => {
    const dispatch = useDispatch();

    const { selectedWallet } = useSelector((state) => state.profile);
    const { zestBloomManagerAddress } = useSelector((state) => state.algorand);
    const [showClawbackAddress, setShowClawbackAddress] = useState(false);
    const [showFreezeAddress, setShowFreezeAddress] = useState(false);
    const managerAddress = getAssetManager(
        selectedWallet?.address,
        zestBloomManagerAddress,
        assetManager,
    );
    const [inputValue, setInputValue] = useState('');
    const { users } = useSelector((state) => state.marketplace);

    const firstCall = useRef(true);
    const usersLength = useRef(users?.length === 0);

    const autocomplateValue = useMemo(() => {
        return users.map((x) => (x.username ? x.username : '')) ?? [];
    }, [users]);

    const handlePopUpOpen = (guid) => {
        changeExistsContributor(guid, {
            isOpen: inputValue !== '',
        });
    };

    const handleAutoChange = async (event, newValue, guid) => {
        try {
            const {
                data: { username, avatar, bio },
            } = await AuthService.getUser(newValue);
            changeExistsContributor(guid, {
                avatar,
                username,
                bio,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const getContributors = useCallback(() => {
        if (firstCall.current && !usersLength.current) {
            firstCall.current = false;
            return;
        }
        const filterPath = `?page_size=12&search=${encodeURIComponent(inputValue)}`;
        dispatch(getUsers(filterPath));
        firstCall.current = false;
    }, [inputValue, dispatch]);

    useDebounce(
        () => {
            getContributors();
        },
        400,
        [getContributors],
    );

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="caption table">
                <TableBody>
                    <TableRow>
                        <TableCell style={{ width: '50%' }}>
                            Manager: {managerAddress || 'Please connect your wallet'}
                        </TableCell>
                        <TableCell>
                            Reserve: {selectedWallet?.address || 'Please connect your wallet'}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            {!showClawbackAddress ? (
                                <div
                                    onClick={() => {
                                        setShowClawbackAddress(true);
                                    }}
                                    style={{ width: '100%', cursor: 'pointer' }}
                                >
                                    Clawback:{' '}
                                    {clawbackAddress || '(Click to manually add Clawback Address)'}
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    placeholder="Enter Clawback Address"
                                    className="clawbackField"
                                    value={clawbackAddress}
                                    onChange={setClawbackAddress}
                                    onBlur={() => {
                                        setShowClawbackAddress(false);
                                    }}
                                    autoFocus
                                />
                            )}
                        </TableCell>
                        <TableCell>
                            {!showFreezeAddress ? (
                                <div
                                    onClick={() => {
                                        setShowFreezeAddress(true);
                                    }}
                                    style={{ width: '100%', cursor: 'pointer' }}
                                >
                                    Freeze:{' '}
                                    {freezeAddress || '(Click to manually add Freeze Address)'}
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    placeholder="Enter Freeze Address"
                                    className="clawbackField"
                                    value={freezeAddress}
                                    onChange={setFreezeAddress}
                                    onBlur={() => {
                                        setShowFreezeAddress(false);
                                    }}
                                    autoFocus
                                />
                            )}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>
                            Default Frozen: {defaultFrozen ? 'True' : 'False'}
                        </TableCell>
                    </TableRow>

                    {/* Asset Attributes */}
                    {Object.keys(assetAttributes).length !== 0 && (
                        <TableRow>
                            <TableCell colSpan={2}>Asset Attributes:</TableCell>
                        </TableRow>
                    )}
                    {assetAttributes?.map((attribute, i) => (
                        <TableRow key={i} className="attribute-inputs">
                            <TableCell>
                                <input
                                    type="text"
                                    placeholder="Enter key"
                                    value={attribute.trait_type}
                                    onChange={(e) =>
                                        changeExistsAttributes(
                                            attribute.guid,
                                            e.target.value,
                                            'trait_type',
                                        )
                                    }
                                />
                            </TableCell>
                            <TableCell style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    className="attribute-inputs-values"
                                    placeholder="Enter value"
                                    value={attribute.value}
                                    onChange={(e) =>
                                        changeExistsAttributes(
                                            attribute.guid,
                                            e.target.value,
                                            'value',
                                        )
                                    }
                                />
                                <button
                                    className="delete-attribute-btn"
                                    onClick={() => deleteAttributes(attribute.guid)}
                                >
                                    X
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}

                    {/* Asset Contributors */}
                    {Object.keys(assetContributors).length !== 0 && (
                        <TableRow>
                            <TableCell colSpan={2}>Asset Contributors:</TableCell>
                        </TableRow>
                    )}
                    {assetContributors?.map((contributor) => (
                        <TableRow key={contributor.guid} className="attribute-inputs">
                            <TableCell>
                                <Grid
                                    justifyContent="center"
                                    alignItems="center"
                                    container
                                    spacing={2}
                                >
                                    <Grid item xs={2}>
                                        <Avatar alt="avatar" src={contributor.avatar} />
                                    </Grid>
                                    <Grid item xs={10}>
                                        <Autocomplete
                                            value={contributor.username}
                                            id={`contributor-${contributor.guid}`}
                                            ListboxProps={{
                                                style: { maxHeight: 400, overflow: 'auto' },
                                            }}
                                            freeSolo
                                            disableClearable
                                            open={contributor.isOpen}
                                            onOpen={() => handlePopUpOpen(contributor.guid)}
                                            onClose={() =>
                                                changeExistsContributor(contributor.guid, {
                                                    isOpen: false,
                                                })
                                            }
                                            onChange={(event, newValue) =>
                                                handleAutoChange(event, newValue, contributor.guid)
                                            }
                                            onInputChange={(event, newInputValue) => {
                                                setInputValue(newInputValue);
                                            }}
                                            options={autocomplateValue}
                                            PaperComponent={({ children }) => (
                                                <Paper style={{ margin: '5px' }}>
                                                    <h4>{children}</h4>
                                                </Paper>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Search User"
                                                    variant="outlined"
                                                    value={inputValue}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Search color="disabled" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    className="attribute-inputs-values"
                                    placeholder="Contributor Type"
                                    value={contributor.type}
                                    onChange={(e) =>
                                        changeExistsContributor(contributor.guid, {
                                            type: e.target.value,
                                        })
                                    }
                                />
                                <button
                                    className="delete-contributor-btn"
                                    onClick={() => deleteContributor(contributor.guid)}
                                >
                                    X
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

SimpleTable.propTypes = {
    defaultFrozen: PropTypes.bool,
    assetAttributes: PropTypes.array,
    changeExistsAttributes: PropTypes.func,
    deleteAttributes: PropTypes.func,
    assetContributors: PropTypes.array,
    changeExistsContributor: PropTypes.func,
    deleteContributor: PropTypes.func,
    assetManager: PropTypes.string,
    clawbackAddress: PropTypes.string,
    setClawbackAddress: PropTypes.func,
    freezeAddress: PropTypes.string,
    setFreezeAddress: PropTypes.func,
};

export default SimpleTable;

function getAssetManager(creator, zestBloom, assetManager) {
    switch (assetManager) {
        case 'creator':
            return creator;
        case 'zestBloom':
            return zestBloom;
        case 'unmanaged':
            return undefined;
        default:
            return creator;
    }
}
