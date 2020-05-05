import axios from 'axios';
import { 
    USER_SEARCH,
    USER_SEARCH_SUCCESS,
    USER_SEARCH_FAILURE
} from './ActionTypes';
import { API_SERVER } from 'properties';

export function getUserSearchRequest(keyword) {
    return (dispatch) => {
        // inform Get Status API is starting
        dispatch(getUserSearch());

        return axios.get(`${API_SERVER}/api/account/search/${keyword}`)
            .then((response) => {
                dispatch(getUserSearchSuccess(response.data));
            }).catch((error) => {
                dispatch(getUserSearchFailure(error));
            });
    };
}

export function getUserSearch() {
    return {
        type: USER_SEARCH,
    };
}

export function getUserSearchSuccess(users) {
    return {
        type: USER_SEARCH_SUCCESS,
        users,
    };
}

export function getUserSearchFailure(error) {
    return {
        type: USER_SEARCH_FAILURE,
        error
    };
}