import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import { Search } from '@material-ui/icons';
import { FormControl, OutlinedInput, InputAdornment, Button } from '@material-ui/core';

import { setValueSearchFromHome } from 'redux/marketplace/actions';
import IconArrowRight from 'assets/img/zb-new/icon-arrow-right.svg';

const StartCollectingSearch = ({ id }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(setValueSearchFromHome(value));
        history.push('/marketplace');
    };

    return (
        <form className="search-group" id={id} onSubmit={handleSubmit}>
            <FormControl variant="outlined">
                <OutlinedInput
                    className="rounded-1"
                    placeholder="Search"
                    onChange={handleChange}
                    value={value}
                    startAdornment={
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    }
                    endAdornment={
                        <Button className="btn-bg-none rounded-1" type="submit">
                            <img src={IconArrowRight} alt="go" />
                        </Button>
                    }
                />
            </FormControl>
        </form>
    );
};

export default StartCollectingSearch;
