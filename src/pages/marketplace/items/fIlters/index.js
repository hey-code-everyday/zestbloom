import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, FormControl, Box, Button, InputAdornment, TextField } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { useHistory } from 'react-router';
import { getRandomAssetsForMarketPlace } from 'redux/marketplace/actions';
import axios from 'axios';
import AssetFilter from './assets';
import PeopleFilter from './people';
import PropTypes from 'prop-types';

const DrawerList = ({
    setFilterObj,
    filterObj,
    setSortAssets,
    sortAssets,
    setSortPeople,
    sortPeople,
    setSortPeopleByRole,
    sortPeopleByRole,
    filterAssetsByTag,
    setFilterAssetsByTag,
    filterPeopleByTag,
    setFilterPeopleByTag,
    viewType,
    setSearchValueAsset,
    setSearchValuePeople,
    setSearchValue,
}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [value, setValue] = useState('');

    const search = (event) => {
        if (event.keyCode === 13) {
            event.stopPropagation();
            return event.preventDefault();
        }

        if (!viewType) {
            setSearchValueAsset(value);
            setSearchValuePeople(value);
        } else {
            setSearchValue(value);
        }
    };

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const onClickBtn = (key) => {
        if (key === viewType) {
            history.push('/marketplace');
        } else {
            history.push(`/marketplace?type=${key}`);
        }
    };

    const randomSearch = () => {
        const currentRequest = axios.CancelToken.source();
        dispatch(getRandomAssetsForMarketPlace(currentRequest));
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div className="filter-search">
                <FormControl variant="outlined">
                    <TextField
                        placeholder="Search"
                        variant="outlined"
                        onChange={handleChange}
                        onKeyUp={search}
                        value={value}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    {' '}
                                    <Search color="disabled" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </FormControl>
                <Box component="span" m={1} className="filter-search-btns">
                    <Button variant="contained" color="primary" onClick={randomSearch}>
                        Random
                    </Button>
                </Box>
            </div>
            <Box component="span" m={10} className="sidebar-search-btns">
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
            {viewType && (
                <div style={{ paddingTop: '2rem' }}>
                    <Typography variant="h2">Search Marketplace</Typography>
                </div>
            )}
            <div style={{ width: '30rem' }}>
                {viewType === 'assets' && (
                    <AssetFilter
                        setFilterObj={setFilterObj}
                        filterObj={filterObj}
                        setSortAssets={setSortAssets}
                        sortAssets={sortAssets}
                        filterAssetsByTag={filterAssetsByTag}
                        setFilterAssetsByTag={setFilterAssetsByTag}
                    />
                )}
                {viewType === 'people' && (
                    <PeopleFilter
                        setSortPeople={setSortPeople}
                        sortPeople={sortPeople}
                        setSortPeopleByRole={setSortPeopleByRole}
                        sortPeopleByRole={sortPeopleByRole}
                        filterPeopleByTag={filterPeopleByTag}
                        setFilterPeopleByTag={setFilterPeopleByTag}
                    />
                )}
            </div>
        </div>
    );
};

DrawerList.propTypes = {
    sortAssets: PropTypes.string,
    sortPeople: PropTypes.string,
    viewType: PropTypes.string,
    sortPeopleByRole: PropTypes.string,
    filterObj: PropTypes.object,
    filterAssetsByTag: PropTypes.array,
    filterPeopleByTag: PropTypes.array,
    setFilterObj: PropTypes.func,
    setSortAssets: PropTypes.func,
    setSortPeople: PropTypes.func,
    setSortPeopleByRole: PropTypes.func,
    setFilterAssetsByTag: PropTypes.func,
    setFilterPeopleByTag: PropTypes.func,
    setSearchValueAsset: PropTypes.func,
    setSearchValuePeople: PropTypes.func,
    setSearchValue: PropTypes.func,
};

export default DrawerList;
