import * as TYPES from './types.js';

const initialState = {
    user: {},
    isLoggedIn: localStorage.getItem('access') ? true : false,
    forgotPasswordSent: false,
    tags: [],
};

const profileSettingsReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case TYPES.UPDATE_PROFILE_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.UPDATE_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case TYPES.UPDATE_PROFILE_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case TYPES.CHANGE_EMAIL_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.CHANGE_EMAIL_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case TYPES.CHANGE_EMAIL_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case TYPES.CHANGE_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.CHANGE_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case TYPES.CHANGE_PASSWORD_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case TYPES.CHANGE_IMAGE_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.CHANGE_IMAGE_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case TYPES.CHANGE_IMAGE_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case TYPES.GET_TAGS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.GET_TAGS_SUCCESS:
            return {
                ...state,
                tags: [...(action.payload || [])],
                success: true,
                loading: false,
            };
        case TYPES.GET_TAGS_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case TYPES.ADD_CUSTOM_TAG_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.ADD_CUSTOM_TAG_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                tags: [...state.tags, action.payload],
            };
        case TYPES.SET_TAGS:
            return {
                ...state,
                tags: [...action.payload],
            };
        case TYPES.ADD_CUSTOM_TAG_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case TYPES.SELECT_TAG_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case TYPES.SELECT_TAG_SUCCESS:
            state.tags
                .filter((t) => t.type === action.payload.type)
                .map((t) => (t.selected = false));

            const tags = state.tags.map((t) => {
                if (t.slug === action.payload.slug) {
                    return action.payload;
                }
                return t;
            });
            return {
                ...state,
                loading: false,
                tags: [...tags],
            };
        case TYPES.SELECT_TAG_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        default:
            return state;
    }
};

export default profileSettingsReducer;
