import React, { useState } from 'react';
import { Button, Menu, Box, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AlgoFont from '../../../assets/img/algo-font.svg';
import { FILTER_CONFIG } from 'configs';
import PropTypes from 'prop-types';

const DropdownFilter = ({ setFilterObj, filterObj }) => {
    const checked = (key, event) => {
        const value = event.target.name;
        // if (filterObj[key].length === 1 && filterObj[key].includes(value)) {
        //     return;
        // }
        setFilterObj((prev) => ({
            ...prev,
            [key]: prev[key].includes(value)
                ? prev[key].filter((x) => x !== value)
                : [...prev[key], value],
        }));
    };

    const handleChangeStatus = (event) => {
        return checked('status', event);
    };
    const handleChangePrice = (event) => {
        return checked('price', event);
    };
    const handleChangeType = (event) => {
        return checked('type', event);
    };
    const handleChangeAsset = (event) => {
        return checked('category', event);
    };

    // const handleChangeAssetAll = (event) => {
    //     if (filterObj.category.length === 2) return;

    //     setFilterObj((prev) => ({
    //         ...prev,
    //         category: FILTER_CONFIG.assetFilter.allCategory,
    //     }));
    // };

    // const handleChangeStatusAll = (event) => {
    //     if (filterObj.status.length === 3) return;

    //     setFilterObj((prev) => ({
    //         ...prev,
    //         status: FILTER_CONFIG.assetFilter.status,
    //     }));
    // };

    // const handleChangeTypeAll = (event) => {
    //     if (filterObj.type.length === 2) return;

    //     setFilterObj((prev) => ({
    //         ...prev,
    //         type: FILTER_CONFIG.assetFilter.type,
    //     }));
    // };

    // const handleChangePriceAll = (event) => {
    //     if (filterObj.price.length === 5) return;

    //     setFilterObj((prev) => ({
    //         ...prev,
    //         price: FILTER_CONFIG.assetFilter.price,
    //     }));
    // };

    const [cardMenuEl, setCardMenuEl] = useState(null);

    const openCardMenu = (e) => {
        setCardMenuEl(e.currentTarget);
    };

    const closeCardMenu = () => {
        setCardMenuEl(null);
    };

    const getAlgoPrice = (from, to) => {
        return (
            <span className="dropdown-prices">
                {from} <img src={AlgoFont} alt="algoFont" /> - {to}
                <img src={AlgoFont} alt="algoFont" />
            </span>
        );
    };
    const getAlgoPricePlus = (from) => {
        return (
            <span className="dropdown-prices">
                {from} <img src={AlgoFont} alt="algoFont" /> +
            </span>
        );
    };

    return (
        <>
            <Button className="dropdown-btn" variant="outlined" onClick={openCardMenu}>
                Filter
                <ExpandMoreIcon />
            </Button>
            <Menu
                anchorEl={cardMenuEl}
                keepMounted
                open={Boolean(cardMenuEl)}
                onClose={closeCardMenu}
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
                <Box display="flex" alignItems="flex-start" className="filter-checkboxes">
                    {/*Status*/}
                    <Box className="filter-checkboxes-column">
                        <Typography variant="body1" className="checklist-title text-capitalize">
                            Assets
                        </Typography>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleChangeAsset}
                                        name={FILTER_CONFIG.all_assets}
                                        color="primary"
                                        checked={filterObj.category.includes(
                                            FILTER_CONFIG.all_assets,
                                        )}
                                    />
                                }
                                label="All Assets"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleChangeAsset}
                                        name={FILTER_CONFIG.zestbloom_minted}
                                        color="primary"
                                        checked={filterObj.category.includes(
                                            FILTER_CONFIG.zestbloom_minted,
                                        )}
                                    />
                                }
                                label="Zestbloom Minted"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleChangeAsset}
                                        name={FILTER_CONFIG.featured_work}
                                        color="primary"
                                        checked={filterObj.category.includes(
                                            FILTER_CONFIG.featured_work,
                                        )}
                                    />
                                }
                                label="Featured Artworks"
                            />
                        </FormGroup>
                    </Box>
                    <Box className="filter-checkboxes-column">
                        <Typography variant="body1" className="checklist-title text-capitalize">
                            Status
                        </Typography>
                        <FormGroup>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleChangeStatusAll}
                                        name="all"
                                        color="primary"
                                        checked={filterObj.status.length === 3}
                                    />
                                }
                                label="All"
                            /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleChangeStatus}
                                        name={FILTER_CONFIG.buy_now}
                                        color="primary"
                                        checked={filterObj.status.includes(FILTER_CONFIG.buy_now)}
                                    />
                                }
                                label="Buy now"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleChangeStatus}
                                        name={FILTER_CONFIG.for_offer}
                                        color="primary"
                                        checked={filterObj.status.includes(FILTER_CONFIG.for_offer)}
                                    />
                                }
                                label="For offer"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleChangeStatus}
                                        name={FILTER_CONFIG.auction}
                                        color="primary"
                                        checked={filterObj.status.includes(FILTER_CONFIG.auction)}
                                    />
                                }
                                label="Auction"
                            />
                        </FormGroup>
                    </Box>
                    {/*Num of items*/}
                    <Box className="filter-checkboxes-column">
                        <Typography variant="body1" className="checklist-title text-capitalize">
                            Num of items
                        </Typography>
                        <FormGroup>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleChangeTypeAll}
                                        name="all"
                                        color="primary"
                                        checked={filterObj.type.length === 2}
                                    />
                                }
                                label="All"
                            /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleChangeType}
                                        name={FILTER_CONFIG.single}
                                        color="primary"
                                        checked={filterObj.type.includes(FILTER_CONFIG.single)}
                                    />
                                }
                                label="Single Item"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleChangeType}
                                        name={FILTER_CONFIG.series}
                                        color="primary"
                                        checked={filterObj.type.includes(FILTER_CONFIG.series)}
                                    />
                                }
                                label="Bundle"
                            />
                        </FormGroup>
                    </Box>
                    {/*Price*/}
                    <Box className="filter-checkboxes-column">
                        <Typography variant="body1" className="checklist-title text-capitalize">
                            Price
                        </Typography>
                        <FormGroup>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleChangePriceAll}
                                        name="all"
                                        color="primary"
                                        checked={filterObj.price.length === 5}
                                    />
                                }
                                label="All"
                            /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleChangePrice}
                                        name={FILTER_CONFIG.price.price_1_10}
                                        color="primary"
                                        checked={filterObj.price.includes(
                                            FILTER_CONFIG.price.price_1_10,
                                        )}
                                    />
                                }
                                label={getAlgoPrice(1, 10)}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleChangePrice}
                                        name={FILTER_CONFIG.price.price_10_50}
                                        color="primary"
                                        checked={filterObj.price.includes(
                                            FILTER_CONFIG.price.price_10_50,
                                        )}
                                    />
                                }
                                label={getAlgoPrice(10, 50)}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleChangePrice}
                                        name={FILTER_CONFIG.price.price_50_100}
                                        color="primary"
                                        checked={filterObj.price.includes(
                                            FILTER_CONFIG.price.price_50_100,
                                        )}
                                    />
                                }
                                label={getAlgoPrice(50, 100)}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleChangePrice}
                                        name={FILTER_CONFIG.price.price_100_200}
                                        color="primary"
                                        checked={filterObj.price.includes(
                                            FILTER_CONFIG.price.price_100_200,
                                        )}
                                    />
                                }
                                label={getAlgoPrice(100, 200)}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={handleChangePrice}
                                        name={FILTER_CONFIG.price.price_200_}
                                        color="primary"
                                        checked={filterObj.price.includes(
                                            FILTER_CONFIG.price.price_200_,
                                        )}
                                    />
                                }
                                label={getAlgoPricePlus(200)}
                            />
                        </FormGroup>
                    </Box>
                </Box>
            </Menu>
        </>
    );
};

DropdownFilter.propTypes = {
    setFilterObj: PropTypes.func,
    filterObj: PropTypes.object,
};
export default DropdownFilter;
