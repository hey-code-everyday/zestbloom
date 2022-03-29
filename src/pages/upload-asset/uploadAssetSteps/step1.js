import React, { useState } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { UploadAssetType } from 'components/shared';
import PropTypes from 'prop-types';

const UploadAssetStep1 = ({ handleNext, classes, setAllValues, allValues }) => {
    const [isSeries, setIsSeries] = useState(allValues.isSeries ?? false);

    const onSubmit = () => {
        setAllValues((prev) => ({ ...prev, isSeries }));
        handleNext();
    };

    return (
        <>
            <Typography className={classes.instructions} component="span">
                <Box display="flex" justifyContent="center" mt={3} className="asset-type-parent">
                    <UploadAssetType active={!isSeries} setIsSeries={setIsSeries} />
                    {/* <UploadAssetType
                            type="multiple"
                            active={isSeries}
                            setIsSeries={setIsSeries}
                        /> */}
                </Box>
            </Typography>
            <Box display="flex" justifyContent="center" mt={5}>
                <Button variant="contained" color="primary" size="large" onClick={onSubmit}>
                    Next
                </Button>
            </Box>
        </>
    );
};

UploadAssetStep1.propTypes = {
    handleNext: PropTypes.func,
    classes: PropTypes.object,
    setAllValues: PropTypes.func,
    allValues: PropTypes.object,
};

export default UploadAssetStep1;
