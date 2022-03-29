import React from 'react';
import {
    Typography,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    Accordion,
} from '@material-ui/core';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';

const SortItem = ({
    title,
    filtered_items,
    filterObj,
    pushOrDeleteValue,
    filtered_type,
    sort,
    setSort,
}) => {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel2a-content"
                id="panel2a-header"
            >
                <Typography>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <List>
                    {filtered_items.map((x) => {
                        return (
                            <ListItem key={x.value}>
                                <ListItemText
                                    className="filter-listItem"
                                    disableTypography
                                    primary={
                                        <Typography
                                            type="body2"
                                            style={{
                                                color:
                                                    (sort ?? filterObj?.[filtered_type]) === x.value
                                                        ? '#485afd'
                                                        : '#000',
                                            }}
                                        >
                                            {x.display}
                                        </Typography>
                                    }
                                    onClick={() => {
                                        setSort
                                            ? setSort(x.value)
                                            : pushOrDeleteValue(filtered_type, x.value);
                                    }}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            </AccordionDetails>
        </Accordion>
    );
};

SortItem.propTypes = {
    title: PropTypes.string,
    filtered_items: PropTypes.array,
    filterObj: PropTypes.object,
    pushOrDeleteValue: PropTypes.func,
    filtered_type: PropTypes.string,
    sort: PropTypes.string,
    setSort: PropTypes.func,
};

export default SortItem;
