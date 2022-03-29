import * as TYPES from './types';

const initialState = {
    offers: { data: [], next: '', loading: false, error: null },
    listings: { data: [], next: '', loading: false, error: null },
    bids: { data: [], next: '', loading: false, error: null },
    auctions: { data: [], next: '', loading: false, error: null },
};

const contractsReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case TYPES.GET_AUCTIONS_REQUEST:
            return {
                ...state,
                auctions: {
                    ...state.auctions,
                    loading: true,
                },
            };

        case TYPES.GET_BIDS_REQUEST:
            return {
                ...state,
                bids: {
                    ...state.bids,
                    loading: true,
                },
            };
        case TYPES.GET_LISTINGS_REQUEST:
            return {
                ...state,
                listings: {
                    ...state.listings,
                    loading: true,
                },
            };
        case TYPES.GET_OFFERS_REQUEST:
            return {
                ...state,
                offers: {
                    ...state.offers,
                    loading: true,
                },
            };

        case TYPES.GET_AUCTIONS_FAIL:
            return {
                ...state,
                auctions: {
                    ...state.auctions,
                    loading: false,
                    error: payload.message,
                },
            };

        case TYPES.GET_BIDS_FAIL:
            return {
                ...state,
                bids: {
                    ...state.bids,
                    loading: false,
                    error: payload.message,
                },
            };

        case TYPES.GET_LISTINGS_FAIL:
            return {
                ...state,
                listings: {
                    ...state.listings,
                    loading: false,
                    error: payload.message,
                },
            };

        case TYPES.GET_OFFERS_FAIL:
            return {
                ...state,
                offers: {
                    ...state.offers,
                    loading: false,
                    error: payload.message,
                },
            };

        case TYPES.GET_AUCTIONS_SUCCESS: {
            return {
                ...state,
                auctions: { data: payload.data, next: payload?.next, loading: false, error: null },
            };
        }

        case TYPES.GET_BIDS_SUCCESS: {
            return {
                ...state,
                bids: { data: payload.data, next: payload?.next, loading: false, error: null },
            };
        }

        case TYPES.GET_LISTINGS_SUCCESS: {
            return {
                ...state,
                listings: { data: payload.data, next: payload?.next, loading: false, error: null },
            };
        }

        case TYPES.GET_OFFERS_SUCCESS: {
            return {
                ...state,
                offers: { data: payload.data, next: payload?.next, loading: false, error: null },
            };
        }

        case TYPES.REMOVE_OFFER: {
            const node = state.offers.data.find((node) => node?.guid === payload.nodeId);
            const offers = node?.offers?.filter((offer) => offer?.guid !== payload?.offerId);

            let newOffer = [];

            if (offers?.length !== 0 && payload?.assetAmount > 1) {
                newOffer = state.offers.data.map((node) =>
                    node.guid === payload.nodeId ? { ...node, offers } : node,
                );
            } else {
                newOffer = state.offers.data.filter(({ guid }) => guid !== payload.nodeId);
            }

            return {
                ...state,
                offers: {
                    ...state.offers,
                    data: newOffer,
                },
            };
        }
        case TYPES.REMOVE_LISTING: {
            return {
                ...state,
                listings: {
                    ...state.listings,
                    data: state.listings.data.filter(({ guid }) => guid !== payload.listingId),
                },
            };
        }

        case TYPES.REMOVE_BID: {
            let newBids = [];

            if (!payload?.offer_guid && !payload?.bid_guid) {
                newBids = state?.bids?.data.filter((asset) => asset?.guid !== payload?.asset_guid);
            } else {
                const bids = state?.bids?.data
                    ?.find((x) => x.guid === payload?.asset_guid)
                    ?.bids.filter((x) => x?.guid !== payload?.bid_guid);

                const offers = state?.bids?.data
                    ?.find((x) => x.guid === payload?.asset_guid)
                    ?.offers?.filter((offer) => offer?.guid !== payload?.offer_guid);

                if (bids?.length === 0 && offers?.length === 0) {
                    newBids = state?.bids?.data.filter(
                        (asset) => asset?.guid !== payload?.asset_guid,
                    );
                } else {
                    newBids = state?.bids?.data.map((asset) =>
                        asset?.guid === payload?.asset_guid ? { ...asset, offers, bids } : asset,
                    );
                }
            }
            return {
                ...state,
                bids: {
                    ...state.bids,
                    data: newBids,
                },
            };
        }

        case TYPES.REMOVE_AUCTION: {
            const node = state.auctions.data.find((node) => node?.guid === payload.node_guid);
            const auctions = node?.auctions?.filter(
                (auction) => auction?.guid !== payload?.auction_guid,
            );
            let newAuctions = [];

            if (auctions?.length !== 0) {
                newAuctions = state.auctions.data.map((node) =>
                    node.guid === payload.node_guid ? { ...node, auctions } : node,
                );
            } else {
                newAuctions = state.auctions.data.filter(({ guid }) => guid !== payload.node_guid);
            }
            return {
                ...state,
                auctions: {
                    ...state.auctions,
                    data: newAuctions,
                },
            };
        }
        case TYPES.LOAD_MORE_CONTRACTS_SUCCESS:
            return {
                ...state,
                [payload?.category]: {
                    ...state[payload?.category],
                    data: [...state[payload?.category]?.data, ...payload.data],
                    next: payload?.next,
                },
            };
        case TYPES.LOAD_MORE_CONTRACTS_FAIL: {
            return {
                ...state,
            };
        }
        default:
            return state;
    }
};

export default contractsReducer;
