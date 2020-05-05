import * as types from 'actions/ActionTypes';
import { Map, List } from 'immutable';

const initialState = Map({
    post: Map({
        status: 'INIT',
        error: -1
    }),
    list: Map({
        status: 'INIT',
        data: List([]),
        isLast: false
    }),
    edit: Map({
        status: 'INIT',
        error: -1
    }),
    remove: Map({
        status: 'INIT',
        error: -1
    }),
    star: Map({
        status: 'INIT',
        error: -1
    })
});

export default function memo(state, action) {
    if (typeof state == 'undefined') {
        state = initialState;
    }

    switch (action.type) {
        case types.MEMO_LIST:
            return state
                .setIn(['list', 'status'], 'WAITING');
        case types.MEMO_LIST_SUCCESS:
            if (action.isInitial) {
                return state
                    .setIn(['list', 'status'], 'SUCCESS')
                    .setIn(['list', 'data'], List(action.data))
                    .setIn(['list', 'isLast'], action.data.length < 6);
            } 
            if (action.listType == 'new') {
                return state
                    .setIn(['list', 'status'], 'SUCCESS')
                    .updateIn(['list', 'data'], (data) => {
                        let returnData = data;
                        action.data.map((item) => {
                            returnData = returnData.unshift(item);
                        });
                        return returnData;
                    });
            } else {
                return state
                    .setIn(['list', 'status'], 'SUCCESS')
                    .updateIn(['list', 'data'], (data) => {
                        let returnData = data;
                        action.data.map((item) => {
                            returnData = returnData.push(item);
                        });
                        return returnData;
                    })
                    .setIn(['list', 'isLast'], action.data.length < 6);
            }
        case types.MEMO_LIST_FAILURE:
            return state
                .setIn(['list', 'status'], 'FAILURE');
        case types.MEMO_POST:
            return state
                .setIn(['post', 'status'], 'WAITING')
                .setIn(['post', 'error'], -1);
        case types.MEMO_POST_SUCCESS:
            return state
                .setIn(['post', 'status'], 'SUCCESS');
        case types.MEMO_POST_FAILURE:
            return state
                .setIn(['post', 'status'], 'FAILURE')
                .setIn(['post', 'error'], action.error);
        case types.MEMO_EDIT:
            return state
                .setIn(['edit', 'status'], 'WAITING')
                .setIn(['edit', 'error'], -1);
        case types.MEMO_EDIT_SUCCESS:
            return state
                .setIn(['edit', 'status'], 'SUCCESS')
                .updateIn(['list', 'data', ], (items) => {
                    return items.map((memo) => {
                        if(memo._id === action.memo._id) {
                            return memo = action.memo;
                        }
                        return memo;
                    })
                });
        case types.MEMO_EDIT_FAILURE:
            return state
                .setIn(['edit', 'status'], 'FAILURE')
                .setIn(['edit', 'error'], action.error);
        case types.MEMO_REMOVE:
            return state
                .setIn(['remove', 'status'], 'WAITING')
                .setIn(['remove', 'error'], -1);
        case types.MEMO_REMOVE_SUCCESS:
            return state
                .setIn(['remove', 'status'], 'SUCCESS')
                .updateIn(['list', 'data'], (items) => (
                    items.splice(action.index, 1))
                )
        case types.MEMO_REMOVE_FAILURE:
            return state
                .setIn(['remove', 'status'], 'FAILURE')
                .setIn(['remove', 'error'], action.error);
        case types.MEMO_STAR:
            return state
                .setIn(['star', 'status'], 'WAITING')
                .setIn(['star', 'error'], -1);
        case types.MEMO_STAR_SUCCESS:
            return state
                .setIn(['star', 'status'], 'SUCCESS')
                .updateIn(['list', 'data'], (items) => {
                    return items.map((memo) => {
                        if(memo._id === action.memo._id) {
                            return memo = action.memo;
                        }
                        return memo;
                    })
                });
        case types.MEMO_STAR_FAILURE:
            return state
                .setIn(['star', 'status'], 'FAILURE')
                .setIn(['star', 'error'], action.error);                
        default:
            return state;
    }
}