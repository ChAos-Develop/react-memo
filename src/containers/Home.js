import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Write, MemoList } from 'components';
import { Map } from 'immutable';
import {
    memoListRequest,
    memoPostRequest,
    memoEditRequest,
    memoRemoveRequest,
    memoStarRequest
} from 'actions/memo';

class Home extends Component {

    constructor(props) {
        super(props);

        this.handlePost = this.handlePost.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleStar = this.handleStar.bind(this);
        this.loadNewMemo = this.loadNewMemo.bind(this);
        this.loadOldMemo = this.loadOldMemo.bind(this);
    }

    state = {
        data: Map({
            loadingState: false,
            initiallyLoaded: false
        })
    }

    static propTypes = {
        username: PropTypes.string
    }

    static defaultProps = {
        username: undefined,
    }

    componentDidMount() {
        console.log("componentDidMount start !!!!!!!!");

        const loadUntilScrollable = () => {
            // If The Scrollbar Does Not Exist
            if ($('body').height() < $(window).height()) {
                this.loadOldMemo()
                    .then(() => {
                        // Do This Recursively Unless It's Last Page
                        if (!this.props.isLast) {
                            loadUntilScrollable();
                        }
                    })
            }
        }

        // Load New Memo Every 5 Second
        const loadMemoLoop = () => {
            this.loadNewMemo().then(
                () => {
                    this.memoLoaderTimoutId = setTimeout(loadMemoLoop, 60000);
                }
            );
        }

        this.props.memoListRequest(true, undefined, undefined, this.props.username).then(
            () => {
                // Begin New Memo Loading Loop
                loadUntilScrollable();
                loadMemoLoop();

                const { data } = this.state;

                this.setState({
                    data: data.set('initiallyLoaded', true)
                });
            }
            //console.log(this.props.memoData);
        );
    
        $(window).scroll(() => {
            // When Height Under ScrollBottom is Less Then 250
            const documentHeight = $(document).height();
            const windowHeight = $(window).height();
            const scrollTop = $(window).scrollTop();
            const reloadValue = documentHeight - windowHeight - scrollTop;
            //console.log(documentHeight, windowHeight, scrollTop, reloadValue);
            //if (documentHeight <= windowHeight + scrollTop ) {

            const { data } = this.state;

            if (reloadValue < 250) {
                if (!data.get('loadingState'))  {
                    //console.log("load now");
                    this.loadOldMemo();

                    this.setState({
                        data: data.set('loadingState', true)
                    });
                }
            } else {
                if (data.get('loadingState'))  {
                    this.setState({
                        data: data.set('loadingState', false)
                    });
                }
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        // 컴포넌트가 업데이트 된 이후에 현재 프롭스로 전달된 usernam과 이전 프롭스로 전달된 username 이 다르면
        // unmount, didmount 실행
        if(this.props.username !== prevProps.username
            || this.props.currentUser !== prevProps.currentUser) {
            this.componentWillUnmount();
            this.componentDidMount();
        }
    }

    componentWillUnmount() {
        // Stop The loadMemoLoop
        clearTimeout(this.memoLoaderTimoutId);

        // Remove Windows Scroll Listener
        $(window).unbind();
     
        const { data } = this.state;

        this.setState({
            data: data.set('initiallyLoaded', false)
        });
    }

    /* POST MEMO */
    handlePost(contents) {
        return this.props.memoPostRequest(contents).then(() => {
            if (this.props.post.get('status') === 'SUCCESS') {
                // TRIGGER LOAD NEW MEMO
                this.loadNewMemo().then(
                    () => {
                        Materialize.toast('POST Success!', 2000);
                    }
                );
            } else {
                /*
                    ERROR CODES
                        1: NOT LOGGED IN
                        2: EMPTY CONTENTS
                */
               let $toastContent;
               switch (this.props.post.get('error')) {
                    case 1:
                        // IF NOT LOGGED IN, NOTIFY AND REFRESH AFTER
                        $toastContent = $('<span style="color: #FFB4BA">You are not logged in</span>');
                        Materialize.toast($toastContent, 2000);
                        setTimeout(() => {
                            location.reload(false);
                        }, 2000);
                        break;
                    case 2:
                        $toastContent = $('<span style="color: #FFB4BA">Please write someting</span>');
                        Materialize.toast($toastContent, 2000);
                        break;
                    default:
                        $toastContent = $('<span style="color: #FFB4BA">Something Broke</span>');
                        Materialize.toast($toastContent, 2000);
                        break;
               };
            }
        })
    }

    /* PUT MEMO */
    handleEdit(id, index, contents) {
        return this.props.memoEditRequest(id, index, contents)
            .then(() => {
                if (this.props.edit.get('status') === 'SUCCESS') {
                    Materialize.toast('Edit Success', 2000);
                } else {
                    /*
                        ERROR CODES
                        1: INVALID ID,
                        2: EMPTY CONTENTS
                        3: NOT LOGGED IN
                        4: NO RESOURCE
                        5: PERMISSION FAILURE
                    */
                    const errorMessage = [
                        'Something broke',
                        'Please write soemthing',
                        'You are not logged in',
                        'That memo does not exist anymore',
                        'You do not have permission'
                    ];

                    const error = this.props.edit.get('error');

                    // Notify Error
                    const $toastContent = $(`<span style="color: #FFB4BA">${errorMessage[error - 1]}</span>`);
                    Materialize.toast($toastContent, 2000);

                    // If Not Logged In, Refresh The Page After 2 Second
                    if (error === 3) {
                        setTimeout(() => { location.reload(false) }, 2000);
                    }
                }
            })
    }

    handleRemove(id, index) {
        this.props.memoRemoveRequest(id, index)
            .then(() => {
                if (this.props.remove.get('status') === 'SUCCESS') {
                    // Load More Memo If There is No Scrollbar
                    // 1 Second Later. (Animation Takes 1 Sec)
                    setTimeout(() => {
                        if ($('body').height() < $(window).height()) {
                            this.loadOldMemo();
                        }
                    }, 1000);
                } else {
                    /*
                    DELETE MEMO: DELETE /api/memo/:id
                    ERROR CODES
                        1: INVALID ID
                        2: NOT LOGGED IN
                        3: NO RESOURCE
                        4: PERMISSION FAILURE
                    */
                    const errorMessage = [
                        'Something broke',
                        'You are not logged in',
                        'That memo does not exist',
                        'You do not have permission'
                    ];

                    // NOTIFY ERROR
                    const $toastContent = $(`<span style="color: #FFB4BA">${errorMessage[this.props.remove.get('error') - 1]}</span>`);
                    Materialize.toast($toastContent, 2000);

                    // IF NOT LOGGED IN, REFRESH THE PAGE
                    if(this.props.remove.get('error') === 2) {
                        setTimeout(()=> { location.reload(false) }, 2000);
                    }
                }
            })
    }

    handleStar(id, index) {
        this.props.memoStarRequest(id, index)
            .then(() => {
                if (this.props.star.get('status') !== 'SUCCESS') {
                    /*
                        TOGGLES STAR OF MEMO: POST /api/memo/star/:id
                        ERROR CODES
                            1: INVALID ID
                            2: NOT LOGGED IN
                            3: NO RESOURCE
                    */
                   const errorMessage= [
                        'Something broke',
                        'You are not logged in',
                        'That memo does not exist'
                    ];

                    // NOTIFY ERROR
                    const $toastContent = $(`<span style="color: #FFB4BA">${errorMessage[this.props.star.get('error') - 1]}</span>`);
                    Materialize.toast($toastContent, 2000);
    
                    // IF NOT LOGGED IN, REFRESH THE PAGE
                    if(this.props.star.get('error') === 2) {
                        setTimeout(()=> {location.reload(false)}, 2000);
                    }
                }
            })
    }

    loadNewMemo() {
        // Cancel If There Is A Pending Request
        if (this.props.listStatus === 'WAITING') {
            return new Promise((resolve, reject) => {
                resolve();
            });
        }

        // If Page is Empty, Do The Initial Loading
        if (this.props.memoData.size === 0) {
            return this.props.memoListRequest(true, undefined, undefined, this.props.username);
        }

        return this.props.memoListRequest(false, 'new', this.props.memoData.get(0)._id, this.props.username);
    }

    loadOldMemo() {
        // Cancel If There Is A Pending Request
        if (this.props.isLast) {
            return new Promise((resolve, reject) => {
                resolve();
            });
        }

        // Get Id Of The Memo At The Bottom
        let memoDataLength = this.props.memoData.size;
        let lastId = this.props.memoData.get(memoDataLength - 1)._id;

        // Start Request
        return this.props.memoListRequest(false, 'old', lastId, this.props.username)
            .then(() => {
                // If It Is Last Page Notify
                if (this.props.isLast) {
                    Materialize.toast('You are reading the last page', 2000);
                }
            })
    }

    render() {
        const write = ( <Write onPost={this.handlePost} /> );

        const emptyView = (
            <div className="container">
                <div className="empty-page">
                    <b>{this.props.username}</b> isn't registered or hasn't written any memo
                </div>
            </div>
        );

        const wallHeader = (
            <div className="container wall-info">
                <div className="card wall-info blue lighten-2 white-text">
                    <div className="card-content">
                        {this.props.username}
                    </div>
                </div>
                { this.props.memoData.size === 0 && this.state.data.get('initiallyLoaded') ? emptyView : undefined }
            </div>
        );

        return(
            <div className="wrapper">
                { typeof this.props.username !== "undefined" ? wallHeader : undefined }
                { this.props.isLoggedIn && typeof this.props.username === "undefined" ? write : undefined }
                <MemoList
                    data={this.props.memoData}
                    currentUser={this.props.currentUser}
                    onEdit={this.handleEdit}
                    onRemove={this.handleRemove}
                    onStar={this.handleStar}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.authentication.getIn(['status', 'isLoggedIn']),
        post: state.memo.get('post'),
        currentUser: state.authentication.getIn(['status', 'currentUser']),
        memoData: state.memo.getIn(['list', 'data']),
        listStatus: state.memo.getIn(['list', 'status']),
        isLast: state.memo.getIn(['list', 'isLast']),
        edit: state.memo.get('edit'),
        remove: state.memo.get('remove'),
        star: state.memo.get('star')
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        memoListRequest: (isInitial, listType, id, username) => {
            return dispatch(memoListRequest(isInitial, listType, id, username));
        },
        memoPostRequest: (contents) => {
            return dispatch(memoPostRequest(contents));
        },
        memoEditRequest: (id, index, contents) => {
            return dispatch(memoEditRequest(id, index, contents));
        },
        memoRemoveRequest: (id, index) => {
            return dispatch(memoRemoveRequest(id, index));
        },
        memoStarRequest: (id, index) => {
            return dispatch(memoStarRequest(id, index));
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Home);