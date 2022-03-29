import React from 'react';
import {
    Box,
    Button,
    Grid,
    Dialog,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    makeStyles,
    Slider,
    TextField,
} from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import imgDateEnd from 'assets/img/date_end.svg';
import imgDateStart from 'assets/img/date_start.svg';
import imgDollarHammer from 'assets/img/dollar_hammer.svg';
import imgDollarHand from 'assets/img/dollar_hand.svg';
import imgDollarTimer from 'assets/img/dollar_timer.svg';
import imgDollarUpArrow from 'assets/img/dollar_up_arrow.svg';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {},
    title: {
        '&.MuiDialogTitle-root': {
            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(3),
        },
    },
    box: {
        fontFamily: 'Roboto',
    },
    topLine: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(0),
        marginBottom: theme.spacing(3),

        '& img': {
            marginRight: theme.spacing(1.5),
        },
    },
    label: {
        fontSize: 14,
        fontWeight: 400,
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
}));

const fields = [
    {
        id: 'startTime',
        label: 'The date and start time of the auction',
        type: 'datetime',
        fieldLabel: 'Start Time',
        icon: imgDateStart,
    },
    {
        id: 'endTime',
        label: 'The date and end time of the auction',
        type: 'datetime',
        fieldLabel: 'End Time',
        icon: imgDateEnd,
    },
    {
        id: 'minPrice',
        label: 'The minimum reserve price set for the auction to begin',
        fieldLabel: 'Reserve Price',
        icon: imgDollarHand,
    },
    {
        id: 'minAmount',
        label: 'This is the minimum amount by which bids must be increased',
        fieldLabel: 'Min Bid Increment',
        icon: imgDollarUpArrow,
    },
    {
        id: 'triggerWindow',
        label: 'Bids within this time window will extend this auction.',
        fieldLabel: 'Snipe Trigger Window',
        icon: imgDollarTimer,
        type: 'slider',
    },
    {
        id: 'extenstionTime',
        label: 'When the snipe extension is triggered, the auction end is extended by this amount of time.',
        fieldLabel: 'Snipe Extension Time',
        icon: imgDollarHammer,
        type: 'slider',
    },
];

const AuctionSettingsModal = ({ open, onClose }) => {
    const classes = useStyles();

    const onSave = () => {
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg">
            <DialogTitle className={classes.title}>
                <Typography variant="h4">Auction Settings</Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={6}>
                    {fields.map(({ id, label, type, fieldLabel, icon }) => (
                        <Grid key={id} item xs={12} md={6}>
                            <Box className={classes.box}>
                                <Box className={classes.topLine}>
                                    <img src={icon} alt={label} />
                                    <Typography className={classes.label} variant="body2">
                                        {label}
                                    </Typography>
                                </Box>
                                <FormControl fullWidth>
                                    <InputLabel className={classes.inputLabel} shrink htmlFor={id}>
                                        {fieldLabel}
                                    </InputLabel>
                                    {type === 'datetime' && (
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <DateTimePicker
                                                label=""
                                                onChange={(e) => console.log(e)}
                                                renderInput={(params) => (
                                                    <TextField {...params} variant="outlined" />
                                                )}
                                            />
                                        </MuiPickersUtilsProvider>
                                    )}
                                    {(!type || type === 'text') && (
                                        <TextField id={id} variant="outlined" fullWidth />
                                    )}
                                    {type === 'slider' && (
                                        <Slider
                                            defaultValue={10}
                                            step={1}
                                            marks={[
                                                { value: 1, label: 1 },
                                                { value: 30, label: 30 },
                                            ]}
                                            max={30}
                                        />
                                    )}
                                </FormControl>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions className={classes.actions}>
                <Button className={classes.button} variant="outlined" onClick={onClose}>
                    Back
                </Button>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={onSave}
                >
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AuctionSettingsModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
};
export default AuctionSettingsModal;
