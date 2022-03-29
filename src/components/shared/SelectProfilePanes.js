import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';

const SelectProfilePanes = ({ value, items }) => {
    const history = useHistory();
    const { username } = useParams();

    const handleChange = (e) => {
        history.push(`/profile/${username}/${e.target.value.toLowerCase()}`);
    };

    return (
        <FormControl className="select-profile-panes">
            <Select value={value} onChange={handleChange} displayEmpty>
                {items.map(({ label }) => (
                    <MenuItem key={label} value={label.toLowerCase()}>
                        {label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

SelectProfilePanes.propTypes = {
    value: PropTypes.string,
    items: PropTypes.array,
};

export default SelectProfilePanes;
