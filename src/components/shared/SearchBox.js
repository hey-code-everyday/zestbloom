import React, { useState } from 'react';
import { useDebounce } from 'react-use';
import PropTypes from 'prop-types';

import { Search } from '@material-ui/icons';
import { FormControl, OutlinedInput, InputAdornment } from '@material-ui/core';

const SearchBox = ({ onSearch, searchKey }) => {
    const [value, setValue] = useState(searchKey);

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    useDebounce(
        () => {
            onSearch(value);
        },
        400,
        [value],
    );

    return (
        <FormControl variant="outlined">
            <OutlinedInput
                placeholder="Search"
                onChange={handleChange}
                value={value}
                startAdornment={
                    <InputAdornment position="start">
                        <Search color="disabled" />
                    </InputAdornment>
                }
            />
        </FormControl>
    );
};

SearchBox.propTypes = {
    onSearch: PropTypes.func.isRequired,
    searchKey: PropTypes.string.isRequired,
};

export default SearchBox;
