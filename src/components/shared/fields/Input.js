import React from 'react';
import { useField } from 'formik';
import { FormControl, TextField, Tooltip } from '@material-ui/core';
import PropTypes from 'prop-types';
import { InfoOutlined } from '@material-ui/icons';

function Input(props) {
    const { label, tooltip, className, ...attr } = props;
    const [field, form] = useField(props);

    return (
        <div className={`form-element ${className || ''}`}>
            <FormControl fullWidth>
                {label && (
                    <label className={`label ${form.touched && form.error ? 'invalid' : ''}`}>
                        {label}
                        {tooltip && (
                            <Tooltip className="tooltip" title={tooltip} arrow>
                                <InfoOutlined style={{ fontSize: 14 }} />
                            </Tooltip>
                        )}
                    </label>
                )}
                <TextField
                    variant="outlined"
                    // autoComplete="off"
                    fullWidth
                    name={field.name}
                    value={form.value}
                    error={form.touched && Boolean(form.error)}
                    helperText={form.touched && form.error}
                    onChange={(e) => form.setFieldValue(field.name, e.target.value)}
                    onBlur={() => form.setFieldTouched(field.name, true)}
                    {...field}
                    {...attr}
                />
            </FormControl>
        </div>
    );
}

Input.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.string,
};

export default Input;
