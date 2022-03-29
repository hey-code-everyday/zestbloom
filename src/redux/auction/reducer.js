import * as TYPES from './types.js';

const initialState = {
    auctionAssets: [],
    loadMoreAssets: '',
    loadMoreAssetsLoading: false,
    loadingItems: false,
};

const auctionReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case TYPES.GET_AUCTION_ASSETS_REQUEST:
            return {
                ...state,
                loadingItems: true,
            };
        case TYPES.GET_AUCTION_ASSETS_SUCCESS:
            return {
                ...state,
                auctionAssets: payload.data,
                loadMoreAssets: payload.next,
                loadingItems: false,
            };
        case TYPES.GET_AUCTION_ASSETS_FAIL:
            return {
                ...state,
                loadingItems: false,
            };
        case TYPES.LOAD_MORE_AUCTION_ASSETS_REQUEST:
            return {
                ...state,
                loadMoreAssetsLoading: true,
            };
        case TYPES.LOAD_MORE_AUCTION_ASSETS_SUCCESS:
            return {
                ...state,
                auctionAssets: [...state.auctionAssets, ...payload.data],
                loadMoreAssets: payload.next,
                loadMoreAssetsLoading: false,
            };
        case TYPES.PLACE_A_BID_SUCCESS:
            return {
                ...state,
                auctionAssets: state.auctionAssets.map((x) =>
                    x.guid === payload.guid ? { ...x, last_bid: payload?.bid } : x,
                ),
            };
        case TYPES.CLOSE_AUCTION_SUCCESS:
            return {
                ...state,
                auctionAssets: state.auctionAssets.map((x) =>
                    x.guid === payload.guid ? payload : x,
                ),
            };
        case TYPES.LOAD_MORE_AUCTION_ASSETS_FAIL:
            return {
                ...state,
                loadMoreAssetsLoading: false,
            };
        default:
            return state;
    }
};

export default auctionReducer;
