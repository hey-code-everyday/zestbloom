import React from 'react';
import { Box, ListItem, Switch, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const AllowComponent = ({ item, formik }) => {
    const handleChange = (e) => {
        formik.setFieldValue(item.name, e.target.checked);
    };

    return (
        <ListItem disableGutters classes={{ root: 'notif-list' }}>
            <Box>
                <Typography variant="body2" component="strong">
                    {item.label}
                </Typography>
                <Typography variant="body1" component="span">
                    {item.text}
                </Typography>
            </Box>
            <Switch
                checked={formik.values[item.name]}
                onChange={handleChange}
                color="primary"
                name={item.name}
                inputProps={{ 'aria-label': 'primary checkbox' }}
            />
        </ListItem>
    );
};

AllowComponent.propTypes = {
    item: PropTypes.object,
    formik: PropTypes.object,
};

export default AllowComponent;
