import React from 'react';
import {
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableContainer,
    TableRow,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';

const ActivityTable = ({ activities }) => {
    return (
        <div>
            <TableContainer
                component={Paper}
                className="activity-table"
                style={{
                    maxHeight: 300,
                    marginBottom: 20,
                }}
            >
                <Table sx={{ minWidth: 650 }} aria-label="caption table" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                style={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                }}
                                align="center"
                            >
                                Collectors
                            </TableCell>
                            <TableCell
                                style={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                }}
                                align="center"
                            >
                                Activities
                            </TableCell>
                            <TableCell
                                style={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                }}
                                align="center"
                            >
                                Date
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {activities?.map((activity) => {
                            return (
                                <TableRow key={activity.guid}>
                                    <TableCell align="center">
                                        {activity?.sender ? activity.sender.username : 'Private'}
                                    </TableCell>
                                    <TableCell align="center">{activity?.description}</TableCell>
                                    <TableCell align="center">{activity?.timesince} ago</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

ActivityTable.propTypes = {
    activities: PropTypes.array,
};

export default ActivityTable;
