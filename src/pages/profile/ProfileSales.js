import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Grid,
    Menu,
    Radio,
    RadioGroup,
    Typography,
} from '@material-ui/core';
import LoadMoreBtn from 'components/shared/LoadMoreBtn';
import LottieContainer from 'components/shared/LottieContainer';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { getSalesHistory, loadMoreItems } from 'redux/sales/actions';
import SaleHistoryTable from './sales/saleHistoryTable';

const ProfileSales = () => {
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { data, loadMoreUrl, loadMoreLoading } = useSelector((state) => state.sales);

    const [filterMenuEl, setFilterMenuEl] = useState(null);
    const [sortMenuEl, setSortMenuEl] = useState(null);

    const [filter, setFilter] = useState();
    const [sort, setSort] = useState();

    const openFilterMenu = (e) => {
        setFilterMenuEl(e.currentTarget);
    };

    const closeFilterMenu = (e) => {
        setFilterMenuEl(null);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.checked ? 24 : null);
    };

    const openSortMenu = (e) => {
        setSortMenuEl(e.currentTarget);
    };

    const closeSortMenu = (e) => {
        setSortMenuEl(null);
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
    };

    const loadMore = () => {
        if (loadMoreUrl) {
            dispatch(loadMoreItems(loadMoreUrl));
        }
    };

    useEffect(() => {
        if (user?.username) {
            const filterObj = filter
                ? {
                      closed_after: new Date(new Date() - filter * 3600 * 1000).toISOString(),
                  }
                : {};

            dispatch(getSalesHistory(user.username, sort, filterObj));
        }
    }, [dispatch, filter, sort, user.username]);

    return (
        <Box className="profile-sales">
            <Grid
                container
                className="sales-header"
                justifyContent="space-between"
                alignItems="center"
            >
                <Grid item>
                    <Typography variant="h4">Sale Activity</Typography>
                </Grid>
                <Grid item>
                    <Grid container>
                        <Grid item>
                            <Button
                                className="dropdown-btn"
                                variant="outlined"
                                onClick={openFilterMenu}
                            >
                                Filter
                                <ExpandMoreIcon />
                            </Button>

                            <Menu
                                anchorEl={filterMenuEl}
                                keepMounted
                                open={Boolean(filterMenuEl)}
                                onClose={closeFilterMenu}
                                className="sort-dropdown"
                                getContentAnchorEl={null}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                onChange={handleFilterChange}
                                                name="all"
                                                color="primary"
                                                checked={filter === 24}
                                            />
                                        }
                                        label="24 hrs"
                                    />
                                </FormGroup>
                            </Menu>
                        </Grid>
                        <Grid item>
                            <Button
                                className="dropdown-btn"
                                variant="outlined"
                                onClick={openSortMenu}
                            >
                                Sort
                                <ExpandMoreIcon />
                            </Button>

                            <Menu
                                anchorEl={sortMenuEl}
                                keepMounted
                                open={Boolean(sortMenuEl)}
                                onClose={closeSortMenu}
                                className="sort-dropdown"
                                getContentAnchorEl={null}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <FormControl component="fieldset">
                                    <RadioGroup value={sort} onChange={handleSortChange}>
                                        <FormControlLabel
                                            value="-amount"
                                            control={<Radio />}
                                            label="High to low"
                                            className="radio-item"
                                        />
                                        <FormControlLabel
                                            value="amount"
                                            control={<Radio />}
                                            label="Low to high"
                                            className="radio-item"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Menu>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Box className="sales-body">
                {data.length ? (
                    <SaleHistoryTable items={data} />
                ) : (
                    <Box padding={2} textAlign="center">
                        <Typography variant="body2">No matching items.</Typography>
                    </Box>
                )}
            </Box>
            <Box>
                {loadMoreUrl &&
                    (loadMoreLoading ? (
                        <LottieContainer
                            containerStyles={{
                                height: '49px',
                                width: '100%',
                                marginTop: '40px',
                            }}
                            lottieStyles={{ width: '50px' }}
                        />
                    ) : (
                        <LoadMoreBtn loadMoreAssets={loadMore} />
                    ))}
            </Box>
        </Box>
    );
};

export default ProfileSales;
