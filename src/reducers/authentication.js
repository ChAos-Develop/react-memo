import * as types from '../actions/ActionTypes';
import { Map, List } from 'immutable';

const initialState = Map({
    login: Map({
        status: 'INIT',
    }),
    register: Map({
        status: 'INIT',
        error: -1,
    }),
    status: Map({
        valid: false,
        isLoggedIn: false,
        currentUser: '',
    }),
    user: Map({
        status: 'INIT',
        error: -1,
        usernames: List([])
    })
});

export default function authentication(state, action) {
    if (typeof state === 'undefined') {
        state = initialState;
    }

    switch (action.type) {
        /* 로그인 */
        case types.AUTH_LOGIN:
            return state.setIn(['login', 'status'], 'WAITING');
        case types.AUTH_LOGIN_SUCCESS:
            return state
                .setIn(['login', 'status'], 'SUCCESS')
                .setIn(['status', 'isLoggedIn'], true)
                .setIn(['status', 'currentUser'], action.username);
        case types.AUTH_LOGIN_FAILURE:
            return state.setIn(['login', 'status'], 'FAILURE');
        /* 회원가입 */
        case types.AUTH_REGISTER:
            return state
                .setIn(['register', 'status'], 'WAITING')
                .setIn(['register', 'error'], -1);
        case types.AUTH_REGISTER_SUCCESS:
            return state.setIn(['register', 'status'], 'SUCCESS');
        case types.AUTH_REGISTER_FAILURE:
            return state
                .setIn(['register', 'status'], 'FAILURE')
                .setIn(['register', 'error'], action.error);
        /* 인증상태 */
        case types.AUTH_GET_STATUS:
            return state.setIn(['status', 'isLoggedIn'], true);
        case types.AUTH_GET_STATUS_SUCCESS:
            return state
                .setIn(['status', 'valid'], true)
                .setIn(['status', 'currentUser'], action.username);
        case types.AUTH_GET_STATUS_FAILURE:
            return state
                .setIn(['status', 'valid'], false)
                .setIn(['status', 'isLoggedIn'], false);
        /* 로그아웃 */
        case types.AUTH_LOGOUT:
            return state
                .setIn(['status', 'isLoggedIn'], false)
                .setIn(['status', 'currentUser'], '');
        /* 사용자 검색 */
        case types.USER_SEARCH:
            return state
                .setIn(['user', 'status'], 'WAITING')
                .setIn(['user', 'error'], -1);
        case types.USER_SEARCH_SUCCESS:
            return state
                .setIn(['user', 'status'], 'SUCCESS')
                .setIn(['user', 'usernames'], action.usernames);
        case types.USER_SEARCH_FAILURE:
            return state
                .setIn(['user', 'status'], 'FAILURE')
                .setIn(['star', 'error'], action.error);                 
        default:
            return state;
    }
}