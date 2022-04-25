import React from 'react';

const ListViewIcon = ({ active }) => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 34 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="34" height="9" fill={active ? '#3eb595' : '#787878'} />
            <rect y="12" width="34" height="9" fill={active ? '#3eb595' : '#787878'} />
            <rect y="24" width="34" height="9" fill={active ? '#3eb595' : '#787878'} />
        </svg>
    );
};
export default ListViewIcon;
