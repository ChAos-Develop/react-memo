import * as types from '../actions/ActionTypes';
import { Map, List } from 'immutable';

const initialState = Map({
    user: Map({
        status: 'INIT',
        users: List([])
    })
});

export default function search(state, action) {
    if (typeof state === 'undefined') {
        state = initialState;
    }

    switch (action.type) {
        /* 사용자 검색 */
        case types.USER_SEARCH:
            return state
                .setIn(['user', 'status'], 'WAITING')
                .setIn(['user', 'error'], -1);
        case types.USER_SEARCH_SUCCESS:
            return state
                .setIn(['user', 'status'], 'SUCCESS')
                .setIn(['user', 'users'], action.users);
        case types.USER_SEARCH_FAILURE:
            return state
                .setIn(['user', 'status'], 'FAILURE')
                .setIn(['user', 'users'], [])                
        default:
            return state;
    }
}