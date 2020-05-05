import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { withRouter, Link } from 'react-router-dom';

class Search extends Component {

    constructor(props) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        // LISTEN ESC KEY, CLOSE IF PRESSED
        const listenEscKey = (evt) => {
            evt = evt || window.event;
            if (evt.keyCode == 27) {
                this.handleClose();
            }
        };

        document.onkeydown = listenEscKey;
        // addEventListener 는 중복 등록이 가능하므로 리렌더링 될때마다 추가되어서 사용불가
        //document.addEventListener('keydown', listenEscKey);
    }

    state = {
        searchState: Map({
            keyword: ''
        })
    }

    static propTypes = {
        onClose: PropTypes.func,
        onSearch: PropTypes.func,
        usernames: PropTypes.array,
    }

    static defaultProps = {
        onClose: () => { console.error('onClose not defined'); },
        onSearch: () => { console.error('onSearch not defined'); },
        usernames: []
    }

    handleClose() {
        this.handleSearch('');
        document.onkeydown = null;
        this.props.onClose();
    }

    handleChange(e) {
        const { searchState } = this.state;
        const value = e.target.value;

        this.setState({
            searchState: searchState.set('keyword', value)
        });
        this.handleSearch(value);
    }

    handleSearch(keyword) {
        this.props.onSearch(keyword);
    }

    handleKeyDown(e) {
        const { users } = this.props;
        if (e.keyCode === 13) {
            if (users.length > 0) {
                this.props.history.push(`/wall/${users[0].username}`);
                this.handleClose();
            }
        }
    }
    
    render() {
        const mapDataToLinks = (data) => {
            // IMPLEMENT: map data array to array of Link components
            // create Links to '/wall/:username'

            return data.map((user) => {
                return (
                    <Link
                        to={`/wall/${user.username}`}
                        onClick={this.handleClose}
                        key={user.username}>
                        {user.username}
                    </Link>
                );
            });
        }

        return (
            <div className="search-screen white-text">
                <div className="right">
                    <a className="wave-effect waves-light btn red lighten-1"
                        onClick={this.handleClose}>
                        CLOSE
                    </a>
                </div>
                <div className="container">
                    <input placeholder="Search a User"
                        value={this.state.keyword}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}
                    />
                    <ul className="search-results">
                        { mapDataToLinks(this.props.users) }
                    </ul>
                </div>
            </div>
        );
    }
}

export default withRouter(Search);