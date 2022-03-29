import React from 'react';
import { useHistory } from 'react-router-dom';
import { KeyboardArrowLeft } from '@material-ui/icons';
import PropTypes from 'prop-types';

const BackButton = ({ label, classname }) => {
    let history = useHistory();
    return (
        <div className="back-btn">
            <button
                className={` icon-btn containedSecondary md rect ${classname}`}
                onClick={() => history.goBack()}
                type="button"
            >
                <KeyboardArrowLeft />
            </button>
            {label && <span className="label">{label}</span>}
        </div>
    );
};

BackButton.propTypes = {
    label: PropTypes.string,
    classname: PropTypes.string,
};

export default BackButton;
