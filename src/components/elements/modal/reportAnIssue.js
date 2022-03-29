import React, { useEffect, useState } from 'react';
import { Box, Dialog, Link as LinkComponent, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { getReportTemplates, sendIssueReports } from 'redux/singleAsset/actions';
import { NOTIFICATIONS } from 'configs';
import PropTypes from 'prop-types';

const ReportAnIssueModal = ({ reportIssue, onCloseReportIssue, assetId, giveNotification }) => {
    const dispatch = useDispatch();
    const [checkedTemplates, setCheckedTemplates] = useState([]);
    const [otherReasonCheck, setOtherReasonCheck] = useState(false);
    const [otherReasonMessage, setOtherReasonMessage] = useState('');
    const { reportTemplates } = useSelector((state) => state.singleAsset);
    const handleMessage = (e) => {
        setOtherReasonMessage(e.target.value);
    };
    const handleChange = (id) => {
        if (checkedTemplates.includes(id)) {
            return setCheckedTemplates((prev) => prev.filter((x) => x !== id));
        }
        setCheckedTemplates((prev) => [...prev, id]);
    };
    useEffect(() => {
        dispatch(getReportTemplates());
    }, [dispatch]);

    const sendReport = () => {
        onCloseReportIssue();
        const data = {
            categories: checkedTemplates,
            issue_url: window.location.href,
            message: otherReasonCheck ? otherReasonMessage : '',
            entity: assetId,
        };
        dispatch(sendIssueReports(data)).then((response) => {
            if (response.status === 201) {
                return giveNotification(NOTIFICATIONS.success.sendReport);
            }
            return giveNotification(NOTIFICATIONS.error.sendReport);
        });
    };
    return (
        <Dialog
            open={reportIssue}
            onClose={onCloseReportIssue}
            scroll="body"
            className="report-popup"
        >
            <Box className="report-popup-content">
                <Typography variant="body1" className="title">
                    Report an Issue
                </Typography>
                <div className="report-popup-body">
                    <FormGroup>
                        {reportTemplates?.map((template, i) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={() => handleChange(template.id)}
                                        name={template.id}
                                        color="primary"
                                        checked={checkedTemplates.includes(template.id)}
                                    />
                                }
                                label={template.message}
                                key={i}
                            />
                        ))}

                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={() => setOtherReasonCheck((prev) => !prev)}
                                    checked={otherReasonCheck}
                                    name="oderReason"
                                    color="primary"
                                />
                            }
                            label="Other:"
                        />
                    </FormGroup>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={otherReasonMessage}
                        onChange={handleMessage}
                    />
                </div>
                <Box display="flex" alignItems="center" mt={5} justifyContent="flex-end">
                    <Box mr={6}>
                        <LinkComponent color="secondary" onClick={onCloseReportIssue}>
                            Cancel
                        </LinkComponent>
                    </Box>
                    <Box>
                        <LinkComponent color="primary" onClick={sendReport}>
                            Report
                        </LinkComponent>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};

ReportAnIssueModal.propTypes = {
    reportIssue: PropTypes.bool,
    onCloseReportIssue: PropTypes.func,
    assetId: PropTypes.string,
    giveNotification: PropTypes.func,
};

export default ReportAnIssueModal;
