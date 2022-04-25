import React from 'react';

const GridViewIcon = ({ active }) => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 35 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="9.25984" height="8.59843" fill={active ? '#3eb595' : '#787878'} />
            <rect
                y="12.2363"
                width="9.25984"
                height="8.59843"
                fill={active ? '#3eb595' : '#787878'}
            />
            <rect
                y="24.4727"
                width="9.25984"
                height="8.59843"
                fill={active ? '#3eb595' : '#787878'}
            />
            <rect
                x="12.5674"
                width="9.25984"
                height="8.59843"
                fill={active ? '#3eb595' : '#787878'}
            />
            <rect
                x="12.5674"
                y="12.2363"
                width="9.25984"
                height="8.59843"
                fill={active ? '#3eb595' : '#787878'}
            />
            <rect
                x="12.5674"
                y="24.4727"
                width="9.25984"
                height="8.59843"
                fill={active ? '#3eb595' : '#787878'}
            />
            <rect
                x="25.1338"
                width="9.25984"
                height="8.59843"
                fill={active ? '#3eb595' : '#787878'}
            />
            <rect
                x="25.1338"
                y="12.2363"
                width="9.25984"
                height="8.59843"
                fill={active ? '#3eb595' : '#787878'}
            />
            <rect
                x="25.1338"
                y="24.4727"
                width="9.25984"
                height="8.59843"
                fill={active ? '#3eb595' : '#787878'}
            />
        </svg>
    );
};
export default GridViewIcon;
