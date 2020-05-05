import React, { Component } from 'react';
import { Header } from 'components'
import { connect } from 'react-redux';
import { getStatusRequest, logoutRequest } from 'actions/authentication';
import { getUserSearchRequest } from 'actions/search';

class App extends Component {

    constructor(props) {
        super(props);

        this.handleSearch = this.handleSearch.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        // get cookie by name
        function getCookie(name) {
            let value = ";" + document.cookie;
            let parts = value.split(name + "=");
            if (parts.length == 2) return parts.pop().split(";").shift();
        }

        // get loginData from cookie
        let loginData = getCookie('key');

        // if loginData is undefined, do nothing
        if (typeof loginData === 'undefined') return;

        // decode base64 & parse json
        loginData = JSON.parse(atob(loginData));

        // if not logged in, do nothing
        if(!loginData.isLoggedIn) return;

        // page refreshed & has a sessio in cookie
        // check whether this cookie is valid or not
        this.props.getStatusRequest().then(() => {

            // if session is not valid
            if (!this.props.status.get('valid')) {
                // logout the session
                loginData = {
                    isLoggedIn: false,
                    username: ''
                };

                document.cookie='key=' + btoa(JSON.stringify(loginData));

                // and notify
                let $toastContent = $('<span style="color: #FFB4BA">Your session expired, please log in again</span>');
                Materialize.toast($toastContent, 4000);
            }
        });
    }

    handleSearch(keyword) {
        this.props.getUserSearchRequest(keyword);
    }

    handleLogout() {
        this.props.logoutRequest().then(() => {
            Materialize.toast('Good Bye!', 2000);

            // empties the session
            let loginData = {
                isLoggedIn: false,
                username: ''
            };

            document.cookie = 'key=' + btoa(JSON.stringify(loginData));
        });
    }

    render() {
        /* Check whether current route is login or register using regex */
        let re = /(login|register)/;
        let isAuth = re.test(this.props.location.pathname);

        return (
            <div>
                { isAuth ? undefined 
                        : <Header isLoggedIn={this.props.status.get('isLoggedIn')}
                            users={this.props.users}
                            onSearch={this.handleSearch}
                            onLogout={this.handleLogout}/> }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.get('status'),
        users: state.search.getIn(['user', 'users'])
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getStatusRequest: () => {
            return dispatch(getStatusRequest());
        },
        getUserSearchRequest: (keyword) => {
            return dispatch(getUserSearchRequest(keyword));
        },
        logoutRequest: () => {
            return dispatch(logoutRequest());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);