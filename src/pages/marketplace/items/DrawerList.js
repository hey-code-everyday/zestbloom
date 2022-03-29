import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Typography,
    FormControl,
    Box,
    Button,
    InputAdornment,
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    FormGroup,
    FormControlLabel,
    Checkbox,
    RadioGroup,
    Radio,
} from '@material-ui/core';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Search } from '@material-ui/icons';
import { useHistory } from 'react-router';
import { FILTER_CONFIG } from 'configs';
import { getRandomAssetsForMarketPlace } from 'redux/marketplace/actions';
import axios from 'axios';
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

    const duration = FILTER_CONFIG.duration;
    const sort_by = FILTER_CONFIG.sort_by;
    const status = FILTER_CONFIG.status;
    const type = FILTER_CONFIG.type;
    const price = FILTER_CONFIG.price_sidebar;
    const users = FILTER_CONFIG.users;
    const assetTag_types = FILTER_CONFIG.assetTag_types;
    const userTag_types = FILTER_CONFIG.userTag_types;
    const people = FILTER_CONFIG.people;

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

    const pushOrDeleteValue = (key, value) => {
        if (value instanceof Array || key === 'duration') {
            setFilterObj((prev) => ({
                ...prev,
                [key]: value,
            }));
            return;
        }
        if (filterObj[key].length === 1 && filterObj[key].includes(value)) {
            return;
        }
        setFilterObj((prev) => ({
            ...prev,
            [key]: prev[key].includes(value)
                ? prev[key].filter((x) => x !== value)
                : [...prev[key], value],
        }));
    };

    const setTag = (method, value) => {
        return method((prev) =>
            prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value],
        );
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
                    <div>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography>Asset Quantity</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormGroup>
                                    <FormControlLabel
                                        key={'All'}
                                        control={
                                            <Checkbox
                                                color="primary"
                                                checked={filterObj.type.length === 2}
                                                onChange={() => {
                                                    pushOrDeleteValue(
                                                        'type',
                                                        FILTER_CONFIG.assetFilter.type,
                                                    );
                                                }}
                                                name="All"
                                            />
                                        }
                                        label="All"
                                    />
                                    {type.map((x) => {
                                        return (
                                            <FormControlLabel
                                                key={x.value}
                                                control={
                                                    <Checkbox
                                                        color="primary"
                                                        checked={filterObj.type.includes(x.value)}
                                                        onChange={() => {
                                                            pushOrDeleteValue('type', x.value);
                                                        }}
                                                        name={x.display}
                                                    />
                                                }
                                                label={x.display}
                                            />
                                        );
                                    })}
                                </FormGroup>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography>Mint Date</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List>
                                    {duration.map((x) => {
                                        return (
                                            <ListItem key={x.value}>
                                                <ListItemText
                                                    className="filter-listItem"
                                                    disableTypography
                                                    primary={
                                                        <Typography
                                                            type="body2"
                                                            style={{
                                                                color:
                                                                    filterObj.duration === x.value
                                                                        ? '#485afd'
                                                                        : '#000',
                                                            }}
                                                        >
                                                            {x.display}
                                                        </Typography>
                                                    }
                                                    onClick={() => {
                                                        pushOrDeleteValue('duration', x.value);
                                                    }}
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography>Sale Type</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormGroup>
                                    <FormControlLabel
                                        key={'All'}
                                        control={
                                            <Checkbox
                                                color="primary"
                                                checked={filterObj.status.length === 3}
                                                onChange={() => {
                                                    pushOrDeleteValue(
                                                        'status',
                                                        FILTER_CONFIG.assetFilter.status,
                                                    );
                                                }}
                                                name="All"
                                            />
                                        }
                                        label="All"
                                    />
                                    {status.map((x) => {
                                        return (
                                            <FormControlLabel
                                                key={x.value}
                                                control={
                                                    <Checkbox
                                                        color="primary"
                                                        checked={filterObj.status.includes(x.value)}
                                                        onChange={() => {
                                                            pushOrDeleteValue('status', x.value);
                                                        }}
                                                        name={x.display}
                                                    />
                                                }
                                                label={x.display}
                                            />
                                        );
                                    })}
                                </FormGroup>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography>Price</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormGroup>
                                    <FormControlLabel
                                        key={'All'}
                                        control={
                                            <Checkbox
                                                color="primary"
                                                checked={filterObj.price.length === 5}
                                                onChange={() => {
                                                    pushOrDeleteValue(
                                                        'price',
                                                        FILTER_CONFIG.assetFilter.price,
                                                    );
                                                }}
                                                name="All"
                                            />
                                        }
                                        label="All"
                                    />
                                    {price.map((x) => {
                                        return (
                                            <FormControlLabel
                                                key={x.value}
                                                control={
                                                    <Checkbox
                                                        color="primary"
                                                        checked={filterObj.price.includes(x.value)}
                                                        onChange={() => {
                                                            pushOrDeleteValue('price', x.value);
                                                        }}
                                                        name={x.display}
                                                    />
                                                }
                                                label={x.display}
                                            />
                                        );
                                    })}
                                </FormGroup>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography>Asset Tags</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormGroup>
                                    {assetTag_types.map((x) => {
                                        return (
                                            <FormControlLabel
                                                key={x.value}
                                                control={
                                                    <Checkbox
                                                        color="primary"
                                                        checked={filterAssetsByTag.includes(
                                                            x.value,
                                                        )}
                                                        onChange={() => {
                                                            setTag(setFilterAssetsByTag, x.value);
                                                        }}
                                                        name={x.dispatch}
                                                    />
                                                }
                                                label={x.display}
                                            />
                                        );
                                    })}
                                </FormGroup>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Sort By</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List>
                                    {sort_by.map((x) => {
                                        return (
                                            <ListItem key={x.value}>
                                                <ListItemText
                                                    className="filter-listItem"
                                                    disableTypography
                                                    primary={
                                                        <Typography
                                                            type="body2"
                                                            style={{
                                                                color:
                                                                    sortAssets === x.value
                                                                        ? '#485afd'
                                                                        : '#000',
                                                            }}
                                                        >
                                                            {x.display}
                                                        </Typography>
                                                    }
                                                    onClick={() => {
                                                        setSortAssets(x.value);
                                                    }}
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                )}
                {viewType === 'people' && (
                    <div>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography>User Type</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List>
                                    {people.map((x) => {
                                        return (
                                            <ListItem key={x.value}>
                                                <ListItemText
                                                    className="filter-listItem"
                                                    disableTypography
                                                    primary={
                                                        <Typography
                                                            type="body2"
                                                            style={{
                                                                color:
                                                                    sortPeopleByRole === x.value
                                                                        ? '#485afd'
                                                                        : '#000',
                                                            }}
                                                        >
                                                            {x.display}
                                                        </Typography>
                                                    }
                                                    onClick={() => {
                                                        setSortPeopleByRole(x.value);
                                                    }}
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography>User Tags</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormGroup>
                                    {userTag_types.map((x) => {
                                        return (
                                            <FormControlLabel
                                                key={x.value}
                                                control={
                                                    <Checkbox
                                                        color="primary"
                                                        checked={filterPeopleByTag.includes(
                                                            x.value,
                                                        )}
                                                        onChange={() => {
                                                            setTag(setFilterPeopleByTag, x.value);
                                                        }}
                                                        name={x.dispatch}
                                                    />
                                                }
                                                label={x.display}
                                            />
                                        );
                                    })}
                                </FormGroup>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography>Sort By</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl>
                                    <RadioGroup
                                        color="primary"
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="radio-buttons-group"
                                        value={sortPeople}
                                        onChange={(e) => {
                                            setSortPeople(e.target.value);
                                        }}
                                    >
                                        {users.map((x) => {
                                            return (
                                                <FormControlLabel
                                                    key={x.value}
                                                    value={x.value}
                                                    control={<Radio color="primary" />}
                                                    label={x.display}
                                                />
                                            );
                                        })}
                                    </RadioGroup>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                )}
            </div>
        </div>
    );
};

DrawerList.propTypes = {
    setFilterObj: PropTypes.func,
    setSortAssets: PropTypes.func,
    setSortPeople: PropTypes.func,
    setSortPeopleByRole: PropTypes.func,
    setFilterAssetsByTag: PropTypes.func,
    setFilterPeopleByTag: PropTypes.func,
    setSearchValueAsset: PropTypes.func,
    setSearchValuePeople: PropTypes.func,
    setSearchValue: PropTypes.func,
    filterObj: PropTypes.object,
    sortAssets: PropTypes.string,
    sortPeople: PropTypes.string,
    sortPeopleByRole: PropTypes.string,
    filterAssetsByTag: PropTypes.array,
    filterPeopleByTag: PropTypes.array,
    viewType: PropTypes.string,
};

export default DrawerList;
