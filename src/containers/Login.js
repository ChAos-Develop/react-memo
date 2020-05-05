import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginRequest } from 'actions/authentication';
import { Authentication } from 'components'

class Login extends Component {

    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(id, pw) {
        return this.props.loginRequest(id, pw)
            .then(() => {
                if (this.props.status === 'SUCCESS') {
                    // create session data
                    let loginData = {
                        isLoggedIn: true,
                        username: id,
                    };

                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));

                    Materialize.toast('Welcome, ' + id + '!', 2000);
                    this.props.history.push('/');
                    return true;
                } else {
                    let $toastContent = $('<span style="color: #FFB4BA">Incorrect username or password</span>');
                    Materialize.toast($toastContent, 2000);
                    return false;
                }
            });
    }

    render() {
        return(
            <Authentication mode={true}
                onLogin={this.handleLogin} />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.getIn(['login', 'status'])
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (id, pw) => {
            return dispatch(loginRequest(id, pw));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);