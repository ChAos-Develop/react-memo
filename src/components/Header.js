import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Link } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Search } from 'components';

export default class Header extends Component {

    constructor(props) {
        super(props);

        this.toggleSearch = this.toggleSearch.bind(this);
    }

    static propTypes = {
        isLoggedIn: PropTypes.bool,
        onLogout: PropTypes.func
    }
    
    static defaultProps = {
        isLoggedIn: false,
        onLogout: () => {
            console.log("logout function not defined");
        }
    }

    state = {
        headerState: Map({
            search: false
        })
    }

    toggleSearch() {
        const { headerState } = this.state;

        this.setState({
            headerState: headerState.set('search', !headerState.get('search'))
        });
    }

    render() {

        const { headerState } = this.state;

        const loginButton = (
            <li>
                <Link to="/login">
                    <i className="material-icons">vpn_key</i>
                </Link>
            </li>
        );

        const logoutButton = (
            <li>
                <a onClick={this.props.onLogout}>
                    <i className="material-icons">lock_open</i>
                </a>
            </li>
        );

        const searchView = (
            <CSSTransition
                classNames="search"
                timeout={300} >
                <Search
                    users={this.props.users}
                    onSearch={this.props.onSearch}
                    onClose={this.toggleSearch} />
            </CSSTransition>
        );

        return(
            <div>
                <nav>
                    <div className="nav-wrapper blue darken-1">
                        <Link to="/" className="brand-logo center">MEMOPAD</Link>

                        <ul>
                            <li>
                                <a onClick={this.toggleSearch}>
                                    <i className="material-icons">search</i>
                                </a>
                            </li>
                        </ul>

                        <div className="right">
                            <ul>
                                { this.props.isLoggedIn ? logoutButton : loginButton }
                            </ul>
                        </div>
                    </div>
                </nav>

                <TransitionGroup>
                    { headerState.get('search') ? searchView : undefined }
                </TransitionGroup>
            </div>
        );
    }
}
