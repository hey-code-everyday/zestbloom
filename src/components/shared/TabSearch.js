import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    FormControl,
    Box,
    InputAdornment,
    TextField,
    Button,
    Grid,
    Paper,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Search } from '@material-ui/icons';
import { useHistory } from 'react-router';
import { getObjectFromLocationSearch } from 'helpers/urls';
import { FILTER_CONFIG } from 'configs';
import { useDebounce } from 'react-use';
import PropTypes from 'prop-types';

const TabSearch = ({ viewType, setSearchValue, searchFromHomePage }) => {
    const history = useHistory();
    const [value, setValue] = useState(searchFromHomePage || '');
    const [locType, setLocType] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const handlePopUpOpen = () => {
        if (value !== '') {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    const { marketplaceAssets, users } = useSelector((state) => state.marketplace);

    const autocomplateValue = useMemo(() => {
        return viewType === 'people'
            ? users.map((x) => (x.username ? x.username : ''))
            : [
                  ...new Set(
                      marketplaceAssets[FILTER_CONFIG.all_assets]?.map((x) =>
                          x.title ? x.title : '',
                      ),
                  ),
              ] ?? [];
    }, [viewType, users, marketplaceAssets]);

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handleAutoChange = (event, newValue) => {
        if (event.keyCode === 13) {
            event.stopPropagation();
            return event.preventDefault();
        }
    };

    useDebounce(
        () => {
            setSearchValue(value);
        },
        500,
        [value],
    );

    useEffect(() => {
        if (history.location.search) {
            const objSearch = getObjectFromLocationSearch(history.location.search);
            setLocType(objSearch);
        } else {
            setLocType(null);
        }
    }, [history.location.search]);

    const onClickBtn = (key) => {
        if (locType?.type === key) {
            history.push('/marketplace');
        } else {
            history.push(`/marketplace?type=${key}`);
        }
    };

    return (
        <Grid className="tab-search mb-5">
            <FormControl variant="outlined">
                <Autocomplete
                    id="free-solo-demo"
                    ListboxProps={{ style: { maxHeight: 400, overflow: 'auto' } }}
                    freeSolo
                    disableClearable
                    open={isOpen}
                    onOpen={handlePopUpOpen}
                    onClose={() => setIsOpen(false)}
                    onChange={handleAutoChange}
                    options={autocomplateValue}
                    PaperComponent={({ children }) => (
                        <Paper style={{ margin: '5px' }}>
                            <h4>{children}</h4>
                        </Paper>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            className="tab-search-input"
                            placeholder="Search"
                            variant="outlined"
                            onChange={handleChange}
                            value={value}
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        {' '}
                                        <Search color="disabled" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
            </FormControl>
            <Box component="span" m={1} className="tab-search-btns">
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => onClickBtn('assets')}
                    style={viewType === 'assets' ? { background: 'black', color: 'white' } : {}}
                >
                    Assets
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => onClickBtn('people')}
                    style={viewType === 'people' ? { background: 'black', color: 'white' } : {}}
                >
                    People
                </Button>
            </Box>
        </Grid>
    );
};

TabSearch.propTypes = {
    viewType: PropTypes.string,
    setSearchValue: PropTypes.func,
    searchFromHomePage: PropTypes.string,
};

export default TabSearch;
