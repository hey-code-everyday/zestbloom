import React from 'react';
import {
    Box,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    makeStyles,
    TextField,
    Slider,
} from '@material-ui/core';

import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';

import { IconButton, InputAdornment } from '@material-ui/core';
import DateRangeIcon from '@material-ui/icons/DateRange';
import Field from 'components/shared/fields/Field';
import { AUCTION_FIELDS } from 'configs';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {},
    box: {
        fontFamily: 'Roboto',
        padding: '0 16px',
    },
    topLine: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(0),
        marginBottom: theme.spacing(4),

        '& img': {
            marginRight: theme.spacing(1.5),
        },
    },
    label: {
        fontSize: 14,
        fontWeight: 400,
        lineHeight: '21px',
        fontFamily: 'Roboto',
    },
    inputLabel: {
        marginTop: theme.spacing(-2.5),
        fontSize: 14,
        color: '#00000050',
    },
    actions: {
        justifyContent: 'center',
        paddingBottom: theme.spacing(4),
    },
    button: {
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),
        borderRadius: theme.spacing(1.25),
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    auctionSlider: {
        marginTop: theme.spacing(5),
    },
}));

const AuctionFields = ({ handleBack, createdAsset, formik }) => {
    const classes = useStyles();

    const onChangeDate = (e, id) => {
        formik.setFieldValue(id, e);
    };

    const onChangeSlider = (id, val) => {
        formik.setFieldValue(id, val);
    };

    return (
        <>
            <Grid container spacing={6}>
                {AUCTION_FIELDS.map(({ id, label, type, fieldLabel, icon }) => (
                    <Grid key={id} item xs={12} lg={6}>
                        <Box className={classes.box}>
                            <Box className={`${classes.topLine} auction-bar-label`}>
                                <img src={icon} alt={label} />
                                <Typography className={classes.label} variant="body2">
                                    {label}
                                </Typography>
                            </Box>
                            <FormControl fullWidth className="date-popup">
                                <InputLabel className={classes.inputLabel} shrink htmlFor={id}>
                                    {fieldLabel}
                                </InputLabel>
                                {type === 'slider' && (
                                    <Slider
                                        className={classes.auctionSlider}
                                        step={1}
                                        marks={[
                                            { value: 1, label: 1 },
                                            { value: 30, label: 30 },
                                        ]}
                                        max={30}
                                        value={formik.values[id]}
                                        onChange={(e, newVal) => onChangeSlider(id, newVal)}
                                        valueLabelDisplay="on"
                                    />
                                )}
                                {type === 'datetime' && (
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <DateTimePicker
                                            emptyLabel
                                            inputVariant="outlined"
                                            onChange={(e) => onChangeDate(e, id)}
                                            value={formik.values[id]}
                                            ampm={false}
                                            disablePast
                                            minDate={id === 'endTime' && formik.values.startTime}
                                            DialogProps={{ className: 'date-popup' }}
                                            showTodayButton
                                            minDateMessage={
                                                id === 'endTime' &&
                                                'The date must not be before the start date'
                                            }
                                            error={Boolean(formik.errors[id])}
                                            helperText={formik.errors[id]}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton>
                                                            <DateRangeIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} variant="outlined" />
                                            )}
                                        />
                                    </MuiPickersUtilsProvider>
                                )}
                                {(!type || type === 'text') && (
                                    <Field
                                        field="input"
                                        type="number"
                                        name={id}
                                        className="no-margin"
                                        {...formik.getFieldProps(id)}
                                    />
                                )}
                            </FormControl>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

AuctionFields.propTypes = {
    handleBack: PropTypes.func,
    formik: PropTypes.object,
};

export default AuctionFields;
