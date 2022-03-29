import React from 'react';

import { FILTER_CONFIG } from 'configs';
import SortItem from './items/listItem';
import CheckboxItem from './items/checkboxItem';
import PropTypes from 'prop-types';

const PeopleFilter = ({
    setSortPeople,
    sortPeople,
    setSortPeopleByRole,
    sortPeopleByRole,
    filterPeopleByTag,
    setFilterPeopleByTag,
}) => {
    const users = FILTER_CONFIG.users;
    const userTag_types = FILTER_CONFIG.userTag_types;
    const people = FILTER_CONFIG.people;

    const setTag = (method, value) => {
        return method((prev) =>
            prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value],
        );
    };
    const sortedItems = [
        {
            title: 'User Type',
            filtered_items: people,
            sort: sortPeopleByRole,
            setSort: setSortPeopleByRole,
        },
        {
            title: 'Sort By',
            filtered_items: users,
            sort: sortPeople,
            setSort: setSortPeople,
        },
    ];

    return (
        <div>
            {sortedItems.map((item) => (
                <SortItem
                    key={item?.title}
                    title={item?.title}
                    filtered_items={item?.filtered_items}
                    sort={item?.sort}
                    setSort={item?.setSort}
                />
            ))}
            <CheckboxItem
                title="User Tags"
                filtered_items={userTag_types}
                filterByTag={filterPeopleByTag}
                setTag={setTag}
                setFilterByTag={setFilterPeopleByTag}
                tags
            />
        </div>
    );
};

PeopleFilter.propTypes = {
    setSortPeople: PropTypes.func,
    setSortPeopleByRole: PropTypes.func,
    setFilterPeopleByTag: PropTypes.func,
    sortPeople: PropTypes.string,
    filterPeopleByTag: PropTypes.array,
};

export default PeopleFilter;
