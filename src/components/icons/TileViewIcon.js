import React from 'react';

// Active Color: #3eb595
// Inactive Color: #787878

const TileViewIcon = ({ active }) => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 35 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="0.606445"
                width="9.25984"
                height="12.2362"
                fill={active ? '#3eb595' : '#787878'}
            />
            <rect
                x="0.606445"
                y="15.873"
                width="9.25984"
                height="4.96063"
                fill={active ? '#3eb595' : '#787878'}
            />
            <rect
                x="0.606445"
                y="24.4727"
                width="9.25984"
                height="8.59843"
                fill={active ? '#3eb595' : '#787878'}
            />
            <rect
                x="13.1738"
                width="9.25984"
                height="4.62992"
                fill={active ? '#3eb595' : '#787878'}
            />
            <rect
                x="13.1738"
                y="7.27539"
                width="9.25984"
                height="8.59843"
                fill={active ? '#3eb595' : '#787878'}
            />
            <rect
                x="13.1738"
                y="18.1895"
                width="9.25984"
                height="14.8819"
                fill={active ? '#3eb595' : '#787878'}
            />
            <rect
                x="25.7402"
                width="9.25984"
                height="8.59843"
                fill={active ? '#3eb595' : '#787878'}
            />
            <rect
                x="25.7402"
                y="12.2363"
                width="9.25984"
                height="8.59843"
                fill={active ? '#3eb595' : '#787878'}
            />
            <rect
                x="25.7402"
                y="24.4727"
                width="9.25984"
                height="8.59843"
                fill={active ? '#3eb595' : '#787878'}
            />
        </svg>
    );
};
export default TileViewIcon;
