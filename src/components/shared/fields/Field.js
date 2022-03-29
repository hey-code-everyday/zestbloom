import React from 'react';
import PropTypes from 'prop-types';
import Input from './Input';

const Field = (props) => {
    const { field, ...attr } = props;

    switch (field) {
        case 'input':
            return <Input {...attr} />;
        // case 'radio':
        // case 'checkbox':
        //     return CheckInput(props);
        // case 'select':
        //     return SelectInput(props);
        // case 'textarea':
        //     return TextAreaInput(props);
        default:
            return <Input {...attr} />;
    }
};

Field.propTypes = {
    field: PropTypes.string,
};

export default Field;
