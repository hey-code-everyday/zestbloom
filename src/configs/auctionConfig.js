import imgDateEnd from 'assets/img/date_end.svg';
import imgDateStart from 'assets/img/date_start.svg';
import imgDollarHammer from 'assets/img/algo_hammer.svg';
import imgDollarHand from 'assets/img/algo_hand.svg';
import imgDollarTimer from 'assets/img/algo_timer.svg';
import imgDollarUpArrow from 'assets/img/algo_up_arrow.svg';

const apiUrl = window.__RUNTIME_CONFIG__.REACT_APP_API_URL;

export const AUCTION_FIELDS = [
    {
        id: 'start_time',
        label: 'The date and start time of the auction',
        type: 'datetime',
        fieldLabel: 'Start Time',
        icon: imgDateStart,
    },
    {
        id: 'end_time',
        label: 'The date and end time of the auction',
        type: 'datetime',
        fieldLabel: 'End Time',
        icon: imgDateEnd,
    },
    {
        id: 'reserve_price',
        label: 'The minimum reserve price set for the auction to begin',
        fieldLabel: 'Reserve Price',
        icon: imgDollarHand,
    },
    {
        id: 'min_bid_increment',
        label: 'This is the minimum amount by which bids must be increased',
        fieldLabel: 'Min Bid Increment',
        icon: imgDollarUpArrow,
    },
    {
        id: 'snipe_trigger_window',
        label: 'The time window before the end of the auction in which new bids will trigger the end time extension.',
        fieldLabel: 'Snipe Trigger Window',
        icon: imgDollarTimer,
        type: 'slider',
    },
    {
        id: 'snipe_extension_time',
        label: 'When the snipe extension is triggered, the auction end is extended by this amount of time.',
        fieldLabel: 'Snipe Extension Time',
        icon: imgDollarHammer,
        type: 'slider',
    },
];

export const AUCTION_CONFIG = {
    create_app: `${apiUrl}/api/marketplace/auctions/`,
    setup_app: (auction) => `${apiUrl}/api/marketplace/auctions/${auction}/setup-app/`,
    complete_app: (auction) => `${apiUrl}/api/marketplace/auctions/${auction}/complete-app/`,
    getAuctionAssets: `${apiUrl}/api/marketplace/auctions/`,
    getTopBidAssets: `${apiUrl}/api/marketplace/auctions/?sort_by=bid_amount_h_l&page_size=4`,
    placeABid: `${apiUrl}/api/marketplace/auctions/`,
    close_app: (auction) => `${apiUrl}/api/marketplace/auctions/${auction}/close-app/`,
};

export const COMPLETED = 'COMPLETED';
export const STARTED = 'STARTED';
export const PENDING = 'PENDING';
