import React from 'react';
import { Box } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const Step3 = () => {
    const [selectedDateStart, setSelectedDateStart] = React.useState(new Date());

    const handleDateChangeStart = (date) => {
        setSelectedDateStart(date);
    };

    const [selectedDateEnd, setSelectedDateEnd] = React.useState(new Date());

    const handleDateChangeEnd = (date) => {
        setSelectedDateEnd(date);
    };

    return (
        <Box className="third-step">
            <div className="third-step-fields">
                <Box display="flex" flexDirection="column" justifyContent="space-between">
                    <div className="info">
                        <i className="icon-calendar-start" />
                        You can schedule this listing to only be buyable at a future date.
                    </div>
                    <div>
                        <label>Listing Date and Time</label>
                        {/*Start Date Datepicker*/}
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                className="post-datepicker"
                                value={selectedDateStart}
                                onChange={handleDateChangeStart}
                                fullWidth
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="space-between">
                    <div className="info">
                        <i className="icon-calendar-end" />
                        Your auction will end and the highest bidder will win your item.
                    </div>
                    <div>
                        <label>End Date and Time</label>
                        {/*End Date Datepicker*/}
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                className="post-datepicker"
                                value={selectedDateEnd}
                                onChange={handleDateChangeEnd}
                                fullWidth
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                </Box>
            </div>
        </Box>
    );
};

export default Step3;
